import React, { useState } from "react";
import { Download, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  imageUrl: string;
  prompt?: string;
  className?: string;
}

const ImageDisplay: React.FC<Props> = ({ imageUrl, prompt = "Generated image", className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn("relative group rounded-xl overflow-hidden border border-border/50 bg-muted/30 my-4", className)}>
      <img
        src={imageUrl}
        alt={prompt}
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10" onClick={() => setIsExpanded(true)}>
          <Maximize2 className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10" onClick={handleDownload}>
          <Download className="h-5 w-5" />
        </Button>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button 
            onClick={() => setIsExpanded(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={imageUrl}
            alt={prompt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
