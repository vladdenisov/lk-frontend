import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.BACKEND_URL}/:path*`,
    },
  ],
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.ts'
    }
  }
};

export default nextConfig;
