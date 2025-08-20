"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileImage, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

export function ImageUploader({
  file,
  setFile,
  previewUrl,
  setPreviewUrl,
}: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) startUpload(uploadedFile);
  };

  // Handle drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const uploadedFile = e.dataTransfer.files?.[0];
    if (uploadedFile) startUpload(uploadedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => setIsDragActive(false);

  // Upload simulation (replace with real API call if needed)
  const startUpload = (uploadedFile: File) => {
    setUploading(true);
    setProgress(0);

    // Set file and preview immediately so the preview UI (with progress) renders during upload
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile));

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);

          toast("Image Uploaded Successfully");

          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  // Remove file
  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {!file ? (
        // Upload Card
        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-200 cursor-pointer",
            "hover:border-primary/50 hover:bg-primary/5",
            isDragActive && "border-primary bg-primary/10",
            "bg-muted/30"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <div
                className={cn(
                  "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors",
                  isDragActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Upload className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-medium mb-2">
                {isDragActive ? "Drop your image here" : "Upload your image"}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your image file here, or click to browse
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="secondary" className="text-xs">
                  PNG
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  JPG
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  SVG
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Max 10MB
                </Badge>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleFileSelect}
              />

              <Button asChild variant="outline" className="w-full max-w-xs">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileImage className="w-4 h-4 mr-2" />
                  Choose File
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // File Preview
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={previewUrl || ""}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{file.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {file.type}
                </p>

                {uploading ? (
                  <div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploading... {progress}%
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Ready to generate
                    </span>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
