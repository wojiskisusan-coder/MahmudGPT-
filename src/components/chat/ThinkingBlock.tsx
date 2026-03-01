import React, { useState } from "react";
import { ChevronDown, ChevronUp, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  content: string;
  className?: string;
}

const ThinkingBlock: React.FC<Props> = ({ content, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  return (
    <div className={cn("my-4 rounded-xl border border-border/50 bg-muted/20 overflow-hidden transition-all duration-300", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left group"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <Brain className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Thinking Process
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/20 rounded-full" />
            <div className="pl-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap italic">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThinkingBlock;
