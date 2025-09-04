"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUploader } from "./image-uploader";
import { FormatSelector } from "./format-selector";
import { ImageSettings } from "./image-settings";
import { ConversionResults } from "./conversion-result";
import { Image as ImageIcon } from "lucide-react";

interface ConvertedImage {
  format: string;
  url: string;
  size: string;
  originalSize: string;
}

export default function ImageConverter() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [quality, setQuality] = useState<number>(90);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setConvertedImages([]);
  };

  const convertImage = async (
    file: File,
    format: string,
    quality: number,
    maxWidth?: number | null,
    maxHeight?: number | null
  ): Promise<{ blob: Blob; canvas: HTMLCanvasElement }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        let { width, height } = img;

        // Apply resize if specified
        if (maxWidth || maxHeight) {
          const aspectRatio = width / height;

          if (maxWidth && maxHeight) {
            // Fit within both constraints
            if (width > maxWidth || height > maxHeight) {
              if (width / maxWidth > height / maxHeight) {
                width = maxWidth;
                height = width / aspectRatio;
              } else {
                height = maxHeight;
                width = height * aspectRatio;
              }
            }
          } else if (maxWidth && width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          } else if (maxHeight && height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw the resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to the desired format
        const mimeType =
          format === "jpeg"
            ? "image/jpeg"
            : format === "png"
            ? "image/png"
            : format === "webp"
            ? "image/webp"
            : format === "gif"
            ? "image/gif"
            : format === "bmp"
            ? "image/bmp"
            : "image/png";

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, canvas });
            } else {
              reject(new Error("Failed to convert image"));
            }
          },
          mimeType,
          quality / 100
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleConvert = async () => {
    if (!uploadedImage || !selectedFormat) return;

    setIsConverting(true);

    try {
      const { blob } = await convertImage(
        uploadedImage,
        selectedFormat,
        quality,
        maxWidth,
        maxHeight
      );

      const convertedUrl = URL.createObjectURL(blob);
      const originalSize = formatBytes(uploadedImage.size);
      const newSize = formatBytes(blob.size);

      const result: ConvertedImage = {
        format: selectedFormat.toUpperCase(),
        url: convertedUrl,
        size: newSize,
        originalSize: originalSize,
      };

      setConvertedImages([result]);
    } catch (error) {
      console.error("Conversion failed:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Image Converter
            </h1>
            <p className="text-muted-foreground mt-1">
              Convert images between different formats and explore image
              variations
            </p>
          </div>
        </div>

        {/* Main Conversion Interface */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                Upload Image
              </CardTitle>
              <CardDescription>
                Select an image file to convert (PNG, JPG, WebP, GIF, BMP)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
              />
            </CardContent>
          </Card>

          {/* Format & Settings Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    2
                  </span>
                  Choose Format
                </CardTitle>
                <CardDescription>
                  Select the output format for your image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormatSelector
                  selectedFormat={selectedFormat}
                  onFormatChange={setSelectedFormat}
                  onConvert={handleConvert}
                  canConvert={
                    !!uploadedImage && !!selectedFormat && !isConverting
                  }
                  isConverting={isConverting}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Settings</CardTitle>
                <CardDescription>
                  Adjust quality and resize options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageSettings
                  quality={quality}
                  onQualityChange={setQuality}
                  maxWidth={maxWidth}
                  maxHeight={maxHeight}
                  onMaxWidthChange={setMaxWidth}
                  onMaxHeightChange={setMaxHeight}
                  uploadedImage={uploadedImage}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                3
              </span>
              Download Results
            </CardTitle>
            <CardDescription>
              Your converted images are ready for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConversionResults
              images={convertedImages}
              isConverting={isConverting}
              originalImage={uploadedImage}
            />
          </CardContent>
        </Card>

        {/* Supported Formats Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Supported Formats</CardTitle>
            <CardDescription>
              Convert between these popular image formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  format: "JPEG",
                  description: "Best for photos with small file sizes",
                },
                {
                  format: "PNG",
                  description: "Best for images with transparency",
                },
                {
                  format: "WebP",
                  description: "Modern format with excellent compression",
                },
                {
                  format: "GIF",
                  description: "Best for simple animations and graphics",
                },
              ].map((item) => (
                <div key={item.format} className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-1">{item.format}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
