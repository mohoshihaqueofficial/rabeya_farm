import type { NextConfig } from "next";

const immutableImages = [
  "/Home/rabeya-cattle-optimized.jpg",
  "/Home/rabeya-hero-optimized.jpg",
  "/Home/rabeya-home-delivery-optimized.jpg",
  "/Home/qurbani-donation-distribution-optimized.jpg",
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 604800,
    qualities: [75],
  },
  async headers() {
    return [
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
