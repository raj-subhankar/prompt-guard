import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ChatApp } from "@/components/ChatApp";

const Index = () => {
  return (
    <ErrorBoundary>
      <ChatApp />
    </ErrorBoundary>
  );
};

export default Index;
