"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppDetailsForm } from "./app-details-form";
import { IconUploader } from "./IconUploader";
import { ThemeCustomizer } from "./theme-customizer";
import { ManifestPreview } from "./manifest-preview";
import { Smartphone, Palette, FileCode, Upload } from "lucide-react";
import Image from "next/image";

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  display: string;
  orientation: string;
  themeColor: string;
  backgroundColor: string;
  categories: string[];
  icon?: File;
}

export default function PWAGenerator() {
  const [config, setConfig] = useState<PWAConfig>({
    name: "",
    shortName: "",
    description: "",
    startUrl: "/",
    display: "standalone",
    orientation: "portrait",
    themeColor: "#000000",
    backgroundColor: "#ffffff",
    categories: [],
  });

  const updateConfig = (updates: Partial<PWAConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <div className=" mb-8">
          <div className="flex items-center  gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PWA Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl ">
            Create a complete Progressive Web App configuration with icons,
            manifest, and service worker ready for deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  PWA Configuration
                </CardTitle>
                <CardDescription>
                  Configure your Progressive Web App settings and generate all
                  necessary files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                      value="details"
                      className="flex items-center gap-2"
                    >
                      <FileCode className="w-4 h-4" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="icons"
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Icons
                    </TabsTrigger>
                    <TabsTrigger
                      value="theme"
                      className="flex items-center gap-2"
                    >
                      <Palette className="w-4 h-4" />
                      Theme
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="flex items-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-6">
                    <AppDetailsForm config={config} onUpdate={updateConfig} />
                  </TabsContent>

                  <TabsContent value="icons" className="mt-6">
                    <IconUploader config={config} onUpdate={updateConfig} />
                  </TabsContent>

                  <TabsContent value="theme" className="mt-6">
                    <ThemeCustomizer config={config} onUpdate={updateConfig} />
                  </TabsContent>

                  <TabsContent value="preview" className="mt-6">
                    <ManifestPreview config={config} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                  <CardDescription>
                    See how your PWA will appear on mobile devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="bg-background border rounded-lg p-4 space-y-3">
                      {/* App Icon Preview */}
                      <div className="flex items-center justify-center">
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm border"
                          style={{
                            backgroundColor:
                              config.backgroundColor || "#ffffff",
                            color: config.themeColor || "#000000",
                          }}
                        >
                          {config.icon ? (
                            <Image
                              src={URL.createObjectURL(config.icon)}
                              alt="App icon"
                              className="w-full h-full object-cover rounded-xl"
                              width={500}
                              height={500}
                            />
                          ) : (
                            config.shortName?.charAt(0) || "A"
                          )}
                        </div>
                      </div>

                      {/* App Name */}
                      <div className="text-center">
                        <h3 className="font-semibold text-sm truncate">
                          {config.name || "Your App Name"}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {config.description ||
                            "Your app description will appear here"}
                        </p>
                      </div>

                      {/* Install Button Preview */}
                      <div className="pt-2">
                        <div
                          className="w-full py-2 px-3 rounded-lg text-xs font-medium text-center"
                          style={{
                            backgroundColor: config.themeColor || "#000000",
                            color: config.backgroundColor || "#ffffff",
                          }}
                        >
                          Install App
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
