import React, { useRef } from "react";
import { Paperclip, X, FileText, Image, Film, FileCode, File } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UploadedFile {
  file: File;
  previewUrl?: string;
  type: "image" | "video" | "document" | "code" | "other";
}

function getFileType(file: File): UploadedFile["type"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (/\.(pdf|doc|docx|txt|rtf|odt)$/i.test(file.name)) return "document";
  if (/\.(js|ts|tsx|jsx|py|java|cpp|c|html|css|json|xml|yaml|yml|md|sql|sh|go|rs|rb)$/i.test(file.name)) return "code";
  return "other";
}

const FILE_ICONS: Record<string, React.ElementType> = {
  image: Image, video: Film, document: FileText, code: FileCode, other: File,
};

interface Props {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

const FileUpload: React.FC<Props> = ({ files, onFilesChange, maxFiles = 5 }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const newFiles: UploadedFile[] = [];
    const remainingSlots = maxFiles - files.length;
    const count = Math.min(selected.length, remainingSlots);
    
    for (let i = 0; i < count; i++) {
      const f = selected[i];
      const type = getFileType(f);
      let previewUrl: string | undefined;
      if (type === "image") {
        previewUrl = URL.createObjectURL(f);
      }
      newFiles.push({ file: f, previewUrl, type });
    }
    onFilesChange([...files, ...newFiles]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (idx: number) => {
    const f = files[idx];
    if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    const newFiles = [...files];
    newFiles.splice(idx, 1);
    onFilesChange(newFiles);
  };

  return (
    <div className="flex flex-col gap-2">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1 mb-2">
          {files.map((f, i) => {
            const Icon = FILE_ICONS[f.type] || File;
            return (
              <div key={i} className="relative group flex items-center gap-2 bg-accent/60 rounded-lg px-2 py-1.5 border border-border text-xs max-w-[200px]">
                {f.previewUrl ? (
                  <img src={f.previewUrl} alt="" className="h-8 w-8 rounded object-cover flex-shrink-0" />
                ) : (
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className="truncate flex-1">{f.file.name}</span>
                <button 
                  onClick={() => remove(i)} 
                  className="ml-1 p-0.5 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-accent/50"
          onClick={() => inputRef.current?.click()}
          disabled={files.length >= maxFiles}
          title="Attach files"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.txt,.doc,.docx,.js,.ts,.tsx,.jsx,.py,.java,.cpp,.c,.html,.css,.json,.xml,.yaml,.yml,.md,.sql,.sh,.go,.rs,.rb,.exe,.zip"
          onChange={e => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileUpload;
