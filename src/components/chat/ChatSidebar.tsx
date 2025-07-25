import { cn } from "@/lib/utils";
import { PromptLibrary } from "../prompt-library/PromptLibrary";

interface ChatSidebarProps {
  collapsed: boolean;
  chatIsLoading: boolean;
  canUseModel: boolean;
  handleSendMessage: (content: string) => Promise<void>;
}

export function ChatSidebar({
  collapsed,
  chatIsLoading,
  canUseModel,
  handleSendMessage,
}: ChatSidebarProps) {
  return (
    <div
      className={cn(
        "bg-muted/30 border-r flex flex-col transition-all duration-300 ease-in-out pt-2",
        collapsed ? "w-0 p-0 overflow-hidden lg:w-96" : "w-96"
      )}
    >
      <PromptLibrary
        handleSendMessage={handleSendMessage}
        chatIsLoading={chatIsLoading}
        canUseModel={canUseModel}
      />
    </div>
  );
}
