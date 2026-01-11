# 💻 OmexPlus: Ready-to-Copy Code Snippets

## 📋 Spis Treści
1. [Sitemap Generator](#1-sitemap-generator)
2. [Dynamic Metadata](#2-dynamic-metadata)
3. [Product Feed](#3-product-feed)
4. [GA4 Integration](#4-ga4-integration)
5. [Structured Data](#5-structured-data)

---

## 1. Sitemap Generator

### File: `storefront/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';

// Medusa API client
const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://omexplus.com';

interface MedusaProduct {
  id: string;
  handle: string;
  created_at: string;
  updated_at: string;
  status: 'published' | 'draft';
}

interface MedusaResponse {
  products: MedusaProduct[];
}

async function getProducts(): Promise<MedusaProduct[]> {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/products?limit=500&fields=id,handle,created_at,updated_at,status`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.status}`);
    }

    const data: MedusaResponse = await response.json();
    return data.products.filter((p) => p.status === 'published');
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'pl'];
  const routes: MetadataRoute.Sitemap = [];

  // Static pages
  for (const locale of locales) {
    routes.push(
      {
        url: `${STORE_URL}/${locale}`,
        changeFrequency: 'daily' as const,
        priority: 1.0,
        lastModified: new Date(),
      },
      {
        url: `${STORE_URL}/${locale}/shop`,
        changeFrequency: 'daily' as const,
        priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${STORE_URL}/${locale}/about`,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
        lastModified: new Date(),
      },
      {
        url: `${STORE_URL}/${locale}/contact`,
        changeFrequency: 'monthly' as const,
        priority: 0.4,
        lastModified: new Date(),
      }
    );
  }

  // Dynamic product pages
  const products = await getProducts();

  for (const locale of locales) {
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${STORE_URL}/${locale}/products/${product.handle}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      lastModified: new Date(product.updated_at || product.created_at),
    }));

    routes.push(...productRoutes);
  }

  return routes;
}
```

### File: `storefront/public/robots.txt`

```
# Block low-quality bots
User-agent: AhrefsBot
User-agent: SemrushBot
User-agent: DotBot
Disallow: /

# Allow good bots
User-agent: Googlebot
User-agent: Bingbot
User-agent: Slurp
Allow: /

# Standard rules
User-agent: *
Allow: /
Crawl-delay: 1

# Private areas
Disallow: /admin/
Disallow: /api/
Disallow: /cart
Disallow: /checkout
Disallow: /account/
Disallow: /*.json$
Disallow: /*?*sort=
Disallow: /*?*filter=

# Sitemaps
Sitemap: https://omexplus.com/sitemap.xml
Sitemap: https://omexplus.com/en/sitemap.xml
Sitemap: https://omexplus.com/pl/sitemap.xml

# Specific to store
Request-rate: 1/1s
```

---

## 2. Dynamic Metadata

### File: `storefront/app/[locale]/products/[handle]/layout.tsx`

```typescript
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://omexplus.com';

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  subtitle?: string;
  thumbnail?: string;
  images?: Array<{ url: string }>;
  variants?: Array<{ price: number; currency_code: string }>;
  category?: { name: string };
}

async function getProduct(handle: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/products?handle=${handle}&expand=images,variants,category`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.products?.[0] || null;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}

interface Props {
  params: Promise<{ locale: string; handle: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale, handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'This product does not exist',
    };
  }

  const price = product.variants?.[0]?.price || 0;
  const currency = product.variants?.[0]?.currency_code || 'USD';
  const categoryName = product.category?.name || 'Industrial Equipment';

  // Clean description for meta tag (max 160 characters)
  const description = `${product.title} - ${
    product.subtitle || product.description
  }. High-quality industrial part. Price: ${price} ${currency}. Free shipping on orders over $100.`
    .substring(0, 160);

  // Image URL for OG
  const imageUrl = product.thumbnail || 'https://omexplus.com/default-product.png';
  
  const url = `${STORE_URL}/${locale}/products/${handle}`;

  return {
    title: `${product.title} | Industrial Parts - OmexPlus`,
    description,
    keywords: [
      product.title,
      categoryName,
      'industrial parts',
      'equipment',
      'parts supplier',
      'machinery',
    ].join(','),

    // Open Graph for Social Media
    openGraph: {
      title: product.title,
      description: product.subtitle || description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
          type: 'image/jpeg',
        },
        ...((product.images || []).map((img) => ({
          url: img.url,
          width: 800,
          height: 800,
          alt: product.title,
          type: 'image/jpeg' as const,
        })) || []),
      ],
      type: 'product' as const,
      url,
      locale,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image' as const,
      title: product.title,
      description: product.subtitle || description,
      images: [imageUrl],
      site: '@omexplus',
      creator: '@omexplus',
    },

    // Alternates for hreflang
    alternates: {
      canonical: url,
      languages: {
        'en-US': `${STORE_URL}/en/products/${handle}`,
        'pl-PL': `${STORE_URL}/pl/products/${handle}`,
      },
    },

    // Additional tags
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },

    // Schema/Structured Data
    other: {
      'product:price:amount': price.toString(),
      'product:price:currency': currency,
      'product:category': categoryName,
    },
  };
}

export const revalidate = 3600; // Revalidate every hour for ISR

export const dynamicParams = true; // Allow dynamic segment values
```

---

## 3. Product Feed

### File: `storefront/app/api/feed/google-merchant/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://omexplus.com';

interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  subtitle?: string;
  description?: string;
  sku?: string;
  status: string;
  thumbnail?: string;
  images?: Array<{ url: string }>;
  variants?: Array<{ price: number; currency_code: string }>;
  categories?: Array<{ name: string }>;
  collection_id?: string;
  meta?: {
    ean?: string;
    brand?: string;
  };
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: NextRequest) {
  try {
    // Fetch products from Medusa
    const response = await fetch(
      `${MEDUSA_URL}/store/products?limit=500&offset=0&fields=id,title,handle,subtitle,description,sku,status,thumbnail,variants,categories,collection_id&expand=variants,images`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.status}`);
    }

    const data = await response.json();
    const products: MedusaProduct[] = data.products || [];

    // Filter published products
    const publishedProducts = products.filter((p) => p.status === 'published');

    // Generate XML feed
    const feedItems = publishedProducts
      .map((product) => {
        const price = product.variants?.[0]?.price || 0;
        const currency = product.variants?.[0]?.currency_code || 'USD';
        const category = product.categories?.[0]?.name || 'Industrial Equipment';
        const description = escapeXml(
          (product.subtitle || product.description || '').substring(0, 5000)
        );
        const title = escapeXml(product.title.substring(0, 150));
        const imageUrl = product.thumbnail || `${STORE_URL}/default-product.png`;
        const productUrl = `${STORE_URL}/en/products/${product.handle}`;

        return `
    <item>
      <g:id><![CDATA[${product.id}]]></g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link><![CDATA[${productUrl}]]></g:link>
      <g:image_link><![CDATA[${imageUrl}]]></g:image_link>
      <g:availability>in stock</g:availability>
      <g:price>${price} ${currency}</g:price>
      <g:product_type><![CDATA[${category}]]></g:product_type>
      <g:brand><![CDATA[OmexPlus]]></g:brand>
      <g:mpn>${product.sku || product.id}</g:mpn>
      <g:condition>new</g:condition>
      <g:item_group_id>${product.collection_id || product.id}</g:item_group_id>
    </item>`;
      })
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>OmexPlus - Industrial Parts Feed</title>
    <link>${STORE_URL}</link>
    <description>Complete feed of ${publishedProducts.length} industrial equipment parts</description>
    <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
    ${feedItems}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Feed generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate feed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

---

## 4. GA4 Integration

### File: `storefront/app/layout.tsx`

```typescript
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleTagManager } from '@/components/GoogleTagManager';
import { useLocale } from 'next-intl';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_STORE_URL || 'https://omexplus.com'),
  title: 'OmexPlus - Industrial Parts & Equipment',
  description: 'Buy industrial parts and equipment online. 1884+ products in stock.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <html lang={locale}>
      <head>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <GoogleTagManager />
      </head>
      <body>
        {children}
        <Analytics debug={false} />
      </body>
    </html>
  );
}
```

### File: `storefront/components/GoogleTagManager.tsx`

```typescript
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export function GoogleTagManager() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    // Initialize GA4 event tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA4_ID, {
        anonymize_ip: false,
        page_path: window.location.pathname,
        page_title: document.title,
      });
    }
  }, []);

  if (!GTM_ID) return null;

  return (
    <>
      {/* GTM noscript */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      {/* GTM script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
}
```

### File: `storefront/hooks/useEcommerceEvents.ts`

```typescript
'use client';

import { useCallback } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price_usd: number;
  currency?: string;
}

export interface OrderItem {
  product_id: string;
  title: string;
  unit_price: number;
  quantity: number;
}

export interface Order {
  id: string;
  total: number;
  tax_total?: number;
  shipping_total?: number;
  items: OrderItem[];
}

export function useEcommerceEvents() {
  // Track view_item event
  const trackProductView = useCallback((product: Product) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: product.currency || 'USD',
        value: product.price_usd,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            item_category: product.category,
            price: product.price_usd,
            quantity: 1,
          },
        ],
      });
    }
  }, []);

  // Track add_to_cart event
  const trackAddToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'add_to_cart', {
          currency: product.currency || 'USD',
          value: product.price_usd * quantity,
          items: [
            {
              item_id: product.id,
              item_name: product.title,
              item_category: product.category,
              price: product.price_usd,
              quantity,
            },
          ],
        });
      }
    },
    []
  );

  // Track purchase event
  const trackPurchase = useCallback((order: Order) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: order.id,
        affiliation: 'OmexPlus',
        value: order.total,
        currency: 'USD',
        tax: order.tax_total || 0,
        shipping: order.shipping_total || 0,
        items: order.items.map((item) => ({
          item_id: item.product_id,
          item_name: item.title,
          price: item.unit_price,
          quantity: item.quantity,
        })),
      });
    }
  }, []);

  // Track search event
  const trackSearch = useCallback((searchTerm: string, resultCount: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        value: resultCount,
      });
    }
  }, []);

  return {
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackSearch,
  };
}
```

---

## 5. Structured Data

### File: `storefront/components/ProductSchema.tsx`

```typescript
'use client';

interface Product {
  id: string;
  title: string;
  handle: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  images?: Array<{ url: string }>;
  variants?: Array<{ price: number; currency_code: string }>;
  rating?: number;
  review_count?: number;
  sku?: string;
  category?: { name: string };
  in_stock?: boolean;
}

interface ProductSchemaProps {
  product: Product;
  locale?: string;
}

export function ProductSchema({ product, locale = 'en' }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://omexplus.com';
  const price = product.variants?.[0]?.price || 0;
  const currency = product.variants?.[0]?.currency_code || 'USD';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.subtitle || product.description,
    sku: product.sku || product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'OmexPlus',
    },
    image: [
      product.thumbnail,
      ...(product.images?.map((img) => img.url) || []),
    ].filter(Boolean),
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/${locale}/products/${product.handle}`,
      priceCurrency: currency,
      price: price.toString(),
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'OmexPlus',
        url: baseUrl,
      },
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: (product.review_count || 0).toString(),
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      suppressHydrationWarning
    />
  );
}
```

### File: `storefront/components/OrganizationSchema.tsx`

```typescript
'use client';

const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://omexplus.com';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OmexPlus',
    alternateName: 'Omex Plus',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Industrial parts and equipment supplier with 1884+ products',
    sameAs: [
      'https://www.facebook.com/omexplus',
      'https://www.linkedin.com/company/omexplus',
      'https://www.instagram.com/omexplus',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+48-61-XXX-XXXX',
      email: 'support@omexplus.com',
      areaServed: ['PL', 'EU'],
      availableLanguage: ['pl', 'en'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your Street Address',
      addressLocality: 'Poznań',
      addressRegion: 'Wielkopolskie',
      postalCode: '60-001',
      addressCountry: 'PL',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      suppressHydrationWarning
    />
  );
}
```

---

## 🚀 Installation Instructions

```bash
# 1. Copy all files to your project
cp -r code-snippets/storefront storefront/

# 2. Update environment variables
echo 'NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXXXXX' >> .env.local
echo 'NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX' >> .env.local

# 3. Install any missing dependencies
npm install

# 4. Build and test
npm run build

# 5. Check for errors
npm run lint

# 6. Deploy
npm run deploy
```

---

**Ready to implement! Start with Week 1 tasks. 🚀**
