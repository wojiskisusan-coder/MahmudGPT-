import React, { useState } from "react";
import { Plus, X, Lock, Crown, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { type AiMode, type ModeConfig, AI_MODES } from "@/constants/chatConstants";

interface Props {
  activeMode: AiMode;
  onModeChange: (mode: AiMode) => void;
  isPro?: boolean;
  onLockedMode?: () => void;
}

const ModeSelector: React.FC<Props> = ({ activeMode, onModeChange, isPro = false, onLockedMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeConfig = AI_MODES.find(m => m.id === activeMode)!;
  const ActiveIcon = activeConfig.icon;

  const handleSelect = (mode: ModeConfig) => {
    if (mode.pro && !isPro) {
      onLockedMode?.();
      setIsOpen(false);
      return;
    }
    onModeChange(mode.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            "border border-border/50 hover:border-primary/50 bg-accent/30 hover:bg-accent/50 backdrop-blur-sm"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Modes</span>
        </button>
        <div className="mode-chip active flex items-center gap-1.5">
          <ActiveIcon className="h-3 w-3" />
          {activeConfig.label}
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 glass-panel-strong rounded-xl shadow-2xl p-2 animate-scale-in max-h-[60vh] overflow-y-auto rgb-border">
            <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-border/20">
              <span className="text-xs font-semibold text-muted-foreground">Select Mode</span>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-accent/50">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-0.5">
              {AI_MODES.map((mode) => {
                const Icon = mode.icon;
                const locked = mode.pro && !isPro;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleSelect(mode)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all group",
                      activeMode === mode.id
                        ? "bg-primary/10 text-foreground"
                        : locked
                        ? "opacity-60 hover:bg-accent/30 text-muted-foreground"
                        : "hover:bg-accent/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                      activeMode === mode.id ? "bg-primary/20" : "bg-accent/50 group-hover:bg-accent"
                    )}>
                      <Icon className={cn("h-4 w-4 flex-shrink-0", mode.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium truncate">{mode.label}</p>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-accent/80 text-muted-foreground font-mono flex items-center gap-0.5">
                          <Cpu className="h-2 w-2" />
                          {mode.model}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{mode.description}</p>
                    </div>
                    {locked ? (
                      <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                        <Crown className="h-3 w-3 text-primary/60" />
                      </div>
                    ) : activeMode === mode.id ? (
                      <span className="ml-auto text-[10px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10">Active</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModeSelector;
