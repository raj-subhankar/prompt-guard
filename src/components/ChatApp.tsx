"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChatInput } from "./chat/ChatInput";
import { AI_MODELS } from "./chat/ModelSelector";
import { AIService, type ChatMessage } from "@/services/aiService";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatSidebar } from "./chat/ChatSidebar";
import { ChatWelcome } from "./chat/ChatWelcome";
import { ChatMessages } from "./chat/ChatMessages";

interface ApiKeys {
  openai?: string;
  anthropic?: string;
}

export function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    try {
      const stored = localStorage.getItem("ai-chat-api-keys");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [promptCategories, setPromptCategories] = useState<string[]>([
    "Security Risks",
    "Privacy Concerns",
    "Regulatory Compliance",
    "Operational Issues",
  ]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const hasApiKeys = useMemo(
    () =>
      Object.keys(apiKeys).length > 0 &&
      Object.values(apiKeys).some((key) => key),
    [apiKeys]
  );

  const currentModel = useMemo(
    () => AI_MODELS.find((m) => m.id === selectedModel),
    [selectedModel]
  );

  const canUseModel = useMemo(
    () => currentModel && apiKeys[currentModel.provider],
    [currentModel, apiKeys]
  );

  useEffect(() => {
    localStorage.setItem("ai-chat-api-keys", JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      setSelectedPrompt("");

      if (!currentModel || !canUseModel) {
        toast({
          title: "API Key Required",
          description: `Please add your ${currentModel?.provider} API key to use this model.`,
          variant: "destructive",
        });
        return;
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
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to send message",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setStreamingMessage("");
      }
    },
    [currentModel, canUseModel, apiKeys, messages, toast]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const handleSelectPrompt = useCallback((content: string) => {
    setSelectedPrompt(content);
  }, []);

  const handleRunPrompts = useCallback(
    async (promptContents: string[]) => {
      if (!currentModel || !canUseModel) {
        toast({
          title: "API Key Required",
          description: `Please add your ${currentModel?.provider} API key to use this model.`,
          variant: "destructive",
        });
        return;
      }

      setIsProcessingFile(true);
      try {
        for (let i = 0; i < promptContents.length; i++) {
          const content = promptContents[i];
          await handleSendMessage(content);

          while (isLoading) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          if (i < promptContents.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }

        toast({
          title: "Prompts Completed",
          description: `Successfully ran ${promptContents.length} prompts.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to run some prompts",
          variant: "destructive",
        });
      } finally {
        setIsProcessingFile(false);
      }
    },
    [currentModel, canUseModel, handleSendMessage, isLoading, toast]
  );

  const handleSaveToLibrary = useCallback(
    (title: string, content: string, category: string) => {
      toast({
        title: "Message Saved",
        description: `Saved "${title}" to ${category} category.`,
      });
    },
    [toast]
  );

  const handleUpdateCategories = useCallback(
    (title: string, content: string, category: string) => {
      setPromptCategories((prev) => {
        if (!prev.includes(category)) {
          return [...prev, category];
        }
        return prev;
      });
    },
    []
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      <ChatHeader
        onClearChat={clearChat}
        messagesCount={messages.length}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        apiKeys={apiKeys}
        onApiKeysChange={setApiKeys}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex flex-1 pt-16">
        <ChatSidebar
          collapsed={sidebarCollapsed}
          onSelectPrompt={handleSelectPrompt}
          onRunPrompts={handleRunPrompts}
          disabled={!canUseModel || isLoading || isProcessingFile}
          isProcessing={isProcessingFile}
          onAddPrompt={handleUpdateCategories}
          hasApiKeys={hasApiKeys}
        />

        <div className="flex-1 flex flex-col min-w-0 relative">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="max-w-4xl mx-auto px-4 py-8">
                {messages.length === 0 ? (
                  <ChatWelcome hasApiKeys={hasApiKeys} />
                ) : (
                  <ChatMessages
                    messages={messages}
                    isLoading={isLoading}
                    streamingMessage={streamingMessage}
                    currentModel={currentModel}
                    onSaveToLibrary={handleSaveToLibrary}
                    categories={promptCategories}
                  />
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="border-t border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 p-4">
            <div className="max-w-4xl mx-auto space-y-3">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                disabled={!canUseModel}
                initialValue={selectedPrompt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
