const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
  },
  experimental: {
    turbo: {
      enabled: false,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/commons/**',
      },
      {
        protocol: 'https',
        hostname: 'www.caterpillar.com',
      },
      {
        protocol: 'https',
        hostname: '*.komatsu.com',
      },
      {
        protocol: 'https',
        hostname: 'www.kolaiwalki.pl',
      },
      {
        protocol: 'https',
        hostname: 'kolaiwalki.pl',
      },
      {
        protocol: 'https',
        hostname: '*.kolaiwalki.pl',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'api.ooxo.pl',
      },
      {
        protocol: 'https',
        hostname: 'ooxo.pl',
      },
    ],
  },
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withNextIntl(nextConfig)
