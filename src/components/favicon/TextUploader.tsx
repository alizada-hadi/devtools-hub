"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface TextUploaderProps {
  text: string;
  setText: (val: string) => void;
  textColor: string;
  setTextColor: (val: string) => void;
  bgColor: string;
  setBgColor: (val: string) => void;
  shape: "rect" | "rounded" | "circle";
  setShape: (val: "rect" | "rounded" | "circle") => void;
  fontFamily: string;
  setFontFamily: (val: string) => void;
}

export const TextUploader: React.FC<TextUploaderProps> = ({
  text,
  setText,
  textColor,
  setTextColor,
  bgColor,
  setBgColor,
  shape,
  setShape,
  fontFamily,
  setFontFamily,
}) => {
  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-0">
          <CardTitle>Text favicon</CardTitle>
          <CardDescription>
            Enter up to two characters, choose a shape, and pick background/text
            colors.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Text Field */}
            <div className="space-y-2">
              <Label htmlFor="text-input">Characters</Label>
              <Input
                id="text-input"
                placeholder="AB"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="max-w-xs"
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground">Max 2 characters</p>
            </div>

            {/* Shape Selector */}
            <div className="space-y-2">
              <Label>Shape</Label>
              <div className="grid grid-cols-3 gap-2 max-w-sm">
                {(["rect", "rounded", "circle"] as const).map((s) => (
                  <Button
                    key={s}
                    variant={shape === s ? "default" : "outline"}
                    onClick={() => setShape(s)}
                    aria-pressed={shape === s}
                    className="w-full"
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <Label htmlFor="font-family">Font</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger id="font-family" className="max-w-xs">
                  <SelectValue placeholder="Choose font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans-serif">Sans-serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="monospace">Monospace</SelectItem>
                  <SelectItem value="system-ui">System UI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-14 p-0 border rounded-md"
                  aria-label="Background color picker"
                />
                <span className="text-sm text-muted-foreground">{bgColor}</span>
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-2">
              <Label htmlFor="text-color">Text color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-10 w-14 p-0 border rounded-md"
                  aria-label="Text color picker"
                />
                <span className="text-sm text-muted-foreground">
                  {textColor}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
