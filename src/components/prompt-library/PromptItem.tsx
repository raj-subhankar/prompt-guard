import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Edit, Send, Trash2 } from "lucide-react";
import type { Prompt } from "@/types";

interface PromptItemProps {
  prompt: Prompt;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onSendPrompt: (content: string) => void;
  isExecutionDisabled: boolean;
  isProcessing: boolean;
}

export function PromptItem({
  prompt,
  isSelected,
  onToggleSelection,
  onEdit,
  onDelete,
  onSendPrompt,
  isExecutionDisabled,
  isProcessing,
}: PromptItemProps) {
  return (
    <div
      onClick={() => !isProcessing && onToggleSelection(prompt.id)}
      className={cn(
        "group relative cursor-pointer rounded-lg border p-3 transition-colors",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-5 items-center">
          <div
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
              isSelected ? "bg-primary text-primary-foreground" : ""
            )}
          >
            <Check className={cn("h-4 w-4", !isSelected && "hidden")} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1.5">
            <h4 className="flex-1 min-w-0 pr-2 font-medium text-sm break-words">
              {prompt.title}
            </h4>

            <div className="flex flex-shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onSendPrompt(prompt.content);
                }}
                disabled={isExecutionDisabled}
                aria-label="Send prompt"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(prompt);
                }}
                disabled={isProcessing}
                aria-label="Edit prompt"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(prompt.id);
                }}
                disabled={isProcessing}
                aria-label="Delete prompt"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {prompt.content}
          </p>
        </div>
      </div>
    </div>
  );
}
