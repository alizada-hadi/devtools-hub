"use client";

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
  Globe,
  Link,
  Unlink,
} from "lucide-react";
import { toast } from "sonner";

export default function URLEncoder() {
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [encodedResult, setEncodedResult] = useState("");
  const [decodedResult, setDecodedResult] = useState("");
  const [activeTab, setActiveTab] = useState("encode");

  const encodeURL = () => {
    try {
      const encoded = encodeURIComponent(textInput);
      setEncodedResult(encoded);
      toast("Encoded successfully");
    } catch {
      toast("Encoding failed");
    }
  };

  const decodeURL = () => {
    try {
      const decoded = decodeURIComponent(urlInput);
      setDecodedResult(decoded);
      toast("Decoded successfully");
    } catch {
      toast("Decoding failed");
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
          setUrlInput(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setTextInput("");
    setUrlInput("");
    setEncodedResult("");
    setDecodedResult("");
    toast("All fields have been cleared");
  };

  const swapContent = () => {
    if (activeTab === "encode" && encodedResult) {
      setUrlInput(encodedResult);
      setDecodedResult("");
      setActiveTab("decode");
    } else if (activeTab === "decode" && decodedResult) {
      setTextInput(decodedResult);
      setEncodedResult("");
      setActiveTab("encode");
    }
  };

  const loadExample = (type: "encode" | "decode") => {
    if (type === "encode") {
      setTextInput("Hello World! How are you? #awesome @user");
      setActiveTab("encode");
    } else {
      setUrlInput(
        "Hello%20World%21%20How%20are%20you%3F%20%23awesome%20%40user"
      );
      setActiveTab("decode");
    }
  };

  return (
    <>
      <div className="container mx-auto p-6 space-y-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Unlink className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                URL Encoder/Decoder
              </h1>
              <p className="text-muted-foreground">
                Encode text for safe URL transmission or decode URL-encoded
                strings back to readable text. Essential for web development,
                API parameters, and form data handling.
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
                    <Globe className="w-5 h-5" />
                    Text to URL Encoded
                    <Badge variant="secondary">Encode</Badge>
                  </CardTitle>
                  <CardDescription>
                    Convert text into URL-safe format by encoding special
                    characters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Input Text</label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadExample("encode")}
                        >
                          Load Example
                        </Button>
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
                      placeholder="Enter text to URL encode... (e.g., Hello World! @user #tag)"
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
                    onClick={encodeURL}
                    disabled={!textInput}
                    className="w-full"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Encode to URL Format
                  </Button>

                  {encodedResult && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">
                          URL Encoded Result
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
                              downloadAsFile(encodedResult, "url-encoded.txt")
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
                    <Globe className="w-5 h-5" />
                    URL Encoded to Text
                    <Badge variant="secondary">Decode</Badge>
                  </CardTitle>
                  <CardDescription>
                    Convert URL-encoded strings back to readable text
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        URL Encoded Input
                      </label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadExample("decode")}
                        >
                          Load Example
                        </Button>
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
                          accept=".txt,.url"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <Textarea
                      placeholder="Enter URL encoded string to decode... (e.g., Hello%20World%21)"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="min-h-32 font-mono"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{urlInput.length} characters</span>
                      <span>{new Blob([urlInput]).size} bytes</span>
                    </div>
                  </div>

                  <Button
                    onClick={decodeURL}
                    disabled={!urlInput}
                    className="w-full"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Decode from URL Format
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
                              downloadAsFile(decodedResult, "url-decoded.txt")
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

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">
                    Common URL Encodings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-mono">Space</span>
                        <span className="font-mono text-muted-foreground">
                          %20
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">!</span>
                        <span className="font-mono text-muted-foreground">
                          %21
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">#</span>
                        <span className="font-mono text-muted-foreground">
                          %23
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">@</span>
                        <span className="font-mono text-muted-foreground">
                          %40
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-mono">?</span>
                        <span className="font-mono text-muted-foreground">
                          %3F
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">&</span>
                        <span className="font-mono text-muted-foreground">
                          %26
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">=</span>
                        <span className="font-mono text-muted-foreground">
                          %3D
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">+</span>
                        <span className="font-mono text-muted-foreground">
                          %2B
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
