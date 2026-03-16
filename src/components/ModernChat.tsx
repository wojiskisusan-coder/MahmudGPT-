import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff, ArrowDown, Menu, Phone, Settings2, Sparkles, Crown, LogOut, FileSearch, Volume2, VolumeX, Video, Image as ImageIcon, Film, Plus, BarChart3, Cpu, Search, Code, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { streamChat, generateImage, fileToBase64, type ChatMessage as ChatMsg } from "@/services/chatService";
import { speak, stopSpeaking } from "@/services/ttsService";
import { audioController } from "@/services/audioController";
import { convertTextToSpeech } from "@/services/elevenlabsService";
import { cleanTextForSpeech } from "@/utils/textCleaner";
import MessageBubble from "./MessageBubble";
import { type AiMode, MODE_COLORS, HERO_SUGGESTIONS, MODE_OPTIONS } from "@/constants/chatConstants";
import ChatSidebar from "./chat/ChatSidebar";
import CodeCanvas from "./chat/CodeCanvas";
import WritingCanvas from "./chat/WritingCanvas";
import FileUpload, { type UploadedFile } from "./chat/FileUpload";
import VoiceChat from "./chat/VoiceChat";
import LiveMode from "./chat/LiveMode";
import SettingsPanel, { DEFAULT_SETTINGS, type UserSettings } from "./chat/SettingsPanel";
import RGBBackground from "./RGBBackground";
import FloatingBadge from "./FloatingBadge";
import ProPlanModal from "./ProPlanModal";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { useChatPersistence, type ChatMessage } from "@/hooks/useChatPersistence";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

import ChatHeader from "./chat/ChatHeader";
import MessageList from "./chat/MessageList";
import ChatInput from "./chat/ChatInput";
import MobileBottomNav from "./chat/MobileBottomNav";
import MobileLayout from "@/layouts/MobileLayout";
import DesktopLayout from "@/layouts/DesktopLayout";

import WelcomeScreen from "./WelcomeScreen";
import OnboardingModal from "./chat/OnboardingModal";

const ModernChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [activeMode, setActiveMode] = useState<AiMode>("assistant");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [codeCanvasContent, setCodeCanvasContent] = useState<string | null>(null);
  const [writingCanvasContent, setWritingCanvasContent] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [voiceChatOpen, setVoiceChatOpen] = useState(false);
  const [liveModeOpen, setLiveModeOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    try { return !localStorage.getItem("mahmudgpt-onboarded"); } catch { return true; }
  });
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mahmudgpt-voice-enabled") || "false"); } catch { return false; }
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proModalReason, setProModalReason] = useState<"limit" | "locked">("limit");
  const [researchProgress, setResearchProgress] = useState(0);
  const [isResearching, setIsResearching] = useState(false);
  const [showModePanel, setShowModePanel] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(() => {
    try { 
      const raw = localStorage.getItem("mahmudgpt-settings");
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
      return DEFAULT_SETTINGS;
    } catch { 
      return DEFAULT_SETTINGS; 
    }
  });

  // @Image / @Video trigger detection
  const [triggerMode, setTriggerMode] = useState<"image" | "video" | null>(null);

  useEffect(() => {
    const trimmed = input.trimStart();
    if (trimmed.startsWith("@Image ") || trimmed.startsWith("@image ")) {
      setTriggerMode("image");
    } else if (trimmed.startsWith("@Video ") || trimmed.startsWith("@video ")) {
      setTriggerMode("video");
    } else {
      setTriggerMode(null);
    }
  }, [input]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const modePanelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const usage = useUsageLimit();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const chat = useChatPersistence();

  // Auth guard removed for now
  useEffect(() => {
    // No-op
  }, []);

  useEffect(() => { document.documentElement.classList.add("dark"); }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-neon", "theme-emerald", "theme-flutter", "theme-ios");
    if (settings.theme === "neon") root.classList.add("theme-neon");
    if (settings.theme === "emerald") root.classList.add("theme-emerald");
    if (settings.theme === "flutter") root.classList.add("theme-flutter");
    if (settings.theme === "ios") root.classList.add("theme-ios");
  }, [settings.theme]);

  // Close mode panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modePanelRef.current && !modePanelRef.current.contains(e.target as Node)) {
        setShowModePanel(false);
      }
    };
    if (showModePanel) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showModePanel]);

  const saveSettings = (s: UserSettings) => {
    setSettings(s);
    localStorage.setItem("mahmudgpt-settings", JSON.stringify(s));
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [chat.messages, scrollToBottom]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const downloadReport = (content: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "research-report.md"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleLockedMode = () => { setProModalReason("locked"); setProModalOpen(true); };

  const send = async () => {
    let text = input.trim();
    if (!text || isLoading) return;

    if (!usage.canSend) { setProModalReason("limit"); setProModalOpen(true); return; }
    usage.increment();

    // Handle @Image / @Video triggers
    let effectiveMode = activeMode;
    if (triggerMode === "image") {
      text = text.replace(/^@[Ii]mage\s+/, "");
      effectiveMode = "image";
    } else if (triggerMode === "video") {
      text = text.replace(/^@[Vv]ideo\s+/, "");
      toast({ title: "Video Generation", description: "Video generation is coming soon! Try @Image instead.", variant: "default" });
      setInput("");
      return;
    }

    const fileDataPromises = uploadedFiles.map(async (f) => ({
      name: f.file.name, type: f.file.type, base64: await fileToBase64(f.file),
    }));
    const fileData = uploadedFiles.length > 0 ? await Promise.all(fileDataPromises) : undefined;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(), role: "user", content: input.trim(),
      files: uploadedFiles.map(f => ({ name: f.file.name, type: f.file.type, previewUrl: f.previewUrl })),
    };

    let convId = chat.activeConvId;
    if (!convId) {
      convId = await chat.createConversation(text.slice(0, 40), effectiveMode);
    }

    chat.setMessages(prev => [...prev, userMsg]);
    setInput("");
    setUploadedFiles([]);
    setIsLoading(true);
    setTriggerMode(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    if (convId) chat.addMessage(convId, { role: "user", content: userMsg.content, files: userMsg.files });

    if (effectiveMode === "image") {
      try {
        const imageUrl = await generateImage(text);
        const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: `Here's your generated image for: "${text}"`, imageUrl };
        chat.setMessages(prev => [...prev, assistantMsg]);
        if (convId) chat.addMessage(convId, { role: "assistant", content: assistantMsg.content, imageUrl });
      } catch (e: unknown) {
        const err = e as Error;
        toast({ title: "Image Error", description: err.message || "Failed to generate image", variant: "destructive" });
      }
      setIsLoading(false);
      return;
    }

    // Deep research progress simulation
    let progressInterval: ReturnType<typeof setInterval> | null = null;
    if (effectiveMode === "deep-research") {
      setIsResearching(true);
      setResearchProgress(0);
      let p = 0;
      progressInterval = setInterval(() => {
        p += Math.random() * 3 + 0.5;
        if (p > 92) p = 92;
        setResearchProgress(p);
      }, 500);
    }

    let assistantContent = "";
    let thinkingContent = "";
    const assistantId = crypto.randomUUID();
    const chatHistory: ChatMsg[] = [...chat.messages, userMsg].map(m => ({ role: m.role, content: m.content }));

    try {
      await streamChat({
        messages: chatHistory, mode: effectiveMode, fileData,
        onThinking: (chunk) => {
          if (!settings.showThinking) return;
          thinkingContent += chunk;
          chat.setMessages(prev => {
            const exists = prev.find(m => m.id === assistantId);
            if (exists) return prev.map(m => m.id === assistantId ? { ...m, thinking: thinkingContent, isStreaming: true } : m);
            return [...prev, { id: assistantId, role: "assistant", content: "", thinking: thinkingContent, isStreaming: true }];
          });
        },
        onDelta: (chunk) => {
          assistantContent += chunk;
          chat.setMessages(prev => {
            const exists = prev.find(m => m.id === assistantId);
            if (exists) return prev.map(m => m.id === assistantId ? { ...m, content: assistantContent, isStreaming: true } : m);
            return [...prev, { id: assistantId, role: "assistant", content: assistantContent, isStreaming: true }];
          });
          if (effectiveMode === "codex" && assistantContent.includes("```") && !codeCanvasContent) setCodeCanvasContent(assistantContent);
          if (effectiveMode === "writer" && assistantContent.length > 200 && !writingCanvasContent) setWritingCanvasContent(assistantContent);
        },
        onDone: () => {
          setIsLoading(false);
          if (progressInterval) { clearInterval(progressInterval); setResearchProgress(100); setTimeout(() => { setIsResearching(false); setResearchProgress(0); }, 1000); }
          chat.setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, isStreaming: false } : m));
          if (codeCanvasContent && assistantContent.includes("```")) setCodeCanvasContent(assistantContent);
          if (writingCanvasContent) setWritingCanvasContent(assistantContent);
          if (settings.autoTTS && assistantContent) {
            handleSpeak(assistantContent, assistantId);
          }
          if (convId) chat.addMessage(convId, { role: "assistant", content: assistantContent, thinking: thinkingContent || undefined });
        },
        onError: (err) => {
          toast({ title: "Error", description: err, variant: "destructive" });
          setIsLoading(false);
          if (progressInterval) { clearInterval(progressInterval); setIsResearching(false); setResearchProgress(0); }
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast({ title: "Error", description: "Failed to get response.", variant: "destructive" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleNewChat = () => { chat.newChat(); audioController.stop(); stopSpeaking(); setCodeCanvasContent(null); setWritingCanvasContent(null); };
  const handleDeleteConv = (id: string) => { chat.deleteConversation(id); if (chat.activeConvId === id) handleNewChat(); };

  const toggleListening = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast({ title: "Not supported", description: "Speech recognition is not available.", variant: "destructive" }); return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (e) => { setInput(prev => prev + e.results[0][0].transcript); setIsListening(false); };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
    setIsListening(true);
  };

  /** Global speak handler using audioController */
  const handleSpeak = async (text: string, messageId: string) => {
    if (audioController.isActiveFor(messageId) && (audioController.isPlaying || audioController.isLoading)) {
      audioController.stop();
      return;
    }
    audioController.setLoading(messageId);
    try {
      const blob = await convertTextToSpeech(text.slice(0, 2000), settings.voiceId || "en");
      // Check if still active (user may have cancelled)
      if (audioController.isActiveFor(messageId)) {
        await audioController.playBlob(blob, messageId);
      }
    } catch {
      // Fallback to browser TTS
      audioController.stop();
      speak(cleanTextForSpeech(text));
    }
  };

  const handleVoiceSpeak = async (text: string) => {
    setInput(text);
    setVoiceChatOpen(false);
    setTimeout(() => send(), 100);
  };

  const handleAutoDebug = (code: string) => {
    setInput(`Please debug this code and fix any issues:\n\n${code}`);
    setActiveMode("codex");
    setCodeCanvasContent(null);
    textareaRef.current?.focus();
  };

  const showCanvas = codeCanvasContent !== null || writingCanvasContent !== null;
  const fontSize = settings.fontSize === "sm" ? "text-xs" : settings.fontSize === "lg" ? "text-base" : "text-sm";
  const usagePercent = usage.isPro ? 100 : Math.min((usage.count / usage.limit) * 100, 100);

  const handleCloseOnboarding = () => {
    try { localStorage.setItem("mahmudgpt-onboarded", "true"); } catch (e) { console.error("Error saving onboarding state", e); }
    setOnboardingOpen(false);
  };

  return (
    <div className="flex h-dvh overflow-hidden relative bg-background">
      <WelcomeScreen />
      <OnboardingModal isOpen={onboardingOpen} onClose={handleCloseOnboarding} />
      <div className="liquid-mesh" />
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 z-[100] bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
      )}
      <RGBBackground modeColor={MODE_COLORS[activeMode] || "purple"} />

      {isMobile ? (
        <MobileLayout
          headerProps={{
            setSidebarOpen,
            setSettingsOpen,
            sidebarOpen,
            theme: settings.theme,
          }}
        >
          <MessageList
            messages={chat.messages} loadingMessages={chat.loadingMessages}
            isLoading={isLoading} isResearching={isResearching}
            researchProgress={researchProgress} handleSpeak={handleSpeak}
            setCodeCanvasContent={setCodeCanvasContent}
            setWritingCanvasContent={setWritingCanvasContent}
            downloadReport={downloadReport} activeMode={activeMode}
            theme={settings.theme} fontSize={fontSize}
            setInput={setInput} usageRemaining={usage.remaining}
            isPro={usage.isPro} scrollContainerRef={scrollContainerRef}
            messagesEndRef={messagesEndRef}
          />
          {showScrollBtn && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
              <Button variant="secondary" size="icon" className="rounded-full shadow-xl h-9 w-9 glass-panel border border-border/20" onClick={scrollToBottom}>
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          )}
          <ChatInput
            input={input} setInput={setInput}
            isLoading={isLoading} isListening={isListening}
            toggleListening={toggleListening} send={send}
            handleKeyDown={handleKeyDown} triggerMode={triggerMode}
            uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}
            showModePanel={showModePanel} setShowModePanel={setShowModePanel}
            activeMode={activeMode} setActiveMode={setActiveMode}
            modePanelRef={modePanelRef} textareaRef={textareaRef}
            isMobile={isMobile} theme={settings.theme}
          />
          <MobileBottomNav
            chatMessagesLength={chat.messages.length}
            handleNewChat={handleNewChat}
            setSidebarOpen={setSidebarOpen}
            setSettingsOpen={setSettingsOpen}
            setProModalOpen={setProModalOpen}
            setProModalReason={setProModalReason}
            setVoiceChatOpen={setVoiceChatOpen}
            sidebarOpen={sidebarOpen}
            settingsOpen={settingsOpen}
            isPro={usage.isPro}
          />
        </MobileLayout>
      ) : (
        <DesktopLayout
          theme={settings.theme}
          sidebar={
            <ChatSidebar
              conversations={chat.conversations} activeId={chat.activeConvId}
              onSelect={chat.setActiveConvId} onNew={handleNewChat} onDelete={handleDeleteConv}
              isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
              onUpgrade={() => { setProModalReason("locked"); setProModalOpen(true); }}
              activeMode={activeMode} onModeChange={setActiveMode}
              isPro={usage.isPro} onLockedMode={handleLockedMode}
              theme={settings.theme}
            />
          }
          header={
            <ChatHeader
              sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
              isMobile={isMobile} activeMode={activeMode}
              voiceEnabled={voiceEnabled} setVoiceEnabled={(val) => {
                setVoiceEnabled(val);
                localStorage.setItem("mahmudgpt-voice-enabled", JSON.stringify(val));
                saveSettings({ ...settings, autoTTS: val });
              }}
              setLiveModeOpen={setLiveModeOpen} setVoiceChatOpen={setVoiceChatOpen}
              setSettingsOpen={setSettingsOpen} setProModalOpen={setProModalOpen}
              setProModalReason={setProModalReason}
              usagePercent={usagePercent} usageCount={usage.count} usageLimit={usage.limit}
              isPro={usage.isPro} theme={settings.theme}
            />
          }
        >
          <MessageList
            messages={chat.messages} loadingMessages={chat.loadingMessages}
            isLoading={isLoading} isResearching={isResearching}
            researchProgress={researchProgress} handleSpeak={handleSpeak}
            setCodeCanvasContent={setCodeCanvasContent}
            setWritingCanvasContent={setWritingCanvasContent}
            downloadReport={downloadReport} activeMode={activeMode}
            theme={settings.theme} fontSize={fontSize}
            setInput={setInput} usageRemaining={usage.remaining}
            isPro={usage.isPro} scrollContainerRef={scrollContainerRef}
            messagesEndRef={messagesEndRef}
          />
          {showScrollBtn && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
              <Button variant="secondary" size="icon" className="rounded-full shadow-xl h-9 w-9 glass-panel border border-border/20" onClick={scrollToBottom}>
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          )}
          <ChatInput
            input={input} setInput={setInput}
            isLoading={isLoading} isListening={isListening}
            toggleListening={toggleListening} send={send}
            handleKeyDown={handleKeyDown} triggerMode={triggerMode}
            uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}
            showModePanel={showModePanel} setShowModePanel={setShowModePanel}
            activeMode={activeMode} setActiveMode={setActiveMode}
            modePanelRef={modePanelRef} textareaRef={textareaRef}
            isMobile={isMobile} theme={settings.theme}
          />
        </DesktopLayout>
      )}

      {/* Canvas panels */}
      {codeCanvasContent !== null && (
        <CodeCanvas content={codeCanvasContent} onClose={() => setCodeCanvasContent(null)} onAutoDebug={handleAutoDebug} isMobile={isMobile} />
      )}
      {writingCanvasContent !== null && (
        <WritingCanvas initialContent={writingCanvasContent} onClose={() => setWritingCanvasContent(null)} isMobile={isMobile} />
      )}

      {/* Overlays */}
      <VoiceChat onSpeakText={handleVoiceSpeak} isOpen={voiceChatOpen} onClose={() => setVoiceChatOpen(false)} />
      <LiveMode isOpen={liveModeOpen} onClose={() => setLiveModeOpen(false)} voiceId={settings.voiceId} />
      <SettingsPanel
        isOpen={settingsOpen} onClose={() => setSettingsOpen(false)}
        settings={settings} onSave={saveSettings}
        usageCount={usage.count} usageLimit={usage.limit} isPro={usage.isPro}
      />
      <ProPlanModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} reason={proModalReason} onProActivated={() => usage.refreshPro()} />
      
      {isMobile && (
        <MobileBottomNav
          chatMessagesLength={chat.messages.length}
          handleNewChat={handleNewChat}
          setSidebarOpen={setSidebarOpen}
          setSettingsOpen={setSettingsOpen}
          setProModalOpen={setProModalOpen}
          setProModalReason={setProModalReason}
          setVoiceChatOpen={setVoiceChatOpen}
          sidebarOpen={sidebarOpen}
          settingsOpen={settingsOpen}
          isPro={usage.isPro}
        />
      )}

      <FloatingBadge />
    </div>
  );
};

export default ModernChat;
