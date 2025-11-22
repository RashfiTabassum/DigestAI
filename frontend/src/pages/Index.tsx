import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Sparkles, Zap } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! I'm DigestAI ✨ Drop me any text and I'll give you the perfect summary!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({
          user_query: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.output || data.response || data.message || "I received your message!",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the chat server. Make sure the API is running at http://127.0.0.1:8000",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to the server. Please check if the API is running.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body relative overflow-hidden">
      {/* Animated Background */}
      <div className="gradient-mesh fixed inset-0 opacity-40 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-scale" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse-scale" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/70 backdrop-blur-xl border-b-2 border-primary/20 shadow-lg">
        <div className="container max-w-4xl mx-auto px-4 py-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg animate-pulse-scale">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              DigestAI
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Smart summarization, instant insights
            </p>
          </div>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="container max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-104px)] relative z-10">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-5 mb-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 transition-colors">
          {messages.map((message, index) => (
            <div key={message.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <ChatMessage
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-bounce-in">
              <div className="flex gap-3">
                <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-md animate-pulse">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div className="bg-card text-card-foreground rounded-2xl rounded-bl-md px-5 py-4 border-2 border-primary/20 shadow-lg">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce shadow-sm" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce shadow-sm" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce shadow-sm" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 pt-2">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Index;
