import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["lh3.googleusercontent.com", "http://localhost:3000"],
  },
  experimental: {
    optimizeCss: false,
  }
};

export default nextConfig;
