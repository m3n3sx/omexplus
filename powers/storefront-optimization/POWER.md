---
name: "storefront-optimization"
displayName: "Storefront Optimization"
description: "Optymalizacja Next.js storefront dla Medusa - performance, SEO, images, caching, Core Web Vitals i best practices dla e-commerce."
keywords: ["nextjs", "optimization", "performance", "seo", "images", "caching"]
author: "Medusa Team"
---

# Storefront Optimization

## Przegląd

Kompleksowy przewodnik po optymalizacji Next.js storefront dla sklepu Medusa. Obejmuje performance, SEO, optymalizację obrazów, caching strategies i poprawę Core Web Vitals.

## Core Web Vitals Targets

```
✅ LCP (Largest Contentful Paint): < 2.5s
✅ FID (First Input Delay): < 100ms
✅ CLS (Cumulative Layout Shift): < 0.1
✅ FCP (First Contentful Paint): < 1.8s
✅ TTI (Time to Interactive): < 3.8s
```

## Workflow 1: Optymalizacja Obrazów

### Next.js Image Component

**Zawsze używaj `next/image` zamiast `<img>`:**

```typescript
import Image from 'next/image'

// ❌ Źle
<img src={product.thumbnail} alt={product.title} />

// ✅ Dobrze
<Image
  src={product.thumbnail}
  alt={product.title}
  width={400}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={index < 3} // Dla above-the-fold images
  placeholder="blur"
  blurDataURL="/placeholder.svg"
/>
```

### Responsive Images

```typescript
// ProductCard.tsx
export function ProductCard({ product, priority = false }) {
  return (
    <div className="product-card">
      <Image
        src={product.thumbnail}
        alt={product.title}
        width={400}
        height={400}
        sizes="(max-width: 640px) 100vw, 
               (max-width: 1024px) 50vw, 
               33vw"
        priority={priority}
        className="object-cover"
      />
    </div>
  )
}

// W ProductGrid - prioritize first 3 images
<ProductGrid>
  {products.map((product, index) => (
    <ProductCard 
      key={product.id} 
      product={product}
      priority={index < 3}
    />
  ))}
</ProductGrid>
```

### Image Optimization Config

```javascript
// next.config.js
module.exports = {
  images: {
    domains: [
      'localhost',
      'your-cdn.com',
      'medusa-public-images.s3.amazonaws.com'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  }
}
```

### Lazy Loading Images

```typescript
// Dla images poniżej fold
<Image
  src={product.thumbnail}
  alt={product.title}
  width={400}
  height={400}
  loading="lazy" // Lazy load
  placeholder="blur"
/>

// Dla hero images - eager loading
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority // Load immediately
  loading="eager"
/>
```

## Workflow 2: Performance Optimization

### Code Splitting

```typescript
// Dynamic imports dla heavy components
import dynamic from 'next/dynamic'

// Lazy load search bar
const EnhancedSearchBar = dynamic(
  () => import('@/components/search/EnhancedSearchBar'),
  { 
    ssr: false,
    loading: () => <SearchSkeleton />
  }
)

// Lazy load modal
const ProductModal = dynamic(
  () => import('@/components/product/ProductModal'),
  { ssr: false }
)
```

### Bundle Analysis

```bash
# Zainstaluj analyzer
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... config
})

# Uruchom analysis
ANALYZE=true npm run build
```

### Tree Shaking

```typescript
// ❌ Źle - importuje całą bibliotekę
import _ from 'lodash'
const result = _.debounce(fn, 300)

// ✅ Dobrze - importuje tylko potrzebną funkcję
import debounce from 'lodash/debounce'
const result = debounce(fn, 300)

// ✅ Jeszcze lepiej - użyj native lub małej biblioteki
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react'

// Memoize component
export const ProductCard = memo(({ product }) => {
  return <div>{product.title}</div>
})

// Memoize expensive calculations
function ProductList({ products, filters }) {
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.category === filters.category
    )
  }, [products, filters.category])
  
  return <div>{/* render */}</div>
}

// Memoize callbacks
function SearchBar({ onSearch }) {
  const handleSearch = useCallback((query) => {
    onSearch(query)
  }, [onSearch])
  
  return <input onChange={handleSearch} />
}
```

## Workflow 3: Caching Strategies

### API Route Caching

```typescript
// app/api/products/route.ts
export async function GET(request: Request) {
  const products = await fetchProducts()
  
  return new Response(JSON.stringify(products), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  })
}
```

### Static Generation (SSG)

```typescript
// app/products/[id]/page.tsx
export async function generateStaticParams() {
  const products = await fetchAllProducts()
  
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.id)
  return <ProductDetail product={product} />
}

// Revalidate every hour
export const revalidate = 3600
```

### Incremental Static Regeneration (ISR)

```typescript
// app/products/page.tsx
export const revalidate = 60 // Revalidate every 60 seconds

export default async function ProductsPage() {
  const products = await fetchProducts()
  return <ProductGrid products={products} />
}
```

### Client-Side Caching

```typescript
// lib/api-client.ts
const cache = new Map()

export async function fetchWithCache(url: string, ttl = 60000) {
  const cached = cache.get(url)
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }
  
  const data = await fetch(url).then(r => r.json())
  cache.set(url, { data, timestamp: Date.now() })
  
  return data
}

// Użycie
const products = await fetchWithCache('/api/products', 60000)
```

## Workflow 4: SEO Optimization

### Metadata API (Next.js 15)

```typescript
// app/products/[id]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetchProduct(params.id)
  
  return {
    title: `${product.title} | Your Store`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.thumbnail],
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [product.thumbnail],
    },
    alternates: {
      canonical: `https://yourdomain.com/products/${product.id}`,
    }
  }
}
```

### Structured Data (JSON-LD)

```typescript
// components/product/ProductStructuredData.tsx
export function ProductStructuredData({ product }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.thumbnail,
    description: product.description,
    sku: product.variants[0]?.sku,
    offers: {
      '@type': 'Offer',
      price: product.variants[0]?.prices[0]?.amount / 100,
      priceCurrency: 'PLN',
      availability: product.variants[0]?.inventory_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

### Sitemap Generation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProducts()
  
  const productUrls = products.map((product) => ({
    url: `https://yourdomain.com/products/${product.id}`,
    lastModified: product.updated_at,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))
  
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://yourdomain.com/products',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ]
}
```

### Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout/'],
    },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

## Workflow 5: Loading States & Skeletons

### Suspense Boundaries

```typescript
// app/products/page.tsx
import { Suspense } from 'react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductSkeleton } from '@/components/product/ProductSkeleton'

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </div>
  )
}
```

### Skeleton Components

```typescript
// components/product/ProductSkeleton.tsx
export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-neutral-200 h-64 w-full rounded-lg" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}
```

## Workflow 6: Font Optimization

### Next.js Font Optimization

```typescript
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

### Tailwind Font Config

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
}
```

## Workflow 7: Monitoring & Analytics

### Web Vitals Tracking

```typescript
// app/layout.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }
  })
  
  return null
}
```

### Performance Monitoring

```typescript
// lib/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now()
  fn()
  const end = performance.now()
  
  console.log(`${name} took ${end - start}ms`)
  
  // Send to monitoring service
  if (end - start > 1000) {
    console.warn(`Slow operation: ${name}`)
  }
}

// Użycie
measurePerformance('fetchProducts', async () => {
  await fetchProducts()
})
```

## Best Practices Checklist

### Images
- [ ] Używaj `next/image` dla wszystkich obrazów
- [ ] Ustaw `priority` dla above-the-fold images
- [ ] Dodaj `sizes` prop dla responsive images
- [ ] Użyj `placeholder="blur"` dla lepszego UX
- [ ] Optymalizuj rozmiary obrazów (max 2000px width)

### Performance
- [ ] Implementuj code splitting z dynamic imports
- [ ] Używaj memoization (memo, useMemo, useCallback)
- [ ] Lazy load components poniżej fold
- [ ] Minimalizuj bundle size (tree shaking)
- [ ] Implementuj proper loading states

### Caching
- [ ] Użyj ISR dla często zmieniających się stron
- [ ] Implementuj client-side caching
- [ ] Ustaw proper Cache-Control headers
- [ ] Cache API responses w Redis (backend)

### SEO
- [ ] Dodaj metadata do wszystkich stron
- [ ] Implementuj structured data (JSON-LD)
- [ ] Generuj sitemap.xml
- [ ] Dodaj robots.txt
- [ ] Użyj canonical URLs

### Fonts
- [ ] Użyj Next.js font optimization
- [ ] Ustaw `display: swap`
- [ ] Preload critical fonts
- [ ] Limit font weights (max 3-4)

### Monitoring
- [ ] Track Web Vitals
- [ ] Monitor bundle size
- [ ] Setup error tracking (Sentry)
- [ ] Monitor API response times

## Performance Testing

### Lighthouse CI

```bash
# Zainstaluj Lighthouse CI
npm install -g @lhci/cli

# Uruchom test
lhci autorun --collect.url=http://localhost:3000

# Lub w CI/CD
lhci autorun --collect.url=https://yourdomain.com
```

### Load Testing

```bash
# Zainstaluj k6
brew install k6  # macOS
# lub
apt install k6   # Linux

# Test script (load-test.js)
import http from 'k6/http';

export default function () {
  http.get('http://localhost:3000/products');
}

# Uruchom test
k6 run --vus 10 --duration 30s load-test.js
```

## Troubleshooting

### Problem: Wolne ładowanie strony

**Diagnostyka:**
```bash
# 1. Sprawdź bundle size
npm run build
# Szukaj dużych chunks

# 2. Analyze bundle
ANALYZE=true npm run build

# 3. Sprawdź Network tab w DevTools
# Szukaj dużych plików lub wolnych requestów
```

**Rozwiązanie:**
- Implementuj code splitting
- Lazy load heavy components
- Optymalizuj obrazy
- Użyj CDN dla static assets

### Problem: Niski LCP score

**Przyczyny:**
- Duże obrazy above-the-fold
- Wolny server response
- Render-blocking resources

**Rozwiązanie:**
```typescript
// 1. Priority dla hero image
<Image src="/hero.jpg" priority />

// 2. Preload critical resources
<link rel="preload" href="/critical.css" as="style" />

// 3. Użyj SSG/ISR zamiast SSR
export const revalidate = 60
```

## Dodatkowe Zasoby

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Framework:** Next.js 15
**Focus:** Performance & SEO
**Type:** Knowledge Base Power
