import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRData } from "./QRGenerator";
import { Download, Copy, Share2 } from "lucide-react";

import QRCode from "qrcode";
import { toast } from "sonner";

interface QRPreviewProps {
  qrData: QRData;
}

export function QRPreview({ qrData }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = useCallback(async () => {
    if (!qrData.content.trim() || !canvasRef.current) return;

    setIsGenerating(true);
    try {
      await QRCode.toCanvas(canvasRef.current, qrData.content, {
        width: qrData.size,
        margin: 2,
        color: {
          dark: qrData.foregroundColor,
          light: qrData.backgroundColor,
        },
        errorCorrectionLevel: qrData.errorCorrectionLevel,
      });

      // Also generate data URL for download
      const dataUrl = await QRCode.toDataURL(qrData.content, {
        width: qrData.size * 2, // Higher resolution for download
        margin: 2,
        color: {
          dark: qrData.foregroundColor,
          light: qrData.backgroundColor,
        },
        errorCorrectionLevel: qrData.errorCorrectionLevel,
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast("Failed to generate QR code. Please check your input.");
    } finally {
      setIsGenerating(false);
    }
  }, [qrData]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement("a");
    link.download = `qrcode-${qrData.type}-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast("QR code has been downloaded successfully.");
  };

  const copyToClipboard = async () => {
    if (!qrCodeDataUrl) return;

    try {
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      toast("QR code copied to clipboard.");
    } catch {
      toast("Failed to copy QR code to clipboard.");
    }
  };

  const shareQRCode = async () => {
    if (!qrCodeDataUrl || !navigator.share) {
      toast("Sharing is not supported on this device.");
      return;
    }

    try {
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();
      const file = new File([blob], `qrcode-${qrData.type}.png`, {
        type: "image/png",
      });

      await navigator.share({
        title: "QR Code",
        text: `Generated QR code for ${qrData.type}`,
        files: [file],
      });
    } catch {
      toast("Failed to share QR code.");
    }
  };

  if (!qrData.content.trim()) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-dashed border-muted-foreground/50 rounded"></div>
        </div>
        <p className="text-muted-foreground">
          Enter content above to generate your QR code
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <div className="text-center">
        <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
          <canvas
            ref={canvasRef}
            className={`max-w-full h-auto ${isGenerating ? "opacity-50" : ""}`}
            style={{ imageRendering: "pixelated" }}
          />
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Info */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="secondary" className="capitalize">
          {qrData.type}
        </Badge>
        <Badge variant="outline">
          {qrData.size}×{qrData.size}px
        </Badge>
        <Badge variant="outline">Level {qrData.errorCorrectionLevel}</Badge>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={downloadQRCode}
          disabled={!qrCodeDataUrl || isGenerating}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PNG
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            disabled={!qrCodeDataUrl || isGenerating}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>

          <Button
            variant="outline"
            onClick={shareQRCode}
            disabled={!qrCodeDataUrl || isGenerating || !navigator.share}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Content Preview */}
      {qrData.content && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Content:</p>
          <p className="text-sm font-mono break-all">
            {qrData.content.length > 100
              ? `${qrData.content.substring(0, 100)}...`
              : qrData.content}
          </p>
        </div>
      )}
    </div>
  );
}
