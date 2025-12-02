# 📚 Phase 0 - API Reference

## 🔍 SEARCH ENDPOINTS

### 1. Full-Text Search
```http
GET /store/search
```

**Query Parameters:**
- `q` (required) - Search query
- `category_id` - Filter by category
- `min_price` - Minimum price
- `max_price` - Maximum price
- `brand[]` - Filter by brands
- `equipment_type[]` - Filter by equipment types
- `in_stock` - Only in-stock products (true/false)
- `sort_by` - Sort field (price, created_at, popularity, name)
- `sort_order` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 12, max: 100)

**Example:**
```bash
curl "http://localhost:9000/store/search?q=pompa+hydrauliczna&min_price=500&max_price=1500&page=1&limit=12"
```

**Response:**
```json
{
  "products": [...],
  "total": 45,
  "page": 1,
  "limit": 12,
  "filters_applied": {
    "min_price": 500,
    "max_price": 1500
  }
}
```

### 2. Autocomplete
```http
GET /store/search/autocomplete
```

**Query Parameters:**
- `q` (required) - Search prefix
- `limit` - Max suggestions (default: 10)

**Example:**
```bash
curl "http://localhost:9000/store/search/autocomplete?q=pom&limit=5"
```

**Response:**
```json
{
  "query": "pom",
  "suggestions": [
    "Pompa hydrauliczna",
    "Pompa zębata",
    "Pompa tłokowa"
  ]
}
```

### 3. Search by Manufacturer SKU
```http
GET /store/search/manufacturer-sku
```

**Query Parameters:**
- `sku` (required) - Manufacturer SKU
- `manufacturer_id` - Filter by manufacturer

**Example:**
```bash
curl "http://localhost:9000/store/search/manufacturer-sku?sku=REXROTH-2A2E-3456"
```

**Response:**
```json
{
  "manufacturer_sku": "REXROTH-2A2E-3456",
  "manufacturer_id": null,
  "products": [...],
  "count": 1
}
```

## 🏭 MANUFACTURER ENDPOINTS

### 1. List Manufacturers
```http
GET /admin/manufacturers
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)
- `is_active` - Filter by active status (true/false)

**Example:**
```bash
curl "http://localhost:9000/admin/manufacturers?page=1&limit=20"
```

**Response:**
```json
{
  "manufacturers": [...],
  "total": 10,
  "page": 1,
  "limit": 20
}
```

### 2. Create Manufacturer
```http
POST /admin/manufacturers
```

**Body:**
```json
{
  "name": "Rexroth",
  "slug": "rexroth",
  "website_url": "https://www.boschrexroth.com",
  "country": "Germany",
  "description": "Bosch Rexroth - hydraulics leader",
  "catalog_pdf_url": "https://example.com/rexroth-catalog.pdf",
  "is_active": true
}
```

**Example:**
```bash
curl -X POST http://localhost:9000/admin/manufacturers \
  -H "Content-Type: application/json" \
  -d '{"name":"Rexroth","slug":"rexroth"}'
```

### 3. Get Manufacturer
```http
GET /admin/manufacturers/:id
```

### 4. Update Manufacturer
```http
PUT /admin/manufacturers/:id
```

### 5. Delete Manufacturer
```http
DELETE /admin/manufacturers/:id
```

## 🎯 SEO ENDPOINTS

### 1. Generate Sitemap
```http
GET /store/seo/sitemap.xml
```

**Example:**
```bash
curl "http://localhost:9000/store/seo/sitemap.xml"
```

**Response:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://omex.pl/produkty/pompa-001</loc>
    <lastmod>2024-12-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 2. Robots.txt
```http
GET /store/seo/robots.txt
```

**Example:**
```bash
curl "http://localhost:9000/store/seo/robots.txt"
```

**Response:**
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://omex.pl/sitemap.xml
```

### 3. Update Product SEO
```http
PUT /admin/products/:id/seo
```

**Body:**
```json
{
  "meta_title": "Pompa Hydrauliczna Rexroth | OMEX",
  "meta_description": "Mała pompa hydrauliczna Rexroth do koparek...",
  "slug": "pompa-hydrauliczna-rexroth-001",
  "canonical_url": "https://omex.pl/produkty/pompa-001"
}
```

## 💼 B2B ENDPOINTS

### 1. List Quotes
```http
GET /admin/b2b/quotes
```

**Query Parameters:**
- `status` - Filter by status (draft, sent, accepted, rejected)
- `customer_id` - Filter by customer
- `page` - Page number
- `limit` - Results per page

### 2. Create Quote
```http
POST /admin/b2b/quotes
```

**Body:**
```json
{
  "customer_id": "cust_123",
  "items": [
    {
      "product_id": "prod_123",
      "quantity": 75,
      "unit_price": 800.00
    }
  ],
  "valid_until": "2024-12-31",
  "notes": "Bulk order discount applied"
}
```

## 🧪 Testing Examples

### Test Search
```bash
# Basic search
curl "http://localhost:9000/store/search?q=pompa"

# Search with filters
curl "http://localhost:9000/store/search?q=pompa&min_price=500&max_price=1500&in_stock=true"

# Search with sorting
curl "http://localhost:9000/store/search?q=pompa&sort_by=price&sort_order=asc"
```

### Test Manufacturers
```bash
# List all
curl "http://localhost:9000/admin/manufacturers"

# Create new
curl -X POST http://localhost:9000/admin/manufacturers \
  -H "Content-Type: application/json" \
  -d '{"name":"Parker","slug":"parker","website_url":"https://parker.com"}'

# Get one
curl "http://localhost:9000/admin/manufacturers/mfr_123"
```

### Test SEO
```bash
# Get sitemap
curl "http://localhost:9000/store/seo/sitemap.xml" > sitemap.xml

# Get robots.txt
curl "http://localhost:9000/store/seo/robots.txt"

# Update product SEO
curl -X PUT http://localhost:9000/admin/products/prod_123/seo \
  -H "Content-Type: application/json" \
  -d '{"meta_title":"New Title","slug":"new-slug"}'
```

## 📊 Database Schema

### Products Table (Extended)
```sql
-- SEO Fields
meta_title VARCHAR(60)
meta_description VARCHAR(160)
meta_keywords JSONB
slug VARCHAR(255) UNIQUE
canonical_url VARCHAR(500)
og_title VARCHAR(60)
og_description VARCHAR(160)
og_image VARCHAR(500)
structured_data JSONB

-- Manufacturer Fields
manufacturer_id UUID
manufacturer_sku VARCHAR(100)
catalog_page INT
technical_docs_url VARCHAR(500)

-- B2B Fields
pricing_tiers JSONB
min_order_quantity INT
lead_time_days INT

-- Search Fields
searchable_text TEXT
filter_attributes JSONB
```

### Manufacturers Table
```sql
id UUID PRIMARY KEY
name VARCHAR(255)
slug VARCHAR(255) UNIQUE
logo_url VARCHAR(500)
website_url VARCHAR(500)
catalog_pdf_url VARCHAR(500)
api_endpoint VARCHAR(500)
is_active BOOLEAN
products_count INT
```

### Manufacturer Parts Table
```sql
id UUID PRIMARY KEY
manufacturer_id UUID
product_id UUID
manufacturer_sku VARCHAR(100)
part_number VARCHAR(100)
catalog_page INT
datasheet_url VARCHAR(500)
```

## 🚀 Quick Start

1. Run migrations:
```bash
npm run migrations:run
```

2. Seed data:
```bash
npx ts-node src/scripts/seed-manufacturers.ts
npx ts-node src/scripts/generate-seo.ts
```

3. Start server:
```bash
npm run dev
```

4. Test endpoints:
```bash
./test-phase-0.sh
```
