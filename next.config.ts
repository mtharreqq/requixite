import { execSync } from "node:child_process";
import type { NextConfig } from "next";
import { version } from "./package.json";

// Last commit date, shown in the footer. No git (e.g. a tarball build): omit it.
let updatedAt = "";
try {
  updatedAt = execSync("git log -1 --format=%cI").toString().trim();
} catch {}

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_VERSION: version, NEXT_PUBLIC_UPDATED_AT: updatedAt },
  // Dev only: botserver over LAN and Tailscale.
  allowedDevOrigins: ["192.168.4.162", "100.124.78.55"],
  images: {
    // The column never exceeds ~576px, so skip the 1920–3840 candidates.
    // Those were the `src` fallback on `fill` images and inflated the markup.
    deviceSizes: [640, 828, 1080, 1200],
    imageSizes: [48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
