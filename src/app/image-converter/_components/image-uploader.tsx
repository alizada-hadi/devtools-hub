"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Upload, Image, X, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  uploadedImage: File | null;
}

export function ImageUploader({
  onImageUpload,
  uploadedImage,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        processFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setIsUploading(false);
    onImageUpload(file);
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onImageUpload(null as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (uploadedImage && previewUrl) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <AspectRatio
            ratio={16 / 9}
            className="bg-muted rounded-lg overflow-hidden"
          >
            <img
              src={previewUrl}
              alt="Uploaded image"
              className="w-full h-full object-contain"
            />
          </AspectRatio>
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="p-2 bg-primary/10 rounded">
            <FileImage className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{uploadedImage.name}</p>
            <p className="text-xs text-muted-foreground">
              {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
              <Upload className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Uploading image...</p>
              <Progress
                value={uploadProgress}
                className="w-full max-w-xs mx-auto"
              />
              <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-full w-fit mx-auto">
              <Image className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">
                {isDragging
                  ? "Drop your image here"
                  : "Drag & drop an image or click to browse"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PNG, JPG, WebP, GIF, BMP files up to 10MB
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
