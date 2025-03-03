import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["www.facebook.com"],
  },
  async rewrites() {
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
