"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ModelSelector } from "./ModelSelector";
import { ApiKeyManager } from "./ApiKeyManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, Settings, Plus, Menu, X } from "lucide-react";

interface ApiKeys {
  openai?: string;
  anthropic?: string;
}

interface ChatHeaderProps {
  onClearChat: () => void;
  messagesCount: number;
  selectedModel: string;
  onModelChange: (model: string) => void;
  apiKeys: ApiKeys;
  onApiKeysChange: (keys: ApiKeys) => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function ChatHeader({
  onClearChat,
  messagesCount,
  selectedModel,
  onModelChange,
  apiKeys,
  onApiKeysChange,
  sidebarCollapsed,
  onToggleSidebar,
}: ChatHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            {sidebarCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Prompt Guard
                </h1>
                {messagesCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {messagesCount} messages
                  </Badge>
                )}
              </div>
            </div>

            <Button
              onClick={onClearChat}
              variant="outline"
              size="sm"
              disabled={messagesCount === 0}
              className="hidden sm:flex bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Model:
            </span>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={onModelChange}
            />
          </div>

          <ThemeToggle />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">API Keys</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Manage API Keys</DialogTitle>
              </DialogHeader>
              <ApiKeyManager
                apiKeys={apiKeys}
                onApiKeysChange={onApiKeysChange}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
