"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Key } from "lucide-react";

interface ApiKeys {
  openai?: string;
}

interface ApiKeyManagerProps {
  apiKeys: ApiKeys;
  onApiKeysChange: (keys: ApiKeys) => void;
  onClose: () => void;
}

export function ApiKeyManager({
  apiKeys,
  onApiKeysChange,
  onClose,
}: ApiKeyManagerProps) {
  const [showKey, setShowKey] = useState(false);
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || "");

  const handleSave = () => {
    onApiKeysChange({
      openai: openaiKey || undefined,
    });
    onClose();
  };

  const handleClear = () => {
    setOpenaiKey("");
    onApiKeysChange({});
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="openai-key" className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          OpenAI API Key
        </Label>
        <div className="relative">
          <Input
            id="openai-key"
            type={showKey ? "text" : "password"}
            placeholder="sk-..."
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Your API key is stored locally and never sent to our servers.
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} className="flex-1">
          Save
        </Button>
        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>
      </div>
    </div>
  );
}
