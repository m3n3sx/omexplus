# 🔥 OmexPlus: Implementation Quick Start Guide

## 🎯 Co Zrobić Następnego Tygodnia (Priority Action Items)

### 1️⃣ MONDAY: Setup Google Search Console & Analytics

```bash
# Step 1: Create GSC property
# https://search.google.com/search-console
# → Add property → Verify with DNS TXT record
# → Submit sitemap (even if not created yet)

# Step 2: Create GA4 property
# https://analytics.google.com
# → Create new account
# → Add measurement ID to .env
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXXXXX

# Step 3: Link Ads to Analytics
# Google Ads → Tools → Linked Accounts → Link to GA4
```

---

### 2️⃣ TUESDAY: Deploy Critical SEO Files

**Create these 2 files immediately:**

#### File A: `storefront/app/sitemap.ts`
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://omexplus.com/en',
      changeFrequency: 'daily',
      priority: 1.0,
      lastModified: new Date(),
    },
    {
      url: 'https://omexplus.com/en/shop',
      changeFrequency: 'daily', 
      priority: 0.9,
    },
    // For dynamic products: Use dynamic import below
  ];
}
```

#### File B: `storefront/public/robots.txt`
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /checkout

Sitemap: https://omexplus.com/sitemap.xml
```

**Deploy**: `npm run build && npm run deploy`

---

### 3️⃣ WEDNESDAY: Add Product Metadata

**Update**: `storefront/app/[locale]/products/[handle]/page.tsx`

```typescript
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetch(
    `https://medusa.omexplus.com/store/products/${params.handle}`
  ).then(r => r.json());

  return {
    title: `${product.title} | Industrial Parts - OmexPlus`,
    description: product.description?.substring(0, 160) || '',
    
    openGraph: {
      images: [product.thumbnail],
      type: 'product',
    },
  };
}
```

---

### 4️⃣ THURSDAY: Google Merchant Center Feed

**Create endpoint**: `storefront/app/api/feed/route.ts`

```typescript
export async function GET() {
  // Generate XML feed of all products
  // Submit to Google Merchant Center at:
  // https://merchants.google.com/mc/feeds
  
  return new Response(xmlFeed, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
```

**Upload to Merchant Center**:
1. Go to https://merchants.google.com
2. Create account → Connect to Google Ads
3. Add data source → XML feed
4. URL: `https://omexplus.com/api/feed`

---

### 5️⃣ FRIDAY: Launch First Ads

**Search Campaign Setup**:
```
Campaign: "Brand Defense"
├─ Keywords: 
│  - "omexplus" (match type: Exact)
│  - "omex plus" (Phrase)
│  - "industrial parts poland" (Broad)
│
├─ Daily Budget: $20
├─ Bid Strategy: Manual CPC
└─ Target CPC: $1.50
```

**Shopping Campaign Setup**:
```
Campaign: "All Products"
├─ Budget: $50/day
├─ Feed: Your product feed
├─ Product filters: (none - show all)
└─ Bid strategy: Target ROAS 2.5
```

---

## 📊 Week-by-Week Roadmap

| Week | Task | Time | Impact |
|------|------|------|--------|
| **1** | GSC + GA4 + robots.txt + sitemap | 4h | 🟢 High |
| **2** | Product metadata + og:image | 6h | 🟢 High |
| **3** | Product feed + Shopping ads | 8h | 🟢 High |
| **4** | Search campaigns (50 keywords) | 10h | 🟠 Medium |
| **5** | Core Web Vitals optimizations | 12h | 🟠 Medium |
| **6** | ISR strategy for top products | 8h | 🟡 Low |
| **7-8** | Monitor & optimize based on data | 10h | 🟡 Low |

---

## 💰 Budget Allocation (Monthly)

```
Recommended Google Ads Spend: $3,000/month

├── Search Campaigns: $1,200 (40%)
│   ├─ Brand keywords: $300
│   ├─ Category keywords: $600
│   └─ Competitor keywords: $300
│
├── Shopping Campaigns: $1,500 (50%)
│   ├─ All Products: $800
│   └─ High-margin items: $700
│
└── Remarketing: $300 (10%)
    ├─ Site visitors: $150
    └─ Cart abandoners: $150

Expected Performance (Month 3):
├─ Search ROAS: 3.5:1 ($4,200 revenue from $1,200 spend)
├─ Shopping ROAS: 2.5:1 ($3,750 revenue from $1,500 spend)
├─ Overall ROAS: 2.7:1 ($7,950 revenue from $3,000 spend)
└─ Organic traffic: +300 sessions/month (from SEO)
```

---

## 🚀 SEO Quick Wins (Next 30 Days)

### Week 1-2: Foundation
- [ ] Submit sitemap to GSC
- [ ] Verify domain in GSC
- [ ] Create GA4 property
- [ ] Deploy robots.txt + sitemap.ts
- [ ] Add 100 basic meta descriptions

**Expected Result**: GSC starts showing indexing data

### Week 3-4: Optimization
- [ ] Add og:image to all products
- [ ] Implement structured data (schema.org)
- [ ] Create product feed
- [ ] Launch first Shopping campaign
- [ ] Set up conversion tracking

**Expected Result**: Shopping ads start generating sales

### Week 5-8: Growth
- [ ] Launch Search campaigns
- [ ] Implement ISR for top 100 products
- [ ] Core Web Vitals optimization
- [ ] Monthly performance review

**Expected Result**: +20% organic traffic MoM

---

## 🎯 Success Metrics - Track These

### Month 1 (Baseline)
```
Google Search Console:
├─ Indexed pages: Should show all 1884 products
├─ Search impression: TBD
└─ Crawl stats: Monitor for errors

Google Analytics:
├─ Total sessions: _____
└─ Organic sessions: _____ (probably 0 initially)
```

### Month 3 (Target)
```
Google Search Console:
├─ Indexed pages: 1884+
├─ Average position: Top 30 for main keywords
└─ Click-through rate: +5%

Google Ads:
├─ Search impressions: 50,000+
├─ Shopping impressions: 100,000+
└─ Click-through rate: 3%+

Google Analytics (Organic):
├─ Monthly sessions: 5,000+
├─ Bounce rate: <70%
└─ Conversion rate: 1%+
```

---

## 🔧 Technical Checklist

### Pre-Launch Verification
- [ ] robots.txt returns 200 status code
- [ ] sitemap.xml is valid XML (test at https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [ ] All product pages return 200 status code
- [ ] Mobile version displays correctly
- [ ] Page loads under 3 seconds (LCP)
- [ ] No JavaScript errors in console
- [ ] GA4 tracking working (check Real-time)
- [ ] Structured data is valid (https://schema.org/validate)

### Ongoing Monitoring
- [ ] Weekly: Check GSC for crawl errors
- [ ] Weekly: Monitor Core Web Vitals
- [ ] Bi-weekly: Review Google Ads performance
- [ ] Monthly: SEO & analytics deep dive

---

## 📞 Support & Resources

### Tools You'll Need (All Free)
- Google Search Console: https://search.google.com/search-console
- Google Analytics 4: https://analytics.google.com
- Google Ads: https://ads.google.com
- Google Merchant Center: https://merchants.google.com
- Lighthouse: Chrome DevTools built-in
- Schema.org Validator: https://schema.org/validate

### Useful Links
- Next.js Metadata API: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Medusa Documentation: https://docs.medusajs.com
- Google Ads Help: https://support.google.com/google-ads

---

## 💡 Pro Tips

1. **Start with 10-15 keywords** in Search campaigns, not 100
2. **Use exact match** initially to get quality scores up
3. **Monitor daily** first 2 weeks for performance
4. **Set conversion tracking FIRST** before launching ads
5. **Test ad copy** - try 5 different headlines
6. **Don't bid on competitor names initially** (waste of money at start)
7. **Use long-tail keywords** - "excavator hydraulic pump" not just "pump"
8. **Leverage product feed** for Shopping campaigns (saves time)
9. **Check competitors' keywords** with SEMRush/Ahrefs free trial
10. **Optimize for mobile** - 70%+ of traffic will be mobile

---

**Next Step**: Start with Week 1 tasks on Monday! 🚀

Good luck with OmexPlus! 💪
