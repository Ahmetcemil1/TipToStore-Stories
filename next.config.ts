import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Allow images from any source (for user-uploaded cover images)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    dangerouslyAllowSVG: true,
  },
  // Suppress source map warnings in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
