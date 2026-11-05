import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The column never exceeds ~576px, so skip the 1920–3840 candidates.
    // Those were the `src` fallback on `fill` images and inflated the markup.
    deviceSizes: [640, 828, 1080, 1200],
    imageSizes: [48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
