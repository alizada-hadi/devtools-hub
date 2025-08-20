"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypeSelector } from "@/components/favicon/type-selector";
import { Image as ImageIcon, Type, Smile } from "lucide-react";
import { TextUploader } from "@/components/favicon/TextUploader";
import { EmojiUploader } from "@/components/favicon/EmojiUploader";
import { ImageUploader } from "@/components/favicon/ImageUploader";

// available favicon sizes
const sizes = [16, 32, 48, 64, 128, 256];

export type FaviconType = "image" | "text" | "emoji";

export default function FaviconGenerator() {
  const [selectedType, setSelectedType] = useState<FaviconType>("image");
  const [isGenerating, setIsGenerating] = useState(false);

  // state for image mode
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // state for text mode
  const [text, setText] = useState("H");
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [shape, setShape] = useState<"rect" | "rounded" | "circle">("rect");
  const [fontFamily, setFontFamily] = useState("sans-serif");

  // state for emoji mode
  const [emoji, setEmoji] = useState("😀");
  const [emojiSearch, setEmojiSearch] = useState("");

  // Core favicon renderer
  const drawFavicon = useCallback(
    async (size: number): Promise<Blob> => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      // Apply shape clip for text mode
      if (selectedType === "text") {
        ctx.beginPath();
        if (shape === "circle") {
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        } else if (shape === "rounded") {
          const r = size * 0.2;
          ctx.moveTo(r, 0);
          ctx.lineTo(size - r, 0);
          ctx.quadraticCurveTo(size, 0, size, r);
          ctx.lineTo(size, size - r);
          ctx.quadraticCurveTo(size, size, size - r, size);
          ctx.lineTo(r, size);
          ctx.quadraticCurveTo(0, size, 0, size - r);
          ctx.lineTo(0, r);
          ctx.quadraticCurveTo(0, 0, r, 0);
        } else {
          ctx.rect(0, 0, size, size);
        }
        ctx.closePath();
        ctx.clip();
      }

      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      if (selectedType === "image" && preview) {
        const img = document.createElement("img");
        img.src = preview;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = (e) => reject(e);
        });
        ctx.drawImage(img, 0, 0, size, size);
      }

      if (selectedType === "text") {
        ctx.fillStyle = textColor;
        ctx.font = `${Math.floor(size * 0.65)}px ${fontFamily}`;
        ctx.textAlign = "center";

        const metrics = ctx.measureText(text);
        const ascent = metrics.actualBoundingBoxAscent;
        const descent = metrics.actualBoundingBoxDescent;
        const hasMetrics =
          Number.isFinite(ascent) &&
          Number.isFinite(descent) &&
          ascent + descent > 0;

        if (hasMetrics) {
          const y = (size - (ascent + descent)) / 2 + ascent;
          ctx.textBaseline = "alphabetic";
          ctx.fillText(text, size / 2, y);
        } else {
          ctx.textBaseline = "middle";
          ctx.fillText(text, size / 2, size / 2);
        }
      }

      if (selectedType === "emoji") {
        const fontSize = size * 0.8;
        ctx.font = `${fontSize}px serif`;
        ctx.textAlign = "center";

        const metrics = ctx.measureText(emoji);
        const ascent = metrics.actualBoundingBoxAscent;
        const descent = metrics.actualBoundingBoxDescent;
        const hasMetrics =
          Number.isFinite(ascent) &&
          Number.isFinite(descent) &&
          ascent + descent > 0;

        if (hasMetrics) {
          // Center using precise text metrics
          const y = (size - (ascent + descent)) / 2 + ascent;
          ctx.textBaseline = "alphabetic";
          ctx.fillText(emoji, size / 2, y);
        } else {
          // Fallback: approximate centering
          ctx.textBaseline = "middle";
          ctx.fillText(emoji, size / 2, size / 2);
        }
      }

      return new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });
    },
    [selectedType, shape, bgColor, preview, text, textColor, emoji, fontFamily]
  );

  // Determine if generation is allowed based on current inputs
  const canGenerate =
    selectedType === "image"
      ? Boolean(preview)
      : selectedType === "text"
      ? text.trim().length > 0
      : selectedType === "emoji"
      ? emoji.trim().length > 0
      : false;

  // ZIP generator
  const generateFavicons = async () => {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    try {
      const zip = new JSZip();
      for (const size of sizes) {
        const blob = await drawFavicon(size);
        zip.file(`favicon-${size}x${size}.png`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "favicons.zip");
    } finally {
      setIsGenerating(false);
    }
  };

  // update live preview
  const previewRef32 = useRef<HTMLCanvasElement | null>(null);
  const previewRef64 = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const updatePreview = async () => {
      for (const [ref, size] of [
        [previewRef32, 32],
        [previewRef64, 64],
      ] as const) {
        if (ref.current) {
          const blob = await drawFavicon(size);
          const img = document.createElement("img");
          img.src = URL.createObjectURL(blob);
          img.onload = () => {
            const ctx = ref.current!.getContext("2d")!;
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
          };
        }
      }
    };
    updatePreview();
  }, [drawFavicon]);

  const faviconTypes = [
    {
      id: "image" as FaviconType,
      title: "Image",
      description: "Upload your own image",
      icon: ImageIcon,
      popular: true,
    },
    {
      id: "text" as FaviconType,
      title: "Text",
      description: "Create from text/letters",
      icon: Type,
      popular: false,
    },
    {
      id: "emoji" as FaviconType,
      title: "Emoji",
      description: "Use any emoji character",
      icon: Smile,
      popular: true,
    },
  ];

  return (
    <>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              style={{ backgroundImage: "var(--gradient-primary)" }}
              className="w-10 h-10 rounded-lg bg-[var(--gradient-primary)] flex items-center justify-center"
            >
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1
                style={{ backgroundImage: "var(--gradient-primary)" }}
                className="text-3xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent"
              >
                Favicon Generator
              </h1>
              <p className="text-muted-foreground">
                Create beautiful favicons for your website in seconds
              </p>
            </div>
          </div>
        </div>

        {/* Type Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose favicon type</h2>
          <TypeSelector
            types={faviconTypes}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>

        {/* Main Content */}
        <Card className="shadow-card border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const selectedTypeData = faviconTypes.find(
                  (type) => type.id === selectedType
                );
                if (selectedTypeData) {
                  const Icon = selectedTypeData.icon;
                  return <Icon className="w-5 h-5 text-primary" />;
                }
                return null;
              })()}
              {selectedType === "image" && "Upload Image"}
              {selectedType === "text" && "Create Text Favicon"}
              {selectedType === "emoji" && "Choose Emoji"}
            </CardTitle>
            <CardDescription>
              {selectedType === "image" &&
                "Upload an image file to generate your favicon. Supports PNG, JPG, and SVG formats."}
              {selectedType === "text" &&
                "Enter text or letters to create a custom text-based favicon."}
              {selectedType === "emoji" &&
                "Select or paste an emoji to use as your favicon."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image */}
            {selectedType === "image" && (
              <ImageUploader
                file={file}
                setFile={setFile}
                setPreviewUrl={setPreview}
                previewUrl={preview}
              />
            )}

            {/* Text */}
            {selectedType === "text" && (
              <TextUploader
                text={text}
                setText={setText}
                textColor={textColor}
                setTextColor={setTextColor}
                bgColor={bgColor}
                setBgColor={setBgColor}
                shape={shape}
                setShape={setShape}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
              />
            )}

            {/* Emoji */}
            {selectedType === "emoji" && (
              <EmojiUploader
                emoji={emoji}
                setEmoji={setEmoji}
                search={emojiSearch}
                setSearch={setEmojiSearch}
              />
            )}

            {/* Preview */}
            <div className="text-center space-y-2">
              <div className="flex gap-6 justify-center mt-1">
                {/* <canvas
                  ref={previewRef32}
                  width={32}
                  height={32}
                  className="border rounded"
                /> */}
                <canvas
                  ref={previewRef64}
                  width={64}
                  height={64}
                  className="border rounded"
                />
              </div>
            </div>

            <Button
              onClick={generateFavicons}
              className="w-full"
              disabled={!canGenerate || isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate & Download ZIP"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
