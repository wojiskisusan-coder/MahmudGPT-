import React from "react";
import { Plus, Mic, MicOff, Send, ImageIcon, Film } from "lucide-react";
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
  return (
    <div className={cn(
      "p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] z-30",
      isMobile && "pb-24"
    )}>
      <div className="max-w-4xl mx-auto relative">
        {/* @Trigger indicator */}
        {triggerMode && (
          <div className={cn(
            "absolute -top-10 left-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-medium border animate-fade-in",
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
          <div className="mb-3">
            <FileUpload files={uploadedFiles} onFilesChange={setUploadedFiles} />
          </div>
        )}

        <div className={cn(
          "relative rounded-[2rem] p-[1.5px] transition-all duration-500",
          "input-glow shadow-2xl shadow-primary/10"
        )}>
          <div className={cn(
            "flex items-end gap-3 rounded-[2rem] border px-4 py-3 transition-all liquid-glass bg-background/40",
            triggerMode === "image"
              ? "border-primary/30 bg-primary/5"
              : "border-white/10",
            "focus-within:border-primary/40 focus-within:bg-background/60",
            theme === "ios" && "rounded-[22px] border-border/40 bg-accent/20"
          )}>
            {/* Mode panel toggle */}
            <div className="relative" ref={modePanelRef}>
              <button
                className={cn(
                  "h-10 w-10 rounded-2xl flex items-center justify-center transition-all",
                  showModePanel ? "bg-primary/20 text-primary rotate-45" : "hover:bg-primary/10 text-muted-foreground"
                )}
                onClick={() => setShowModePanel(!showModePanel)}
              >
                <Plus className="h-5 w-5 transition-transform" />
              </button>
              {showModePanel && (
                <div className="absolute bottom-14 left-0 liquid-glass rounded-3xl p-3 min-w-[220px] max-w-[90vw] animate-scale-in shadow-2xl z-50 border border-white/10">
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
              placeholder={triggerMode === "image" ? "Describe your image..." : "Ask MahmudGPT… (@Image, @Video)"}
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm sm:text-base py-2 placeholder:text-muted-foreground/30 max-h-[160px] font-medium"
            />
            <div className="flex items-center gap-1 pb-1">
              <Button
                variant="ghost" size="icon"
                className={cn("h-10 w-10 rounded-2xl hover:bg-primary/10", isListening && "text-destructive bg-destructive/10 animate-pulse")}
                onClick={toggleListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
              </Button>
              <button
                className={cn(
                  "h-11 w-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 relative overflow-hidden",
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
