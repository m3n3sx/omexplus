import { MetadataRoute } from 'next'

const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://ooxo.pl'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/konto/', '/account/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/konto/', '/account/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout/',
          '/konto/',
          '/account/',
          '/cart/',
          '/admin/',
          '/*.json$',
          '/*?*sort=',
          '/*?*filter=',
          '/*?*page=',
        ],
      },
      // Block aggressive bots
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
    ],
    sitemap: `${STORE_URL}/sitemap.xml`,
  }
}
