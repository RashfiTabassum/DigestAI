import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full animate-slide-up">
      <div className="relative flex items-end gap-3 p-4 bg-card rounded-3xl border-2 border-primary/30 shadow-2xl hover:border-primary/50 transition-all duration-300 backdrop-blur-sm">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[60px] max-h-[200px] resize-none border-0 focus-visible:ring-0 bg-transparent font-body text-foreground placeholder:text-muted-foreground text-[15px]"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
          className={cn(
            "h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-white shrink-0 transition-all duration-300 shadow-lg",
            !message.trim() || isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110 hover:shadow-2xl hover:-translate-y-1 pulse-glow"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          )}
        </Button>
      </div>
    </form>
  );
};

// Import cn utility
import { cn } from "@/lib/utils";

export default ChatInput;
