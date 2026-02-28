
import React, { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Play, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ListOrdered, List, Code as CodeIcon, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeCanvasProps {
  defaultLanguage?: "html" | "css" | "javascript" | "markdown" | "plain";
  defaultContent?: string;
}

const CodeCanvas: React.FC<CodeCanvasProps> = ({
  defaultLanguage = "javascript",
  defaultContent = "",
}) => {
  const [content, setContent] = useState(defaultContent);
  const [language, setLanguage] = useState(defaultLanguage);
  const [previewContent, setPreviewContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Update preview when content changes or when manually triggered
  const updatePreview = useCallback(() => {
    // For large content, we use a small delay and only update chunks
    // to avoid performance issues
    if (content.length > 10000) {
      // For very large content, show a preview message
      setPreviewContent(content.slice(0, 5000) + "\n\n/* Preview truncated for performance. Full code will be included when copied. */");
      
      toast({
        title: "Large code detected",
        description: "Preview has been truncated for performance. Full code is available when copied.",
      });
    } else {
      setPreviewContent(content);
    }
  }, [content, toast]);
  
  // Initialize preview when component mounts
  useEffect(() => {
    if (defaultContent) {
      updatePreview();
    }
  }, [defaultContent, updatePreview]);
  
  // Copy content to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy content to clipboard.",
        variant: "destructive",
      });
    }
  };
  
  // Format HTML content with syntax highlighting
  const formatContent = (text: string, lang: string) => {
    // Large content optimization - apply only limited syntax highlighting
    if (text.length > 10000) {
      // Simple highlighting for large files
      return text;
    }
    
    // Basic syntax highlighting
    if (lang === "javascript") {
      // Highlight keywords
      const formatted = text
        .replace(/(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)/g, '<span class="text-blue-500">$1</span>')
        .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-green-500">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="text-gray-400">$1</span>')
        .replace(/(\d+)/g, '<span class="text-purple-500">$1</span>');
      return formatted;
    } else if (lang === "html") {
      // Highlight HTML tags
      const formatted = text
        .replace(/(&lt;[^&]*&gt;)/g, '<span class="text-red-500">$1</span>')
        .replace(/(".*?")/g, '<span class="text-green-500">$1</span>');
      return formatted;
    } else if (lang === "css") {
      // Highlight CSS properties
      const formatted = text
        .replace(/([\w-]+):/g, '<span class="text-blue-500">$1</span>:')
        .replace(/(#[a-fA-F0-9]{3,6})/g, '<span class="text-green-500">$1</span>');
      return formatted;
    } else if (lang === "markdown") {
      // Highlight markdown syntax
      const formatted = text
        .replace(/(^#{1,6}\s.*$)/gm, '<span class="text-blue-500 font-bold">$1</span>')
        .replace(/(\*\*.*?\*\*)/g, '<span class="font-bold">$1</span>')
        .replace(/(\*.*?\*)/g, '<span class="italic">$1</span>')
        .replace(/(^\s*-\s.*$)/gm, '<span class="text-green-500">$1</span>');
      return formatted;
    }
    return text;
  };
  
  // Text formatting functions
  const applyFormatting = (formatType: string) => {
    // Get the textarea element
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = '';
    let cursorAdjustment = 0;

    switch (formatType) {
      case 'bold':
        formattedText = language === 'markdown' ? `**${selectedText}**` : `<strong>${selectedText}</strong>`;
        cursorAdjustment = language === 'markdown' ? 2 : 9;
        break;
      case 'italic':
        formattedText = language === 'markdown' ? `*${selectedText}*` : `<em>${selectedText}</em>`;
        cursorAdjustment = language === 'markdown' ? 1 : 4;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        cursorAdjustment = 3;
        break;
      case 'align-left':
        formattedText = language === 'markdown' ? selectedText : `<div style="text-align: left;">${selectedText}</div>`;
        cursorAdjustment = language === 'markdown' ? 0 : 29;
        break;
      case 'align-center':
        formattedText = language === 'markdown' ? selectedText : `<div style="text-align: center;">${selectedText}</div>`;
        cursorAdjustment = language === 'markdown' ? 0 : 31;
        break;
      case 'align-right':
        formattedText = language === 'markdown' ? selectedText : `<div style="text-align: right;">${selectedText}</div>`;
        cursorAdjustment = language === 'markdown' ? 0 : 30;
        break;
      case 'list':
        if (language === 'markdown') {
          formattedText = selectedText
            .split('\n')
            .map(line => line.trim() ? `- ${line}` : line)
            .join('\n');
        } else {
          formattedText = `<ul>\n${selectedText
            .split('\n')
            .map(line => line.trim() ? `  <li>${line}</li>` : '')
            .join('\n')}\n</ul>`;
        }
        cursorAdjustment = 0;
        break;
      case 'list-ordered':
        if (language === 'markdown') {
          formattedText = selectedText
            .split('\n')
            .map((line, index) => line.trim() ? `${index + 1}. ${line}` : line)
            .join('\n');
        } else {
          formattedText = `<ol>\n${selectedText
            .split('\n')
            .map(line => line.trim() ? `  <li>${line}</li>` : '')
            .join('\n')}\n</ol>`;
        }
        cursorAdjustment = 0;
        break;
      case 'code':
        formattedText = language === 'markdown' ? `\`${selectedText}\`` : `<code>${selectedText}</code>`;
        cursorAdjustment = language === 'markdown' ? 1 : 6;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Focus back on textarea and set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      // If no text was selected, place cursor inside the formatting tags
      if (start === end) {
        textarea.selectionStart = start + cursorAdjustment;
        textarea.selectionEnd = start + cursorAdjustment;
      } else {
        // If text was selected, place cursor at the end of the formatted text
        textarea.selectionStart = start + formattedText.length;
        textarea.selectionEnd = start + formattedText.length;
      }
    }, 0);
  };
  
  // Render HTML preview for HTML language
  const renderHtmlPreview = () => {
    if (language === "html") {
      return (
        <div 
          className="border p-4 rounded-md bg-white text-black w-full h-full overflow-auto"
          dangerouslySetInnerHTML={{ __html: previewContent }}
        />
      );
    } else if (language === "markdown") {
      // Very basic markdown rendering
      const html = previewContent
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br />');
      
      return (
        <div 
          className="border p-4 rounded-md bg-white text-black w-full h-full overflow-auto prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else {
      // For other languages, show syntax highlighted code
      const formattedCode = formatContent(
        previewContent.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        language
      );
      
      return (
        <div className="border p-4 rounded-md bg-gray-900 text-white font-mono w-full h-full overflow-auto">
          <pre dangerouslySetInnerHTML={{ __html: formattedCode }} />
        </div>
      );
    }
  };
  
  // Determine if formatting toolbar should be visible based on language
  const showFormattingToolbar = language === 'markdown' || language === 'html' || language === 'plain';

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Code Canvas</CardTitle>
          <div className="space-x-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "html" | "css" | "javascript" | "markdown" | "plain")}
              className="text-sm border border-gray-300 rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="markdown">Markdown</option>
              <option value="plain">Plain Text</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="min-h-[300px]">
            {showFormattingToolbar && (
              <div className="flex flex-wrap gap-1 mb-2 p-1 border border-gray-200 dark:border-gray-700 rounded">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => applyFormatting('bold')}
                  className="h-8 w-8" 
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => applyFormatting('italic')}
                  className="h-8 w-8"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => applyFormatting('underline')}
                  className="h-8 w-8"
                  title="Underline"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-0.5"></div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => applyFormatting('align-left')}
                  className="h-8 w-8"
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => applyFormatting('align-center')}
                  className="h-8 w-8"
                  title="Align Center"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => applyFormatting('align-right')}
                  className="h-8 w-8"
                  title="Align Right"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-0.5"></div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => applyFormatting('list')}
                  className="h-8 w-8"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => applyFormatting('list-ordered')}
                  className="h-8 w-8"
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => applyFormatting('code')}
                  className="h-8 w-8"
                  title="Code"
                >
                  <CodeIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 ml-auto"
                  title="More formatting options"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono"
              placeholder={`Enter your ${language} code here...`}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="min-h-[300px]">
            {renderHtmlPreview()}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={updatePreview}>
          <Play className="h-4 w-4 mr-2" />
          Update Preview
        </Button>
        <Button variant="outline" onClick={copyToClipboard}>
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CodeCanvas;
