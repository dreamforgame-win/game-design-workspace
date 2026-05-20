import type { NextConfig } from 'next'

let nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

if (process.env.ANALYZE === 'true') {
  try {
    const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default
    nextConfig = withBundleAnalyzer({ enabled: true })(nextConfig)
  } catch {
    // Bundle analyzer not installed, skip
  }
}

export default nextConfig
