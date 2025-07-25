import { useState, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import { AIService } from "@/services/aiService";
import type { AIModel, ApiKeys, ChatMessage } from "@/types";

interface UseChatProps {
  apiKeys: ApiKeys;
  currentModel?: AIModel;
}

export function useChat({ apiKeys, currentModel }: UseChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const { toast } = useToast();

  const canUseModel = !!(currentModel && apiKeys[currentModel.provider]);

  const handleSendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!currentModel || !canUseModel) {
        const errorMsg = `Please add your ${currentModel?.provider} API key.`;
        toast({
          title: "API Key Required",
          description: errorMsg,
          variant: "destructive",
        });
        throw new Error(errorMsg);
      }

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        role: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setStreamingMessage("");

      try {
        const aiService = new AIService(apiKeys);
        const allMessages = [...messages, userMessage];
        const response = await aiService.sendMessage(
          allMessages,
          currentModel,
          (chunk) => {
            setStreamingMessage((prev) => prev + chunk);
          }
        );

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: "assistant",
          timestamp: new Date(),
          model: currentModel.name,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to send message",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsLoading(false);
        setStreamingMessage("");
      }
    },
    [currentModel, canUseModel, apiKeys, messages, toast]
  );

  const clearChat = useCallback(() => setMessages([]), []);

  return {
    messages,
    isLoading,
    streamingMessage,
    handleSendMessage,
    clearChat,
    canUseModel,
  };
}
