# Agents

The platform ships with **12 specialized AI agents**, each defined in `lib/agents/definitions.ts`. Every agent has:

- **type** (Prisma enum)
- **slug** (URL-friendly)
- **name** (display name, e.g. "Atlas")
- **role** (formal title)
- **description** (one-line)
- **goal** (single sentence)
- **systemPrompt** (LLM prompt)
- **icon** + **color** + **gradient** (UI)
- **capabilities** (array of strings)
- **outputs** (array of strings — artifacts produced)
- **order** (display order)

The full output of every agent is a **JSON object** with a consistent shape:

```json
{
  "thinking": "How this agent reasoned about the project…",
  "output": { /* the structured deliverable */ },
  "confidenceScore": 0.92
}
```

## Adding a new agent

1. Add a new value to the `AgentType` enum in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_new_agent`
3. Add a metadata entry in `lib/agents/definitions.ts`
4. Implement a generator function in `lib/agents/generators.ts`
5. Register it in the dispatcher switch
6. Add it to `DEFAULT_PIPELINE` in `orchestrator.ts`

## Switching the model

`lib/ai/provider.ts` is a thin abstraction over OpenAI / Anthropic / Google. By default it auto-detects the first available key. To force a specific provider, set `DEFAULT_AI_PROVIDER` in `.env`.

The mock provider is a fully deterministic fallback used when no API keys are set — it returns a placeholder so the rest of the orchestration is testable offline.
