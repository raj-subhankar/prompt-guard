import { useState, useRef, useEffect, useMemo } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useChat } from "@/hooks/useChat";
import { usePromptLibrary } from "@/hooks/usePromptLibrary";
import { AI_MODELS, LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "./ChatHeader";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWelcome } from "./ChatWelcome";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

export function ChatApp() {
  const [apiKeys, setApiKeys] = useLocalStorage(
    LOCAL_STORAGE_KEYS.API_KEYS,
    {}
  );
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    streamingMessage,
    handleSendMessage,
    clearChat,
    canUseModel,
  } = useChat({
    apiKeys,
    currentModel: selectedModel,
  });

  const { categories, saveContentAsPrompt } = usePromptLibrary({
    handleSendMessage,
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  return (
    <div className="flex h-screen overflow-hidden">
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
          chatIsLoading={isLoading}
          canUseModel={canUseModel}
          handleSendMessage={handleSendMessage}
        />

        <div className="flex-1 flex flex-col min-w-0 relative">
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="max-w-4xl mx-auto px-4 py-8">
              {messages.length === 0 ? (
                <ChatWelcome hasApiKeys={Object.keys(apiKeys).length > 0} />
              ) : (
                <ChatMessages
                  messages={messages}
                  isLoading={isLoading}
                  streamingMessage={streamingMessage}
                  currentModel={selectedModel}
                  onSaveToLibrary={saveContentAsPrompt}
                  categories={categories}
                />
              )}
            </div>
          </ScrollArea>
          <div className="border-t bg-background/80 p-4">
            <div className="max-w-4xl mx-auto">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                disabled={!canUseModel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
