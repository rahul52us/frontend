import type { NextConfig } from "next";

const isCapacitor = process.env.CAPACITOR_BUILD === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: isCapacitor ? 'export' : undefined,

  images: {
    unoptimized: isCapacitor,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.facebook.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    if (isCapacitor) {
      return [];
    }
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
};

export default nextConfig;
