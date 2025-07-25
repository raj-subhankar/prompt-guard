import { ChatApp } from "@/components/chat/ChatApp";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Index = () => {
  return (
    <ErrorBoundary>
      <ChatApp />
    </ErrorBoundary>
  );
};

export default Index;
