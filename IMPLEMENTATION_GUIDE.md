# OMEX Backend Infrastructure - Implementation Guide

## Quick Start

### 1. Run Migrations

```bash
# Build the project
npm run build

# Run migrations
npx medusa migrations run

# Verify migrations
npx medusa migrations show
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Test API Endpoints

```bash
# Test search
curl "http://localhost:9000/store/products/search?query=pompa&limit=10"

# Test autocomplete
curl "http://localhost:9000/store/products/search/autocomplete?prefix=pom"

# Test sitemap
curl "http://localhost:9000/store/seo/sitemap.xml"

# Test robots.txt
curl "http://localhost:9000/store/seo/robots.txt"
```

## Module Configuration

The following modules have been added to `medusa-config.ts`:

- `omex-manufacturer` - Manufacturer management
- `omex-seo` - SEO optimization
- `omex-b2b` - B2B features
- `omex-documentation` - Technical documentation

## Database Schema

### Product Table Extensions

The product table now includes:

**SEO Fields:**
- `meta_title` (VARCHAR 60)
- `meta_description` (VARCHAR 160)
- `meta_keywords` (JSONB)
- `slug` (VARCHAR 255, UNIQUE)
- `canonical_url` (VARCHAR 500)
- `og_title`, `og_description`, `og_image`
- `schema_type` (VARCHAR 50)
- `structured_data` (JSONB)

**Manufacturer Fields:**
- `manufacturer_id` (UUID, FK to manufacturer)
- `manufacturer_sku` (VARCHAR 255)
- `manufacturer_part_number` (VARCHAR 255)
- `manufacturer_catalog_page` (INT)
- `manufacturer_catalog_pdf_url` (VARCHAR 500)
- `manufacturer_technical_docs` (JSONB)

**Search Fields:**
- `searchable_text` (TEXT) - Full-text search
- `filter_attributes` (JSONB) - Dynamic filters
- `is_featured`, `is_bestseller`, `is_new` (BOOLEAN)
- `comparable_products` (JSONB)
- `breadcrumb` (VARCHAR 500)

**B2B Fields:**
- `b2b_min_quantity` (INT)
- `b2b_pricing_tiers` (JSONB)
- `b2b_discount_percentage` (DECIMAL)
- `b2b_lead_time_days` (INT)
- `b2b_bulk_discount_available` (BOOLEAN)
- `requires_quote` (BOOLEAN)

**Stock Fields:**
- `supplier_ids` (JSONB)
- `stock_level`, `stock_reserved`, `stock_available` (INT)
- `stock_warehouse_locations` (JSONB)
- `reorder_point`, `supplier_lead_time` (INT)

### New Tables

**manufacturer:**
```sql
CREATE TABLE manufacturer (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  description TEXT,
  country VARCHAR(100),
  catalog_pdf_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  products_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**manufacturer_part:**
```sql
CREATE TABLE manufacturer_part (
  id UUID PRIMARY KEY,
  manufacturer_id UUID NOT NULL REFERENCES manufacturer(id),
  product_id UUID NOT NULL REFERENCES product(id),
  manufacturer_sku VARCHAR(255) NOT NULL,
  part_number VARCHAR(255),
  catalog_page INT,
  datasheet_json JSONB,
  UNIQUE(manufacturer_id, manufacturer_sku)
);
```

**quote:**
```sql
CREATE TABLE quote (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  valid_until TIMESTAMP,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**purchase_order:**
```sql
CREATE TABLE purchase_order (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  po_number VARCHAR(255) UNIQUE NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_terms VARCHAR(50),
  delivery_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Service Usage

### ManufacturerService

```typescript
// Create manufacturer
const manufacturer = await manufacturerService.createManufacturer({
  name: "Rexroth",
  slug: "rexroth",
  country: "Germany",
  website_url: "https://www.boschrexroth.com",
  catalog_pdf_url: "https://example.com/rexroth-catalog.pdf",
})

// Search by manufacturer SKU
const products = await manufacturerService.searchByManufacturerSKU(
  "REXROTH-2A2E-3456",
  "mfr_123"
)

// Search by catalog page
const catalogProducts = await manufacturerService.searchByCatalogPage(
  "mfr_123",
  15
)

// Sync catalog
const syncResult = await manufacturerService.syncCatalog("mfr_123")
```

### SEOService

```typescript
// Generate meta tags
const metaTags = await seoService.generateMetaTags(product)

// Generate structured data
const structuredData = seoService.generateStructuredData(product)

// Update product SEO
await seoService.updateProductSEO("prod_123", {
  meta_title: "Pompa Hydrauliczna Rexroth 5kW | OMEX",
  meta_description: "Profesjonalna pompa hydrauliczna...",
  og_image: "https://omex.pl/images/products/hyd-001.jpg",
})

// Generate sitemap
const sitemap = await seoService.generateSitemap({
  includeCategories: true,
  includeManufacturers: true,
})

// Validate SEO
const validation = seoService.validateMetaTags(metaTags)
if (!validation.valid) {
  console.warn("SEO warnings:", validation.warnings)
}
```

### B2BService

```typescript
// Get pricing tier
const pricing = await b2bService.getPricingTier("prod_123", 50)
// Returns: { price: 850.00, discount: 7.5 }

// Calculate B2B pricing
const calculation = await b2bService.calculateB2BPricing([
  { product_id: "prod_123", quantity: 50 },
  { product_id: "prod_456", quantity: 100 },
])

// Create quote
const quote = await b2bService.createQuote({
  customer_id: "cust_123",
  items: [
    {
      product_id: "prod_123",
      quantity: 50,
      unit_price: 850.00,
      total: 42500.00,
    },
  ],
  valid_until: new Date("2025-01-31"),
  notes: "Bulk order discount applied",
})

// Create purchase order
const po = await b2bService.createPurchaseOrder({
  customer_id: "cust_123",
  po_number: "PO-2024-001",
  items: [...],
  payment_terms: "NET30",
  delivery_date: new Date("2025-01-15"),
})

// Validate B2B order
const validation = await b2bService.validateB2BOrder([
  { product_id: "prod_123", quantity: 5 },
])
if (!validation.valid) {
  console.error("Validation errors:", validation.errors)
}
```

### DocumentationService

```typescript
// Create document
const doc = await documentationService.createDocument({
  manufacturer_id: "mfr_123",
  title: "Rexroth Pump Datasheet",
  document_type: "datasheet",
  file_url: "https://example.com/docs/rexroth-pump.pdf",
  file_size: 2048576,
  mime_type: "application/pdf",
  products: ["prod_123", "prod_456"],
})

// Get product documents
const docs = await documentationService.getProductDocuments("prod_123")

// Get manufacturer documents
const mfrDocs = await documentationService.getManufacturerDocuments(
  "mfr_123",
  "datasheet"
)

// Search documents
const searchResults = await documentationService.searchDocuments(
  "hydraulic pump",
  { document_type: "datasheet" }
)
```

### Enhanced SearchService

```typescript
// Full-text search
const results = await searchService.search(
  "pompa hydrauliczna",
  { category_id: "cat_123", min_price: 100, max_price: 2000 },
  { field: "price", order: "asc" },
  { page: 1, limit: 20 }
)

// Search by manufacturer SKU
const products = await searchService.searchByManufacturerSKU(
  "REXROTH-2A2E-3456"
)

// Search by catalog page
const catalogProducts = await searchService.searchByCatalogPage(
  "mfr_123",
  15
)

// Get similar products
const similar = await searchService.similarProducts("prod_123", 5)

// Get related products
const related = await searchService.relatedProducts("prod_123", 5)

// Autocomplete
const suggestions = await searchService.autocomplete("pom", 10)

// Get facets
const facets = await searchService.getFacets("cat_123")
```

## API Examples

### Store API

**Search Products:**
```bash
curl "http://localhost:9000/store/products/search?query=pompa&category=cat_123&price_min=100&price_max=2000&sort=price_asc&limit=20"
```

**Search by Manufacturer SKU:**
```bash
curl "http://localhost:9000/store/products/search/manufacturer?sku=REXROTH-2A2E-3456&manufacturer_id=mfr_123"
```

**Autocomplete:**
```bash
curl "http://localhost:9000/store/products/search/autocomplete?prefix=pom&limit=10"
```

**Get Similar Products:**
```bash
curl "http://localhost:9000/store/products/prod_123/similar?limit=5"
```

**Get Facets:**
```bash
curl "http://localhost:9000/store/products/facets?category=cat_123"
```

**Get Manufacturer Catalog:**
```bash
curl "http://localhost:9000/store/manufacturers/mfr_123/catalog?page=15"
```

**Get Sitemap:**
```bash
curl "http://localhost:9000/store/seo/sitemap.xml"
```

**Get Robots.txt:**
```bash
curl "http://localhost:9000/store/seo/robots.txt"
```

### Admin API

**Create Manufacturer:**
```bash
curl -X POST "http://localhost:9000/admin/manufacturers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rexroth",
    "slug": "rexroth",
    "country": "Germany",
    "website_url": "https://www.boschrexroth.com"
  }'
```

**Update Product SEO:**
```bash
curl -X POST "http://localhost:9000/admin/products/prod_123/seo" \
  -H "Content-Type: application/json" \
  -d '{
    "meta_title": "Pompa Hydrauliczna Rexroth 5kW | OMEX",
    "meta_description": "Profesjonalna pompa hydrauliczna do koparek",
    "meta_keywords": ["pompa", "hydrauliczna", "rexroth"]
  }'
```

**Create Quote:**
```bash
curl -X POST "http://localhost:9000/admin/b2b/quotes" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_123",
    "items": [
      {
        "product_id": "prod_123",
        "quantity": 50,
        "unit_price": 850.00,
        "total": 42500.00
      }
    ],
    "valid_until": "2025-01-31T23:59:59Z"
  }'
```

**Sync Manufacturer Catalog:**
```bash
curl -X POST "http://localhost:9000/admin/manufacturers/mfr_123/sync-catalog"
```

## Performance Optimization

### Indexes

All critical indexes are created automatically by migrations:

- Full-text search: GIN index on `searchable_text`
- JSONB queries: GIN indexes on `filter_attributes`, `products`
- Foreign keys: B-tree indexes on all FK columns
- Unique constraints: Unique indexes on `slug`, `po_number`, etc.

### Query Optimization

**Use searchable_text for full-text search:**
```sql
WHERE to_tsvector('simple', searchable_text) @@ to_tsquery('simple', 'pompa')
```

**Use JSONB operators for filters:**
```sql
WHERE filter_attributes @> '{"material": "steel"}'::jsonb
```

**Use partial indexes for boolean flags:**
```sql
CREATE INDEX idx_featured ON product (is_featured) WHERE is_featured = true;
```

### Denormalization

The `searchable_text` field is denormalized for performance. Update it whenever:
- Product title changes
- Product description changes
- Category changes
- Manufacturer changes

Example trigger (optional):
```sql
CREATE OR REPLACE FUNCTION update_searchable_text()
RETURNS TRIGGER AS $$
BEGIN
  NEW.searchable_text := 
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.sku, '') || ' ' ||
    COALESCE(NEW.manufacturer_part_number, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_searchable_text
BEFORE INSERT OR UPDATE ON product
FOR EACH ROW
EXECUTE FUNCTION update_searchable_text();
```

## Testing

### Unit Tests

```typescript
// Test SEO service
describe("SEOService", () => {
  it("should generate valid meta tags", async () => {
    const metaTags = await seoService.generateMetaTags(mockProduct)
    expect(metaTags.meta_title).toBeDefined()
    expect(metaTags.meta_title.length).toBeLessThanOrEqual(60)
  })

  it("should validate SEO fields", () => {
    const validation = seoService.validateMetaTags({
      meta_title: "Test",
      meta_description: "Test description",
    })
    expect(validation.valid).toBe(true)
  })
})

// Test B2B service
describe("B2BService", () => {
  it("should calculate correct pricing tier", async () => {
    const pricing = await b2bService.getPricingTier("prod_123", 50)
    expect(pricing.price).toBe(850.00)
    expect(pricing.discount).toBe(7.5)
  })
})
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration:http
```

## Troubleshooting

### Migration Issues

**Problem:** Migration fails with "relation already exists"
**Solution:** Check if migration was already run:
```bash
npx medusa migrations show
```

**Problem:** Foreign key constraint violation
**Solution:** Ensure parent tables exist before running dependent migrations

### Search Issues

**Problem:** Full-text search returns no results
**Solution:** Ensure `searchable_text` is populated:
```sql
UPDATE product SET searchable_text = title || ' ' || description;
```

**Problem:** Slow search queries
**Solution:** Check if GIN index exists:
```sql
SELECT * FROM pg_indexes WHERE tablename = 'product' AND indexname LIKE '%searchable%';
```

### B2B Issues

**Problem:** Pricing tier not found
**Solution:** Ensure `b2b_pricing_tiers` is valid JSONB:
```sql
SELECT b2b_pricing_tiers FROM product WHERE id = 'prod_123';
```

## Next Steps

1. **Import Products**: Use the infrastructure to import your product catalog
2. **Populate SEO**: Run auto-generate SEO for all products
3. **Add Manufacturers**: Import manufacturer data
4. **Configure B2B**: Set up pricing tiers and customer groups
5. **Test Search**: Verify full-text search performance
6. **Frontend Integration**: Connect storefront to APIs

## Support

For issues or questions:
1. Check this guide
2. Review `BACKEND_INFRASTRUCTURE_README.md`
3. Check Medusa.js 2.0 documentation
4. Review PostgreSQL full-text search docs

---

**Status**: ✅ Ready for Implementation
