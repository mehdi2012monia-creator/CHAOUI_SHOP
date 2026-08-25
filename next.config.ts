import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        // السماح بتضمين المتجر داخل Google Sites وأي صفحة أخرى (iframe)
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.google.com https://*.googleusercontent.com https://sites.google.com *",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/api/feed.xml",
        headers: [
          { key: "Cache-Control", value: "public, max-age=600, s-maxage=600" },
        ],
      },
      export default {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // زيد هادي
  output: 'standalone',
}
    ];
  },
};

export default nextConfig;
