# 📊 Strategia SEO i Google Ads dla OmexPlus (Medusa + Next.js)

## 🎯 Executive Summary

Sklep OmexPlus posiada solidne fundamenty techniczno-architektoniczne:
- **Backend**: Medusa JS (RESTful API, 1884+ produktów, multi-currency)
- **Frontend**: Next.js 14+ (App Router, i18n, SSR/SSG capabilities)
- **Infrastruktura**: PostgreSQL, Stripe, Netlify

Obecnie **brakuje**: SEO optimization, structured data, analytics tracking, kampanień performance marketing.

---

## 📈 CZĘŚĆ 1: AUDYT SEO - LUKI I MOŻLIWOŚCI

### ❌ Aktualne Problemy

| Problem | Wpływ | Priorytet |
|---------|-------|-----------|
| Brak `sitemap.xml` | -20% crawlability | 🔴 KRYTYCZNY |
| Brak `robots.txt` | Niezdefiniowane crawl budget | 🔴 KRYTYCZNY |
| Brak structured data (schema.org) | Brak rich snippets, 0% SEO advantage | 🔴 KRYTYCZNY |
| Brak meta descriptions | CTR -20-30% | 🔴 KRYTYCZNY |
| Brak meta keywords per produktu | Zero keyword targeting | 🔴 KRYTYCZNY |
| Brak og:image na produktach | 0% social sharing potential | 🟠 WYSOKI |
| Brak GA4/GTM | Zero data-driven optimization | 🟠 WYSOKI |
| Brak Core Web Vitals monitoring | Nieznawy performance impact | 🟠 WYSOKI |
| Brak Open Graph na PLP | Słabe social sharing | 🟡 ŚREDNI |
| Brak dinamicznych sitemap'ów | Nowe produkty nie indexowane | 🟡 ŚREDNI |

### ✅ Obecne Atuty

- **Next.js 14** - Native ISR (Incremental Static Regeneration), najszybsze SSR rendering
- **i18n plugin** - Automatyczne hreflang tags (jeśli prawidłowo skonfigurowane)
- **Medusa API** - Możliwość real-time danych produktowych
- **PostgreSQL** - Baza do custom analytics, A/B testing

---

## 🛠️ CZĘŚĆ 2: IMPLEMENTACJA TECHNICZNA (STEP-BY-STEP)

### FAZA 1: CRITICAL SEO SETUP (Tydzień 1-2)

#### 1. Dynamic Metadata Generator dla Produktów

**Plik**: `storefront/app/[locale]/products/[handle]/layout.tsx`

```typescript
import { Metadata, ResolvingMetadata } from 'next';
import { getMedusaProduct } from '@/lib/medusa-client';

interface Props {
  params: Promise<{ locale: string; handle: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale, handle } = await params;
  
  try {
    const product = await getMedusaProduct(handle);

    return {
      title: `${product.title} | OmexPlus - Parts & Equipment`,
      description: `${product.title} - ${product.subtitle}. High-quality part for ${product.category}. ${product.price_usd}. Free shipping on orders over $100.`,
      keywords: [
        product.title,
        product.category,
        'industrial parts',
        'equipment',
      ].join(','),
      
      // Open Graph for Social
      openGraph: {
        title: product.title,
        description: product.subtitle,
        images: [
          {
            url: product.thumbnail,
            width: 1200,
            height: 630,
            alt: product.title,
            type: 'image/jpeg',
          },
        ],
        type: 'product',
        url: `https://omexplus.com/${locale}/products/${handle}`,
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: product.subtitle,
        images: [product.thumbnail],
      },
      
      // Canonical URL (important dla hreflang)
      alternates: {
        canonical: `https://omexplus.com/${locale}/products/${handle}`,
        languages: {
          'en-US': `https://omexplus.com/en/products/${handle}`,
          'pl-PL': `https://omexplus.com/pl/products/${handle}`,
        },
      },
    };
  } catch (error) {
    return {
      title: 'Product | OmexPlus',
      description: 'Industrial parts and equipment for your business',
    };
  }
}
```

#### 2. Dynamic Sitemap Generator

**Plik**: `storefront/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';
import { getMedusaProducts } from '@/lib/medusa-client';

const BASE_URL = 'https://omexplus.com';
const LOCALES = ['en', 'pl'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  // Static pages
  for (const locale of LOCALES) {
    routes.push(
      {
        url: `${BASE_URL}/${locale}`,
        changeFrequency: 'daily',
        priority: 1.0,
        lastModified: new Date(),
      },
      {
        url: `${BASE_URL}/${locale}/shop`,
        changeFrequency: 'daily',
        priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${BASE_URL}/${locale}/about`,
        changeFrequency: 'monthly',
        priority: 0.5,
        lastModified: new Date(),
      }
    );
  }

  // Dynamic product pages
  try {
    const products = await getMedusaProducts({ 
      limit: 500,
      expand: 'images,variants'
    });

    for (const locale of LOCALES) {
      const productRoutes = products.map((product) => ({
        url: `${BASE_URL}/${locale}/products/${product.handle}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : new Date(),
      }));

      routes.push(...productRoutes);
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  return routes;
}
```

#### 3. robots.txt Configuration

**Plik**: `storefront/public/robots.txt`

```
# Block bad bots
User-agent: AhrefsBot
User-agent: SemrushBot
Disallow: /

# Allow Google, Bing, Yandex
User-agent: *
Allow: /

# Disallow private/admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /cart
Disallow: /checkout
Disallow: /account

# Crawl rules
Crawl-delay: 1

# Sitemaps
Sitemap: https://omexplus.com/sitemap.xml
Sitemap: https://omexplus.com/en/sitemap.xml
Sitemap: https://omexplus.com/pl/sitemap.xml
```

---

### FAZA 2: STRUCTURED DATA & RICH SNIPPETS (Tydzień 2-3)

#### 1. Product Schema (JSON-LD) dla każdego produktu

**Plik**: `storefront/components/ProductSchema.tsx`

```typescript
import { useLocale } from 'next-intl';

interface ProductSchemaProps {
  product: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    price_usd: number;
    currency: string;
    thumbnail: string;
    images: Array<{ url: string }>;
    rating?: number;
    review_count?: number;
    sku: string;
    manufacturer?: string;
    warranty?: string;
    in_stock: boolean;
  };
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const locale = useLocale();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.subtitle,
    sku: product.sku,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: product.manufacturer || 'OmexPlus',
    },
    image: [
      product.thumbnail,
      ...product.images.map((img) => img.url),
    ],
    offers: {
      '@type': 'Offer',
      url: `https://omexplus.com/${locale}/products/${product.id}`,
      priceCurrency: product.currency,
      price: product.price_usd.toString(),
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'OmexPlus',
        url: 'https://omexplus.com',
      },
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: (product.review_count || 0).toString(),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

#### 2. Organization & Local Business Schema

**Plik**: `storefront/components/OrganizationSchema.tsx`

```typescript
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OmexPlus',
    alternateName: 'Omex Plus',
    url: 'https://omexplus.com',
    logo: 'https://omexplus.com/logo.png',
    description:
      'Industrial parts and equipment supplier with 1884+ products in stock',
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
      streetAddress: '...',
      addressLocality: 'Poznań',
      addressRegion: 'Wielkopolskie',
      postalCode: '60-001',
      addressCountry: 'PL',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

### FAZA 3: GOOGLE ANALYTICS & CONVERSION TRACKING (Tydzień 3-4)

#### 1. Google Analytics 4 Setup

**Plik**: `storefront/app/layout.tsx`

```typescript
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale}>
      <head>
        {/* GA4 */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### 2. Google Tag Manager Implementation

**Plik**: `storefront/components/GoogleTagManager.tsx`

```typescript
'use client';

import Script from 'next/script';

export function GoogleTagManager() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {/* GTM (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      {/* GTM (JavaScript) */}
      <Script
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

#### 3. Enhanced E-Commerce Events

**Plik**: `storefront/hooks/useEcommerceEvents.ts`

```typescript
'use client';

import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export function useEcommerceEvents() {
  const searchParams = useSearchParams();

  // Wrap in a callback to track view_item events
  const trackProductView = useCallback((product: any) => {
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'USD',
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

  // Track add to cart
  const trackAddToCart = useCallback((product: any, quantity: number = 1) => {
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'USD',
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
  }, []);

  // Track purchase
  const trackPurchase = useCallback((order: any) => {
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: order.id,
        affiliation: 'OmexPlus',
        value: order.total,
        currency: 'USD',
        tax: order.tax_total || 0,
        shipping: order.shipping_total || 0,
        items: order.items.map((item: any) => ({
          item_id: item.product_id,
          item_name: item.title,
          price: item.unit_price,
          quantity: item.quantity,
        })),
      });
    }
  }, []);

  return {
    trackProductView,
    trackAddToCart,
    trackPurchase,
  };
}
```

---

## 🎯 CZĘŚĆ 3: GOOGLE ADS STRATEGIA

### Campaign Structure (Recommended)

```
OmexPlus Google Ads
├── Search Campaigns
│   ├── Brand (100-150% bid adjustment)
│   ├── Category (High-value: Excavators, Forklifts, Pumps)
│   ├── Product Features (Hydraulic, Electric, Manual)
│   └── Competitive Keywords (vs Caterpillar, Komatsu)
│
├── Shopping Campaigns
│   ├── All Products (Feed from Medusa API)
│   ├── High-margin items
│   └── Seasonal/In-stock featured
│
├── Remarketing
│   ├── Site visitors - 30 days
│   ├── Cart abandoners - 7 days
│   ├── Product viewers - 14 days
│   └── Past buyers - Cross-sell
│
└── Performance Max (Feed-based)
    └── Automated multi-channel campaign
```

### 1. Product Feed Integration (Google Merchant Center)

**Plik**: `storefront/app/api/feed/google-merchant.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getMedusaProducts } from '@/lib/medusa-client';

const NAMESPACE = 'http://base.google.com/ns/1.0';

export async function GET(request: NextRequest) {
  try {
    const products = await getMedusaProducts({
      limit: 500,
      expand: 'images,variants,categories',
    });

    const baseUrl = process.env.NEXT_PUBLIC_STORE_URL;
    const currency = 'USD'; // or dynamic from product

    const feedItems = products
      .filter((p) => p.status === 'published' && p.in_stock)
      .map((product) => ({
        'g:id': product.id,
        'g:title': product.title.substring(0, 150),
        'g:description': (
          product.subtitle || product.description || ''
        ).substring(0, 5000),
        'g:link': `${baseUrl}/products/${product.handle}`,
        'g:image_link': product.thumbnail,
        'g:availability': product.in_stock ? 'in stock' : 'out of stock',
        'g:price': `${product.price_usd} ${currency}`,
        'g:product_type': product.category,
        'g:brand': product.manufacturer || 'OmexPlus',
        'g:mpn': product.sku,
        'g:item_group_id': product.collection_id,
        'g:gtin': product.ean || '',
        'g:condition': 'new',
      }));

    // Generate XML RSS feed
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0" xmlns:g="${NAMESPACE}">
        <channel>
          <title>OmexPlus - Industrial Parts Feed</title>
          <link>${baseUrl}</link>
          <description>Complete feed of industrial equipment parts</description>
          <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
          ${feedItems
            .map(
              (item) => `
            <item>
              <g:id><![CDATA[${item['g:id']}]]></g:id>
              <g:title><![CDATA[${item['g:title']}]]></g:title>
              <g:description><![CDATA[${item['g:description']}]]></g:description>
              <g:link><![CDATA[${item['g:link']}]]></g:link>
              <g:image_link><![CDATA[${item['g:image_link']}]]></g:image_link>
              <g:availability>${item['g:availability']}</g:availability>
              <g:price>${item['g:price']}</g:price>
              <g:product_type><![CDATA[${item['g:product_type']}]]></g:product_type>
              <g:brand><![CDATA[${item['g:brand']}]]></g:brand>
              <g:mpn>${item['g:mpn']}</g:mpn>
              <g:condition>${item['g:condition']}</g:condition>
            </item>
          `
            )
            .join('')}
        </channel>
      </rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Refresh hourly
      },
    });
  } catch (error) {
    console.error('Feed generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate feed' },
      { status: 500 }
    );
  }
}
```

### 2. Smart Bidding Strategy for Google Ads

| Campaign Type | Strategy | Target ROAS | Notes |
|---------------|----------|-------------|-------|
| **Search - Brand** | Target impression share (max clicks) | - | Defend brand keywords |
| **Search - High-Value Categories** | Target ROAS 300% | 3.0:1 | Excavators, Forklifts |
| **Shopping - All Products** | Target ROAS 250% | 2.5:1 | Broad visibility |
| **Remarketing - Cart Abandoners** | Target ROAS 500% | 5.0:1 | High intent, low cost |
| **Performance Max** | Maximize conversion value | - | Automated cross-channel |

### 3. Keyword Strategy

**High-Priority Keywords**:
```
excavator parts, hydraulic pump, forklift attachment
CAT parts, Komatsu equipment, construction machinery
spare parts industrial, heavy equipment supplier
[City] + equipment rental, parts distributor
```

**Long-tail Keywords** (from Medusa product data):
```
{product.title} + "parts"
{product.title} + "for sale"
{category} + "wholesale"
{manufacturer} + compatible parts
```

---

## 🚀 CZĘŚĆ 4: PERFORMANCE OPTIMIZATION

### 1. Core Web Vitals Optimization

**next.config.js - Enhanced Version**:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image Optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/wikipedia/commons/**' },
      { protocol: 'https', hostname: 'www.caterpillar.com' },
      { protocol: 'https', hostname: '*.komatsu.com' },
    ],
    // Key optimization: Responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year for optimized images
  },

  // Compression & Bundling
  compress: true,
  swcMinify: true,

  // Headers for CWV
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
      ],
    },
  ],

  // Redirects
  redirects: async () => [
    {
      source: '/cart',
      destination: '/checkout',
      permanent: true,
    },
  ],

  experimental: {
    optimizeCss: true,
    esmExternals: true,
  },
};
```

### 2. Lazy Loading & Code Splitting

**Plik**: `storefront/components/ProductGrid.tsx`

```typescript
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load product card component
const ProductCard = dynamic(() => import('./ProductCard'), {
  loading: () => <ProductCardSkeleton />,
  ssr: true, // Important for SEO
});

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
          <ProductCard product={product} />
        </Suspense>
      ))}
    </div>
  );
}
```

### 3. ISR (Incremental Static Regeneration) Strategy

**Plik**: `storefront/app/[locale]/products/[handle]/page.tsx`

```typescript
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  // Pre-generate top 100 products at build time
  const topProducts = await getMedusaProducts({ 
    limit: 100,
    sort: '-sales_count'
  });

  return topProducts.map((product) => ({
    locale: 'en',
    handle: product.handle,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { handle } = await params;
  const product = await getMedusaProduct(handle);

  return <ProductDetail product={product} />;
}
```

---

## 📊 CZĘŚĆ 5: MONITORING & KPI DASHBOARD

### Essential Metrics to Track

```typescript
// Key Performance Indicators
const KPIs = {
  SEO: {
    'Organic Traffic': 'GA4 > Overview',
    'Ranking Keywords (Top 10)': 'Google Search Console',
    'Crawl Errors': 'GSC > Coverage',
    'Core Web Vitals': 'PageSpeed Insights',
  },
  
  GoogleAds: {
    'Search ROAS': 'Ads > Campaigns > ROAS column',
    'Shopping CTR': 'Ads > Shopping > CTR',
    'Avg CPC by Category': 'Ads > Audiences',
    'Conversion Rate': 'Ads > Conversions',
  },
  
  ECommerce: {
    'Product Page CTR': 'GA4 > Engagement',
    'Add to Cart Rate': 'GA4 > Events > add_to_cart',
    'Conversion Rate': 'GA4 > Conversions',
    'AOV (Average Order Value)': 'GA4 > Revenue',
  },

  Technical: {
    'Page Load Time (LCP)': 'Chrome UX Report',
    'Cumulative Layout Shift': 'Chrome UX Report',
    'First Input Delay (FID)': 'Chrome UX Report',
    'Indexation Rate': 'GSC > Coverage',
  },
};
```

### Monthly Check-list

- [ ] GSC: Review top queries, search appearance, coverage issues
- [ ] GA4: Compare MoM organic traffic, top landing pages, user segments
- [ ] Google Ads: ROAS by campaign, CPC trends, quality score audit
- [ ] Lighthouse: Run Core Web Vitals audit on top 10 pages
- [ ] Competitors: Check ranking changes for top 20 keywords
- [ ] Products: Ensure all 1884 products indexed in GSC

---

## 🔧 CZĘŚĆ 6: IMPLEMENTATION ROADMAP

### **MIESIĄC 1: Foundation (Critical SEO)**
- ✅ Implement dynamic metadata for all products
- ✅ Generate sitemap.xml & robots.txt
- ✅ Add structured data (Product schema)
- ✅ Set up Google Search Console & GSC sitemap submission
- ✅ Install GA4 & GTM
- ~10-15 hours dev work

### **MIESIĄC 2: Google Ads & Feed**
- ✅ Create Google Merchant Center account
- ✅ Generate product feed (XML/CSV)
- ✅ Launch Shopping campaign (100 high-margin products)
- ✅ Set up conversion tracking (purchase, add to cart)
- ✅ A/B test ad copy (5 variations per ad group)
- ~20-25 hours dev work

### **MIESIĄC 3: Optimization & Scaling**
- ✅ Launch Search campaigns (50 keywords per category)
- ✅ Set up Remarketing audiences
- ✅ Performance Max campaign (if >$500/day budget)
- ✅ Implement Core Web Vitals optimizations
- ✅ ISR strategy for top 500 products
- ~15-20 hours dev work

---

## 📝 Environment Variables Required

```bash
# Google Analytics
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Medusa
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa.omexplus.com

# Store Configuration
NEXT_PUBLIC_STORE_URL=https://omexplus.com
NEXT_PUBLIC_STORE_NAME=OmexPlus
NEXT_PUBLIC_DEFAULT_CURRENCY=USD
```

---

## 💡 KEY QUICK WINS (Implement First)

1. **Meta Descriptions** - Add to all 1884 products (+15-25% CTR)
2. **og:image** - Product thumbnails (+30% social shares)
3. **GA4 Event Tracking** - Track add_to_cart, purchase (+90% data clarity)
4. **Product Feed to Google** - Shopping campaigns (+40% conversions)
5. **ISR for Top 100 Products** - Speed up ranking products (+20% LCP)

---

## 🎓 Resources

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Merchant Center](https://merchants.google.com)
- [Google Ads for Shopping](https://support.google.com/google-ads/answer/2454022)
- [Medusa API Documentation](https://docs.medusajs.com)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Schema.org Product Type](https://schema.org/Product)

---

**Document Version**: 1.0 | **Last Updated**: December 30, 2025
