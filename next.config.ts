import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ảnh CMS được tạo trong public/uploads ở runtime và được Nginx phục vụ trực tiếp.
    // Bỏ Image Optimization để ảnh mới không phụ thuộc danh sách public lúc Next khởi động.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
