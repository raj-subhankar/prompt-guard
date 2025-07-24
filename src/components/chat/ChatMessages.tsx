import { ChatMessage as ChatMessageComponent } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage } from "@/services/aiService";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  streamingMessage: string;
  currentModel: any;
  onSaveToLibrary: (title: string, content: string, category: string) => void;
  categories: string[];
}

export function ChatMessages({
  messages,
  isLoading,
  streamingMessage,
  currentModel,
  onSaveToLibrary,
  categories,
}: ChatMessagesProps) {
  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <ChatMessageComponent
            message={message}
            onSaveToLibrary={
              message.role === "user" ? onSaveToLibrary : undefined
            }
            categories={categories}
          />
        </div>
      ))}

      {isLoading && (
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
          {streamingMessage ? (
            <ChatMessageComponent
              message={{
                id: "streaming",
                content: streamingMessage,
                role: "assistant",
                timestamp: new Date(),
                model: currentModel?.name,
              }}
            />
          ) : (
            <TypingIndicator model={currentModel?.name} />
          )}
        </div>
      )}
    </div>
  );
}
