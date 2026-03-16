import React, { useState, useCallback, useRef } from "react";
import { Phone, PhoneOff, Volume2, Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface Props {
  onSpeakText: (text: string, voiceId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const VoiceChat: React.FC<Props> = ({ onSpeakText, isOpen, onClose }) => {
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = false; // Changed to false to stop after one sentence
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onSpeakText(transcript, selectedVoice.id);
      setIsListening(false);
    };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
    setIsListening(true);
  }, [selectedVoice, onSpeakText]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-2xl flex flex-col items-center justify-center liquid-glass">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent text-muted-foreground">
        <X className="h-6 w-6" />
      </button>

      <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300">
        {/* Voice visualizer */}
        <div className={cn(
          "relative h-32 w-32 rounded-full flex items-center justify-center transition-all duration-500",
          isListening ? "scale-110 shadow-[0_0_60px_hsl(var(--primary)/0.5)]" : "shadow-none"
        )}>
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse" />
            </>
          )}
          <div className={cn(
            "relative h-24 w-24 rounded-full flex items-center justify-center transition-colors duration-300",
            isListening ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
          )}>
            <Volume2 className={cn("h-10 w-10", isListening && "animate-bounce")} />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">
            {isListening ? "Listening..." : "Tap to speak"}
          </h3>
          <p className="text-sm text-muted-foreground">Voice: {selectedVoice.name}</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className={cn(
              "rounded-full h-16 w-16 shadow-lg transition-all duration-300", 
              isListening 
                ? "bg-destructive hover:bg-destructive/90 shadow-destructive/30" 
                : "bg-primary hover:bg-primary/90 shadow-primary/30 hover:scale-105"
            )}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? <PhoneOff className="h-8 w-8" /> : <Phone className="h-8 w-8" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-12 w-12 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent" 
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings2 className="h-5 w-5" />
          </Button>
        </div>

        {showSettings && (
          <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 w-72 space-y-3 animate-in fade-in slide-in-from-bottom-4 shadow-2xl">
            <h4 className="text-sm font-semibold px-1">Select Voice</h4>
            <div className="grid grid-cols-2 gap-2">
              {VOICES.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs border transition-all text-left",
                    selectedVoice.id === v.id 
                      ? "border-primary bg-primary/10 text-primary font-medium" 
                      : "border-transparent bg-accent/50 hover:bg-accent text-muted-foreground"
                  )}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
