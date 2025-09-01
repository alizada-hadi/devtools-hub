"use client";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Download, Image, Loader2, ArrowRight, FileImage } from "lucide-react";

interface ConvertedImage {
  format: string;
  url: string;
  size: string;
  originalSize: string;
}

interface ConversionResultsProps {
  images: ConvertedImage[];
  isConverting: boolean;
  originalImage: File | null;
}

export function ConversionResults({
  images,
  isConverting,
  originalImage,
}: ConversionResultsProps) {
  if (isConverting) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-6">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Converting your image...</h3>
        <p className="text-muted-foreground">
          This may take a few moments depending on the image size
        </p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 bg-muted rounded-full mb-6">
          <Image className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2 text-muted-foreground">
          No images converted yet
        </h3>
        <p className="text-muted-foreground">
          Upload an image and select a format to begin conversion
        </p>
      </div>
    );
  }

  const handleDownload = (image: ConvertedImage) => {
    // In a real app, this would download the actual converted file
    const link = document.createElement("a");
    link.href = image.url;
    link.download = `converted-image.${image.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Conversion Summary */}
      <div className="flex items-center justify-center gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
          <FileImage className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="text-center">
          <p className="font-medium text-green-800 dark:text-green-200">
            Conversion completed successfully!
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Your image has been converted and is ready for download
          </p>
        </div>
      </div>

      {/* Before & After Comparison */}
      {originalImage && (
        <div className="space-y-4">
          <h4 className="font-semibold">Before & After</h4>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-sm">Original</h5>
                <span className="text-xs text-muted-foreground">
                  {originalImage.name.split(".").pop()?.toUpperCase()}
                </span>
              </div>
              <AspectRatio
                ratio={16 / 9}
                className="bg-muted rounded-lg overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(originalImage)}
                  alt="Original image"
                  className="w-full h-full object-contain"
                />
              </AspectRatio>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {(originalImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="md:hidden flex items-center justify-center py-2">
              <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
            </div>

            {/* Converted */}
            {images.map((image, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-sm">Converted</h5>
                  <span className="text-xs text-muted-foreground">
                    {image.format}
                  </span>
                </div>
                <AspectRatio
                  ratio={16 / 9}
                  className="bg-muted rounded-lg overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt="Converted image"
                    className="w-full h-full object-contain"
                  />
                </AspectRatio>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{image.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Download Results</h4>
          <span className="text-sm text-muted-foreground">
            {images.length} file{images.length !== 1 ? "s" : ""} ready
          </span>
        </div>

        <div className="space-y-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <FileImage className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    converted-image.{image.format.toLowerCase()}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{image.size}</span>
                    <span>•</span>
                    <span className="text-green-600 dark:text-green-400">
                      {(() => {
                        // Parse sizes properly (e.g., "1.5 MB" -> 1.5 * 1024 * 1024)
                        const parseSize = (sizeStr: string): number => {
                          const parts = sizeStr.split(' ');
                          const value = parseFloat(parts[0]);
                          const unit = parts[1];
                          
                          switch (unit) {
                            case 'Bytes': return value;
                            case 'KB': return value * 1024;
                            case 'MB': return value * 1024 * 1024;
                            case 'GB': return value * 1024 * 1024 * 1024;
                            default: return value;
                          }
                        };
                        
                        const originalBytes = parseSize(image.originalSize);
                        const newBytes = parseSize(image.size);
                        const reduction = ((originalBytes - newBytes) / originalBytes) * 100;
                        
                        return reduction > 0 
                          ? `${reduction.toFixed(0)}% smaller`
                          : `${Math.abs(reduction).toFixed(0)}% larger`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(image)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Info Footer */}
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Converted images are processed locally and will be available for
          download for 24 hours
        </p>
      </div>
    </div>
  );
}
