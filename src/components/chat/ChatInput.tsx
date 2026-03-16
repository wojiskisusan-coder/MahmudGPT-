import React from "react";
import { Plus, Mic, MicOff, Send, ImageIcon, Film, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FileUpload, { type UploadedFile } from "./FileUpload";
import { type AiMode, MODE_OPTIONS } from "@/constants/chatConstants";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  send: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  triggerMode: "image" | "video" | null;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[]) => void;
  showModePanel: boolean;
  setShowModePanel: (show: boolean) => void;
  activeMode: AiMode;
  setActiveMode: (mode: AiMode) => void;
  modePanelRef: React.RefObject<HTMLDivElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  isMobile: boolean;
  theme?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  isListening,
  toggleListening,
  send,
  handleKeyDown,
  triggerMode,
  uploadedFiles,
  setUploadedFiles,
  showModePanel,
  setShowModePanel,
  activeMode,
  setActiveMode,
  modePanelRef,
  textareaRef,
  isMobile,
  theme
}) => {
  const [showMagicWand, setShowMagicWand] = React.useState(false);

  return (
    <div className={cn(
      "p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] z-30 transition-all duration-300",
      isMobile && "pb-20 px-2"
    )}>
      <div className="max-w-4xl mx-auto relative">
        {/* @Trigger indicator */}
        {triggerMode && (
          <div className={cn(
            "absolute -top-10 left-2 flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-medium border animate-fade-in",
            triggerMode === "image"
              ? "bg-primary/10 border-primary/20 text-primary"
              : "bg-accent/30 border-accent/50 text-muted-foreground",
            "liquid-glass"
          )}>
            {triggerMode === "image" ? (
              <><ImageIcon className="h-3 w-3" /> Image Generation Mode</>
            ) : (
              <><Film className="h-3 w-3" /> Video Generation Mode (Coming Soon)</>
            )}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mb-3 px-2">
            <FileUpload files={uploadedFiles} onFilesChange={setUploadedFiles} />
          </div>
        )}

        <div className={cn(
          "relative rounded-[2rem] p-[1.5px] transition-all duration-500",
          "input-glow shadow-2xl shadow-primary/10",
          isMobile && "rounded-[1.5rem]"
        )}>
          <div className={cn(
            "flex items-end gap-2 sm:gap-3 rounded-[2rem] border px-3 sm:px-4 py-2 sm:py-3 transition-all liquid-glass bg-background/40",
            triggerMode === "image"
              ? "border-primary/30 bg-primary/5"
              : "border-white/10",
            "focus-within:border-primary/40 focus-within:bg-background/60",
            theme === "ios" && "rounded-[22px] border-border/40 bg-accent/20",
            isMobile && "rounded-[1.5rem]"
          )}>
            {/* Mode panel toggle */}
            <div className="relative" ref={modePanelRef}>
              <button
                className={cn(
                  "h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all",
                  showModePanel ? "bg-primary/20 text-primary rotate-45" : "hover:bg-primary/10 text-muted-foreground"
                )}
                onClick={() => setShowModePanel(!showModePanel)}
              >
                <Plus className="h-5 w-5 transition-transform" />
              </button>
              {showModePanel && (
                <div className={cn(
                  "absolute bottom-14 left-0 liquid-glass rounded-3xl p-3 min-w-[220px] max-w-[90vw] animate-scale-in shadow-2xl z-50 border border-white/10",
                  isMobile && "fixed bottom-24 left-4 right-4 max-w-none"
                )}>
                  <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest px-2 mb-2">Modes</p>
                  <div className="flex flex-col gap-1">
                    {MODE_OPTIONS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setActiveMode(m.id as AiMode); setShowModePanel(false); }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                          activeMode === m.id
                            ? "bg-primary/20 text-primary font-bold"
                            : "hover:bg-white/5 text-muted-foreground"
                        )}
                      >
                        <span className="text-lg">{m.icon}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Magic Wand for Text Intelligence */}
            <div className="relative">
              <button
                className={cn(
                  "h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all hover:bg-primary/10 text-muted-foreground hover:text-primary",
                  showMagicWand && "bg-primary/20 text-primary"
                )}
                onClick={() => setShowMagicWand(!showMagicWand)}
                title="Text Intelligence"
              >
                <Sparkles className="h-4 w-4" />
              </button>
              {showMagicWand && (
                <div className={cn(
                  "absolute bottom-14 left-0 liquid-glass rounded-2xl p-2 min-w-[220px] animate-scale-in shadow-2xl z-50 border border-white/10",
                  isMobile && "fixed bottom-24 left-4 right-4 max-w-none"
                )}>
                  <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest px-2 mb-1">GravityWrite AI</p>
                  <div className="grid grid-cols-1 gap-0.5">
                    {[
                      { label: "Fix Grammar", prompt: "Please fix the grammar and spelling of the following text:\n\n" },
                      { label: "Improve Style & Tone", prompt: "Please rewrite the following text to improve its style, tone, and flow:\n\n" },
                      { label: "Summarize", prompt: "Please provide a concise summary of the following text:\n\n" },
                      { label: "Explain simply", prompt: "Please explain the following concept simply, as if I were 5 years old:\n\n" },
                      { label: "Readability Analysis", prompt: "Please analyze the readability, clarity, and style of the following text and provide improvement recommendations:\n\n" },
                      { label: "Restructure", prompt: "Please restructure the following text for better logical flow and clarity:\n\n" },
                      { label: "Study Plan", prompt: "Please generate an adaptive study plan and learning path based on the following materials:\n\n" },
                      { label: "Business Strategy", prompt: "Please generate a business strategy and creative intelligence report based on the following inputs:\n\n" },
                      { label: "Generate Chart", prompt: "Please generate a data visualization chart (using Recharts) for the following data:\n\n" }
                    ].map((action, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(prev => action.prompt + prev);
                          setShowMagicWand(false);
                          textareaRef.current?.focus();
                        }}
                        className="text-left px-3 py-2 rounded-xl text-[11px] hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Grok Imagine Video Button */}
            {!isMobile && (
              <button
                className={cn(
                  "h-10 w-10 rounded-2xl flex items-center justify-center transition-all hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-400"
                )}
                onClick={() => {
                  setInput(prev => "@Video " + prev);
                  textareaRef.current?.focus();
                }}
                title="Grok Imagine Video"
              >
                <Film className="h-4 w-4" />
              </button>
            )}

            {uploadedFiles.length === 0 && (
              <div className="pb-1">
                <FileUpload files={uploadedFiles} onFilesChange={setUploadedFiles} />
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={triggerMode === "image" ? "Describe your image..." : isMobile ? "Ask MahmudGPT..." : "Ask MahmudGPT… (@Image, @Video)"}
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm sm:text-base py-2 placeholder:text-muted-foreground/30 max-h-[160px] font-medium"
            />
            <div className="flex items-center gap-1 pb-1">
              <Button
                variant="ghost" size="icon"
                className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl hover:bg-primary/10", isListening && "text-destructive bg-destructive/10 animate-pulse")}
                onClick={toggleListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
              </Button>
              <button
                className={cn(
                  "h-10 w-10 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all active:scale-90 relative overflow-hidden",
                  input.trim()
                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30"
                    : "bg-white/5 text-muted-foreground/20"
                )}
                onClick={send}
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-5 w-5 relative z-10" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-[8px] text-muted-foreground/15 mt-2">
          MahmudGPT — World's Best AI
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
