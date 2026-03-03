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
        <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-8">
          {/* Ultra Hero */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl scale-150" />
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-br from-primary via-primary/70 to-primary/40 flex items-center justify-center animate-hero-glow shadow-2xl shadow-primary/30">
              <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground animate-float" />
            </div>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 font-['Space_Grotesk'] gradient-text">MahmudGPT</h2>
            <p className="text-xs sm:text-sm text-muted-foreground/40">What can I help you with today?</p>
          </div>

          {/* Suggestion Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl w-full px-4">
            {HERO_SUGGESTIONS.map((s) => (
              <button
                key={s.text}
                onClick={() => setInput(s.text)}
                className="suggestion-card text-left p-4 rounded-2xl border border-border/10 glass-panel group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{s.label}</span>
                </div>
                <span className="block text-xs leading-relaxed text-muted-foreground/80 group-hover:text-foreground transition-colors font-medium">{s.text}</span>
              </button>
            ))}
          </div>

          {!isPro && (
            <p className="text-[9px] text-muted-foreground/25">{usageRemaining} messages remaining today</p>
          )}
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
