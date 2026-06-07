"use client";

import * as React from "react";
import { Sparkles, Send, Loader2, Plus, Bot, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { AGENTS, type AgentMeta } from "@/lib/agents/definitions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatRelativeTime } from "@/lib/utils/cn";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  agentType?: string;
}

export function ChatInterface({
  projectId,
  agents,
  initialAgent,
}: {
  projectId: string;
  agents: AgentMeta[];
  initialAgent: string;
}) {
  const [agentType, setAgentType] = React.useState(initialAgent);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm **${AGENTS.find((a) => a.type === agentType)?.name}**, your ${AGENTS.find((a) => a.type === agentType)?.shortRole}. Ask me anything about this project, or pick another agent from the list to collaborate with.`,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function onSend() {
    if (!input.trim() || streaming) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setStreaming(true);

    const assistantId = `a-${Date.now()}`;
    setMessages((m) => [
      ...m,
      { id: assistantId, role: "assistant", content: "", createdAt: new Date().toISOString(), agentType },
    ]);

    try {
      const res = await fetch(`/api/projects/${projectId}/agents/${agentType.toLowerCase().replace(/_/g, "-")}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMsg.content }),
      });
      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.delta) {
              acc += data.delta;
              setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, content: acc } : msg)));
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, content: `**Error:** ${String(err)}` } : msg)));
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
      <Card className="hidden h-[calc(100vh-7rem)] flex-col lg:flex">
        <div className="border-b border-border/60 p-3">
          <h3 className="font-display text-sm font-semibold">Choose an agent</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Each has unique expertise and memory.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {agents.map((a) => {
            const active = a.type === agentType;
            return (
              <button
                key={a.type}
                onClick={() => setAgentType(a.type)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors",
                  active ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <div className={cn("h-7 w-7 shrink-0 rounded-md bg-gradient-to-br text-white", a.gradient)}>
                  <Sparkles className="m-1.5 h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{a.name}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{a.shortRole}</div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="flex h-[calc(100vh-7rem)] flex-col">
        <div className="flex items-center justify-between border-b border-border/60 p-3">
          <div className="flex items-center gap-2">
            <div className={cn("h-8 w-8 rounded-md bg-gradient-to-br text-white", AGENTS.find((a) => a.type === agentType)?.gradient)}>
              <Sparkles className="m-2 h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">{AGENTS.find((a) => a.type === agentType)?.name}</div>
              <div className="text-xs text-muted-foreground">{AGENTS.find((a) => a.type === agentType)?.shortRole}</div>
            </div>
          </div>
          <Badge variant="success" className="gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Online
          </Badge>
        </div>
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "assistant" && (
                <div className={cn("h-7 w-7 shrink-0 rounded-md bg-gradient-to-br text-white", AGENTS.find((a) => a.type === (m.agentType || agentType))?.gradient || "from-indigo-500 to-fuchsia-500")}>
                  <Sparkles className="m-1.5 h-4 w-4" />
                </div>
              )}
              <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                {m.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-zinc-950 [&_pre]:p-3 [&_pre]:text-xs [&_code]:rounded [&_code]:bg-zinc-950/30 [&_code]:px-1 [&_code]:py-0.5">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content || (streaming ? "_Thinking…_" : "")}
                    </ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
              {m.role === "user" && (
                <div className="h-7 w-7 shrink-0 rounded-md bg-zinc-700 text-white">
                  <UserIcon className="m-1.5 h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-border/60 p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${AGENTS.find((a) => a.type === agentType)?.name || "an agent"} anything…`}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              className="min-h-[40px] resize-none"
            />
            <Button variant="gradient" size="icon" onClick={onSend} disabled={!input.trim() || streaming}>
              {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Responses are streamed in real time. Press Enter to send, Shift+Enter for new line.
          </p>
        </div>
      </Card>
    </div>
  );
}
