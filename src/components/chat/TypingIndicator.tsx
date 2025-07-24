import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  model?: string;
}

export function TypingIndicator({ model }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 mb-6">
      <div className="h-8 w-8 rounded-full bg-chat-assistant flex items-center justify-center">
        <div className="w-4 h-4 text-chat-assistant-foreground">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18" />
          </svg>
        </div>
      </div>
      
      <div className="max-w-[70%] space-y-1">
        <div className="bg-chat-assistant border border-border rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className={cn(
                "w-2 h-2 bg-muted-foreground rounded-full animate-bounce",
                "[animation-delay:-0.3s]"
              )} />
              <div className={cn(
                "w-2 h-2 bg-muted-foreground rounded-full animate-bounce",
                "[animation-delay:-0.15s]"
              )} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
            </div>
            <span className="text-xs text-muted-foreground">
              {model ? `${model} is thinking...` : 'AI is thinking...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}