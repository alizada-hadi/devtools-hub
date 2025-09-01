"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface ImageSettingsProps {
  quality: number;
  onQualityChange: (quality: number) => void;
  maxWidth: number | null;
  maxHeight: number | null;
  onMaxWidthChange: (width: number | null) => void;
  onMaxHeightChange: (height: number | null) => void;
  uploadedImage?: File | null;
}

export function ImageSettings({
  quality,
  onQualityChange,
  maxWidth,
  maxHeight,
  onMaxWidthChange,
  onMaxHeightChange,
  uploadedImage,
}: ImageSettingsProps) {
  const [enableResize, setEnableResize] = useState(false);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState<number | null>(null);

  // Get original image dimensions when image is uploaded
  React.useEffect(() => {
    if (uploadedImage) {
      const img = new window.Image();
      img.onload = () => {
        setOriginalAspectRatio(img.width / img.height);
      };
      img.src = URL.createObjectURL(uploadedImage);
    }
  }, [uploadedImage]);

  const handleResizeToggle = (enabled: boolean) => {
    setEnableResize(enabled);
    if (!enabled) {
      // Clear resize settings when disabled
      onMaxWidthChange(null);
      onMaxHeightChange(null);
    }
  };

  const handleWidthChange = (value: string) => {
    const width = value ? parseInt(value) : null;
    onMaxWidthChange(width);

    // If maintaining aspect ratio and we have the original aspect ratio, calculate new height
    if (maintainAspectRatio && originalAspectRatio && width) {
      onMaxHeightChange(Math.round(width / originalAspectRatio));
    }
  };

  const handleHeightChange = (value: string) => {
    const height = value ? parseInt(value) : null;
    onMaxHeightChange(height);

    // If maintaining aspect ratio and we have the original aspect ratio, calculate new width
    if (maintainAspectRatio && originalAspectRatio && height) {
      onMaxWidthChange(Math.round(height * originalAspectRatio));
    }
  };

  return (
    <div className="space-y-6">
      {/* Quality Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="quality">Image Quality</Label>
          <span className="text-sm text-muted-foreground">{quality}%</span>
        </div>
        <Slider
          id="quality"
          min={10}
          max={100}
          step={5}
          value={[quality]}
          onValueChange={([value]) => onQualityChange(value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Higher quality means larger file size. 90% is recommended for most
          images.
        </p>
      </div>

      {/* Resize Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="resize-toggle">Resize Image</Label>
            <p className="text-sm text-muted-foreground">
              Reduce image dimensions to save space
            </p>
          </div>
          <Switch
            id="resize-toggle"
            checked={enableResize}
            onCheckedChange={handleResizeToggle}
          />
        </div>

        {enableResize && (
          <div className="space-y-4 pl-4 border-l-2 border-muted">
            <div className="flex items-center space-x-2">
              <Switch
                id="aspect-ratio"
                checked={maintainAspectRatio}
                onCheckedChange={setMaintainAspectRatio}
              />
              <Label htmlFor="aspect-ratio" className="text-sm">
                Maintain aspect ratio
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-width">Max Width (px)</Label>
                <Input
                  id="max-width"
                  type="number"
                  placeholder="e.g. 1920"
                  value={maxWidth || ""}
                  onChange={(e) => handleWidthChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-height">Max Height (px)</Label>
                <Input
                  id="max-height"
                  type="number"
                  placeholder="e.g. 1080"
                  value={maxHeight || ""}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  disabled={maintainAspectRatio && !!maxWidth}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Images larger than these dimensions will be resized proportionally
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
