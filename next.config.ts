import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['cheerio', 'jsdom'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
