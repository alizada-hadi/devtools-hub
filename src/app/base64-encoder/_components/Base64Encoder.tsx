"use client";

import React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Download,
  Upload,
  RotateCcw,
  ArrowUpDown,
  SearchCode,
} from "lucide-react";
import { toast } from "sonner";

export default function Base64Encoder() {
  const [textInput, setTextInput] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [encodedResult, setEncodedResult] = useState("");
  const [decodedResult, setDecodedResult] = useState("");
  const [activeTab, setActiveTab] = useState("encode");

  const encodeToBase64 = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(textInput)));
      setEncodedResult(encoded);
      toast("Encoded successfully");
    } catch {
      toast.error("Encoding failed");
    }
  };

  const decodeFromBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setDecodedResult(decoded);
      toast("Decoded successfully");
    } catch {
      toast.error("Decoding failed");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast(`File ${filename} has been downloaded`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (activeTab === "encode") {
          setTextInput(content);
        } else {
          setBase64Input(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setTextInput("");
    setBase64Input("");
    setEncodedResult("");
    setDecodedResult("");
    toast("All fields have been cleared");
  };

  const swapContent = () => {
    if (activeTab === "encode" && encodedResult) {
      setBase64Input(encodedResult);
      setDecodedResult("");
      setActiveTab("decode");
    } else if (activeTab === "decode" && decodedResult) {
      setTextInput(decodedResult);
      setEncodedResult("");
      setActiveTab("encode");
    }
  };

  return (
    <>
      <div className="container mx-auto p-6 space-y-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <SearchCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Base64 Encoder/Decoder
              </h1>
              <p className="text-muted-foreground">
                Encode text to Base64 or decode Base64 back to readable text.
                Perfect for data encoding, URL safe strings, and API
                integrations.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid w-64 grid-cols-2">
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={swapContent}
                  disabled={!encodedResult && !decodedResult}
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Swap
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>

            <TabsContent value="encode" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Text to Base64
                    <Badge variant="secondary">Encode</Badge>
                  </CardTitle>
                  <CardDescription>
                    Enter your text below to encode it to Base64 format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Input Text</label>
                      <div className="flex gap-2">
                        <label htmlFor="encode-file-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload File
                            </span>
                          </Button>
                        </label>
                        <input
                          id="encode-file-upload"
                          type="file"
                          accept=".txt,.json,.xml,.csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <Textarea
                      placeholder="Enter text to encode..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="min-h-32 font-mono"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{textInput.length} characters</span>
                      <span>{new Blob([textInput]).size} bytes</span>
                    </div>
                  </div>

                  <Button
                    onClick={encodeToBase64}
                    disabled={!textInput}
                    className="w-full"
                  >
                    Encode to Base64
                  </Button>

                  {encodedResult && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">
                          Base64 Result
                        </label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(encodedResult)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadAsFile(encodedResult, "encoded.txt")
                            }
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={encodedResult}
                        readOnly
                        className="min-h-32 font-mono bg-muted"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{encodedResult.length} characters</span>
                        <span>{new Blob([encodedResult]).size} bytes</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decode" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Base64 to Text
                    <Badge variant="secondary">Decode</Badge>
                  </CardTitle>
                  <CardDescription>
                    Enter Base64 encoded string below to decode it back to
                    readable text
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        Base64 Input
                      </label>
                      <div className="flex gap-2">
                        <label htmlFor="decode-file-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload File
                            </span>
                          </Button>
                        </label>
                        <input
                          id="decode-file-upload"
                          type="file"
                          accept=".txt,.base64"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <Textarea
                      placeholder="Enter Base64 string to decode..."
                      value={base64Input}
                      onChange={(e) => setBase64Input(e.target.value)}
                      className="min-h-32 font-mono"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{base64Input.length} characters</span>
                      <span>{new Blob([base64Input]).size} bytes</span>
                    </div>
                  </div>

                  <Button
                    onClick={decodeFromBase64}
                    disabled={!base64Input}
                    className="w-full"
                  >
                    Decode from Base64
                  </Button>

                  {decodedResult && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">
                          Decoded Text
                        </label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(decodedResult)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadAsFile(decodedResult, "decoded.txt")
                            }
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={decodedResult}
                        readOnly
                        className="min-h-32 font-mono bg-muted"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{decodedResult.length} characters</span>
                        <span>{new Blob([decodedResult]).size} bytes</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
