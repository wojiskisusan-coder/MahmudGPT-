import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Sparkles, Smartphone, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DownloadPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isSandbox, setIsSandbox] = useState(false);

  useEffect(() => {
    // Check if running in iframe/sandbox
    const inIframe = window.self !== window.top;
    setIsSandbox(inIframe);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show popup after a short delay if not already installed
      const hasDismissed = localStorage.getItem("mahmudgpt-download-dismissed");
      if (!hasDismissed) {
        setTimeout(() => setIsVisible(true), 5000);
      }
    };

    const manualShowHandler = () => {
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("show-download-popup", manualShowHandler);

    // Also show if it's a mobile device and we want to encourage PWA
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hasDismissed = localStorage.getItem("mahmudgpt-download-dismissed");
    if (isMobile && !hasDismissed && !deferredPrompt) {
        // Even if beforeinstallprompt hasn't fired yet, we might want to show instructions for iOS
        setTimeout(() => setIsVisible(true), 8000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("show-download-popup", manualShowHandler);
    };
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("mahmudgpt-download-dismissed", "true");
  };

  const handleInstall = async () => {
    if (isSandbox) {
      alert("To install, please open this app in a full browser tab (outside of the preview window).");
      return;
    }

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        setDeferredPrompt(null);
        setIsVisible(false);
      } catch (err) {
        console.error("Error during PWA installation:", err);
      }
    } else {
      // Fallback for iOS or browsers where prompt isn't available
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !((window as unknown) as { MSStream?: unknown }).MSStream;
      if (isIOS) {
        alert("To install on iOS: Tap the 'Share' icon (square with arrow) and then 'Add to Home Screen'.");
      } else {
        alert("PWA installation is not supported in this browser or environment. Try opening in a full tab.");
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="w-full max-w-md pointer-events-auto"
          >
            <div className="ios-card p-6 relative overflow-hidden group">
              {/* Animated Background Elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-700" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
              
              <div className="absolute top-3 right-3 z-10">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10 text-muted-foreground/50 hover:text-foreground transition-colors" onClick={handleDismiss}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/40 flex items-center justify-center shadow-2xl shadow-primary/30 flex-shrink-0 animate-hero-glow relative">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
                    <Sparkles className="h-8 w-8 text-primary-foreground relative z-10" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-xl font-bold font-['Space_Grotesk'] tracking-tight">MahmudGPT</h3>
                      <span className="px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase tracking-tighter">PRO</span>
                    </div>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      Experience the world's most powerful AI directly on your home screen.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: <Zap className="h-4 w-4 text-amber-500" />, label: "Instant", desc: "No loading" },
                    { icon: <Smartphone className="h-4 w-4 text-blue-500" />, label: "Native", desc: "Full screen" },
                    { icon: <Globe className="h-4 w-4 text-emerald-500" />, label: "Offline", desc: "Basic access" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                      <div className="p-1.5 rounded-lg bg-white/5">{item.icon}</div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                        <span className="text-[7px] text-muted-foreground/40 uppercase font-medium">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {isSandbox && (
                    <p className="text-[10px] text-amber-500/80 text-center mb-1 font-medium">
                      Note: Open in a full tab to enable installation.
                    </p>
                  )}
                  <Button 
                    onClick={handleInstall}
                    className="w-full py-7 rounded-2xl text-sm font-bold shiny-button text-primary-foreground shadow-2xl shadow-primary/20 group/btn overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Install Premium App
                  </Button>
                  <button 
                    onClick={handleDismiss}
                    className="w-full py-2 text-[10px] font-bold text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors uppercase tracking-widest"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DownloadPopup;
