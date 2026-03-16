import React from "react";
import { Menu, Settings2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  theme?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ setSidebarOpen, setSettingsOpen, sidebarOpen, theme }) => {
  return (
    <header className={cn(
      "flex items-center justify-between px-3 py-2.5 border-b border-white/5 sticky top-0 z-30 h-14 liquid-glass",
      theme === "ios" && "ios-blur border-b-border/20"
    )}>
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/30 rounded-xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <h1 className="text-sm font-bold font-['Space_Grotesk'] gradient-text">MahmudGPT</h1>
      </div>

      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-accent/30" onClick={() => setSettingsOpen(true)}>
        <Settings2 className="h-3.5 w-3.5" />
      </Button>
    </header>
  );
};

export default MobileHeader;
