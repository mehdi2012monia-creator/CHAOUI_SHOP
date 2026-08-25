import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
    turbo: {
      resolveAlias: {
        // الى عندك مشكل فـ الـ path
      }
    }
  },
};

export default nextConfig;
