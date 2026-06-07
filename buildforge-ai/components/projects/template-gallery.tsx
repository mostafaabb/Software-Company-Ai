"use client";

import * as React from "react";
import {
  LayoutTemplate,
  Globe,
  ShoppingCart,
  MessageSquare,
  FileText,
  BarChart3,
  Loader2,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const templateIcons: Record<string, any> = {
  web: Globe,
  ecommerce: ShoppingCart,
  social: MessageSquare,
  blog: FileText,
  saas: BarChart3,
  default: LayoutTemplate,
};

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  popular?: boolean;
  icon?: string;
}

interface TemplateGalleryProps {
  onSelect?: (template: Template) => void;
}

const categories = [
  { id: "all", label: "All" },
  { id: "web", label: "Web Apps" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "social", label: "Social" },
  { id: "saas", label: "SaaS" },
  { id: "blog", label: "Blogs" },
];

export function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("all");

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const filtered = activeCategory === "all"
    ? templates
    : templates.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <LayoutTemplate className="h-5 w-5" />
        Project Templates
      </h2>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <LayoutTemplate className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p className="text-sm">No templates found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => {
            const Icon = templateIcons[template.icon || "default"] || LayoutTemplate;
            return (
              <Card key={template.id} className="relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                {template.popular && (
                  <div className="absolute right-2 top-2">
                    <Badge variant="gradient" className="gap-1">
                      <Star className="h-3 w-3" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    className="w-full gradient"
                    onClick={() => onSelect?.(template)}
                  >
                    <Sparkles className="h-4 w-4" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
