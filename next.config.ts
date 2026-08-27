import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ảnh CMS runtime được phục vụ qua /api/uploads, không phụ thuộc static files của Next/Nginx.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
