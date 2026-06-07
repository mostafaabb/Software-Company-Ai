/**
 * Background worker entrypoint (BullMQ).
 * Runs long-lived agent runs, knowledge ingestion, and email out-of-band.
 * Started as a separate process: `node scripts/worker.js`
 */
import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", { maxRetriesPerRequest: null });

const agentWorker = new Worker(
  "agent-runs",
  async (job) => {
    const { projectId, userId, agentType } = job.data;
    const { runSingleAgent } = await import("../lib/agents/orchestrator");
    return runSingleAgent({ projectId, userId, agentType });
  },
  { connection, concurrency: 3 },
);

agentWorker.on("completed", (job) => console.log(`[agent-runs] ${job.id} completed`));
agentWorker.on("failed", (job, err) => console.error(`[agent-runs] ${job?.id} failed:`, err));
console.log("BuildForge worker started");
