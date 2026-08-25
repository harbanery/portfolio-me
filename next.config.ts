import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    // Local images next/image may optimize: the site logo and the
    // portfolio-cover route (its `?v=<updatedAt>` query busts the
    // immutable cache when the admin updates a record).
    localPatterns: [
      { pathname: "/logo.png" },
      { pathname: "/api/portfolio-cover/**" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "jfbwaakuillpudswyfkg.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  compress: true,
  poweredByHeader: false,

  // Enable production source maps for debugging (disable if not needed)
  productionBrowserSourceMaps: false,

  // NOTE: legacy `compiler.removeConsole` / `reactRemoveProperties` flags
  // were removed while diagnosing production hydration mismatches.

  // Optimize bundle size with tree shaking
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "react-icons"],
  },
};

export default nextConfig;
