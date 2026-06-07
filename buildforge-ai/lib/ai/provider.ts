/**
 * Unified AI provider wrapper.
 * Supports OpenAI natively, plus a deterministic mock provider used for
 * development and offline runs. The mock provider produces realistic
 * per-agent output via the generators in `lib/agents/generators`.
 *
 * To add Anthropic or Google, drop in the official SDK and follow the
 * same pattern as `openaiComplete` below.
 */
import OpenAI from "openai";

export type AIProvider = "openai" | "mock";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  json?: boolean;
}

export interface AICompletionResult {
  content: string;
  tokensUsed: number;
  model: string;
  provider: AIProvider;
}

export interface AIStreamChunk {
  delta: string;
  done: boolean;
}

const DEFAULT_PROVIDER = (process.env.DEFAULT_AI_PROVIDER as AIProvider) || "mock";

function getProvider(): AIProvider {
  if (process.env.OPENAI_API_KEY) return "openai";
  return DEFAULT_PROVIDER === "openai" ? "mock" : (DEFAULT_PROVIDER as AIProvider);
}

export async function aiComplete(
  messages: AIMessage[],
  options: AICompletionOptions = {},
): Promise<AICompletionResult> {
  const provider = getProvider();
  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    return openaiComplete(messages, options);
  }
  return mockComplete(messages, options);
}

export async function* aiStream(
  messages: AIMessage[],
  options: AICompletionOptions = {},
): AsyncGenerator<AIStreamChunk> {
  const result = await aiComplete(messages, { ...options, stream: true });
  // Simulate streaming by chunking the response
  const tokens = result.content.split(/(\s+)/);
  for (const t of tokens) {
    yield { delta: t, done: false };
    if (tokens.indexOf(t) % 3 === 0) await new Promise((r) => setTimeout(r, 12));
  }
  yield { delta: "", done: true };
}

// =====================================================
// Provider implementations
// =====================================================

async function openaiComplete(
  messages: AIMessage[],
  options: AICompletionOptions,
): Promise<AICompletionResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const completion = await client.chat.completions.create({
    model: options.model || "gpt-4o",
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 4096,
    response_format: options.json ? { type: "json_object" } : undefined,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  return {
    content: completion.choices[0]?.message?.content || "",
    tokensUsed: completion.usage?.total_tokens || 0,
    model: completion.model,
    provider: "openai",
  };
}

async function mockComplete(
  _messages: AIMessage[],
  _options: AICompletionOptions,
): Promise<AICompletionResult> {
  // The mock provider is a no-op: the orchestrator uses the structured
  // generators in lib/agents/generators.ts to produce the real output.
  // This function exists so the streaming pipeline has something to chunk.
  const content = "Mock response — the orchestrator uses structured generators to produce real agent output.";
  return { content, tokensUsed: Math.ceil(content.length / 4), model: "mock", provider: "mock" };
}
