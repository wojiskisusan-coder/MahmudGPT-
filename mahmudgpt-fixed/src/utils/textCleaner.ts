/**
 * Cleans markdown and special characters from text before sending to TTS.
 * Prevents the AI from speaking asterisks, hashes, backticks, etc.
 */
export function cleanTextForSpeech(text: string): string {
  let cleaned = text;

  // Remove code blocks (```...```)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, ". Code block omitted. ");

  // Remove inline code (`...`)
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

  // Remove bold/italic markers (**, *, __, _)
  cleaned = cleaned.replace(/\*{1,3}(.*?)\*{1,3}/g, "$1");
  cleaned = cleaned.replace(/_{1,3}(.*?)_{1,3}/g, "$1");

  // Remove strikethrough (~~...~~)
  cleaned = cleaned.replace(/~~(.*?)~~/g, "$1");

  // Remove markdown headers (# ## ### etc.)
  cleaned = cleaned.replace(/^#{1,6}\s*/gm, "");

  // Remove markdown links [text](url) → text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove markdown images ![alt](url)
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1 image");

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  // Remove bullet points and list markers
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, "");
  cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, "");

  // Remove blockquotes
  cleaned = cleaned.replace(/^>\s*/gm, "");

  // Remove horizontal rules
  cleaned = cleaned.replace(/^[-*_]{3,}$/gm, "");

  // Remove table formatting
  cleaned = cleaned.replace(/\|/g, ", ");
  cleaned = cleaned.replace(/^[-:|\s]+$/gm, "");

  // Clean up HTML entities
  cleaned = cleaned.replace(/&amp;/g, "and");
  cleaned = cleaned.replace(/&lt;/g, "less than");
  cleaned = cleaned.replace(/&gt;/g, "greater than");
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&#39;/g, "'");

  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.replace(/[ \t]{2,}/g, " ");
  cleaned = cleaned.trim();

  return cleaned;
}
