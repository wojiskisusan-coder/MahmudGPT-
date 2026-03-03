import React from "react";
import { X, Crown, Zap, Sparkles, CheckCircle2, Star, ShieldCheck, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reason?: "limit" | "locked";
}

const ProModal: React.FC<Props> = ({ isOpen, onClose, reason = "locked" }) => {
  if (!isOpen) return null;

  const features = [
    { icon: Zap, label: "Unlimited Messages", desc: "No daily limits on any model" },
    { icon: Sparkles, label: "Elite Models", desc: "Access Gemini 2.5 Pro & 3.1 Pro" },
    { icon: Star, label: "Priority Access", desc: "Faster response times during peak hours" },
    { icon: ShieldCheck, label: "Advanced Security", desc: "Enhanced data protection & privacy" },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative bg-card border border-primary/20 rounded-[2.5rem] w-full max-w-lg shadow-2xl shadow-primary/20 overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-background/50 hover:bg-accent text-muted-foreground transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 sm:p-10 flex flex-col items-center text-center relative">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-primary/40 flex items-center justify-center mb-6 shadow-2xl shadow-primary/30 animate-hero-glow">
            <Crown className="h-10 w-10 text-primary-foreground animate-float" />
          </div>

          <h2 className="text-3xl font-bold font-['Space_Grotesk'] gradient-text mb-2">
            {reason === "limit" ? "Daily Limit Reached" : "Unlock Pro Features"}
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-xs">
            {reason === "limit" 
              ? "You've used all your free messages for today. Upgrade to continue chatting."
              : "Get access to our most powerful models and unlimited intelligence."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-accent/30 border border-white/5 text-left group hover:bg-accent/50 transition-colors">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <f.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{f.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full space-y-3">
            <Button className="w-full h-14 rounded-2xl text-base font-bold shiny-button shadow-xl shadow-primary/20 group">
              <Rocket className="mr-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Upgrade to Pro — $20/mo
            </Button>
            <p className="text-[10px] text-muted-foreground/50">
              Secure payment via Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProModal;
