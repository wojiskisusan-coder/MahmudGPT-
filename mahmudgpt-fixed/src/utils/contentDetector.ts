
// Content type detection utility

export type ContentType = 'table' | 'code' | 'text' | 'image' | 'none';

// Function to detect what type of content the user is asking for
export function detectContentType(message: string): ContentType {
  const lowerMessage = message.toLowerCase();
  
  // Check for image-related keywords
  if (
    lowerMessage.includes('image') ||
    lowerMessage.includes('photo') ||
    lowerMessage.includes('picture') ||
    lowerMessage.includes('analyze image') ||
    lowerMessage.includes('extract text') ||
    lowerMessage.includes('ocr') ||
    lowerMessage.includes('recognize') ||
    lowerMessage.includes('identify') ||
    lowerMessage.includes('what is in this') ||
    lowerMessage.includes('what\'s in this') ||
    lowerMessage.includes('detect object') ||
    lowerMessage.includes('analyze object') ||
    lowerMessage.includes('flower') ||
    lowerMessage.includes('plant') ||
    lowerMessage.includes('animal') ||
    (lowerMessage.includes('what') && lowerMessage.includes('this'))
  ) {
    return 'image';
  }
  
  // Check for table-related keywords
  if (
    lowerMessage.includes('table') ||
    lowerMessage.includes('comparison') ||
    lowerMessage.includes('grid') ||
    lowerMessage.includes('chart') ||
    (lowerMessage.includes('data') && lowerMessage.includes('format'))
  ) {
    return 'table';
  }
  
  // Check for code-related keywords
  if (
    lowerMessage.includes('code') ||
    lowerMessage.includes('function') ||
    lowerMessage.includes('javascript') ||
    lowerMessage.includes('html') ||
    lowerMessage.includes('css') ||
    lowerMessage.includes('typescript') ||
    lowerMessage.includes('python') ||
    lowerMessage.includes('program')
  ) {
    return 'code';
  }
  
  // Enhanced check for text/document keywords including formatting
  if (
    lowerMessage.includes('write') ||
    lowerMessage.includes('text') ||
    lowerMessage.includes('essay') ||
    lowerMessage.includes('article') ||
    lowerMessage.includes('paragraph') ||
    lowerMessage.includes('story') ||
    lowerMessage.includes('canvas') ||
    lowerMessage.includes('format') ||
    // Formatting-related keywords
    lowerMessage.includes('bold') ||
    lowerMessage.includes('italic') ||
    lowerMessage.includes('underline') ||
    lowerMessage.includes('bullets') ||
    lowerMessage.includes('bullet points') ||
    lowerMessage.includes('align') ||
    lowerMessage.includes('alignment') ||
    lowerMessage.includes('center') ||
    lowerMessage.includes('right') ||
    lowerMessage.includes('numbered list') ||
    lowerMessage.includes('formatting') ||
    lowerMessage.includes('hashtag') || // For markdown headers
    lowerMessage.includes('asterisk') || // For markdown emphasis
    lowerMessage.includes('markdown') ||
    lowerMessage.includes('document') ||
    lowerMessage.includes('editor')
  ) {
    return 'text';
  }
  
  // Default to none if no specific type detected
  return 'none';
}
