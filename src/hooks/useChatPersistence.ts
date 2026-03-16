import { useState, useEffect, useCallback } from "react";
import type { Conversation } from "@/components/chat/ChatSidebar";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  imageUrl?: string;
  isStreaming?: boolean;
  files?: { name: string; type: string; previewUrl?: string }[];
}

export function useChatPersistence() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvIdState] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    setUserId("local-user");
  }, []);

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setLoadingConvs(false);
      return;
    }
    
    setLoadingConvs(true);
    let localConvs = [];
    try {
      const localConvsRaw = localStorage.getItem(`mahmudgpt-convs-${userId}`);
      const parsed = localConvsRaw ? JSON.parse(localConvsRaw) : [];
      localConvs = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse local conversations", e);
      localConvs = [];
    }
    
    setConversations(localConvs.map((c: Record<string, unknown>) => ({
      id: String(c.id || ""),
      title: String(c.title || "Untitled"),
      createdAt: c.createdAt ? new Date(c.createdAt as string) : new Date()
    })));
    setLoadingConvs(false);
  }, [userId]);

  useEffect(() => {
    if (!activeConvId || !userId) {
      setMessages([]);
      setLoadingMessages(false);
      return;
    }
    
    setLoadingMessages(true);
    let localMsgs = [];
    try {
      const raw = localStorage.getItem(`mahmudgpt-msgs-${activeConvId}`);
      const parsed = raw ? JSON.parse(raw) : [];
      localMsgs = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse local messages", e);
      localMsgs = [];
    }
    setMessages(localMsgs);
    setLoadingMessages(false);
  }, [activeConvId, userId]);

  const setActiveConvId = useCallback((id: string | null) => {
    setActiveConvIdState(id);
  }, []);

  const createConversation = useCallback(async (title: string, mode: string) => {
    if (!userId) return null;
    
    const newId = crypto.randomUUID();
    const newConv: Conversation = { 
      id: newId, 
      title: title.slice(0, 60), 
      createdAt: new Date() 
    };

    setConversations(prev => [newConv, ...prev]);
    let currentConvs = [];
    try {
      currentConvs = JSON.parse(localStorage.getItem(`mahmudgpt-convs-${userId}`) || "[]");
    } catch (e) {
      console.error("Failed to parse local conversations during create", e);
    }
    localStorage.setItem(`mahmudgpt-convs-${userId}`, JSON.stringify([newConv, ...currentConvs]));
    setActiveConvIdState(newId);
    return newId;
  }, [userId]);

  const addMessage = useCallback(async (
    convId: string,
    msg: Omit<ChatMessage, "id">,
  ) => {
    if (!userId) return null;
    const msgId = crypto.randomUUID();
    const fullMsg: ChatMessage = { ...msg, id: msgId };

    let currentMsgs = [];
    try {
      currentMsgs = JSON.parse(localStorage.getItem(`mahmudgpt-msgs-${convId}`) || "[]");
    } catch (e) {
      console.error("Failed to parse local messages during add", e);
    }
    localStorage.setItem(`mahmudgpt-msgs-${convId}`, JSON.stringify([...currentMsgs, fullMsg]));
    
    let localConvs = [];
    try {
      const localConvsRaw = localStorage.getItem(`mahmudgpt-convs-${userId}`);
      localConvs = localConvsRaw ? JSON.parse(localConvsRaw) : [];
    } catch (e) {
      console.error("Failed to parse local conversations during timestamp update", e);
    }
    const updatedConvs = localConvs.map((c: { id: string; title: string; createdAt: string; updatedAt?: string }) => 
      c.id === convId ? { ...c, updatedAt: new Date().toISOString() } : c
    );
    localStorage.setItem(`mahmudgpt-convs-${userId}`, JSON.stringify(updatedConvs));
    
    return msgId;
  }, [userId]);

  const deleteConversation = useCallback(async (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (userId) {
      const currentConvsRaw = localStorage.getItem(`mahmudgpt-convs-${userId}`);
      const currentConvs = currentConvsRaw ? JSON.parse(currentConvsRaw) : [];
      localStorage.setItem(`mahmudgpt-convs-${userId}`, JSON.stringify(currentConvs.filter((c: { id: string }) => c.id !== id)));
    }
    localStorage.removeItem(`mahmudgpt-msgs-${id}`);
    
    if (activeConvId === id) {
      setActiveConvIdState(null);
      setMessages([]);
    }
  }, [activeConvId, userId]);

  const newChat = useCallback(() => {
    setActiveConvIdState(null);
    setMessages([]);
  }, []);

  return {
    conversations, activeConvId, setActiveConvId,
    messages, setMessages,
    createConversation, addMessage, deleteConversation, newChat,
    userId, loadingConvs, loadingMessages,
  };
}
