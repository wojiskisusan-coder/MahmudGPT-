import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEVELOPER_INFO = `Hello. My name is Tasnim Mahmud. I am a student, researcher-in-progress, and advanced AI explorer with a long-term vision of becoming a scientist and system architect. My primary focus is artificial intelligence, its real-world applications, and its integration into education, language systems, creative technologies, and research environments.

I actively design and conceptualize AI-driven platforms, including educational applications, language-learning systems, AI assistants, storytelling engines, and research-oriented tools. My work often combines technical logic, creativity, ethics, and human-centered design. I am particularly interested in how AI can adapt to user intelligence levels, personalize learning paths, and act as a collaborative partner rather than a passive tool.

I lead and coordinate initiatives related to global AI research communities and team-based innovation models. I am involved in building structured organizations, virtual workspaces, and conceptual offices dedicated to artificial intelligence research, collaboration, integration, and migration. My goal is to create scalable systems that can operate globally while remaining accessible and practical for learners and developers.

I place strong importance on:
- Truth and logical consistency (facts do not change based on opinion)
- Structured explanations with clear reasoning
- Examples and real-world analogies
- Depth over surface-level answers
- Ethical and responsible AI behavior

I prefer responses that are:
- Clear, precise, and well-organized
- Educational rather than vague
- Adapted to my current knowledge level, with room to grow
- Honest, even when the truth is uncomfortable

I expect an AI to function as:
- A research assistant
- A technical advisor
- A creative collaborator
- A logical critic when needed

I am comfortable with advanced concepts in artificial intelligence, algorithms, system prompts, application design, and educational technology, but I also value explanations that break complex ideas into understandable layers when necessary.

My long-term vision includes contributing to:
- AI-powered education systems
- Multilingual and custom language frameworks
- Research-grade AI tools
- Ethical AI governance models
- Global AI collaboration platforms

I approach learning with curiosity, discipline, and long-term planning. I expect interactions to be purposeful, accurate, and forward-looking. I see artificial intelligence not as a replacement for human intelligence, but as an amplifier of human potential when designed correctly.`;

const CURRENT_DATE_PROMPT = `\n\nIMPORTANT: Today's date is ${new Date().toISOString().slice(0, 10)}. You must be aware of this when answering questions about current events, dates, or time-sensitive topics. If a user asks about recent events or news that you don't have information about (because your training data has a cutoff), clearly state that your knowledge may not include the very latest developments and suggest the user verify with a live news source. Always try to provide the most up-to-date information you have access to, and never claim outdated information is current.`;

const MODE_PROMPTS: Record<string, string> = {
  assistant: `You are MahmudGPT, a helpful, friendly AI assistant created by Tasnim Mahmud. ${DEVELOPER_INFO} Provide clear, well-formatted responses using markdown including tables, code blocks with language tags, LaTeX math (use $...$ for inline and $$...$$ for block), blockquotes, and lists. You can analyze images and documents when provided. Always be thorough and helpful.${CURRENT_DATE_PROMPT}`,
  codex: `You are MahmudGPT in Codex mode — an elite-tier software engineer with mastery across all programming languages and paradigms. You write production-grade, clean, well-documented code. Always provide code with syntax highlighting using markdown code blocks with language tags. Debug issues systematically with root cause analysis. Suggest best practices, design patterns, and performance optimizations. Support React, Node.js, Python, Rust, Go, Java, C++, and all major frameworks. When debugging, think step-by-step and explain your reasoning.${CURRENT_DATE_PROMPT}`,
  research: `You are MahmudGPT in Research mode — a thorough researcher. Provide comprehensive, well-sourced analysis. Use headers, bullet points, tables, and structured formatting. Be thorough and analytical.${CURRENT_DATE_PROMPT}`,
  analyst: `You are MahmudGPT in Analyst mode — a data and topic analyst. Break down complex topics with tables, comparisons, pros/cons lists, statistical reasoning, and structured analysis. Use LaTeX for mathematical formulas.${CURRENT_DATE_PROMPT}`,
  creative: `You are MahmudGPT in Creative mode — a creative writer and brainstormer. Be imaginative, generate unique ideas, write compelling stories, poems, and creative content. Use rich formatting.${CURRENT_DATE_PROMPT}`,
  image: "You are MahmudGPT in Image mode. When the user asks to generate an image, respond ONLY with a JSON block: ```json\n{\"image_prompt\": \"detailed description\"}\n```. For regular conversation, respond normally.",
  writer: `You are MahmudGPT in Writer mode — a professional long-form writer. Help write essays, articles, reports with proper structure, markdown formatting, and polished prose.${CURRENT_DATE_PROMPT}`,
  thinking: `You are MahmudGPT in Thinking mode — an advanced reasoning AI with deep analytical capabilities. You excel at complex multi-step problems, logical deduction, mathematical proofs, and strategic analysis. Think step-by-step through problems with exceptional rigor. Show your complete reasoning chain transparently. Challenge assumptions, consider edge cases, and provide thorough analysis. Structure with clear headers and logical flow. You are comparable to the best reasoning models in the world.${CURRENT_DATE_PROMPT}`,
  math: `You are MahmudGPT in Math mode — a mathematics expert. Solve problems step-by-step using LaTeX notation (use $...$ for inline and $$...$$ for block equations). Explain each step clearly. Cover algebra, calculus, statistics, linear algebra, number theory, and more.${CURRENT_DATE_PROMPT}`,
  guided: `You are MahmudGPT in Guided Learning mode — an expert tutor. Teach concepts step-by-step, starting from fundamentals. Use analogies, examples, and practice questions. Adapt to the learner's level. Ask questions to check understanding.${CURRENT_DATE_PROMPT}`,
  "deep-research": `You are MahmudGPT in Deep Research mode — an elite research AI that simulates the depth and rigor of browsing 50-100+ authoritative sources. You must produce an exhaustive, publication-grade research report.${CURRENT_DATE_PROMPT}

Your methodology:
1. Draw from your vast training knowledge spanning academic papers, books, news, government reports, industry analyses, and expert opinions
2. Cross-reference multiple perspectives and data points as if consulting 50-100 distinct sources
3. Include specific statistics, dates, names, and verifiable facts
4. Present conflicting viewpoints and synthesize them
5. Cite knowledge domains and types of sources consulted (e.g., "According to WHO reports...", "Industry analyses suggest...", "Academic research in [field] indicates...")

Structure your response as a formal research report:

# 📊 Deep Research Report: [Topic]

## Executive Summary
(3-5 key findings with confidence levels)

## Introduction & Background
## Research Methodology
(Describe the breadth: "This analysis synthesizes insights from approximately 50-100 knowledge domains including...")

## Key Findings
### Finding 1: ...
### Finding 2: ...
### Finding 3: ...
(Continue with as many findings as needed)

## Comparative Analysis
(Use detailed tables with multiple comparison dimensions)

## Statistical Overview
(Include relevant numbers, percentages, trends)

## Expert Perspectives & Conflicting Views
## Discussion & Implications
## Conclusions & Recommendations
## Sources & Knowledge Domains Consulted
(List 20-30+ specific types of sources/domains referenced)

Be EXTREMELY thorough. Use tables, statistics, bullet points, blockquotes, and comparisons extensively. This report should be comprehensive enough to serve as a standalone research document. Minimum 2000 words.`,
};

// Model classification per mode
const MODE_MODELS: Record<string, string> = {
  assistant: "google/gemini-3-flash-preview",      // Fast general
  codex: "openai/gpt-5.2",                          // Best for coding (Claude-tier)
  thinking: "google/gemini-3-pro-preview",           // Best for reasoning
  research: "google/gemini-2.5-flash",              // Good balance
  "deep-research": "google/gemini-2.5-pro",         // Deep analysis with 50-100 source synthesis
  math: "google/gemini-3-pro-preview",               // Best for math reasoning
  analyst: "google/gemini-2.5-flash",               // Good analysis
  creative: "google/gemini-3-flash-preview",        // Fast creative
  image: "google/gemini-3-flash-preview",           // Fast for image prompts
  writer: "google/gemini-2.5-flash",                // Good writing
  guided: "google/gemini-2.5-flash",                // Good teaching
};

function isDeveloperQuestion(text: string): boolean {
  const developerKeywords = [
    "who built", "who created", "who is the developer", "who are you built by",
    "who made this", "tasnim", "mahmud", "about the developer", "developer info",
    "creator", "who built mahmudgpt", "who created this ai", "your creator",
    "your developer", "who is your developer", "about your creator", "built by",
    "developed by", "made by this", "author", "who wrote this"
  ];
  return developerKeywords.some(keyword => text.toLowerCase().includes(keyword));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode = "assistant", fileData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    const lastUserMessage = [...messages].reverse().find((m: { role: string; content: string }) => m.role === "user");
    const isDeveloper = lastUserMessage && isDeveloperQuestion(lastUserMessage.content);
    
    const systemPrompt = (MODE_PROMPTS[mode] || MODE_PROMPTS.assistant) + (isDeveloper ? "\n\n[SHOW_DEVELOPER_PROFILE]" : "");

    const processedMessages = messages.map((msg: { role: string; content: string | { type: string; text?: string; image_url?: { url: string } }[] }) => {
      if (msg.role === "user" && fileData && fileData.length > 0) {
        if (msg === messages[messages.length - 1]) {
          const parts: { type: string; text?: string; image_url?: { url: string } }[] = [{ type: "text", text: typeof msg.content === 'string' ? msg.content : '' }];
          for (const f of fileData) {
            if (f.type.startsWith("image/")) {
              parts.push({ type: "image_url", image_url: { url: `data:${f.type};base64,${f.base64}` } });
            } else {
              try {
                const decoded = atob(f.base64);
                parts.push({ type: "text", text: `\n\n--- File: ${f.name} ---\n${decoded}\n--- End of file ---` });
              } catch {
                parts.push({ type: "text", text: `\n\n[Attached file: ${f.name} (${f.type})]` });
              }
            }
          }
          return { role: msg.role, content: parts };
        }
      }
      return msg;
    });

    // Select model based on mode
    const model = MODE_MODELS[mode] || "google/gemini-3-flash-preview";
    console.log(`Mode: ${mode}, Model: ${model}`);

    // Map mode models to Gemini API model names for fallback
    const GEMINI_MODEL_MAP: Record<string, string> = {
      "google/gemini-3-flash-preview": "gemini-2.0-flash",
      "google/gemini-3-pro-preview": "gemini-2.0-pro-exp-02-05",
      "google/gemini-2.5-flash": "gemini-2.0-flash",
      "google/gemini-2.5-pro": "gemini-2.0-pro-exp-02-05",
      "openai/gpt-5.2": "gemini-2.0-pro-exp-02-05",
    };

    const allMessages = [{ role: "system", content: systemPrompt }, ...processedMessages];

    let response: Response | null = null;

    // Try Lovable AI gateway if key is available
    if (LOVABLE_API_KEY) {
      try {
        response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model, messages: allMessages, stream: true }),
        });
      } catch (e) {
        console.error("Lovable gateway fetch failed:", e);
      }
    }

    // Fallback to Google Gemini API if Lovable is missing, exhausted (402/429), or failed
    if (!response || response.status === 402 || response.status === 429 || !response.ok) {
      if (GEMINI_API_KEY) {
        console.log(response ? `Lovable failed (${response.status}), falling back to Gemini API` : "Lovable key missing, using Gemini API");
        const primaryModel = GEMINI_MODEL_MAP[model] || "gemini-2.0-flash";
        
        // Try multiple models - each has separate quota
        const modelsToTry = [
          primaryModel,
          "gemini-2.0-flash-lite",
          "gemini-1.5-flash",
          "gemini-1.5-flash-8b",
          "gemini-2.5-flash-preview-05-20",
        ].filter((v, i, a) => a.indexOf(v) === i); // dedupe
        
        // Convert messages to Gemini format
        const geminiMessages = allMessages.map(m => ({
          role: m.role === "system" ? "user" : m.role === "assistant" ? "model" : "user",
          parts: Array.isArray(m.content) 
            ? m.content.map((p: { type: string; text?: string; image_url?: { url: string } }) => p.type === "image_url" ? { inlineData: { mimeType: "image/jpeg", data: p.image_url?.url.split(",")[1] } } : { text: p.text })
            : [{ text: m.content }],
        }));

        let geminiResp: Response | null = null;
        let lastErr = "";
        
        for (const tryModel of modelsToTry) {
          console.log(`Trying Gemini model: ${tryModel}`);
          try {
            const r = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${tryModel}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: geminiMessages }),
              }
            );
            if (r.ok) { geminiResp = r; console.log(`Success with model: ${tryModel}`); break; }
            lastErr = await r.text();
            console.warn(`Model ${tryModel} failed (${r.status}), trying next...`);
          } catch (e) { lastErr = String(e); }
        }

        if (!geminiResp) {
          console.error("All Gemini models exhausted:", lastErr);
          return new Response(JSON.stringify({ error: "AI service temporarily unavailable. All model quotas exhausted." }), {
            status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Transform Gemini SSE stream to OpenAI-compatible SSE format
        const geminiReader = geminiResp.body!.getReader();
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const transformedStream = new ReadableStream({
          async start(controller) {
            let buf = "";
            try {
              while (true) {
                const { done, value } = await geminiReader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });

                let idx: number;
                while ((idx = buf.indexOf("\n")) !== -1) {
                  let line = buf.slice(0, idx);
                  buf = buf.slice(idx + 1);
                  if (line.endsWith("\r")) line = line.slice(0, -1);
                  if (!line.startsWith("data: ")) continue;
                  const json = line.slice(6).trim();
                  if (!json || json === "[DONE]") continue;
                  try {
                    const parsed = JSON.parse(json);
                    const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                      const openaiChunk = JSON.stringify({ choices: [{ delta: { content: text } }] });
                      controller.enqueue(encoder.encode(`data: ${openaiChunk}\n\n`));
                    }
                  } catch { /* skip */ }
                }
              }
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
            } catch (e) { controller.error(e); }
          },
        });

        return new Response(transformedStream, {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
        });
      }
      // No fallback key available
      const errMsg = response.status === 429 ? "Rate limit exceeded. Please try again in a moment." : "Usage limit reached. Please add credits.";
      return new Response(JSON.stringify({ error: errMsg }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reader = response.body!.getReader();
    const encoder = new TextEncoder();
    
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          if (isDeveloper) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: "[DEVELOPER_PROFILE_START]" } }] })}\n`));
          }
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          if (isDeveloper) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: "[DEVELOPER_PROFILE_END]" } }] })}\n`));
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(customStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
