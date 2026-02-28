
import { create } from 'zustand';
import { Message } from '@/components/ChatMessage';

interface MessageAttachment {
  type: 'image' | 'audio' | 'video' | 'pdf' | 'file';
  url?: string;
  name: string;
  size?: number;
  content?: Blob;
  mimeType?: string;
  format?: string; // Added format field for specific file types (jpg, png, etc.)
}

export interface EnhancedMessage extends Message {
  attachments?: MessageAttachment[];
}

interface MessageState {
  messages: EnhancedMessage[];
  isLoading: boolean;
  addMessage: (content: string, role: "user" | "assistant", id?: string, attachments?: MessageAttachment[]) => void;
  editMessage: (id: string, newContent: string) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  addAttachmentToMessage: (id: string, attachment: MessageAttachment) => void;
  removeAttachmentFromMessage: (id: string, attachmentIndex: number) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (content, role, id, attachments) => set((state) => ({
    messages: [
      ...state.messages, 
      {
        id: id || Math.random().toString(36).substring(2, 9),
        content,
        role,
        timestamp: new Date(),
        attachments
      }
    ]
  })),
  editMessage: (id, newContent) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { ...msg, content: newContent } : msg
    )
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),
  addAttachmentToMessage: (id, attachment) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { 
        ...msg, 
        attachments: msg.attachments ? [...msg.attachments, attachment] : [attachment] 
      } : msg
    )
  })),
  removeAttachmentFromMessage: (id, attachmentIndex) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id && msg.attachments ? { 
        ...msg, 
        attachments: msg.attachments.filter((_, index) => index !== attachmentIndex)
      } : msg
    )
  })),
}));
