// src/components/pwa-generator/IconUploader.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon, Download, Check } from "lucide-react";
import { PWAConfig } from "./PWAGenerator";
import JSZip from "jszip";
import { generateManifest } from "./manifest-preview";
import Image from "next/image";
import { toast } from "sonner";

interface IconUploaderProps {
  config: PWAConfig;
  onUpdate: (updates: Partial<PWAConfig>) => void;
}

const PWA_ICON_SIZES = [
  { size: 72, purpose: "any" },
  { size: 96, purpose: "any" },
  { size: 128, purpose: "any" },
  { size: 144, purpose: "any" },
  { size: 152, purpose: "any" },
  { size: 192, purpose: "any" },
  { size: 384, purpose: "any" },
  { size: 512, purpose: "any" },
  { size: 192, purpose: "maskable" },
  { size: 512, purpose: "maskable" },
];

export function IconUploader({ config, onUpdate }: IconUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedIcons, setGeneratedIcons] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast("Invalid file type");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast("File too large");
        return;
      }

      onUpdate({ icon: file });
      generateIcons(file);
    },
    [onUpdate]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        handleFileUpload(imageFile);
      }
    },
    [handleFileUpload]
  );

  const generateIcons = async (file: File) => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedIcons([]);

    try {
      const icons: string[] = [];

      for (let i = 0; i < PWA_ICON_SIZES.length; i++) {
        const iconSize = PWA_ICON_SIZES[i];

        // Simulate processing time
        await new Promise<void>((resolve) => setTimeout(resolve, 200));

        // Create a canvas to resize the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = document.createElement("img");

        await new Promise<string>((resolve) => {
          img.onload = () => {
            canvas.width = iconSize.size;
            canvas.height = iconSize.size;

            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";
              ctx.drawImage(img, 0, 0, iconSize.size, iconSize.size);
            }

            const dataUrl = canvas.toDataURL("image/png");
            icons.push(dataUrl);
            resolve(dataUrl);
          };
          img.src = URL.createObjectURL(file);
        });

        setProgress(((i + 1) / PWA_ICON_SIZES.length) * 100);
      }

      setGeneratedIcons(icons);
      toast("Icons generated successfully!");
    } catch (error) {
      console.error("Error generating icons:", error);
      toast("Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAllIcons = async () => {
    const zip = new JSZip();
    const iconsFolder = zip.folder("icons");

    try {
      // Add generated icons to the ZIP
      for (let i = 0; i < generatedIcons.length; i++) {
        const iconData = PWA_ICON_SIZES[i];
        const iconUrl = generatedIcons[i];
        const response = await fetch(iconUrl);
        const blob = await response.blob();
        const fileName = `icon-${iconData.size}x${iconData.size}-${iconData.purpose}.png`;
        iconsFolder?.file(fileName, blob);
      }

      // Add manifest.json to the ZIP
      const manifestContent = generateManifest(config);
      zip.file("manifest.json", manifestContent);

      // Generate and download the ZIP
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${(
        config.shortName || "pwa"
      ).toLowerCase()}-pwa-assets.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast("Download successful");
    } catch (error) {
      console.error("Error creating ZIP:", error);
      toast("Download failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          {config.icon ? (
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border shadow-sm">
                <Image
                  src={URL.createObjectURL(config.icon)}
                  alt="Uploaded icon"
                  className="w-full h-full object-cover"
                  width={96} // w-24 = 96px
                  height={96} // h-24 = 96px
                />
              </div>
              <div>
                <p className="font-medium">{config.icon.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(config.icon.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Different Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">Upload App Icon</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Drop your image here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 512x512px or larger, PNG format
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        className="hidden"
      />

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Generating PWA Icons...
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Creating icons in multiple sizes for different devices and
                purposes
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Icons Preview */}
      {generatedIcons.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <h3 className="font-medium">Generated Icons</h3>
                <Badge variant="secondary">{generatedIcons.length} icons</Badge>
              </div>
              <Button onClick={downloadAllIcons} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {PWA_ICON_SIZES.map((iconData, index) => (
                <div
                  key={`${iconData.size}-${iconData.purpose}`}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden border shadow-sm mb-2">
                    {generatedIcons[index] && (
                      <Image
                        src={generatedIcons[index]}
                        alt={`${iconData.size}x${iconData.size}`}
                        className="w-full h-full object-cover"
                        width={iconData.size} // Use actual icon size
                        height={iconData.size} // Use actual icon size
                      />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {iconData.size}×{iconData.size}
                    {iconData.purpose === "maskable" && (
                      <Badge variant="outline" className="ml-1 text-xs">
                        M
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <Badge variant="outline" className="mr-2">
                  M
                </Badge>
                indicates maskable icons for adaptive display on different
                devices
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
