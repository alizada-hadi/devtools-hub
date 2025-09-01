// src/components/pwa-generator/ManifestPreview.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, FileCode, Smartphone, Globe } from "lucide-react";

import { PWAConfig } from "./PWAGenerator";
import { toast } from "sonner";

interface ManifestPreviewProps {
  config: PWAConfig;
}

// Export the generateManifest function for reuse
export function generateManifest(config: PWAConfig) {
  const manifest = {
    name: config.name || "My App",
    short_name: config.shortName || "App",
    description: config.description || "A Progressive Web App",
    start_url: config.startUrl || "/",
    display: config.display || "standalone",
    orientation: config.orientation || "portrait",
    theme_color: config.themeColor || "#000000",
    background_color: config.backgroundColor || "#ffffff",
    categories: config.categories.length > 0 ? config.categories : undefined,
    icons: [
      {
        src: "icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/icon-192x192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "icons/icon-512x512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };

  return JSON.stringify(manifest, null, 2);
}

export function ManifestPreview({ config }: ManifestPreviewProps) {
  const generateServiceWorker = () => {
    return `// Service Worker for ${config.name || "PWA"}
const CACHE_NAME = '${(config.shortName || "pwa").toLowerCase()}-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});`;
  };

  const generateHTMLSnippet = () => {
    return `<!-- Add to your HTML <head> section -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="${config.themeColor || "#000000"}">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="${config.shortName || "App"}">
<meta name="apple-mobile-web-app-status-bar-style" content="default">

<!-- Add at the end of your <body> section -->
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
</script>`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast("Copied to clipboard");
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const manifestContent = generateManifest(config);
  const serviceWorkerContent = generateServiceWorker();
  const htmlSnippet = generateHTMLSnippet();

  return (
    <div className="space-y-6">
      {/* PWA Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            PWA Readiness Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">App Information</span>
              <Badge
                variant={
                  config.name && config.description ? "default" : "destructive"
                }
              >
                {config.name && config.description ? "Complete" : "Missing"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">App Icon</span>
              <Badge variant={config.icon ? "default" : "destructive"}>
                {config.icon ? "Uploaded" : "Missing"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Theme Colors</span>
              <Badge variant="default">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Display Mode</span>
              <Badge variant="default">Configured</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manifest.json */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="w-5 h-5" />
                manifest.json
              </CardTitle>
              <CardDescription>Web app manifest configuration</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(manifestContent, "Manifest")}
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => downloadFile(manifestContent, "manifest.json")}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={manifestContent}
            readOnly
            className="font-mono text-sm min-h-[200px]"
          />
        </CardContent>
      </Card>

      {/* Service Worker */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                sw.js (Service Worker)
              </CardTitle>
              <CardDescription>
                Basic service worker for offline functionality
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  copyToClipboard(serviceWorkerContent, "Service Worker")
                }
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => downloadFile(serviceWorkerContent, "sw.js")}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={serviceWorkerContent}
            readOnly
            className="font-mono text-sm min-h-[150px]"
          />
        </CardContent>
      </Card>

      {/* HTML Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>HTML Integration</CardTitle>
              <CardDescription>
                Add these snippets to your HTML file
              </CardDescription>
            </div>
            <Button
              onClick={() => copyToClipboard(htmlSnippet, "HTML snippet")}
              variant="outline"
              size="sm"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={htmlSnippet}
            readOnly
            className="font-mono text-sm min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Installation Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Installation Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <p>
                Download all generated files and place them in your web
                app&apos;s root directory
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <p>
                Create an icons folder and place all generated icon files inside
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <p>Add the HTML snippets to your main HTML file</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <p>Test your PWA using browser developer tools and Lighthouse</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
