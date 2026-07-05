import type { NextConfig } from 'next';

let nextConfig: NextConfig = {
  experimental: {
    // Heavy libs ke imports ko per-module resolve karta hai — module-graph aur build memory dono kam
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // Next 16: build ke dauran peak memory usage kam karta hai
    webpackMemoryOptimizations: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
        ],
      },
    ];
  },
};

// Bundle analyzer (optional, enabled via ANALYZE=true)
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

// Dev: allow external origins via env (ALLOWED_DEV_ORIGINS comma-separated)
if (process.env.ALLOWED_DEV_ORIGINS) {
  nextConfig.allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS.split(',').map(s => s.trim());
}

export default nextConfig;
