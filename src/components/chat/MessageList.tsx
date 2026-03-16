import React from "react";
import { Sparkles, FileSearch } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import MessageBubble from "../MessageBubble";
import { type AiMode, HERO_SUGGESTIONS } from "@/constants/chatConstants";
import type { ChatMessage } from "@/hooks/useChatPersistence";

interface MessageListProps {
  messages: ChatMessage[];
  loadingMessages: boolean;
  isLoading: boolean;
  isResearching: boolean;
  researchProgress: number;
  handleSpeak: (text: string, messageId: string) => void;
  setCodeCanvasContent: (content: string | null) => void;
  setWritingCanvasContent: (content: string | null) => void;
  downloadReport: (content: string) => void;
  activeMode: AiMode;
  theme?: string;
  fontSize: string;
  setInput: (input: string) => void;
  usageRemaining: number;
  isPro: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loadingMessages,
  isLoading,
  isResearching,
  researchProgress,
  handleSpeak,
  setCodeCanvasContent,
  setWritingCanvasContent,
  downloadReport,
  activeMode,
  theme,
  fontSize,
  setInput,
  usageRemaining,
  isPro,
  scrollContainerRef,
  messagesEndRef
}) => {
  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto message-list">
      {loadingMessages ? (
        <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20 rounded-lg" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk']">How can I help you today?</h2>
          <p className="text-sm text-muted-foreground/60 max-w-md">
            I'm MahmudGPT, your AI assistant. Ask me anything, upload files, or try different AI modes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl mt-4">
            {HERO_SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s.prompt)}
                className="suggestion-card glass-panel p-4 rounded-2xl text-left hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <span className="text-xs font-bold font-['Space_Grotesk']">{s.title}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 line-clamp-1">{s.prompt}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={fontSize}>
          {messages.map(msg => (
            <div key={msg.id} className="animate-in slide-in-from-bottom-4 fade-in duration-300">
              <MessageBubble
                message={msg}
                onSpeak={handleSpeak}
                onOpenCodeCanvas={setCodeCanvasContent}
                onOpenWritingCanvas={setWritingCanvasContent}
                onDownloadReport={activeMode === "deep-research" ? downloadReport : undefined}
                theme={theme}
              />
            </div>
          ))}
          {isLoading && !messages.find(m => m.role === "assistant" && m.isStreaming) && (
            <div className="px-4 py-6 flex flex-col items-center gap-3">
              {isResearching && (
                <div className="w-full max-w-md space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileSearch className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span>Deep researching… analyzing sources</span>
                    <span className="ml-auto font-mono text-primary">{Math.round(researchProgress)}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-accent/30 overflow-hidden">
                    <div
                      className="h-full rounded-full research-progress-bar transition-all duration-500 ease-out"
                      style={{ width: `${researchProgress}%` }}
                    />
                  </div>
                </div>
              )}
              {!isResearching && (
                <div className="flex items-center gap-3">
                  <div className="typing-indicator"><span /><span /><span /></div>
                  <span className="text-[10px] text-muted-foreground/40">Thinking...</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
