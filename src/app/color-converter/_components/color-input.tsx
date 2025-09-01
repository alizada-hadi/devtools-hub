import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColorData } from "./ColorConverter";
import { Eye, Hash, Percent, Square } from "lucide-react";

interface ColorInputProps {
  colorData: ColorData;
  onColorChange: (color: ColorData) => void;
}

export function ColorInput({ colorData, onColorChange }: ColorInputProps) {
  const [inputValue, setInputValue] = useState(colorData.hex);
  const [inputFormat, setInputFormat] = useState<string>("auto");

  const convertColor = (input: string): ColorData | null => {
    const cleanInput = input.trim().toLowerCase();

    // Hex color
    const hexMatch = cleanInput.match(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i);
    if (hexMatch) {
      const hex =
        hexMatch[1].length === 3
          ? hexMatch[1]
              .split("")
              .map((c) => c + c)
              .join("")
          : hexMatch[1];

      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      return convertFromRGB(r, g, b);
    }

    // RGB color
    const rgbMatch = cleanInput.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
    );
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return convertFromRGB(r, g, b);
    }

    // HSL color
    const hslMatch = cleanInput.match(
      /hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/
    );
    if (hslMatch) {
      const h = parseInt(hslMatch[1]);
      const s = parseInt(hslMatch[2]);
      const l = parseInt(hslMatch[3]);
      return convertFromHSL(h, s, l);
    }

    return null;
  };

  const convertFromRGB = (r: number, g: number, b: number): ColorData => {
    const hex = `#${[r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")}`;

    // Convert to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const diff = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / diff + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / diff + 4;
          break;
      }
      h /= 6;
    }

    // Convert to HSV
    const v = max;
    const sHsv = max === 0 ? 0 : diff / max;

    // Convert to CMYK
    const k = 1 - max;
    const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);

    return {
      hex,
      rgb: { r, g, b },
      hsl: {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
      },
      hsv: {
        h: Math.round(h * 360),
        s: Math.round(sHsv * 100),
        v: Math.round(v * 100),
      },
      cmyk: {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100),
      },
    };
  };

  const convertFromHSL = (h: number, s: number, l: number): ColorData => {
    const sNorm = s / 100;
    const lNorm = l / 100;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;

    let rNorm = 0,
      gNorm = 0,
      bNorm = 0;

    if (h >= 0 && h < 60) {
      rNorm = c;
      gNorm = x;
      bNorm = 0;
    } else if (h >= 60 && h < 120) {
      rNorm = x;
      gNorm = c;
      bNorm = 0;
    } else if (h >= 120 && h < 180) {
      rNorm = 0;
      gNorm = c;
      bNorm = x;
    } else if (h >= 180 && h < 240) {
      rNorm = 0;
      gNorm = x;
      bNorm = c;
    } else if (h >= 240 && h < 300) {
      rNorm = x;
      gNorm = 0;
      bNorm = c;
    } else if (h >= 300 && h < 360) {
      rNorm = c;
      gNorm = 0;
      bNorm = x;
    }

    const r = Math.round((rNorm + m) * 255);
    const g = Math.round((gNorm + m) * 255);
    const b = Math.round((bNorm + m) * 255);

    return convertFromRGB(r, g, b);
  };

  const handleConvert = () => {
    const result = convertColor(inputValue);
    if (result) {
      onColorChange(result);
      setInputFormat(detectFormat(inputValue));
    }
  };

  const detectFormat = (input: string): string => {
    const cleanInput = input.trim().toLowerCase();
    if (
      cleanInput.match(/^#?[a-f0-9]{6}$/i) ||
      cleanInput.match(/^#?[a-f0-9]{3}$/i)
    )
      return "hex";
    if (cleanInput.includes("rgb")) return "rgb";
    if (cleanInput.includes("hsl")) return "hsl";
    return "unknown";
  };

  const formatExamples = [
    { format: "HEX", example: "#3b82f6", icon: Hash },
    { format: "RGB", example: "rgb(59, 130, 246)", icon: Square },
    { format: "HSL", example: "hsl(217, 91%, 60%)", icon: Percent },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="color-input">Enter Color Value</Label>
        <div className="flex gap-2">
          <Input
            id="color-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter color (e.g., #3b82f6, rgb(59, 130, 246))"
            className="flex-1"
          />
          <Button onClick={handleConvert} size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Convert
          </Button>
        </div>
        {inputFormat !== "auto" && (
          <Badge variant="secondary" className="w-fit">
            Detected: {inputFormat.toUpperCase()}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Supported Formats
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {formatExamples.map(({ format, example, icon: Icon }) => (
            <div
              key={format}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{format}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {example}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
