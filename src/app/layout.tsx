import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { Footer } from "@/components/footer";
import { ModeToggle } from "@/components/theme-switcher";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO Configuration
const siteName = "devtoolskits";
const siteDescription =
  "All your essential development tools in one place. Generate QR codes, convert images, create PWAs, and more. Fast, reliable, and always free.";
const siteUrl = "https://devtoolskits.vercel.app"; // Replace with your actual domain
const siteImage = "/images/dev-banner.jpeg";
const siteLogo = "/images/dev-logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "development tools",
    "web tools",
    "qr code generator",
    "image converter",
    "pwa generator",
    "favicon generator",
    "color converter",
    "font converter",
    "form generator",
    "base64 encoder",
    "url encoder",
    "jwt decoder",
    "developer utilities",
    "free tools",
    "online tools",
  ],
  authors: [{ name: "devtoolskits Team" }],
  creator: "devtoolskits",
  publisher: "devtoolskits",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: `${siteName} - All your essential development tools in one place`,
      },
      {
        url: siteLogo,
        width: 512,
        height: 512,
        alt: `${siteName} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [siteImage],
    creator: "@devtoolskits", // Replace with your actual Twitter handle
    site: "@devtoolskits", // Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with your actual Google Search Console verification code
    yandex: "your-yandex-verification-code", // Replace with your actual Yandex verification code
    yahoo: "your-yahoo-verification-code", // Replace with your actual Yahoo verification code
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
  classification: "Development Tools",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": siteName,
    "application-name": siteName,
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#000000",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    image: `${siteUrl}${siteImage}`,
    logo: `${siteUrl}${siteLogo}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "devtoolskits Team",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "devtoolskits",
      url: siteUrl,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    featureList: [
      "QR Code Generator",
      "Image Converter",
      "PWA Generator",
      "Favicon Generator",
      "Color Converter",
      "Font Converter",
      "Form Generator",
      "Base64 Encoder/Decoder",
      "URL Encoder/Decoder",
      "JWT Decoder",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta
          name="google-site-verification"
          content="your-google-verification-code"
        />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
              <AppSidebar />

              <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
                  <div className="flex items-center justify-between h-full px-6">
                    <div className="flex items-center gap-4">
                      <SidebarTrigger />
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                          devtoolskits
                        </h1>
                        <span className="text-xs bg-primary/10 text-foreground px-2 py-1 rounded-full">
                          Beta
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* TODO: Add GitHub link */}
                      <Link
                        href="https://github.com/alizada-hadi/devtools-hub"
                        target="_blank"
                      >
                        <Button variant="ghost" size="sm">
                          <Github className="w-4 h-4" />
                          Star on GitHub
                        </Button>
                      </Link>

                      <ModeToggle />
                    </div>
                  </div>
                </header>

                <main className="flex-1 overflow-auto">{children}</main>

                <Footer />
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
