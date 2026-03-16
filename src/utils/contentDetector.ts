export type ContentType = 'table' | 'code' | 'text';

export const detectContentType = (text: string): ContentType => {
  const lowercaseText = text.toLowerCase();
  
  // Detect code
  if (
    lowercaseText.includes('code') || 
    lowercaseText.includes('function') || 
    lowercaseText.includes('class') || 
    lowercaseText.includes('implement') ||
    lowercaseText.includes('javascript') ||
    lowercaseText.includes('python') ||
    lowercaseText.includes('html') ||
    lowercaseText.includes('css') ||
    lowercaseText.includes('react') ||
    lowercaseText.includes('typescript')
  ) {
    return 'code';
  }
  
  // Detect table
  if (
    lowercaseText.includes('table') || 
    lowercaseText.includes('list') || 
    lowercaseText.includes('comparison') || 
    lowercaseText.includes('schedule') ||
    lowercaseText.includes('data')
  ) {
    return 'table';
  }
  
  // Default to text
  return 'text';
};
