"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Building2,
  Lightbulb,
  FolderPlus,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const industries = [
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "healthcare", name: "Healthcare", icon: "🏥" },
  { id: "finance", name: "Finance", icon: "💰" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "retail", name: "Retail", icon: "🛒" },
  { id: "food-beverage", name: "Food & Beverage", icon: "🍔" },
  { id: "real-estate", name: "Real Estate", icon: "🏠" },
  { id: "entertainment", name: "Entertainment", icon: "🎬" },
  { id: "other", name: "Other", icon: "✨" },
];

const steps = [
  { title: "Welcome", icon: Rocket },
  { title: "Pick Industry", icon: Building2 },
  { title: "Describe Your Idea", icon: Lightbulb },
  { title: "First Project", icon: FolderPlus },
];

interface OnboardingWizardProps {
  onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [industry, setIndustry] = React.useState("");
  const [idea, setIdea] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleComplete = async () => {
    localStorage.setItem("onboarding-industry", industry);
    localStorage.setItem("onboarding-idea", idea);
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, industry }),
      });
      if (res.ok) {
        const project = await res.json();
        onComplete();
        router.push(`/dashboard/projects/${project.id}`);
      }
    } catch {
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 overflow-hidden">
        <div className="p-6 pb-0">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
            </div>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mb-6" />
        </div>
        <CardContent className="p-6 pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to BuildForge AI</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Let&apos;s set up your AI software company. In a few quick steps, we&apos;ll configure
                    your workspace and get your first project running.
                  </p>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-2">Pick Your Industry</h2>
                  <p className="text-muted-foreground mb-6">Choose the industry that best describes your company.</p>
                  <div className="grid grid-cols-3 gap-3">
                    {industries.map((ind) => (
                      <button
                        key={ind.id}
                        onClick={() => setIndustry(ind.id)}
                        className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:bg-accent ${
                          industry === ind.id
                            ? "border-primary bg-accent ring-2 ring-primary/20"
                            : "border-border"
                        }`}
                      >
                        <span className="text-2xl">{ind.icon}</span>
                        <span className="text-sm font-medium">{ind.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-2">Describe Your Idea</h2>
                  <p className="text-muted-foreground mb-6">
                    Tell us about your project. What problem does it solve? What features do you need?
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="idea">Project Description</Label>
                    <Textarea
                      id="idea"
                      placeholder="e.g., I want to build a project management tool for remote teams with real-time collaboration, task tracking, and AI-powered insights..."
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Be as detailed as possible. Our AI agents will use this to plan your project.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center py-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500">
                    <FolderPlus className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Create Your First Project</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We&apos;ll create a project with your idea and run our discovery agent to analyze requirements,
                    create a roadmap, and generate an initial architecture.
                  </p>
                  <div className="rounded-lg border bg-muted/50 p-4 text-left text-sm mb-4">
                    <div className="font-medium mb-1">What happens next:</div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Discovery agent analyzes your requirements</li>
                      <li>• Market research agent evaluates the opportunity</li>
                      <li>• Product manager creates a detailed spec</li>
                      <li>• Architecture agents design the system</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={(currentStep === 1 && !industry) || (currentStep === 2 && !idea.trim())}
                className="gradient"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="gradient"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Launch Project
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
