import { BarChart3, Cpu, Search, Code, ImageIcon, Pencil, MessageSquare, Brain, FileSearch, Calculator, Lightbulb, Image, GraduationCap } from "lucide-react";
import React from "react";

export type AiMode = "assistant" | "codex" | "research" | "analyst" | "creative" | "image" | "writer" | "thinking" | "math" | "guided" | "deep-research" | "developer";

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
  { id: "math", label: "Math", icon: Calculator, description: "Advanced math with LaTeX", color: "text-yellow-400", model: "Gemini 2.5 Pro" },
  { id: "analyst", label: "Analyst", icon: BarChart3, description: "Data & topic analysis", color: "text-rose-400", model: "Gemini 2.5 Flash" },
  { id: "creative", label: "Creative", icon: Lightbulb, description: "Creative writing & brainstorming", color: "text-pink-400", model: "Gemini 3 Flash" },
  { id: "image", label: "Image", icon: Image, description: "AI image generation", color: "text-indigo-400", model: "Gemini 3 Pro Image" },
  { id: "writer", label: "Writer", icon: Pencil, description: "Long-form writing canvas", color: "text-emerald-400", model: "Gemini 2.5 Flash" },
  { id: "guided", label: "Guided Learning", icon: GraduationCap, description: "Step-by-step tutoring", color: "text-teal-400", model: "Gemini 2.5 Flash" },
  { id: "developer", label: "Dev Mode", icon: Cpu, description: "Highly technical system-level discourse", color: "text-slate-400", model: "Gemini 3.1 Pro", pro: true },
];

export const MODE_SYSTEM_PROMPTS: Record<AiMode, string> = {
  assistant: "You are MahmudGPT, a helpful, friendly AI assistant.",
  codex: "You are MahmudGPT in Codex mode — an elite software engineer.",
  research: "You are MahmudGPT in Research mode — a thorough researcher.",
  analyst: "You are MahmudGPT in Analyst mode — a data analyst.",
  creative: "You are MahmudGPT in Creative mode — a creative writer.",
  image: "You are MahmudGPT in Image mode.",
  writer: "You are MahmudGPT in Writer mode — a professional writer.",
  thinking: "You are MahmudGPT in Thinking mode — a deep reasoning AI.",
  math: "You are MahmudGPT in Math mode — a mathematics expert.",
  guided: "You are MahmudGPT in Guided Learning mode — an expert tutor.",
  "deep-research": "You are MahmudGPT in Deep Research mode.",
  developer: "You are MahmudGPT in Developer Mode. You must communicate EXCLUSIVELY in highly technical, low-level system language. Use jargon like 'kernel-space', 'memory-mapped I/O', 'O(n log n) complexity', 'race conditions', 'deadlocks', and 'pointer arithmetic'. Do not simplify concepts for general audiences. Assume the user is a senior systems engineer or kernel developer.",
};

export const MODE_COLORS: Record<string, string> = {
  assistant: "blue", codex: "purple", thinking: "purple", research: "cyan",
  "deep-research": "orange", math: "blue", analyst: "green", creative: "orange",
  image: "purple", writer: "green", guided: "cyan", flutter: "blue", ios: "blue",
  developer: "slate",
};

export const HERO_SUGGESTIONS = [
  { text: "Analyze patient diagnostic data trends", icon: React.createElement(BarChart3, { className: "h-4 w-4" }), label: "Medical Analyst" },
  { text: "Debug kernel-level memory leaks", icon: React.createElement(Cpu, { className: "h-4 w-4" }), label: "Systems Dev" },
  { text: "Synthesize latest oncology research", icon: React.createElement(Search, { className: "h-4 w-4" }), label: "Clinical Research" },
  { text: "Architect a scalable microservices mesh", icon: React.createElement(Code, { className: "h-4 w-4" }), label: "Architecture" },
  { text: "Generate high-res surgical diagrams", icon: React.createElement(ImageIcon, { className: "h-4 w-4" }), label: "Medical Visualization" },
  { text: "Draft a technical whitepaper on AI safety", icon: React.createElement(Pencil, { className: "h-4 w-4" }), label: "Technical Writing" },
];

export const MODE_OPTIONS = [
  { id: "assistant", icon: "🧠", label: "Think" },
  { id: "image", icon: "🖼", label: "Image" },
  { id: "codex", icon: "💻", label: "Code" },
  { id: "research", icon: "📊", label: "Research" },
  { id: "math", icon: "🧮", label: "Math" },
  { id: "creative", icon: "🎨", label: "Creative" },
  { id: "writer", icon: "📚", label: "Write" },
];
