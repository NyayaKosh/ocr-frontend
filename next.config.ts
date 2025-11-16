import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ocr.nyayakosh.com"
      },
      {
        protocol: "http",
        hostname: "localhost:3000"
      }
    ],
  },
};

export default nextConfig;
