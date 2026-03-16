import React, { useState, useEffect } from "react";
import { X, User, Palette, Volume2, Brain, Save, Zap, Ticket, CheckCircle2, AlertCircle, Download, BarChart3, Heart, Trophy, Flame, Terminal, Key, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/apiService";

export interface UserSettings {
  displayName: string;
  systemPrompt: string;
  voiceId: string;
  voiceName: string;
  autoTTS: boolean;
  showThinking: boolean;
  streamSpeed: "fast" | "normal" | "slow";
  fontSize: "sm" | "base" | "lg";
  theme: "dark" | "neon" | "emerald" | "flutter" | "ios";
  animationsEnabled: boolean;
  localFirst: boolean;
  healthModeEnabled: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  displayName: "User",
  systemPrompt: "",
  voiceId: "JBFqnCBsd6RMkjVDRZzb",
  voiceName: "George",
  autoTTS: false,
  showThinking: true,
  streamSpeed: "normal",
  fontSize: "base",
  theme: "dark",
  animationsEnabled: true,
  localFirst: false,
  healthModeEnabled: false,
};

const VOICES = [
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger" },
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel" },
  { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice" },
];

const THEMES = [
  { id: "dark" as const, label: "Dark", color: "bg-[hsl(240,15%,7%)]" },
  { id: "neon" as const, label: "Neon", color: "bg-[hsl(280,60%,10%)]" },
  { id: "emerald" as const, label: "Emerald", color: "bg-[hsl(160,40%,8%)]" },
  { id: "flutter" as const, label: "Flutter", color: "bg-[hsl(199,100%,50%)]" },
  { id: "ios" as const, label: "iOS", color: "bg-[hsl(210,100%,50%)]" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  usageCount?: number;
  usageLimit?: number;
  isPro?: boolean;
}

const SettingsPanel: React.FC<Props> = ({ isOpen, onClose, settings, onSave, usageCount = 0, usageLimit = 30, isPro = false }) => {
  const [local, setLocal] = useState<UserSettings>(settings);
  const [activeTab, setActiveTab] = useState<"profile" | "voice" | "ai" | "appearance" | "stats" | "developer">("profile");

  useEffect(() => setLocal(settings), [settings]);

  const save = () => { onSave(local); onClose(); };

  if (!isOpen) return null;

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "voice" as const, label: "Voice", icon: Volume2 },
    { id: "ai" as const, label: "AI", icon: Brain },
    { id: "appearance" as const, label: "Theme", icon: Palette },
    { id: "stats" as const, label: "Stats", icon: BarChart3 },
    { id: "developer" as const, label: "Dev", icon: Terminal },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold font-['Space_Grotesk']">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        {/* Usage Counter */}
        <div className="px-5 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Daily Usage</span>
            {isPro ? (
              <span className="text-[10px] font-medium text-primary flex items-center gap-1"><Zap className="h-3 w-3" /> Pro — Unlimited</span>
            ) : (
              <span className="text-[10px] font-medium">{usageCount} / {usageLimit}</span>
            )}
          </div>
          {!isPro && (
            <div className="w-full h-1.5 rounded-full bg-accent overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min((usageCount / usageLimit) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex border-b border-border overflow-x-auto no-scrollbar">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={cn(
              "flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors",
              activeTab === t.id ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            )}>
              <t.icon className="h-3.5 w-3.5" />{t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "profile" && (
            <>
              <div>
                <label className="text-xs font-medium mb-1 block">Display Name</label>
                <input value={local.displayName} onChange={e => setLocal({ ...local, displayName: e.target.value })} className="w-full bg-accent/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Custom System Prompt</label>
                <textarea value={local.systemPrompt} onChange={e => setLocal({ ...local, systemPrompt: e.target.value })} rows={4} className="w-full bg-accent/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="Override default AI personality..." />
              </div>
            </>
          )}
          {activeTab === "voice" && (
            <>
              <div>
                <label className="text-xs font-medium mb-2 block">Voice</label>
                <div className="grid grid-cols-2 gap-2">
                  {VOICES.map(v => (
                    <button key={v.id} onClick={() => setLocal({ ...local, voiceId: v.id, voiceName: v.name })} className={cn(
                      "px-3 py-2 rounded-lg text-xs border transition-all",
                      local.voiceId === v.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                    )}>{v.name}</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={local.autoTTS} onChange={e => setLocal({ ...local, autoTTS: e.target.checked })} className="accent-primary" />
                Auto-read responses aloud
              </label>
            </>
          )}
          {activeTab === "ai" && (
            <>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={local.showThinking} onChange={e => setLocal({ ...local, showThinking: e.target.checked })} className="accent-primary" />
                Show AI thinking process
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={local.localFirst} onChange={e => setLocal({ ...local, localFirst: e.target.checked })} className="accent-primary" />
                Local-first mode (Simulated)
              </label>
              <div>
                <label className="text-xs font-medium mb-1 block">Stream Speed</label>
                <div className="flex gap-2">
                  {(["fast", "normal", "slow"] as const).map(s => (
                    <button key={s} onClick={() => setLocal({ ...local, streamSpeed: s })} className={cn(
                      "flex-1 py-2 rounded-lg text-xs border transition-all capitalize",
                      local.streamSpeed === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                    )}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <label className="text-xs font-medium mb-2 flex items-center gap-1.5">
                  <Ticket className="h-3 w-3 text-primary" />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input 
                    id="promo-code-input"
                    placeholder="Enter code..." 
                    className="flex-1 bg-accent/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById("promo-code-input") as HTMLInputElement;
                      if (input && input.value) {
                        const success = apiService.applyPromoCode(input.value);
                        if (success) {
                          alert("Promo code applied successfully! Your experience has been enhanced.");
                          input.value = "";
                        } else {
                          alert("Invalid promo code. Please try again.");
                        }
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-1.5">
                  Enter a promo code to unlock exclusive features and higher priority access.
                </p>
              </div>
            </>
          )}
          {activeTab === "appearance" && (
            <>
              <div>
                <label className="text-xs font-medium mb-2 block">Theme</label>
                <div className="flex gap-2">
                  {THEMES.map(t => (
                    <button key={t.id} onClick={() => setLocal({ ...local, theme: t.id })} className={cn(
                      "flex-1 py-3 rounded-lg text-xs border transition-all flex flex-col items-center gap-1.5",
                      local.theme === t.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                    )}>
                      <div className={cn("h-6 w-6 rounded-full border border-border", t.color)} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Font Size</label>
                <div className="flex gap-2">
                  {(["sm", "base", "lg"] as const).map(s => (
                    <button key={s} onClick={() => setLocal({ ...local, fontSize: s })} className={cn(
                      "flex-1 py-2 rounded-lg text-xs border transition-all",
                      local.fontSize === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                    )}>{s === "sm" ? "Small" : s === "base" ? "Medium" : "Large"}</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={local.animationsEnabled} onChange={e => setLocal({ ...local, animationsEnabled: e.target.checked })} className="accent-primary" />
                Enable animations
              </label>
            </>
          )}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
                  <span className="text-2xl font-bold">7</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Day Streak</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold">12</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Badges</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5 text-rose-500" />
                    Health Mode BETA
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={local.healthModeEnabled}
                      onChange={e => setLocal({ ...local, healthModeEnabled: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-accent peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                {local.healthModeEnabled ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Productivity Score</span>
                      <span className="font-bold text-emerald-400">88%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-accent overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[88%]" />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Focus Level</span>
                      <span className="font-bold text-blue-400">High</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed italic">
                      "You've been highly productive today. Consider taking a 5-minute break to maintain peak cognitive performance."
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-muted-foreground/40 text-center py-4">
                    Enable Health Mode to track productivity and workflow efficiency.
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-border/50">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Recent Achievements</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {["Fast Learner", "Code Master", "Night Owl", "Researcher"].map((badge, i) => (
                    <div key={i} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-medium text-primary">
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "developer" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Key className="h-3.5 w-3.5 text-primary" />
                  API Access
                </h3>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1.5">
                  <RefreshCw className="h-3 w-3" /> Rotate Keys
                </Button>
              </div>

              <div className="space-y-4">
                <div className="glass-panel p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Secret Key</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
                    <code className="text-xs font-mono flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      mgpt_live_sk_7f2a9b4c8e1d3f5a6b7c8d9e0f1a2b3c
                    </code>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Use this key to authenticate requests to the MahmudGPT API. Keep it secret!
                  </p>
                </div>

                <div className="glass-panel p-4 rounded-2xl space-y-3 opacity-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Public Key</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-bold">DISABLED</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
                    <code className="text-xs font-mono flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      mgpt_live_pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </code>
                    <Button variant="ghost" size="icon" disabled className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3">API Documentation</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-12 text-[11px] justify-start gap-2 rounded-xl">
                    <Terminal className="h-4 w-4 text-primary" />
                    REST API
                  </Button>
                  <Button variant="outline" className="h-12 text-[11px] justify-start gap-2 rounded-xl">
                    <Zap className="h-4 w-4 text-primary" />
                    Webhooks
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-xs"
            onClick={() => {
              window.dispatchEvent(new Event("show-download-popup"));
              onClose();
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Install App
          </Button>
          <Button onClick={save} className="gap-2"><Save className="h-3.5 w-3.5" />Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

export { DEFAULT_SETTINGS };
export default SettingsPanel;
