# OMEX Backend Infrastructure - Enterprise Features

## Overview

This document describes the comprehensive backend infrastructure layer for the OMEX B2B e-commerce platform. This is the **FOUNDATION LAYER** that enables scalability, advanced search, SEO optimization, and B2B features.

## What Was Implemented

### 1. Database Schema Extensions

#### Product Table Extensions
- **SEO Fields**: meta_title, meta_description, meta_keywords, slug, canonical_url, og_title, og_description, og_image, schema_type, structured_data
- **Manufacturer Fields**: manufacturer_id, manufacturer_sku, manufacturer_part_number, manufacturer_catalog_page, manufacturer_catalog_pdf_url, manufacturer_technical_docs
- **Search Fields**: searchable_text, filter_attributes, is_featured, is_bestseller, is_new, comparable_products, breadcrumb
- **B2B Fields**: b2b_min_quantity, b2b_pricing_tiers, b2b_discount_percentage, b2b_lead_time_days, b2b_bulk_discount_available, requires_quote
- **Stock Fields**: supplier_ids, stock_level, stock_reserved, stock_available, stock_warehouse_locations, reorder_point, supplier_lead_time

#### New Tables
- **manufacturer**: Stores manufacturer information (Rexroth, Parker, Hydac, etc.)
- **manufacturer_part**: Links products to manufacturer SKUs and catalog pages
- **b2b_customer_group**: B2B customer groups with custom pricing
- **quote**: Quote system for B2B customers
- **purchase_order**: Purchase order management
- **technical_document**: Technical documentation library

### 2. Database Migrations

All migrations are located in `src/migrations/`:

1. `1733150000000-add-seo-fields-to-product.ts` - SEO fields
2. `1733150100000-create-manufacturer-table.ts` - Manufacturer table
3. `1733150200000-create-manufacturer-part-table.ts` - Manufacturer parts
4. `1733150300000-add-manufacturer-fields-to-product.ts` - Product-manufacturer links
5. `1733150400000-add-search-fields-to-product.ts` - Search and filter fields
6. `1733150500000-add-b2b-product-fields.ts` - B2B fields
7. `1733150600000-create-b2b-tables.ts` - B2B tables (quotes, POs)
8. `1733150700000-create-technical-document-table.ts` - Documentation

### 3. Models

All models are in `src/models/`:

- `manufacturer.ts` - Manufacturer model
- `manufacturer-part.ts` - Manufacturer part model
- `b2b-customer-group.ts` - B2B customer group model
- `quote.ts` - Quote model
- `purchase-order.ts` - Purchase order model
- `technical-document.ts` - Technical document model

### 4. Services

#### ManufacturerService (`src/modules/omex-manufacturer/`)
- Create/update/delete manufacturers
- Sync manufacturer catalogs
- Search by manufacturer SKU
- Search by catalog page
- Manage manufacturer parts

#### SEOService (`src/modules/omex-seo/`)
- Generate meta tags (title, description, keywords)
- Generate structured data (JSON-LD for Google)
- Generate canonical URLs
- Generate sitemap.xml
- Generate robots.txt
- Validate SEO fields

#### B2BService (`src/modules/omex-b2b/`)
- Calculate B2B pricing tiers
- Create and manage quotes
- Create and manage purchase orders
- Validate B2B orders
- Manage customer groups

#### DocumentationService (`src/modules/omex-documentation/`)
- Create/update/delete technical documents
- Associate documents with products
- Search documents
- Get product/manufacturer documents

#### Enhanced SearchService (`src/modules/omex-search/`)
- Full-text search with PostgreSQL
- Search by manufacturer SKU
- Search by catalog page
- Similar products
- Related products
- Autocomplete
- Faceted search

### 5. API Endpoints

#### Store Endpoints

**Search:**
- `GET /store/products/search` - Basic search with filters
- `GET /store/products/search/manufacturer` - Search by manufacturer SKU
- `GET /store/products/search/autocomplete` - Autocomplete suggestions
- `GET /store/products/facets` - Get available filters
- `GET /store/products/:id/similar` - Get similar products
- `GET /store/manufacturers/:id/catalog` - Get catalog products by page

**SEO:**
- `GET /store/seo/sitemap.xml` - Generate sitemap
- `GET /store/seo/robots.txt` - Generate robots.txt

#### Admin Endpoints

**Manufacturers:**
- `GET /admin/manufacturers` - List manufacturers
- `POST /admin/manufacturers` - Create manufacturer
- `GET /admin/manufacturers/:id` - Get manufacturer
- `PUT /admin/manufacturers/:id` - Update manufacturer
- `DELETE /admin/manufacturers/:id` - Delete manufacturer
- `POST /admin/manufacturers/:id/sync-catalog` - Sync catalog

**SEO:**
- `GET /admin/products/:id/seo` - Get product SEO
- `POST /admin/products/:id/seo` - Set product SEO
- `PUT /admin/products/:id/seo` - Update product SEO

**B2B:**
- `GET /admin/b2b/quotes` - List quotes
- `POST /admin/b2b/quotes` - Create quote
- `GET /admin/b2b/purchase-orders` - List purchase orders
- `POST /admin/b2b/purchase-orders` - Create purchase order

## Usage Examples

### 1. Search by Text

```bash
GET /store/products/search?query=pompa+hydrauliczna&limit=20&offset=0
```

### 2. Search by Manufacturer SKU

```bash
GET /store/products/search/manufacturer?sku=REXROTH-2A2E-3456
```

### 3. Search by Catalog Page

```bash
GET /store/manufacturers/mfr_123/catalog?page=15
```

### 4. Get Similar Products

```bash
GET /store/products/prod_123/similar?limit=5
```

### 5. Autocomplete

```bash
GET /store/products/search/autocomplete?prefix=pom
```

### 6. Create Quote

```bash
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
  ],
  "valid_until": "2025-01-31T23:59:59Z",
  "notes": "Bulk order discount applied"
}
```

### 7. Update Product SEO

```bash
POST /admin/products/prod_123/seo
{
  "meta_title": "Pompa Hydrauliczna Rexroth 5kW | OMEX",
  "meta_description": "Mała pompa hydrauliczna Rexroth do koparek. 5kW, 250 bar. Gwarancja 2 lata.",
  "meta_keywords": ["pompa", "hydrauliczna", "rexroth", "koparka"],
  "og_title": "Pompa Hydrauliczna Rexroth 5kW",
  "og_description": "Profesjonalna pompa hydrauliczna do maszyn budowlanych",
  "og_image": "https://omex.pl/images/products/hyd-001.jpg"
}
```

### 8. Generate Sitemap

```bash
GET /store/seo/sitemap.xml
```

## Database Indexes

The following indexes are created for optimal performance:

### Product Table
- `IDX_product_slug` - Fast slug lookups
- `IDX_product_manufacturer_id` - Manufacturer filtering
- `IDX_product_manufacturer_sku` - Manufacturer SKU search
- `IDX_product_manufacturer_part_number` - Part number search
- `IDX_product_searchable_text` - Full-text search (GIN index)
- `IDX_product_filter_attributes` - JSONB filter queries (GIN index)
- `IDX_product_is_featured` - Featured products
- `IDX_product_is_bestseller` - Bestseller products
- `IDX_product_is_new` - New products
- `IDX_product_stock_level` - Stock queries
- `IDX_product_stock_available` - Available stock queries

### Manufacturer Table
- `IDX_manufacturer_slug` - Slug lookups
- `IDX_manufacturer_is_active` - Active manufacturers

### Manufacturer Part Table
- `IDX_manufacturer_part_sku` - SKU search
- `IDX_manufacturer_part_number` - Part number search
- `IDX_manufacturer_part_catalog_page` - Catalog page search
- `IDX_manufacturer_part_unique` - Unique constraint (manufacturer_id, manufacturer_sku)

### B2B Tables
- `IDX_quote_customer_id` - Customer quotes
- `IDX_quote_status` - Quote status filtering
- `IDX_purchase_order_customer_id` - Customer POs
- `IDX_purchase_order_po_number` - PO number lookup
- `IDX_purchase_order_status` - PO status filtering

### Technical Document Table
- `IDX_technical_document_manufacturer_id` - Manufacturer docs
- `IDX_technical_document_type` - Document type filtering
- `IDX_technical_document_products` - Product association (GIN index)

## Search Architecture

### PostgreSQL Full-Text Search

The system uses PostgreSQL's built-in full-text search with `tsvector` and `tsquery`:

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
```

### Searchable Text Field

The `searchable_text` field is a denormalized field that contains:
- Product title
- Product description
- SKU
- Part number
- Manufacturer name
- Category name
- Technical specs (flattened)

This field should be updated whenever product data changes.

### Future: Elasticsearch Migration

The architecture is designed to support Elasticsearch migration:
1. Keep PostgreSQL full-text search for MVP (10k-100k products)
2. Add Elasticsearch when scaling to 1M+ products
3. Use same service interface (no API changes needed)

## B2B Pricing Tiers

B2B pricing tiers are stored as JSONB:

```json
{
  "1-10": { "price": 919.58, "discount": 0 },
  "11-50": { "price": 850.00, "discount": 7.5 },
  "51-100": { "price": 800.00, "discount": 13 },
  "100+": { "price": 750.00, "discount": 18 }
}
```

The B2BService automatically calculates the correct price based on quantity.

## SEO Features

### Structured Data (JSON-LD)

Every product generates structured data for Google Rich Snippets:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Pompa Hydrauliczna Rexroth 5kW",
  "description": "Profesjonalna pompa hydrauliczna...",
  "image": "https://omex.pl/images/products/hyd-001.jpg",
  "sku": "HYD-001",
  "brand": {
    "@type": "Brand",
    "name": "Rexroth"
  },
  "offers": {
    "@type": "Offer",
    "price": 919.58,
    "priceCurrency": "PLN",
    "availability": "https://schema.org/InStock",
    "url": "https://omex.pl/hydraulika/pompa-rexroth-5kw"
  }
}
```

### Canonical URLs

Format: `https://omex.pl/{category}/{slug}`

Example: `https://omex.pl/hydraulika/pompa-rexroth-5kw`

### Sitemap Generation

The sitemap includes:
- Homepage
- All products
- All categories
- All manufacturers

Updated automatically when content changes.

## Running Migrations

```bash
# Run all migrations
npm run build
medusa migrations run

# Or using npx
npx medusa migrations run
```

## Next Steps

1. **Product Import**: Now that the infrastructure is ready, you can import products
2. **Frontend Integration**: Connect the storefront to these APIs
3. **Admin UI**: Build admin interfaces for manufacturers, SEO, B2B
4. **Search Optimization**: Fine-tune full-text search queries
5. **Elasticsearch**: Add when scaling beyond 100k products

## Architecture Benefits

✅ **Scalable**: Designed for 100k+ products
✅ **SEO-Ready**: Full meta tags, structured data, sitemap
✅ **B2B-Ready**: Pricing tiers, quotes, purchase orders
✅ **Search-Ready**: Full-text search, manufacturer search, catalog search
✅ **Future-Proof**: Easy Elasticsearch migration path
✅ **Type-Safe**: Full TypeScript implementation
✅ **Normalized**: Proper database design with foreign keys
✅ **Indexed**: Optimized queries with proper indexes

## Support

For questions or issues, refer to:
- Medusa.js 2.0 documentation
- PostgreSQL full-text search documentation
- This README

---

**Status**: ✅ Infrastructure Complete - Ready for Product Import
