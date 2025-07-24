import { MessageSquare, Sparkles, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWelcomeProps {
  hasApiKeys: boolean;
}

export function ChatWelcome({ hasApiKeys }: ChatWelcomeProps) {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Get intelligent insights and recommendations",
    },
    {
      icon: Shield,
      title: "Security Focused",
      description: "Built with privacy and security in mind",
    },
    {
      icon: Zap,
      title: "Multiple Models",
      description: "Choose from various AI models for different tasks",
    },
  ];

  return (
    <div className="text-center py-12 space-y-8">
      <div className="space-y-4">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
          <MessageSquare className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            How can I help you today?
          </h1>
          <p className="text-muted-foreground text-lg">
            {hasApiKeys
              ? "Choose a model and start your conversation."
              : "Configure your API keys to get started."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted/70 transition-colors"
          >
            <feature.icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {!hasApiKeys && (
        <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
          <h3 className="font-semibold mb-2">Ready to get started?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your API keys in the header to begin chatting with AI models.
          </p>
          <Button variant="outline" size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Configure API Keys
          </Button>
        </div>
      )}
    </div>
  );
}
