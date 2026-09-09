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

  // Security headers for every route. CSP keeps Analytics & Speed Insights
  // working: their script loads from va.vercel-scripts.com and both beacon
  // back over connect-src (style-src keeps 'unsafe-inline' for the inline
  // styles the components set; img-src lists every host next/image may
  // fetch plus data:/blob: for the inline base64 covers).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://res.cloudinary.com https://raw.githubusercontent.com https://github.com",
              "font-src 'self' data:",
              "connect-src 'self' https://va.vercel-scripts.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Enable production source maps for debugging (disable if not needed)
  productionBrowserSourceMaps: false,

  // NOTE: legacy `compiler.removeConsole` / `reactRemoveProperties` flags
  // were removed while diagnosing production hydration mismatches.

  // Optimize bundle size with tree shaking
  // (`framer-motion` was removed — it is not a dependency of this app.)
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
};

export default nextConfig;
