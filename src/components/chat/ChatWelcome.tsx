import { Key, MessageSquare } from "lucide-react";

interface ChatWelcomeProps {
  hasApiKeys: boolean;
}

export function ChatWelcome({ hasApiKeys }: ChatWelcomeProps) {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center p-4 text-center">
      {!hasApiKeys ? (
        <>
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Key className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            API Key Required
          </h3>
          <p className="text-sm text-muted-foreground">
            Add an API key from the top bar to begin.
          </p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">Ready to test</h3>
          <p className="text-sm text-muted-foreground">
            Select prompts from the Prompt Library to start
          </p>
        </>
      )}
    </div>
  );
}
