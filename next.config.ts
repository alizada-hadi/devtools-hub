import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Ensure API routes use Node.js runtime
    serverComponentsExternalPackages: ["formidable"],
  },
  /* config options here */
  api: {
    runtime: "nodejs",
  },
};

export default nextConfig;
