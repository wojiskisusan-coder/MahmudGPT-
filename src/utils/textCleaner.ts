/**
 * Cleans text for Text-to-Speech by removing markdown artifacts, 
 * code blocks, and other non-verbal symbols.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return "";

  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove bold/italic markdown
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove markdown links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove markdown headers
    .replace(/^#+\s+/gm, "")
    // Remove bullet points
    .replace(/^[\s]*[-*+]\s+/gm, "")
    // Remove numbered lists
    .replace(/^[\s]*\d+\.\s+/gm, "")
    // Remove blockquotes
    .replace(/^>\s+/gm, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove multiple spaces and newlines
    .replace(/\s+/g, " ")
    .trim();
}
