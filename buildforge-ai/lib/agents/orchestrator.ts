/**
 * Agent Orchestrator
 * --------------------
 * LangGraph-inspired pipeline that runs 14 agents in sequence (or
 * parallel where possible), passing the accumulated output as context to
 * downstream agents. Persists a row per agent run with timing, tokens, and
 * confidence scores.
 */
import { prisma } from "@/lib/db/prisma";
import { AGENTS, getAgent, type AgentMeta } from "./definitions";
import { generateAgentOutput, type ProjectContext, type AgentRunInput } from "./generators";
import { aiComplete } from "@/lib/ai/provider";
import type { AgentType } from "@/types/agent";
import type { AgentRun } from "@prisma/client";

export interface OrchestrateOptions {
  projectId: string;
  userId: string;
  agents?: AgentType[];
  parallel?: boolean;
}

export interface OrchestrateResult {
  projectId: string;
  totalTokens: number;
  totalDurationMs: number;
  runs: Array<{
    agentType: AgentType;
    runId: string;
    status: string;
    confidence: number;
    tokens: number;
    durationMs: number;
  }>;
  masterReportId?: string;
}

const DEFAULT_PIPELINE: AgentType[] = [
  "DISCOVERY_AGENT",
  "PRODUCT_MANAGER",
  "MARKET_RESEARCH",
  "BUSINESS_ANALYST",
  "UX_RESEARCH",
  "UI_DESIGN",
  "DATABASE_ARCHITECT",
  "BACKEND_ARCHITECT",
  "FRONTEND_ARCHITECT",
  "QA_ENGINEER",
  "DEVOPS_ENGINEER",
  "SECURITY_ENGINEER",
  "FINANCIAL_ANALYST",
  "CODE_GENERATOR",
];

export async function orchestrate(opts: OrchestrateOptions): Promise<OrchestrateResult> {
  const project = await prisma.project.findUnique({ where: { id: opts.projectId } });
  if (!project) throw new Error("Project not found");

  const pipeline = opts.agents && opts.agents.length > 0 ? opts.agents : DEFAULT_PIPELINE;
  const ctx: ProjectContext = {
    id: project.id,
    name: project.name,
    idea: project.idea,
    description: project.description,
    industry: project.industry,
    targetMarket: project.targetMarket,
  };

  const previousOutputs: Partial<Record<AgentType, unknown>> = {};
  const result: OrchestrateResult = {
    projectId: project.id,
    totalTokens: 0,
    totalDurationMs: 0,
    runs: [],
  };

  await prisma.project.update({
    where: { id: project.id },
    data: { status: "IN_PROGRESS" },
  });

  if (opts.parallel) {
    const parallelizable: AgentType[] = ["MARKET_RESEARCH", "UX_RESEARCH", "QA_ENGINEER", "DEVOPS_ENGINEER", "SECURITY_ENGINEER"];
    const sequentialFirst = pipeline.filter((a) => !parallelizable.includes(a));
    const parallelSecond = pipeline.filter((a) => parallelizable.includes(a));
    for (const type of sequentialFirst) {
      const run = await runAgent({ projectId: project.id, userId: opts.userId, agentType: type, context: ctx, previousOutputs });
      previousOutputs[type] = run.output;
      accumulate(result, run);
    }
    const parallelResults = await Promise.all(
      parallelSecond.map((type) =>
        runAgent({ projectId: project.id, userId: opts.userId, agentType: type, context: ctx, previousOutputs }),
      ),
    );
    for (const run of parallelResults) {
      previousOutputs[run.agentType] = run.output;
      accumulate(result, run);
    }
  } else {
    for (const type of pipeline) {
      const run = await runAgent({ projectId: project.id, userId: opts.userId, agentType: type, context: ctx, previousOutputs });
      previousOutputs[type] = run.output;
      accumulate(result, run);
    }
  }

  // Master report (synthesizes all outputs)
  const master = await generateAgentOutput("FINANCIAL_ANALYST", { context: ctx, previousOutputs });
  const masterRun = await runAgent({
    projectId: project.id,
    userId: opts.userId,
    agentType: "FINANCIAL_ANALYST",
    context: ctx,
    previousOutputs,
    forceOutput: master,
  });
  accumulate(result, masterRun);

  const report = await prisma.report.create({
    data: {
      projectId: project.id,
      type: "MASTER",
      title: `${project.name} — Master Report`,
      content: JSON.stringify({
        projectName: project.name,
        generatedAt: new Date().toISOString(),
        pipeline: result.runs,
        sections: Object.entries(previousOutputs).map(([agent, data]) => ({
          title: getAgent(agent as AgentType)?.name || agent,
          agent,
          data,
        })),
        totals: {
          totalTokens: result.totalTokens,
          totalDurationMs: result.totalDurationMs,
        },
      }),
      summary: (master.output as { executiveSummary?: string })?.executiveSummary || project.idea.slice(0, 240),
    },
  });
  result.masterReportId = report.id;

  await prisma.project.update({
    where: { id: project.id },
    data: { status: "COMPLETED" },
  });

  return result;
}

function accumulate(result: OrchestrateResult, run: AgentRunRecord) {
  result.totalTokens += run.tokens;
  result.totalDurationMs += run.durationMs;
  result.runs.push({
    agentType: run.agentType,
    runId: run.id,
    status: run.status,
    confidence: run.confidenceScore,
    tokens: run.tokens,
    durationMs: run.durationMs,
  });
}

interface AgentRunRecord {
  id: string;
  agentType: AgentType;
  status: string;
  confidenceScore: number;
  tokens: number;
  durationMs: number;
  output: unknown;
}

interface RunAgentArgs {
  projectId: string;
  userId: string;
  agentType: AgentType;
  context: ProjectContext;
  previousOutputs: Partial<Record<AgentType, unknown>>;
  forceOutput?: { output: Record<string, unknown>; thinking: string; confidenceScore: number };
}

async function runAgent(args: RunAgentArgs): Promise<AgentRunRecord> {
  const start = Date.now();
  const agent = getAgent(args.agentType);
  if (!agent) throw new Error(`Unknown agent: ${args.agentType}`);

  const run = await prisma.agentRun.create({
    data: {
      projectId: args.projectId,
      agentType: args.agentType,
      status: "RUNNING",
      input: JSON.stringify(args.previousOutputs),
      triggeredById: args.userId,
      startedAt: new Date(),
      modelProvider: "buildforge",
      modelName: "multi-agent-v1",
    },
  });

  try {
    let result = args.forceOutput;

    if (!result) {
      // Use the deterministic generator. If an LLM provider is configured,
      // a future enhancement can post-process the generator output with the
      // model for richer detail.
      const llmResult = await aiComplete(
        [
          { role: "system", content: agent.systemPrompt },
          {
            role: "user",
            content: JSON.stringify({
              project: args.context,
              previousOutputs: args.previousOutputs,
              task: `Generate the ${agent.name} deliverables for this project.`,
            }),
          },
        ],
        { temperature: 0.7, maxTokens: 4096, json: true },
      ).catch(() => null);

      const generated = generateAgentOutput(args.agentType, {
        context: args.context,
        previousOutputs: args.previousOutputs,
      });

      result = {
        ...generated,
        output: { ...generated.output, _llm: llmResult?.content || null },
      };
    }

    const durationMs = Date.now() - start;
    const tokens = estimateTokens(JSON.stringify(result.output));

    const updated = await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "COMPLETED",
        output: JSON.stringify(result.output),
        thinking: result.thinking,
        confidenceScore: result.confidenceScore,
        tokensUsed: tokens,
        durationMs,
        completedAt: new Date(),
        modelProvider: "buildforge",
        modelName: "multi-agent-v1",
      },
    });

    // Persist as a project document
    await prisma.document.create({
      data: {
        projectId: args.projectId,
        title: `${agent.name} — ${agent.shortRole}`,
        type: agent.slug,
        content: JSON.stringify(result.output, null, 2),
        version: 1,
      },
    });

    // Track usage
    await prisma.usageMetric.create({
      data: {
        userId: args.userId,
        metric: "agent_run",
        value: 1,
        metadata: JSON.stringify({ agentType: args.agentType, tokens }),
      },
    });

    return {
      id: updated.id,
      agentType: args.agentType,
      status: "COMPLETED",
      confidenceScore: result.confidenceScore,
      tokens,
      durationMs,
      output: result.output,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await prisma.agentRun.update({
      where: { id: run.id },
      data: { status: "FAILED", errorMessage: message, completedAt: new Date() },
    });
    throw err;
  }
}

function estimateTokens(s: string): number {
  return Math.ceil(s.length / 4);
}

export async function runSingleAgent(args: {
  projectId: string;
  userId: string;
  agentType: AgentType;
}) {
  const project = await prisma.project.findUnique({ where: { id: args.projectId } });
  if (!project) throw new Error("Project not found");
  const ctx: ProjectContext = {
    id: project.id,
    name: project.name,
    idea: project.idea,
    description: project.description,
    industry: project.industry,
    targetMarket: project.targetMarket,
  };
  // Pull existing outputs for context
  const previousRuns = await prisma.agentRun.findMany({
    where: { projectId: project.id, status: "COMPLETED" },
    orderBy: { createdAt: "asc" },
  });
  const previousOutputs: Partial<Record<AgentType, unknown>> = {};
  for (const r of previousRuns) {
    if (r.output) previousOutputs[r.agentType as AgentType] = r.output;
  }
  return runAgent({
    projectId: project.id,
    userId: args.userId,
    agentType: args.agentType,
    context: ctx,
    previousOutputs,
  });
}
