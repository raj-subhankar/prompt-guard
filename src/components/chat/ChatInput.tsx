import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  disabled?: boolean;
  initialValue?: string;
}

export const ChatInput = React.memo<ChatInputProps>(({ onSendMessage, isLoading, onStop, disabled, initialValue }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialValue) {
      setMessage(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }, [message, isLoading, disabled, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <Textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Add your API keys to start chatting..." : "Type your message... (Shift+Enter for new line)"}
          disabled={disabled || isLoading}
          className={cn(
            "min-h-[44px] max-h-32 resize-none bg-secondary/50 border-border",
            "focus:ring-primary focus:border-primary transition-smooth"
          )}
          rows={1}
          aria-label="Message input"
        />
      </div>
      
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        size="sm"
        className={cn(
          "h-11 px-3 bg-gradient-primary hover:opacity-90 transition-smooth",
          isLoading && "bg-destructive hover:bg-destructive"
        )}
        onClick={isLoading ? onStop : undefined}
        aria-label={isLoading ? "Stop generating" : "Send message"}
      >
        {isLoading ? (
          <Square className="h-4 w-4" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
});

ChatInput.displayName = "ChatInput";