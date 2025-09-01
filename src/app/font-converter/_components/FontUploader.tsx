// src/app/_components/FontUploader.tsx
import { useCallback, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FontUploaderProps {
  onFileUpload: (file: File) => void;
}

export function FontUploader({ onFileUpload }: FontUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const fontFile = files.find(
        (file) =>
          file.type.includes("font") ||
          file.name.match(/\.(ttf|otf|woff|woff2)$/i)
      );

      if (fontFile) {
        onFileUpload(fontFile);
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (
        file &&
        (file.type.includes("font") ||
          file.name.match(/\.(ttf|otf|woff|woff2)$/i))
      ) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "p-3 rounded-full transition-colors",
              isDragging ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <p className="font-medium">
              {isDragging
                ? "Drop your font file here"
                : "Drop font file or click to browse"}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports TTF, OTF, WOFF, WOFF2 (max 10MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
