"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { ColorInput } from "./color-input";
import { ColorPreview } from "./color-preview";
import { ColorFormats } from "./color-formatter";
import { ColorPalette } from "./color-palette";

export interface ColorData {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorConverter() {
  const [colorData, setColorData] = useState<ColorData>({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    hsv: { h: 217, s: 76, v: 96 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 },
  });

  return (
    <>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Color Converter
              </h1>
              <p className="text-muted-foreground mt-1">
                Convert colors between different formats and explore color
                variations
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input and Preview Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Color Input</h2>
              <ColorInput colorData={colorData} onColorChange={setColorData} />
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Color Preview</h2>
              <ColorPreview
                colorData={colorData}
                onColorChange={setColorData}
              />
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Color Formats</h2>
              <ColorFormats colorData={colorData} />
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Color Variations</h2>
              <ColorPalette baseColor={colorData.hex} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
