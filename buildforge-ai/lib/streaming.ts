export interface StreamEvent {
  type: "agent_start" | "agent_thinking" | "agent_output" | "agent_complete" | "agent_error" | "pipeline_complete" | "pipeline_progress";
  agentType?: string;
  agentName?: string;
  data?: unknown;
  progress?: { current: number; total: number; percentage: number };
  timestamp: string;
}

export function createStreamEncoder() {
  return {
    encode(event: StreamEvent): string {
      return `data: ${JSON.stringify(event)}\n\n`;
    },
  };
}

export function sseHeaders(): HeadersInit {
  return {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };
}

export async function streamAgentProgress(
  controller: ReadableStreamDefaultController,
  agentType: string,
  agentName: string,
  current: number,
  total: number
): Promise<void> {
  const encoder = new TextEncoder();
  const event: StreamEvent = {
    type: "pipeline_progress",
    agentType,
    agentName,
    progress: { current, total, percentage: Math.round((current / total) * 100) },
    timestamp: new Date().toISOString(),
  };
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}

export async function streamAgentComplete(
  controller: ReadableStreamDefaultController,
  agentType: string,
  agentName: string,
  output: unknown,
  confidenceScore: number
): Promise<void> {
  const encoder = new TextEncoder();
  const event: StreamEvent = {
    type: "agent_complete",
    agentType,
    agentName,
    data: { output, confidenceScore },
    timestamp: new Date().toISOString(),
  };
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}
