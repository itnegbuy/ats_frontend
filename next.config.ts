import type { NextConfig } from 'next';

let nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  generateBuildId: () => {
    // Use GIT_COMMIT from env (Hostinger/CI sets this) or fallback to timestamp
    return process.env.GIT_COMMIT || `build-${Date.now()}`;
  },
  async headers() {
    return [
      // ── HTML pages: prevent CDN caching (so new deploy → fresh content instantly) ──
      {
        source: '/:path((?!_next|favicon|images|og-image|logo).*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',  value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          { key: 'Content-Security-Policy',    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com https://img.youtube.com https://i.ytimg.com; font-src 'self' data:; connect-src 'self' https://api.aeroturbinespare.com https://www.google-analytics.com https://www.googletagmanager.com; frame-src 'self' https://www.youtube.com; object-src 'none'; base-uri 'self'; form-action 'self';" },
          { key: 'Vary',                       value: 'Cookie, Accept-Encoding' },
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
