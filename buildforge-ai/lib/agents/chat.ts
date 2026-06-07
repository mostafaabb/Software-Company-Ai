/**
 * Agent chat — allows users to have a streaming conversation with a single
 * agent. Each message is persisted and the agent's response is streamed
 * back via Server-Sent Events.
 */
import { prisma } from "@/lib/db/prisma";
import { getAgent } from "./definitions";
import { generateAgentOutput } from "./generators";
import { aiStream, type AIStreamChunk } from "@/lib/ai/provider";
import type { AgentType } from "@/types/agent";

export interface ChatRequest {
  projectId: string;
  userId: string;
  agentType: AgentType;
  chatId?: string;
  content: string;
}

export interface ChatResponse {
  chatId: string;
  messageId: string;
  stream: AsyncGenerator<AIStreamChunk>;
}

export async function ensureChat(projectId: string, userId: string, agentType: AgentType, chatId?: string) {
  if (chatId) {
    const existing = await prisma.chat.findFirst({ where: { id: chatId, projectId, userId } });
    if (existing) return existing;
  }
  return prisma.chat.create({
    data: {
      projectId,
      userId,
      agentType,
      title: `Chat with ${getAgent(agentType)?.name || "agent"}`,
      mode: "AGENT",
    },
  });
}

export async function* chatStream(req: ChatRequest): AsyncGenerator<AIStreamChunk> {
  const agent = getAgent(req.agentType);
  if (!agent) throw new Error("Unknown agent");

  const chat = await ensureChat(req.projectId, req.userId, req.agentType, req.chatId);

  // Persist user message
  await prisma.message.create({
    data: {
      chatId: chat.id,
      projectId: req.projectId,
      role: "USER",
      content: req.content,
      agentType: req.agentType,
      authorId: req.userId,
    },
  });

  // Build context: project + recent history
  const project = await prisma.project.findUnique({ where: { id: req.projectId } });
  const history = await prisma.message.findMany({
    where: { chatId: chat.id },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const messages = [
    { role: "system" as const, content: agent.systemPrompt },
    {
      role: "system" as const,
      content: `Project context:
Name: ${project?.name}
Idea: ${project?.idea}
Industry: ${project?.industry || "n/a"}
Target market: ${project?.targetMarket || "n/a"}`,
    },
    ...history.map((m) => ({
      role: m.role.toLowerCase() as "user" | "assistant" | "system",
      content: m.content,
    })),
    { role: "user" as const, content: req.content },
  ];

  // For the assistant message, we'll create a placeholder and stream into it
  const assistantMessage = await prisma.message.create({
    data: {
      chatId: chat.id,
      projectId: req.projectId,
      role: "ASSISTANT",
      content: "",
      agentType: req.agentType,
    },
  });

  let buffer = "";
  for await (const chunk of aiStream(messages, { temperature: 0.7 })) {
    if (chunk.done) break;
    buffer += chunk.delta;
    yield chunk;
  }

  // If the stream was empty (mock provider), fall back to the generator.
  if (!buffer.trim()) {
    const generated = generateAgentOutput(req.agentType, {
      context: {
        id: project!.id,
        name: project!.name,
        idea: project!.idea,
        description: project!.description,
        industry: project!.industry,
        targetMarket: project!.targetMarket,
      },
    });
    const text = `**${generated.thinking}**\n\n\`\`\`json\n${JSON.stringify(generated.output, null, 2)}\n\`\`\``;
    const tokens = text.split(/(\s+)/);
    for (const t of tokens) {
      buffer += t;
      yield { delta: t, done: false };
    }
  }

  await prisma.message.update({
    where: { id: assistantMessage.id },
    data: { content: buffer, tokens: Math.ceil(buffer.length / 4) },
  });

  await prisma.chat.update({
    where: { id: chat.id },
    data: { lastMessageAt: new Date() },
  });

  yield { delta: "", done: true };
}
