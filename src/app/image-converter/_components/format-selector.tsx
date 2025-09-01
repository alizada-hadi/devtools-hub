"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Download } from "lucide-react";

interface FormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  onConvert: () => void;
  canConvert: boolean;
  isConverting: boolean;
}

const formats = [
  {
    value: "jpeg",
    label: "JPEG",
    description: "Best for photos, smaller file size",
    extension: ".jpg",
  },
  {
    value: "png",
    label: "PNG",
    description: "Best for graphics, supports transparency",
    extension: ".png",
  },
  {
    value: "webp",
    label: "WebP",
    description: "Modern format, excellent compression",
    extension: ".webp",
  },
  {
    value: "gif",
    label: "GIF",
    description: "Best for simple animations",
    extension: ".gif",
  },
  {
    value: "bmp",
    label: "BMP",
    description: "Uncompressed, large file size",
    extension: ".bmp",
  },
];

export function FormatSelector({
  selectedFormat,
  onFormatChange,
  onConvert,
  canConvert,
  isConverting,
}: FormatSelectorProps) {
  return (
    <div className="space-y-6">
      <RadioGroup value={selectedFormat} onValueChange={onFormatChange}>
        <div className="grid gap-3">
          {formats.map((format) => (
            <div key={format.value} className="flex items-center space-x-3">
              <RadioGroupItem value={format.value} id={format.value} />
              <Label
                htmlFor={format.value}
                className="flex-1 cursor-pointer flex justify-between items-center py-2"
              >
                <div>
                  <div className="font-medium">{format.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {format.description}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {format.extension}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      <div className="pt-4 border-t">
        <Button
          onClick={onConvert}
          disabled={!canConvert}
          className="w-full"
          size="lg"
        >
          {isConverting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Converting Image...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Convert Image
            </>
          )}
        </Button>

        {!selectedFormat && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            Please select an output format
          </p>
        )}
      </div>
    </div>
  );
}
