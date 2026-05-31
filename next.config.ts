import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/brands", destination: "/marcas", permanent: true },
      { source: "/drivers", destination: "/conductores", permanent: true },
      { source: "/why", destination: "/por-que", permanent: true },
    ];
  },
};

export default nextConfig;
