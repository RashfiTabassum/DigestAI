import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full gap-3 animate-bounce-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-md animate-pulse-scale">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-5 py-3.5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
          isUser
            ? "bg-gradient-to-br from-primary to-orange-500 text-white rounded-br-md"
            : "bg-card text-card-foreground rounded-bl-md border-2 border-primary/20 hover:border-primary/40"
        )}
      >
        <p className="text-sm leading-relaxed font-body whitespace-pre-wrap">
          {message}
        </p>
        {timestamp && (
          <p className={cn(
            "text-xs mt-1.5 opacity-70",
            isUser ? "text-white/90" : "text-muted-foreground"
          )}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {isUser && (
        <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary/30 flex items-center justify-center shadow-md">
          <User className="h-4 w-4 text-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
