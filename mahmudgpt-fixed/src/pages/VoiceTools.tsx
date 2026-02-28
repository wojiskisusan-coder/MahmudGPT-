
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Volume2, Code, Table, FileText, ImageIcon } from 'lucide-react';
import { getTranslation } from '@/utils/translations';
import { useLanguageStore } from '@/store/languageStore';
import WriteCanvas from '@/components/WriteCanvas';
import CodeCanvas from '@/components/CodeCanvas';
import TableFormatter from '@/components/TableFormatter';
import ImageCreator from '@/components/ImageCreator';

interface GeneratedContent {
  type: 'table' | 'code' | 'text' | 'image';
  content: string;
  prompt: string;
}

const VoiceTools = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('image-creator');
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const { currentLanguage } = useLanguageStore();
  
  // Attempt to load content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('generatedContent');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent) as GeneratedContent;
        setContent(parsedContent);
        setActiveTab(parsedContent.type);
      } catch (e) {
        console.error('Failed to parse saved content:', e);
      }
    }
  }, []);
  
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{getTranslation('tools', currentLanguage)}</h1>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full flex justify-start overflow-auto">
            <TabsTrigger value="image-creator" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>{getTranslation('image_creator', currentLanguage) || "Image Creator"}</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>{getTranslation('voice_tools', currentLanguage) || "Voice Tools"}</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{getTranslation('text_tools', currentLanguage) || "Text Tools"}</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>{getTranslation('code_tools', currentLanguage) || "Code Tools"}</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              <span>{getTranslation('table_tools', currentLanguage) || "Table Tools"}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="image-creator" className="focus-visible:outline-none focus-visible:ring-0">
            <ImageCreator initialPrompt={content?.type === 'image' ? content.prompt : ''} />
          </TabsContent>
          
          <TabsContent value="voice" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="border rounded-md bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">{getTranslation('voice_tools_title', currentLanguage) || "Voice Tools"}</h2>
              <p className="text-muted-foreground">
                {getTranslation('voice_tools_description', currentLanguage) || "Convert your text to speech using our advanced AI voices."}
              </p>
              
              {/* Voice tools content would go here */}
              <div className="mt-6">
                <p>Coming soon: Advanced text-to-speech tools with multiple voice options</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="focus-visible:outline-none focus-visible:ring-0">
            {content?.type === 'text' ? (
              <WriteCanvas />
            ) : (
              <WriteCanvas />
            )}
          </TabsContent>
          
          <TabsContent value="code" className="focus-visible:outline-none focus-visible:ring-0">
            {content?.type === 'code' ? (
              <CodeCanvas />
            ) : (
              <CodeCanvas />
            )}
          </TabsContent>
          
          <TabsContent value="table" className="focus-visible:outline-none focus-visible:ring-0">
            {content?.type === 'table' ? (
              <TableFormatter />
            ) : (
              <TableFormatter />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VoiceTools;
