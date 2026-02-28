import { useState, useCallback } from "react";
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

const LOCAL_USER = "local-user";

export function useChatPersistence() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const raw = localStorage.getItem(`mahmudgpt-convs-${LOCAL_USER}`);
      if (!raw) return [];
      return JSON.parse(raw).map((c: { id: string; title: string; createdAt: string }) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }));
    } catch { return []; }
  });

  const [activeConvId, setActiveConvIdState] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const loadingConvs = false;
  const loadingMessages = false;

  const saveConvs = (convs: Conversation[]) => {
    localStorage.setItem(`mahmudgpt-convs-${LOCAL_USER}`, JSON.stringify(convs));
  };

  const setActiveConvId = useCallback((id: string | null) => {
    setActiveConvIdState(id);
    if (!id) { setMessages([]); return; }
    try {
      const msgs = JSON.parse(localStorage.getItem(`mahmudgpt-msgs-${id}`) || "[]");
      setMessages(msgs);
    } catch { setMessages([]); }
  }, []);

  const createConversation = useCallback(async (title: string, _mode: string) => {
    const newId = crypto.randomUUID();
    const newConv: Conversation = { id: newId, title: title.slice(0, 60), createdAt: new Date() };
    setConversations(prev => {
      const updated = [newConv, ...prev];
      saveConvs(updated);
      return updated;
    });
    setActiveConvIdState(newId);
    setMessages([]);
    return newId;
  }, []);

  const addMessage = useCallback(async (convId: string, msg: Omit<ChatMessage, "id">) => {
    const msgId = crypto.randomUUID();
    const fullMsg: ChatMessage = { ...msg, id: msgId };
    const existing = JSON.parse(localStorage.getItem(`mahmudgpt-msgs-${convId}`) || "[]");
    localStorage.setItem(`mahmudgpt-msgs-${convId}`, JSON.stringify([...existing, fullMsg]));
    return msgId;
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveConvs(updated);
      return updated;
    });
    localStorage.removeItem(`mahmudgpt-msgs-${id}`);
    if (activeConvId === id) {
      setActiveConvIdState(null);
      setMessages([]);
    }
  }, [activeConvId]);

  const newChat = useCallback(() => {
    setActiveConvIdState(null);
    setMessages([]);
  }, []);

  return {
    conversations, activeConvId, setActiveConvId,
    messages, setMessages,
    createConversation, addMessage, deleteConversation, newChat,
    userId: LOCAL_USER, loadingConvs, loadingMessages,
  };
}
