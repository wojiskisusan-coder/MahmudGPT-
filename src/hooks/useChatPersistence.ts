import { useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation } from "@/components/chat/ChatSidebar";

interface DBMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string | null;
  image_url?: string | null;
  files?: { name: string; type: string; previewUrl?: string }[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  imageUrl?: string;
  isStreaming?: boolean;
  files?: { name: string; type: string; previewUrl?: string }[];
}

// Helper to check if Supabase is likely working
const isSupabaseAvailable = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function useChatPersistence() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvIdState] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Get user ID from Firebase Auth
  useEffect(() => {
    if (!auth) {
      setUserId("anonymous-user");
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? "anonymous-user");
    });
    return () => unsubscribe();
  }, []);

  // Load conversations
  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setLoadingConvs(false);
      return;
    }
    
    const load = async () => {
      setLoadingConvs(true);
      
      // Try Supabase first
      if (isSupabaseAvailable) {
        try {
          const { data, error } = await supabase
            .from("conversations")
            .select("*")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false });
            
          if (!error && data) {
            setConversations(data.map(c => ({
              id: c.id,
              title: c.title,
              createdAt: new Date(c.created_at),
            })));
            setLoadingConvs(false);
            return;
          }
        } catch (e) {
          console.warn("Supabase load failed, falling back to localStorage", e);
        }
      }
      
      // Fallback to localStorage
      const localConvsRaw = localStorage.getItem(`mahmudgpt-convs-${userId}`);
      const localConvs = localConvsRaw ? JSON.parse(localConvsRaw) : [];
      setConversations(localConvs.map((c: { id: string; title: string; createdAt: string }) => ({
        ...c,
        createdAt: new Date(c.createdAt)
      })));
      setLoadingConvs(false);
    };
    load();
  }, [userId]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!activeConvId || !userId) {
      setMessages([]);
      setLoadingMessages(false);
      return;
    }
    
    let cancelled = false;
    const load = async () => {
      setLoadingMessages(true);
      
      // Don't clear messages if we already have some for this conversation 
      // (e.g. from optimistic update)
      // Actually, it's safer to just load and then set.
      
      if (isSupabaseAvailable) {
        try {
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", activeConvId)
            .order("created_at", { ascending: true });
            
          if (!cancelled && !error && data) {
            const parsed = (data as DBMessage[]).map(m => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content || "",
              thinking: m.thinking ?? undefined,
              imageUrl: m.image_url ?? undefined,
              files: m.files ?? undefined,
            }));
            setMessages(parsed);
            setLoadingMessages(false);
            return;
          }
        } catch (e) {
          console.warn("Supabase messages load failed", e);
        }
      }
      
      if (cancelled) return;
      
      // Fallback to localStorage
      const localMsgs = JSON.parse(localStorage.getItem(`mahmudgpt-msgs-${activeConvId}`) || "[]");
      setMessages(localMsgs);
      setLoadingMessages(false);
    };
    load();
    return () => { cancelled = true; };
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

    // Try Supabase
    if (isSupabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from("conversations")
          .insert({ user_id: userId, title: title.slice(0, 60), mode })
          .select()
          .single();
        if (!error && data) {
          const conv: Conversation = { id: data.id, title: data.title, createdAt: new Date(data.created_at) };
          setConversations(prev => [conv, ...prev]);
          setActiveConvIdState(data.id);
          return data.id;
        }
      } catch (e) {
        console.warn("Supabase create failed", e);
      }
    }
    
    // Fallback to localStorage
    setConversations(prev => [newConv, ...prev]);
    const currentConvs = JSON.parse(localStorage.getItem(`mahmudgpt-convs-${userId}`) || "[]");
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

    // Try Supabase
    if (isSupabaseAvailable) {
      try {
        const { error } = await supabase
          .from("messages")
          .insert({
            conversation_id: convId,
            user_id: userId,
            role: msg.role,
            content: msg.content,
            thinking: msg.thinking ?? null,
            image_url: msg.imageUrl ?? null,
            files: msg.files ?? null,
          });
        if (!error) {
          await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
        }
      } catch (e) {
        console.warn("Supabase add message failed", e);
      }
    }
    
    // Fallback to localStorage
    const currentMsgs = JSON.parse(localStorage.getItem(`mahmudgpt-msgs-${convId}`) || "[]");
    localStorage.setItem(`mahmudgpt-msgs-${convId}`, JSON.stringify([...currentMsgs, fullMsg]));
    
    // Update conversation timestamp in local storage
    const localConvsRaw = localStorage.getItem(`mahmudgpt-convs-${userId}`);
    const localConvs = localConvsRaw ? JSON.parse(localConvsRaw) : [];
    const updatedConvs = localConvs.map((c: { id: string; title: string; createdAt: string; updatedAt?: string }) => 
      c.id === convId ? { ...c, updatedAt: new Date().toISOString() } : c
    );
    localStorage.setItem(`mahmudgpt-convs-${userId}`, JSON.stringify(updatedConvs));
    
    return msgId;
  }, [userId]);

  const deleteConversation = useCallback(async (id: string) => {
    if (isSupabaseAvailable) {
      try {
        await supabase.from("conversations").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase delete failed", e);
      }
    }
    
    // Always update local state and storage
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
