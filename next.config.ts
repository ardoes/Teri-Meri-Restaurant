import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [100, 75],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [256, 384, 512, 640, 750, 828, 960, 1080, 1200],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
