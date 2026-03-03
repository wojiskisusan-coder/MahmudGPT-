import React from "react";
import { Plus, Menu, Settings2, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  chatMessagesLength: number;
  handleNewChat: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setProModalOpen: (open: boolean) => void;
  setProModalReason: (reason: "limit" | "locked") => void;
  sidebarOpen: boolean;
  settingsOpen: boolean;
  isPro: boolean;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  chatMessagesLength,
  handleNewChat,
  setSidebarOpen,
  setSettingsOpen,
  setProModalOpen,
  setProModalReason,
  sidebarOpen,
  settingsOpen,
  isPro
}) => {
  return (
    <div className="mobile-bottom-nav liquid-glass border-t border-white/10">
      <button 
        onClick={() => { handleNewChat(); setSidebarOpen(false); }}
        className={cn("mobile-nav-item", chatMessagesLength === 0 && "active")}
      >
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mb-1">
          <Plus className="h-5 w-5" />
        </div>
        <span>New Chat</span>
      </button>
      <button 
        onClick={() => setSidebarOpen(true)}
        className={cn("mobile-nav-item", sidebarOpen && "active")}
      >
        <Menu className="h-5 w-5" />
        <span>History</span>
      </button>
      <button 
        onClick={() => setSettingsOpen(true)}
        className={cn("mobile-nav-item", settingsOpen && "active")}
      >
        <Settings2 className="h-5 w-5" />
        <span>Settings</span>
      </button>
      <button 
        onClick={() => { setProModalReason("locked"); setProModalOpen(true); }}
        className={cn("mobile-nav-item", isPro && "active")}
      >
        <Crown className="h-5 w-5 text-amber-500" />
        <span>Pro</span>
      </button>
    </div>
  );
};

export default MobileBottomNav;
