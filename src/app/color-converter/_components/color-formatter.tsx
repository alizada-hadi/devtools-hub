import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Hash,
  Square,
  Percent,
  Palette,
  Camera,
} from "lucide-react";
import { ColorData } from "./ColorConverter";
import { toast } from "sonner";

interface ColorFormatsProps {
  colorData: ColorData;
}

export function ColorFormats({ colorData }: ColorFormatsProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      toast(`${format} color value copied to clipboard`);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      toast("Failed to copy to clipboard");
    }
  };

  const formats = [
    {
      name: "HEX",
      value: colorData.hex.toUpperCase(),
      description: "Hexadecimal notation",
      icon: Hash,
      color: "bg-blue-500",
    },
    {
      name: "RGB",
      value: `rgb(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b})`,
      description: "Red, Green, Blue",
      icon: Square,
      color: "bg-green-500",
    },
    {
      name: "RGBA",
      value: `rgba(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b}, 1)`,
      description: "RGB with Alpha",
      icon: Square,
      color: "bg-green-600",
    },
    {
      name: "HSL",
      value: `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, ${colorData.hsl.l}%)`,
      description: "Hue, Saturation, Lightness",
      icon: Percent,
      color: "bg-purple-500",
    },
    {
      name: "HSLA",
      value: `hsla(${colorData.hsl.h}, ${colorData.hsl.s}%, ${colorData.hsl.l}%, 1)`,
      description: "HSL with Alpha",
      icon: Percent,
      color: "bg-purple-600",
    },
    {
      name: "HSV",
      value: `hsv(${colorData.hsv.h}, ${colorData.hsv.s}%, ${colorData.hsv.v}%)`,
      description: "Hue, Saturation, Value",
      icon: Palette,
      color: "bg-orange-500",
    },
    {
      name: "CMYK",
      value: `cmyk(${colorData.cmyk.c}%, ${colorData.cmyk.m}%, ${colorData.cmyk.y}%, ${colorData.cmyk.k}%)`,
      description: "Cyan, Magenta, Yellow, Black",
      icon: Camera,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="space-y-3">
      {formats.map((format) => (
        <div
          key={format.name}
          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-smooth"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`w-8 h-8 ${format.color} rounded-md flex items-center justify-center flex-shrink-0`}
            >
              <format.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{format.name}</span>
                <Badge variant="outline" className="text-xs">
                  {format.description}
                </Badge>
              </div>
              <div className="font-mono text-sm text-muted-foreground truncate">
                {format.value}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(format.value, format.name)}
            className="flex-shrink-0 ml-2"
          >
            {copiedFormat === format.name ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      ))}

      {/* CSS Custom Properties */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Hash className="w-4 h-4" />
          CSS Custom Properties
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono text-muted-foreground flex-1">
              --primary-color: {colorData.hex};
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  `--primary-color: ${colorData.hex};`,
                  "CSS Custom Property"
                )
              }
            >
              {copiedFormat === "CSS Custom Property" ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
