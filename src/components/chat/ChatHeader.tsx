import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ModelSelector } from "../ModelSelector";
import { ApiKeyManager } from "../ApiKeyManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Plus, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import tetrateIcon from "../../../public/tetrate-logo-orange.svg";
import { useState } from "react";
import { AIModel, ApiKeys } from "@/types";

interface ChatHeaderProps {
  onClearChat: () => void;
  messagesCount: number;
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              <div className="p-2">
                <Link to="/">
                  <img
                    src={tetrateIcon}
                    alt="Tetrate logo"
                    className="h-5 w-5"
                  />
                </Link>
              </div>
              <div>
                <h1 className="font-bold text-lg bg-clip-text">Prompt Guard</h1>
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">API Keys</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>API Configuration</DialogTitle>
              </DialogHeader>
              <ApiKeyManager
                apiKeys={apiKeys}
                onApiKeysChange={onApiKeysChange}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
