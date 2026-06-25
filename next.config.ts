import type { NextConfig } from "next";

const STATIC_CACHE_HEADER = {
  key: "Cache-Control",
  value: "public, max-age=31536000, immutable",
} as const;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [STATIC_CACHE_HEADER],
      },
      {
        source: "/videos/:path*",
        headers: [STATIC_CACHE_HEADER],
      },
      {
        source: "/_next/static/:path*",
        headers: [STATIC_CACHE_HEADER],
      },
      {
        source: "/icon",
        headers: [STATIC_CACHE_HEADER],
      },
      {
        source: "/apple-icon",
        headers: [STATIC_CACHE_HEADER],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/brands", destination: "/marcas", permanent: true },
      { source: "/drivers", destination: "/conductores", permanent: true },
      { source: "/why", destination: "/por-que", permanent: true },
    ];
  },
};

export default nextConfig;
