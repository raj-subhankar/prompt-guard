// Message related types
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
}

// Prompt library types
export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
}

// API related types
export interface ApiKeys {
  openai?: string;
  anthropic?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'cohere';
  description?: string;
}

// Component prop types
export interface MessageProps {
  message: ChatMessage;
  onSaveToLibrary?: (title: string, content: string, category: string) => void;
  categories?: string[];
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  disabled?: boolean;
  initialValue?: string;
}

export interface PromptLibraryProps {
  onSelectPrompt: (content: string) => void;
  onRunPrompts: (prompts: string[]) => Promise<void>;
  disabled?: boolean;
  isProcessing?: boolean;
  onAddPrompt?: (title: string, content: string, category: string) => void;
}