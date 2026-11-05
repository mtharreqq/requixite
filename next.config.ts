import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // `/` is not a document. It always points at English, including when the
    // browser asks for Indonesian. Locale is chosen only from the URL.
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
    ];
  },
  images: {
    // The column never exceeds ~576px, so skip the 1920–3840 candidates.
    // Those were the `src` fallback on `fill` images and inflated the markup.
    deviceSizes: [640, 828, 1080, 1200],
    imageSizes: [48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
