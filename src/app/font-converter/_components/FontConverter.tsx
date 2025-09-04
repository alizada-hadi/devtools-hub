/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/_components/FontConverter.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { FileText } from "lucide-react";
import { FontUploader } from "./FontUploader";
import { FormatSelector } from "./FormatSelector";
import { ConversionResults } from "./ConversionResults";

export default function FontConverter() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    "woff",
    "woff2",
  ]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<
    Array<{ format: string; url: string; size: string }>
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setConvertedFiles([]); // Clear previous results
    setErrorMessage(null); // Clear previous errors
  };

  const handleConvert = async () => {
    if (!uploadedFile) {
      setErrorMessage("Please upload a font file");
      return;
    }

    setIsConverting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("formats", JSON.stringify(selectedFormats));

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Conversion failed");
      }

      const { results } = await response.json();
      console.log("API results:", results);

      const mimeMap: { [key: string]: string } = {
        ttf: "font/ttf",
        woff: "font/woff",
        woff2: "font/woff2",
        eot: "application/vnd.ms-fontobject",
        svg: "image/svg+xml",
      };

      const converted = results.map(
        (r: { format: string; base64: string; size: string }) => {
          const lowerFormat = r.format.toLowerCase();
          const blob = base64ToBlob(r.base64, mimeMap[lowerFormat]);
          return {
            format: r.format,
            url: URL.createObjectURL(blob),
            size: r.size,
          };
        }
      );

      setConvertedFiles(converted);
      if (converted.length < selectedFormats.length) {
        const failedFormats = selectedFormats.filter(
          (f) =>
            !converted.some(
              (c: any) => c.format.toLowerCase() === f.toLowerCase()
            )
        );
        setErrorMessage(
          `Some formats failed to convert: ${failedFormats.join(", ")}`
        );
      }
    } catch (error) {
      console.error("Conversion error:", error);
      setErrorMessage((error as Error).message || "Failed to convert font");
    } finally {
      setIsConverting(false);
    }
  };

  function base64ToBlob(base64: string, mime: string) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime || "application/octet-stream" });
  }

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Font Converter
              </h1>
              <p className="text-muted-foreground">
                Convert your fonts to modern web formats like WOFF, WOFF2, and
                more
              </p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Upload Font</CardTitle>
                <CardDescription>
                  Upload your TTF, OTF, or WOFF font file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FontUploader onFileUpload={handleFileUpload} />
                {uploadedFile && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">
                        {uploadedFile.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Format Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Select Formats</CardTitle>
                <CardDescription>
                  Choose output formats for conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormatSelector
                  selectedFormats={selectedFormats}
                  onFormatChange={setSelectedFormats}
                  onConvert={handleConvert}
                  isConverting={isConverting}
                  hasFile={!!uploadedFile}
                />
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Download Results</CardTitle>
                <CardDescription>Your converted font files</CardDescription>
              </CardHeader>
              <CardContent>
                <ConversionResults
                  files={convertedFiles}
                  isConverting={isConverting}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">TTF</h4>
                  <p className="text-xs text-muted-foreground">
                    TrueType Font - standard format
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">WOFF</h4>
                  <p className="text-xs text-muted-foreground">
                    Web Open Font Format - widely supported
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">WOFF2</h4>
                  <p className="text-xs text-muted-foreground">
                    Better compression, modern browsers
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">EOT</h4>
                  <p className="text-xs text-muted-foreground">
                    Embedded OpenType for IE support
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">SVG</h4>
                  <p className="text-xs text-muted-foreground">
                    Scalable Vector Graphics fonts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
