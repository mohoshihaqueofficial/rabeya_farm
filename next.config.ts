import type { NextConfig } from "next";

const immutableImages = [
  "/Home/rabeya-cattle-optimized.jpg",
  "/Home/rabeya-hero-optimized.jpg",
  "/Home/rabeya-home-delivery-optimized.jpg",
  "/Home/qurbani-donation-distribution-optimized.jpg",
];

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy: only our own scripts/styles, images from self + YouTube thumbnails + admin uploads (data:/blob:),
// iframes only from youtube-nocookie (cow videos). 'unsafe-inline' is required by Next's inline bootstrap scripts
// without a nonce setup; 'unsafe-eval' and ws: only in dev (React Refresh / HMR).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src https://www.youtube-nocookie.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Payment receipts (≤ 5 MB) are uploaded through a Server Action; default limit is 1 MB.
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 604800,
    qualities: [75],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      ...immutableImages.map(source => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      })),
      {
        source: "/partners/mou-sukher-khamar.jpg",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
