# OMEX Backend Infrastructure - Quick Reference

## 🚀 Quick Start

```bash
npm run build && npx medusa migrations run && npm run dev
```

## 📦 Modules

| Module | Service | Purpose |
|--------|---------|---------|
| `omex-manufacturer` | `ManufacturerService` | Manufacturer management |
| `omex-seo` | `SEOService` | SEO optimization |
| `omex-b2b` | `B2BService` | B2B features |
| `omex-documentation` | `DocumentationService` | Technical docs |
| `omex-search` | `SearchService` | Enhanced search |

## 🔍 Search Endpoints

```bash
# Basic search
GET /store/products/search?query=pompa&limit=20

# Manufacturer SKU search
GET /store/products/search/manufacturer?sku=REXROTH-2A2E-3456

# Autocomplete
GET /store/products/search/autocomplete?prefix=pom

# Similar products
GET /store/products/:id/similar?limit=5

# Facets/filters
GET /store/products/facets?category=cat_123

# Catalog search
GET /store/manufacturers/:id/catalog?page=15
```

## 🎯 SEO Endpoints

```bash
# Sitemap
GET /store/seo/sitemap.xml

# Robots.txt
GET /store/seo/robots.txt

# Update product SEO (admin)
POST /admin/products/:id/seo
{
  "meta_title": "Product Title | OMEX",
  "meta_description": "Product description...",
  "meta_keywords": ["keyword1", "keyword2"]
}
```

## 💼 B2B Endpoints

```bash
# Create quote (admin)
POST /admin/b2b/quotes
{
  "customer_id": "cust_123",
  "items": [
    {
      "product_id": "prod_123",
      "quantity": 50,
      "unit_price": 850.00,
      "total": 42500.00
    }
  ]
}

# List quotes (admin)
GET /admin/b2b/quotes?customer_id=cust_123&status=draft

# Create purchase order (admin)
POST /admin/b2b/purchase-orders
{
  "customer_id": "cust_123",
  "po_number": "PO-2024-001",
  "items": [...]
}
```

## 🏭 Manufacturer Endpoints

```bash
# List manufacturers (admin)
GET /admin/manufacturers?is_active=true

# Create manufacturer (admin)
POST /admin/manufacturers
{
  "name": "Rexroth",
  "slug": "rexroth",
  "country": "Germany"
}

# Update manufacturer (admin)
PUT /admin/manufacturers/:id

# Sync catalog (admin)
POST /admin/manufacturers/:id/sync-catalog
```

## 💾 Database Schema

### Product Extensions

```typescript
// SEO
meta_title: string (60 chars)
meta_description: string (160 chars)
meta_keywords: string[]
slug: string (unique)
canonical_url: string
og_title, og_description, og_image: string
structured_data: JSONB

// Manufacturer
manufacturer_id: UUID
manufacturer_sku: string
manufacturer_part_number: string
manufacturer_catalog_page: number

// Search
searchable_text: TEXT (full-text indexed)
filter_attributes: JSONB
is_featured, is_bestseller, is_new: boolean
comparable_products: UUID[]

// B2B
b2b_min_quantity: number
b2b_pricing_tiers: JSONB
b2b_discount_percentage: decimal
requires_quote: boolean

// Stock
stock_level, stock_reserved, stock_available: number
supplier_ids: UUID[]
reorder_point: number
```

### New Tables

```sql
manufacturer (id, name, slug, country, catalog_pdf_url, ...)
manufacturer_part (id, manufacturer_id, product_id, manufacturer_sku, ...)
quote (id, customer_id, items, total_amount, status, ...)
purchase_order (id, customer_id, po_number, items, status, ...)
b2b_customer_group (id, name, discount_percentage, ...)
technical_document (id, manufacturer_id, title, document_type, ...)
```

## 🔧 Service Usage

### ManufacturerService

```typescript
// Resolve service
const manufacturerService = req.scope.resolve("omexManufacturer")

// Create
await manufacturerService.createManufacturer({ name, slug, ... })

// Search by SKU
await manufacturerService.searchByManufacturerSKU("REXROTH-2A2E-3456")

// Search by catalog page
await manufacturerService.searchByCatalogPage("mfr_123", 15)

// Sync catalog
await manufacturerService.syncCatalog("mfr_123")
```

### SEOService

```typescript
const seoService = req.scope.resolve("omexSeo")

// Generate meta tags
await seoService.generateMetaTags(product)

// Generate structured data
seoService.generateStructuredData(product)

// Update product SEO
await seoService.updateProductSEO("prod_123", { meta_title, ... })

// Generate sitemap
await seoService.generateSitemap({ includeCategories: true })

// Validate
seoService.validateMetaTags(metaTags)
```

### B2BService

```typescript
const b2bService = req.scope.resolve("omexB2b")

// Get pricing tier
await b2bService.getPricingTier("prod_123", 50)
// Returns: { price: 850.00, discount: 7.5 }

// Calculate pricing
await b2bService.calculateB2BPricing([
  { product_id: "prod_123", quantity: 50 }
])

// Create quote
await b2bService.createQuote({ customer_id, items, ... })

// Validate order
await b2bService.validateB2BOrder(items)
```

### SearchService

```typescript
const searchService = req.scope.resolve("omexSearch")

// Full-text search
await searchService.search(query, filters, sort, pagination)

// Manufacturer SKU
await searchService.searchByManufacturerSKU("REXROTH-2A2E-3456")

// Catalog page
await searchService.searchByCatalogPage("mfr_123", 15)

// Similar products
await searchService.similarProducts("prod_123", 5)

// Autocomplete
await searchService.autocomplete("pom", 10)

// Facets
await searchService.getFacets("cat_123")
```

### DocumentationService

```typescript
const docService = req.scope.resolve("omexDocumentation")

// Create document
await docService.createDocument({
  manufacturer_id: "mfr_123",
  title: "Datasheet",
  document_type: "datasheet",
  file_url: "https://...",
  products: ["prod_123"]
})

// Get product docs
await docService.getProductDocuments("prod_123")

// Get manufacturer docs
await docService.getManufacturerDocuments("mfr_123", "datasheet")

// Search
await docService.searchDocuments("hydraulic pump")
```

## 📊 B2B Pricing Tiers Format

```json
{
  "1-10": { "price": 919.58, "discount": 0 },
  "11-50": { "price": 850.00, "discount": 7.5 },
  "51-100": { "price": 800.00, "discount": 13 },
  "100+": { "price": 750.00, "discount": 18 }
}
```

## 🔎 Full-Text Search Query

```sql
SELECT p.*,
  ts_rank(
    to_tsvector('simple', COALESCE(p.searchable_text, '')),
    to_tsquery('simple', 'pompa & hydrauliczna')
  ) as rank
FROM product p
WHERE to_tsvector('simple', COALESCE(p.searchable_text, ''))
  @@ to_tsquery('simple', 'pompa & hydrauliczna')
ORDER BY rank DESC
LIMIT 20
```

## 🎨 Structured Data Example

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Pompa Hydrauliczna Rexroth 5kW",
  "sku": "HYD-001",
  "brand": { "@type": "Brand", "name": "Rexroth" },
  "offers": {
    "@type": "Offer",
    "price": 919.58,
    "priceCurrency": "PLN",
    "availability": "https://schema.org/InStock"
  }
}
```

## 🗂️ File Locations

```
src/
├── migrations/          # 7 migration files
├── models/              # 6 model files
├── modules/             # 4 service modules
│   ├── omex-manufacturer/
│   ├── omex-seo/
│   ├── omex-b2b/
│   └── omex-documentation/
├── api/
│   ├── store/           # 8 store endpoints
│   └── admin/           # 10 admin endpoints
└── types/               # 5 type definition files
```

## 🐛 Troubleshooting

```bash
# Check migrations
npx medusa migrations show

# Verify indexes
psql -d your_db -c "SELECT * FROM pg_indexes WHERE tablename = 'product';"

# Test search
curl "http://localhost:9000/store/products/search?query=test"

# Check service resolution
# In route: const service = req.scope.resolve("omexManufacturer")
```

## 📈 Performance Tips

1. **Use searchable_text** for full-text search (GIN indexed)
2. **Use filter_attributes** for dynamic filters (GIN indexed)
3. **Denormalize** frequently accessed data
4. **Paginate** large result sets (limit/offset)
5. **Cache** sitemap.xml and robots.txt
6. **Update searchable_text** when product changes

## ✅ Checklist

- [ ] Run migrations
- [ ] Test search endpoints
- [ ] Create test manufacturer
- [ ] Update product SEO
- [ ] Test B2B pricing
- [ ] Generate sitemap
- [ ] Verify indexes
- [ ] Import products

## 📚 Documentation

- `BACKEND_INFRASTRUCTURE_README.md` - Complete overview
- `IMPLEMENTATION_GUIDE.md` - Detailed implementation guide
- `INFRASTRUCTURE_SUMMARY.md` - High-level summary
- `QUICK_REFERENCE.md` - This file

---

**Quick Links:**
- Medusa Docs: https://docs.medusajs.com
- PostgreSQL Full-Text: https://www.postgresql.org/docs/current/textsearch.html
- Schema.org: https://schema.org/Product
