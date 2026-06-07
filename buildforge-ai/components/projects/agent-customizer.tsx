"use client";

import * as React from "react";
import {
  Settings,
  RotateCcw,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
  Brain,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface AgentConfig {
  id: string;
  name: string;
  type: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

interface AgentCustomizerProps {
  projectId: string;
}

const defaultAgents: AgentConfig[] = [
  { id: "1", name: "Product Manager", type: "PRODUCT_MANAGER", systemPrompt: "You are a product manager...", temperature: 0.7, maxTokens: 4096 },
  { id: "2", name: "Market Research", type: "MARKET_RESEARCH", systemPrompt: "You are a market research analyst...", temperature: 0.5, maxTokens: 4096 },
  { id: "3", name: "Backend Architect", type: "BACKEND_ARCHITECT", systemPrompt: "You are a backend architect...", temperature: 0.3, maxTokens: 8192 },
  { id: "4", name: "Frontend Architect", type: "FRONTEND_ARCHITECT", systemPrompt: "You are a frontend architect...", temperature: 0.4, maxTokens: 8192 },
];

export function AgentCustomizer({ projectId }: AgentCustomizerProps) {
  const [agents, setAgents] = React.useState<AgentConfig[]>(defaultAgents);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [previewText, setPreviewText] = React.useState("");

  const editing = agents.find((a) => a.id === expanded);

  const updateAgent = (id: string, updates: Partial<AgentConfig>) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const saveConfig = async (agent: AgentConfig) => {
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}/customization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.type, config: {
          systemPrompt: agent.systemPrompt,
          temperature: agent.temperature,
          maxTokens: agent.maxTokens,
        }}),
      });
    } catch {} finally {
      setSaving(false);
    }
  };

  const resetDefaults = (id: string) => {
    const defaults = defaultAgents.find((a) => a.id === id);
    if (defaults) updateAgent(id, defaults);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Settings className="h-5 w-5" />
        Agent Customization
      </h2>

      <div className="space-y-2">
        {agents.map((agent) => (
          <Card key={agent.id} className="overflow-hidden">
            <button
              className="flex w-full items-center justify-between p-4 text-left hover:bg-accent/50"
              onClick={() => setExpanded(expanded === agent.id ? null : agent.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">
                    temp: {agent.temperature} | tokens: {agent.maxTokens}
                  </p>
                </div>
              </div>
              {expanded === agent.id ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {expanded === agent.id && (
              <div className="border-t bg-muted/30 p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">System Prompt</Label>
                  <Textarea
                    value={agent.systemPrompt}
                    onChange={(e) => updateAgent(agent.id, { systemPrompt: e.target.value })}
                    rows={4}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Temperature: {agent.temperature}</Label>
                  </div>
                  <Slider
                    value={[agent.temperature]}
                    onValueChange={(v) => updateAgent(agent.id, { temperature: v[0] })}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Max Tokens</Label>
                  <Input
                    type="number"
                    value={agent.maxTokens}
                    onChange={(e) => updateAgent(agent.id, { maxTokens: Number(e.target.value) })}
                    className="h-8 w-32"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveConfig(agent)}
                    disabled={saving}
                    className="gradient"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => resetDefaults(agent.id)}>
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type a message to see how the agent would respond with current settings..."
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            rows={3}
          />
          {previewText && (
            <div className="mt-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              Agent response would appear here with temperature={editing?.temperature ?? 0.5} and maxTokens={editing?.maxTokens ?? 4096}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
