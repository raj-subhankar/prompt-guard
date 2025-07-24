import { PromptLibrary } from "./PromptLibrary";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ChatSidebarProps {
  collapsed: boolean;
  onSelectPrompt: (content: string) => void;
  onRunPrompts: (prompts: string[]) => void;
  disabled: boolean;
  isProcessing: boolean;
  onAddPrompt: (title: string, content: string, category: string) => void;
  hasApiKeys: boolean;
}

export function ChatSidebar({
  collapsed,
  onSelectPrompt,
  onRunPrompts,
  disabled,
  isProcessing,
  onAddPrompt,
  hasApiKeys,
}: ChatSidebarProps) {
  return (
    <div
      className={cn(
        "bg-muted/30 border-r border-border/50 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-0 overflow-hidden lg:w-80" : "w-80"
      )}
    >
      <div className="flex-1 p-4 overflow-hidden">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Prompt Library</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Select or run predefined prompts
          </p>
        </div>

        <PromptLibrary
          onSelectPrompt={onSelectPrompt}
          onRunPrompts={onRunPrompts}
          disabled={disabled}
          isProcessing={isProcessing}
          onAddPrompt={onAddPrompt}
        />

        {!hasApiKeys && (
          <div className="mt-4 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-sm font-medium">Get Started</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Add your API keys to start chatting with AI models.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
