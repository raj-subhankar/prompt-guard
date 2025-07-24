import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SaveMessageDialog } from "./SaveMessageDialog";
import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  model?: string;
}

interface ChatMessageProps {
  message: Message;
  onSaveToLibrary?: (title: string, content: string, category: string) => void;
  categories?: string[];
}

export const ChatMessage = React.memo<ChatMessageProps>(
  ({ message, onSaveToLibrary, categories = [] }) => {
    const isUser = message.role === "user";

    return (
      <div
        className={cn(
          "group flex gap-3 mb-6 relative", // Added relative positioning to the main container
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback
            className={cn(
              "text-sm",
              isUser
                ? "bg-chat-assistant text-chat-assistant-foreground"
                : "bg-chat-user text-chat-user-foreground"
            )}
          >
            {isUser ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "max-w-[70%] space-y-1 relative",
            isUser ? "items-end" : "items-start"
          )}
        >
          <div
            className={cn(
              "rounded-lg px-4 py-2 text-sm break-words relative",
              isUser ? "bg-chat-assistant text-chat-assistant-foreground" : ""
            )}
          >
            {message.content}
          </div>

          {isUser && onSaveToLibrary && (
            <div
              className={cn(
                "absolute top-0 transition-opacity duration-200 z-10",
                "opacity-0 group-hover:opacity-100",
                isUser ? "-left-12" : "-right-12"
              )}
            >
              <SaveMessageDialog
                content={message.content}
                categories={categories}
                onSave={onSaveToLibrary}
              />
            </div>
          )}

          <div
            className={cn(
              "text-xs text-muted-foreground flex gap-2",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            <span>{message.timestamp.toLocaleTimeString()}</span>
            {message.model && !isUser && <span>• {message.model}</span>}
          </div>
        </div>
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";
