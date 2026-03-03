import React from "react";
import { Menu, Sparkles, Volume2, VolumeX, Video, Phone, Settings2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type AiMode, MODE_OPTIONS } from "@/constants/chatConstants";

interface ChatHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
  activeMode: AiMode;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  setLiveModeOpen: (open: boolean) => void;
  setVoiceChatOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setProModalOpen: (open: boolean) => void;
  setProModalReason: (reason: "limit" | "locked") => void;
  usagePercent: number;
  usageCount: number;
  usageLimit: number;
  isPro: boolean;
  theme?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isMobile,
  activeMode,
  voiceEnabled,
  setVoiceEnabled,
  setLiveModeOpen,
  setVoiceChatOpen,
  setSettingsOpen,
  setProModalOpen,
  setProModalReason,
  usagePercent,
  usageCount,
  usageLimit,
  isPro,
  theme
}) => {
  return (
    <header className={cn(
      "flex items-center gap-2 px-3 py-2.5 border-b border-white/5 sticky top-0 z-30 h-14 sm:h-16 liquid-glass",
      theme === "ios" && "ios-blur border-b-border/20"
    )}>
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/30 rounded-xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20 animate-logo-pulse">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        {!isMobile && (
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm font-bold font-['Space_Grotesk'] gradient-text leading-none">MahmudGPT</h1>
              <div className="px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[7px] font-bold text-primary uppercase tracking-tighter">PRO</div>
            </div>
            <p className="text-[8px] sm:text-[9px] text-muted-foreground/40 leading-none mt-0.5">Intelligence Redefined</p>
          </div>
        )}
      </div>

      {/* Active mode badge */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-full glass-panel text-[9px] font-medium text-muted-foreground">
        <span>{MODE_OPTIONS.find(m => m.id === activeMode)?.icon || "🧠"}</span>
        <span className="hidden sm:inline">{MODE_OPTIONS.find(m => m.id === activeMode)?.label || "Think"}</span>
      </div>

      {/* Usage progress bar */}
      {!isPro && (
        <div className="hidden sm:flex items-center gap-2 mr-1">
          <div className="w-20 h-1.5 rounded-full bg-accent/30 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground/50 font-mono">{usageCount}/{usageLimit}</span>
        </div>
      )}

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost" size="icon"
          className={cn("h-8 w-8 rounded-xl hover:bg-accent/30", voiceEnabled && "text-primary bg-primary/10")}
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          title={voiceEnabled ? "Voice On" : "Voice Off"}
        >
          {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-accent/30" onClick={() => setLiveModeOpen(true)} title="Live Mode">
          <Video className="h-3.5 w-3.5" />
        </Button>
        {!isMobile && (
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-accent/30" onClick={() => setVoiceChatOpen(true)}>
            <Phone className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-accent/30" onClick={() => setSettingsOpen(true)}>
          <Settings2 className="h-3.5 w-3.5" />
        </Button>
        {!isPro && (
          <button
            onClick={() => { setProModalReason("locked"); setProModalOpen(true); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] font-semibold shiny-button text-primary-foreground ml-0.5"
          >
            <Crown className="h-2.5 w-2.5" />
            <span className="hidden sm:inline">Pro</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
