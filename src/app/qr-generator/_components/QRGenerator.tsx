"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QRInputForm } from "./qr-input-form";
import { QRPreview } from "./qr-preview";
import { QRCustomizer } from "./qr-customizer";
import { QrCode, Sparkles, Settings } from "lucide-react";

export interface QRData {
  type: "url" | "text" | "email" | "phone" | "sms" | "wifi";
  content: string;
  size: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  foregroundColor: string;
  backgroundColor: string;
}

export default function QRCodeGenerator() {
  const [qrData, setQRData] = useState<QRData>({
    type: "url",
    content: "",
    size: 256,
    errorCorrectionLevel: "M",
    foregroundColor: "#000000",
    backgroundColor: "#ffffff",
  });

  return (
    <>
      <div className="container mx-auto p-6">
        <div className=" mx-auto">
          {/* Header */}
          <div className=" mb-8">
            <div className="flex items-center  gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                QR Code Generator
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl ">
              Create custom QR codes for URLs, text, contact info, and more.
              Customize colors, size, and error correction for perfect results.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Input & Customization */}
            <div className="space-y-6">
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    QR Code Content
                  </CardTitle>
                  <CardDescription>
                    Choose what type of data you want to encode
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <QRInputForm qrData={qrData} setQRData={setQRData} />
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-lg">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Customization
                  </CardTitle>
                  <CardDescription>
                    Adjust size, colors, and error correction
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <QRCustomizer qrData={qrData} setQRData={setQRData} />
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-primary" />
                    Preview & Download
                  </CardTitle>
                  <CardDescription>
                    Preview your QR code and download when ready
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <QRPreview qrData={qrData} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
