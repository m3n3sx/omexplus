# 🚀 Next.js Storefront Complete Restoration Guide

## 📋 Analysis of Current Issues

### ✅ What's Working:
- Tailwind config is properly set up for Next.js 15
- API client structure is good with proper error handling
- Environment variables are configured correctly
- Component structure follows best practices
- TypeScript configuration is valid

### ⚠️ What Needs Fixing:
1. **Missing Medusa SDK**: `@medusajs/medusa-js` not installed
2. **CSS Conflicts**: Custom styles override Tailwind utilities
3. **Missing Components**: Search components referenced but may not exist
4. **CORS Configuration**: Backend needs proper CORS setup
5. **API Key Configuration**: Publishable key needs backend setup

---

## 🔧 Step-by-Step Restoration

### Step 1: Install Missing Dependencies

```bash
cd storefront
npm install @medusajs/medusa-js
npm install @medusajs/types
npm install clsx
```

### Step 2: Clean Up globals.css

**Problem**: Your current `globals.css` has 500+ lines of custom CSS that conflicts with Tailwind.

**Solution**: Replace with minimal Medusa-compatible version:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  /* Minimal custom components only */
  .container {
    @apply mx-auto px-4 max-w-7xl;
  }
}
```

### Step 3: Fix Environment Variables

**Current `.env.local`** (✅ Already correct):
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_storefront_2024_token
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SZb2ZBEhIjq58F9e5RI9recju3zt6gMUtWFqnJcJP9oQeJ9hBQCVB903pifAF8wmSC1f90XT0TvwBsn0lkPewYw00svf5ANHg
```

### Step 4: Configure Backend CORS

**Backend `medusa-config.ts`** - Add CORS configuration:

```typescript
module.exports = {
  projectConfig: {
    // ... other config
    http: {
      storeCors: "http://localhost:3000,http://localhost:8000",
      adminCors: "http://localhost:7001,http://localhost:7000",
      authCors: "http://localhost:3000,http://localhost:7001",
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
}
```

### Step 5: Create Proper API Client

**File: `storefront/lib/medusa.ts`** (New simplified version):

```typescript
import Medusa from "@medusajs/medusa-js"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const medusaClient = new Medusa({
  baseUrl: BACKEND_URL,
  maxRetries: 3,
  apiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

export default medusaClient
```

### Step 6: Test API Communication

**Create test file: `storefront/test-api.ts`**

```typescript
import { medusaClient } from './lib/medusa'

async function testAPI() {
  try {
    console.log('Testing Medusa API connection...')
    
    // Test 1: Get regions
    const regions = await medusaClient.regions.list()
    console.log('✅ Regions:', regions.regions.length)
    
    // Test 2: Get products
    const products = await medusaClient.products.list({ limit: 5 })
    console.log('✅ Products:', products.products.length)
    
    // Test 3: Get categories
    const categories = await medusaClient.productCategories.list()
    console.log('✅ Categories:', categories.product_categories.length)
    
    console.log('🎉 All API tests passed!')
  } catch (error) {
    console.error('❌ API Error:', error)
  }
}

testAPI()
```

Run test:
```bash
cd storefront
npx tsx test-api.ts
```

### Step 7: Fix Component Imports

**Update `storefront/app/[locale]/page.tsx`** - Remove missing component imports:

```typescript
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { medusaClient } from '@/lib/medusa'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          medusaClient.products.list({ limit: 6 }),
          medusaClient.productCategories.list({ limit: 6 })
        ])
        
        setProducts(productsRes.products)
        setCategories(categoriesRes.product_categories)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Części do Maszyn Budowlanych
          </h1>
          <p className="text-xl mb-8">
            Profesjonalny sklep B2B • 18 lat doświadczenia
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto py-16">
        <h2 className="text-3xl font-bold mb-8">Kategorie</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/categories/${category.handle}`}
              className="p-6 bg-white border rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="text-center font-semibold">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Produkty</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {product.variants?.[0]?.prices?.[0]?.amount / 100} PLN
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Dodaj
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

---

## 🧪 Testing Commands

### 1. Start Backend (Terminal 1)
```bash
npm run dev
```

### 2. Start Storefront (Terminal 2)
```bash
cd storefront
npm run dev
```

### 3. Test API Endpoints

**Test Products:**
```bash
curl http://localhost:9000/store/products
```

**Test Categories:**
```bash
curl http://localhost:9000/store/product-categories
```

**Test Regions:**
```bash
curl http://localhost:9000/store/regions
```

### 4. Browser Tests

1. Open http://localhost:3000
2. Check browser console for errors
3. Verify products load
4. Test navigation
5. Check mobile responsive design

---

## 📱 Mobile Testing Guide

### Responsive Breakpoints (Tailwind):
- **sm**: 640px (mobile landscape)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

### Test Checklist:
- [ ] Header collapses to mobile menu
- [ ] Search bar is usable on mobile
- [ ] Product grid stacks properly
- [ ] Images scale correctly
- [ ] Buttons are touch-friendly (min 44px)
- [ ] Text is readable (min 16px)

### Chrome DevTools Testing:
```
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
Test devices:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- Desktop (1920px)
```

---

## 🔥 CORS Error Solutions

### Problem: "CORS policy: No 'Access-Control-Allow-Origin' header"

### Solution 1: Backend Configuration

**File: `medusa-config.ts`**
```typescript
module.exports = {
  projectConfig: {
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000",
    },
  },
}
```

**File: `.env`**
```env
STORE_CORS=http://localhost:3000,http://localhost:8000
ADMIN_CORS=http://localhost:7001
AUTH_CORS=http://localhost:3000
```

### Solution 2: Next.js Proxy (Alternative)

**File: `storefront/next.config.js`**
```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9000/:path*',
      },
    ]
  },
}
```

Then update API calls:
```typescript
// Instead of: http://localhost:9000/store/products
// Use: /api/store/products
```

### Solution 3: Development Proxy

**Install:**
```bash
npm install -g local-cors-proxy
```

**Run:**
```bash
lcp --proxyUrl http://localhost:9000 --port 8010
```

**Update `.env.local`:**
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:8010
```

---

## 🎨 Tailwind Best Practices

### 1. Use Utility Classes (Not Custom CSS)

❌ **Bad:**
```css
.btn-primary {
  background-color: #1a3a52;
  padding: 8px 16px;
  border-radius: 8px;
}
```

✅ **Good:**
```tsx
<button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
  Click me
</button>
```

### 2. Responsive Design

```tsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-4 
  gap-4
">
  {/* Content */}
</div>
```

### 3. Dark Mode Support

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Content */}
</div>
```

### 4. Custom Colors in tailwind.config.ts

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f4f8',
        500: '#1a3a52',
        900: '#0f2538',
      },
    },
  },
}
```

---

## ✅ Final Checklist

### Backend:
- [ ] Medusa running on port 9000
- [ ] CORS configured for localhost:3000
- [ ] Database connected
- [ ] Products seeded
- [ ] Publishable API key created

### Storefront:
- [ ] Dependencies installed
- [ ] `.env.local` configured
- [ ] `globals.css` cleaned up
- [ ] API client working
- [ ] Components rendering
- [ ] No TypeScript errors
- [ ] Mobile responsive
- [ ] CORS working

### Testing:
- [ ] Products load from API
- [ ] Categories display
- [ ] Navigation works
- [ ] Search functional
- [ ] Cart operations work
- [ ] Mobile layout correct
- [ ] No console errors

---

## 🚨 Common Errors & Fixes

### Error: "Module not found: @medusajs/medusa-js"
```bash
cd storefront
npm install @medusajs/medusa-js
```

### Error: "fetch failed" or "ECONNREFUSED"
- Check backend is running: `curl http://localhost:9000/health`
- Verify `.env.local` has correct URL
- Check firewall/antivirus

### Error: "Publishable API key is required"
- Create key in Medusa admin
- Add to `.env.local`
- Restart Next.js dev server

### Error: CSS not applying
```bash
cd storefront
rm -rf .next
npm run dev
```

### Error: TypeScript errors
```bash
cd storefront
npm run build
# Fix reported errors
```

---

## 📚 Additional Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Medusa Storefront Starter](https://github.com/medusajs/nextjs-starter-medusa)

---

## 🎯 Quick Start Commands

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Storefront
cd storefront
npm install
npm run dev

# Terminal 3 - Test API
curl http://localhost:9000/store/products
curl http://localhost:9000/store/product-categories

# Open browser
open http://localhost:3000
```

---

**Last Updated**: December 2024
**Medusa Version**: 2.x
**Next.js Version**: 15.0.0
**Tailwind Version**: 3.4.0
