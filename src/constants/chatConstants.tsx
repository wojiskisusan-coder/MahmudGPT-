import { BarChart3, Cpu, Search, Code, ImageIcon, Pencil, MessageSquare, Brain, FileSearch, Calculator, Lightbulb, Image, GraduationCap, Film } from "lucide-react";
import React from "react";

export type AiMode = "assistant" | "codex" | "research" | "analyst" | "creative" | "image" | "writer" | "thinking" | "math" | "guided" | "deep-research" | "developer" | "study" | "business" | "media";

export interface ModeConfig {
  id: AiMode;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
  model: string;
  pro?: boolean;
}

export const AI_MODES: ModeConfig[] = [
  { id: "assistant", label: "Assistant", icon: MessageSquare, description: "Fast general-purpose AI", color: "text-blue-400", model: "Gemini 3 Flash" },
  { id: "codex", label: "Codex", icon: Code, description: "Elite code generation & debugging", color: "text-green-400", model: "Gemini 2.5 Pro", pro: true },
  { id: "thinking", label: "Thinking", icon: Brain, description: "Deep reasoning & analysis", color: "text-purple-400", model: "Gemini 2.5 Pro", pro: true },
  { id: "research", label: "Research", icon: Search, description: "Research & analysis", color: "text-cyan-400", model: "Gemini 2.5 Flash" },
  { id: "deep-research", label: "Deep Research", icon: FileSearch, description: "Exhaustive multi-source report", color: "text-orange-400", model: "Gemini 2.5 Pro", pro: true },
  { id: "study", label: "Study Mastery", icon: GraduationCap, description: "Adaptive learning & exam prep", color: "text-teal-400", model: "Gemini 2.5 Flash" },
  { id: "business", label: "Business Intel", icon: BarChart3, description: "Strategy & creative intelligence", color: "text-rose-400", model: "Gemini 2.5 Flash" },
  { id: "media", label: "Media Gen", icon: Film, description: "Video & music generation", color: "text-indigo-400", model: "Gemini 3 Pro", pro: true },
  { id: "math", label: "Math", icon: Calculator, description: "Advanced math with LaTeX", color: "text-yellow-400", model: "Gemini 2.5 Pro" },
  { id: "creative", label: "Creative", icon: Lightbulb, description: "Creative writing & brainstorming", color: "text-pink-400", model: "Gemini 3 Flash" },
  { id: "image", icon: Image, label: "Image", description: "AI image generation", color: "text-indigo-400", model: "Gemini 3 Pro Image" },
  { id: "writer", label: "Writer", icon: Pencil, description: "Long-form writing canvas", color: "text-emerald-400", model: "Gemini 2.5 Flash" },
  { id: "developer", label: "Dev Mode", icon: Cpu, description: "Highly technical system-level discourse", color: "text-slate-400", model: "Gemini 3.1 Pro", pro: true },
];

export const MODE_SYSTEM_PROMPTS: Record<AiMode, string> = {
  assistant: "You are MahmudGPT, a helpful, friendly AI assistant. You are the world's best AI, capable of handling any task with precision and creativity.",
  codex: "You are MahmudGPT in Codex mode — an elite software engineer. You provide high-quality, production-ready code, debugging help, and architectural advice.",
  research: "You are MahmudGPT in Research mode — a thorough researcher. You synthesize information from multiple sources, provide citations, and offer deep insights.",
  analyst: "You are MahmudGPT in Analyst mode — a data analyst. You excel at identifying trends, patterns, and anomalies in data.",
  creative: "You are MahmudGPT in Creative mode — a creative writer and brainstormer. You help users generate unique ideas, stories, and content.",
  image: "You are MahmudGPT in Image mode. You help users generate high-quality images by refining their prompts and providing artistic direction.",
  writer: "You are MahmudGPT in Writer mode — a professional writer. You help users draft, edit, and refine long-form content like essays, reports, and books.",
  thinking: "You are MahmudGPT in Thinking mode — a deep reasoning AI. You show your step-by-step reasoning process to solve complex problems.",
  math: "You are MahmudGPT in Math mode — a mathematics expert. You provide clear, step-by-step solutions to math problems using LaTeX for formulas.",
  guided: "You are MahmudGPT in Guided Learning mode — an expert tutor. You help users learn new concepts through interactive, step-by-step guidance.",
  "deep-research": "You are MahmudGPT in Deep Research mode. You perform exhaustive research across the web to create comprehensive reports.",
  study: "You are MahmudGPT in Study Mastery mode. You help users with homework, exam prep, and language learning. You provide adaptive learning paths and predictive study suggestions based on the user's performance.",
  business: "You are MahmudGPT in Business Intel mode. You help with business planning, strategy, and creative intelligence. You can generate reports, presentations, and 3D architectural plans.",
  media: "You are MahmudGPT in Media Gen mode. You help users generate videos (via Grok Imagine style) and music (via ElevenLabs style). You can also assist with style transfer and 3D modeling.",
  developer: "You are MahmudGPT in Developer Mode. You must communicate EXCLUSIVELY in highly technical, low-level system language. Use jargon like 'kernel-space', 'memory-mapped I/O', 'O(n log n) complexity', 'race conditions', 'deadlocks', and 'pointer arithmetic'. Do not simplify concepts for general audiences. Assume the user is a senior systems engineer or kernel developer.",
};

export const MODE_COLORS: Record<string, string> = {
  assistant: "blue", codex: "purple", thinking: "purple", research: "cyan",
  "deep-research": "orange", math: "blue", analyst: "green", creative: "orange",
  image: "purple", writer: "green", guided: "cyan", flutter: "blue", ios: "blue",
  developer: "slate", study: "teal", business: "rose", media: "indigo"
};

export const HERO_SUGGESTIONS = [
  { prompt: "Analyze patient diagnostic data trends", icon: <BarChart3 className="h-4 w-4" />, title: "Medical Analyst" },
  { prompt: "Debug kernel-level memory leaks", icon: <Cpu className="h-4 w-4" />, title: "Systems Dev" },
  { prompt: "Synthesize latest oncology research", icon: <Search className="h-4 w-4" />, title: "Clinical Research" },
  { prompt: "Architect a scalable microservices mesh", icon: <Code className="h-4 w-4" />, title: "Architecture" },
  { prompt: "Generate high-res surgical diagrams", icon: <ImageIcon className="h-4 w-4" />, title: "Medical Visualization" },
  { prompt: "Draft a technical whitepaper on AI safety", icon: <Pencil className="h-4 w-4" />, title: "Technical Writing" },
];

export const MODE_OPTIONS = [
  { id: "assistant", icon: "🧠", label: "Think" },
  { id: "image", icon: "🖼", label: "Image" },
  { id: "codex", icon: "💻", label: "Code" },
  { id: "study", icon: "🎓", label: "Study" },
  { id: "business", icon: "💼", label: "Business" },
  { id: "media", icon: "🎬", label: "Media" },
  { id: "research", icon: "📊", label: "Research" },
];
