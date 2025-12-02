# 🏗️ Phase 0 - Architecture Overview

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Search  │  │   SEO    │  │   B2B    │  │  Mfr     │   │
│  │   UI     │  │  Meta    │  │  Quotes  │  │  Catalog │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /store/search                                       │   │
│  │  /store/search/autocomplete                          │   │
│  │  /store/search/manufacturer-sku                      │   │
│  │  /store/seo/sitemap.xml                              │   │
│  │  /store/seo/robots.txt                               │   │
│  │  /admin/manufacturers                                │   │
│  │  /admin/b2b/quotes                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Search  │  │   SEO    │  │   B2B    │  │   Mfr    │   │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Products (Extended)                                 │   │
│  │  ├─ SEO fields (meta_title, slug, structured_data)  │   │
│  │  ├─ Search fields (searchable_text, indexes)        │   │
│  │  ├─ Manufacturer fields (mfr_sku, catalog_page)     │   │
│  │  └─ B2B fields (pricing_tiers, min_quantity)        │   │
│  │                                                       │   │
│  │  Manufacturers                                       │   │
│  │  ├─ Profiles (Rexroth, Parker, Hydac, etc.)         │   │
│  │  ├─ Catalog PDFs                                     │   │
│  │  └─ API endpoints                                    │   │
│  │                                                       │   │
│  │  Manufacturer Parts                                  │   │
│  │  ├─ SKU mapping                                      │   │
│  │  ├─ Catalog pages                                    │   │
│  │  └─ Datasheets                                       │   │
│  │                                                       │   │
│  │  B2B Tables                                          │   │
│  │  ├─ Customer groups                                  │   │
│  │  ├─ Quotes                                           │   │
│  │  └─ Purchase orders                                  │   │
│  │                                                       │   │
│  │  Technical Documents                                 │   │
│  │  ├─ Datasheets                                       │   │
│  │  ├─ Manuals                                          │   │
│  │  └─ Certifications                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Search Flow

```
User types "pompa hydrauliczna"
        │
        ▼
┌─────────────────────┐
│  Search Endpoint    │
│  /store/search      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Search Service     │
│  - Parse query      │
│  - Apply filters    │
│  - Build SQL        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Database Query     │
│  - Full-text search │
│  - Join tables      │
│  - Apply indexes    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Results            │
│  - 45 products      │
│  - Sorted by rank   │
│  - Paginated        │
└─────────────────────┘
```

## 🎯 SEO Flow

```
Product created/updated
        │
        ▼
┌─────────────────────┐
│  SEO Service        │
│  - Generate meta    │
│  - Create slug      │
│  - Build JSON-LD    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Save to DB         │
│  - meta_title       │
│  - meta_description │
│  - structured_data  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Sitemap Update     │
│  - Add to sitemap   │
│  - Update timestamp │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Google Crawl       │
│  - Index page       │
│  - Rank in search   │
└─────────────────────┘
```

## 🏭 Manufacturer Integration

```
CSV Import with manufacturer_sku
        │
        ▼
┌─────────────────────┐
│  Product Created    │
│  - HYD-001          │
│  - Pompa Rexroth    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Manufacturer       │
│  Lookup             │
│  - Find "Rexroth"   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Create Mapping     │
│  manufacturer_part  │
│  - mfr_sku          │
│  - catalog_page     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Searchable         │
│  - By our SKU       │
│  - By mfr SKU       │
│  - By catalog page  │
└─────────────────────┘
```

## 💼 B2B Pricing Flow

```
Customer adds 75 units to cart
        │
        ▼
┌─────────────────────┐
│  B2B Service        │
│  - Check customer   │
│    group            │
│  - Get pricing tier │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Calculate Price    │
│  Quantity: 75       │
│  Tier: 51-100       │
│  Discount: 13%      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Apply Discount     │
│  Base: €919.58      │
│  Final: €800.00     │
│  Savings: €119.58   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Generate Quote     │
│  - Total: €60,000   │
│  - Valid: 30 days   │
│  - Status: DRAFT    │
└─────────────────────┘
```

## 📊 Database Schema

### Products Table (Extended)
```sql
CREATE TABLE product (
  -- Core fields (existing)
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  sku VARCHAR(100) UNIQUE,
  price DECIMAL(10,2),
  
  -- SEO fields (Phase 0)
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  meta_keywords JSONB,
  slug VARCHAR(255) UNIQUE,
  canonical_url VARCHAR(500),
  og_title VARCHAR(60),
  og_description VARCHAR(160),
  og_image VARCHAR(500),
  structured_data JSONB,
  
  -- Manufacturer fields (Phase 0)
  manufacturer_id UUID,
  manufacturer_sku VARCHAR(100),
  catalog_page INT,
  technical_docs_url VARCHAR(500),
  
  -- B2B fields (Phase 0)
  pricing_tiers JSONB,
  min_order_quantity INT,
  lead_time_days INT,
  
  -- Search fields (Phase 0)
  searchable_text TEXT,
  filter_attributes JSONB,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_product_slug ON product(slug);
CREATE INDEX idx_product_searchable ON product USING GIN(to_tsvector('english', searchable_text));
CREATE INDEX idx_product_manufacturer ON product(manufacturer_id);
```

### Manufacturers Table
```sql
CREATE TABLE manufacturer (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  catalog_pdf_url VARCHAR(500),
  api_endpoint VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  products_count INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_manufacturer_slug ON manufacturer(slug);
CREATE INDEX idx_manufacturer_active ON manufacturer(is_active);
```

### Manufacturer Parts Table
```sql
CREATE TABLE manufacturer_part (
  id UUID PRIMARY KEY,
  manufacturer_id UUID REFERENCES manufacturer(id),
  product_id UUID REFERENCES product(id),
  manufacturer_sku VARCHAR(100),
  part_number VARCHAR(100),
  catalog_page INT,
  datasheet_url VARCHAR(500),
  created_at TIMESTAMP,
  
  UNIQUE(manufacturer_id, manufacturer_sku)
);

-- Indexes
CREATE INDEX idx_mfr_part_sku ON manufacturer_part(manufacturer_sku);
CREATE INDEX idx_mfr_part_catalog ON manufacturer_part(manufacturer_id, catalog_page);
```

## 🔐 Security

- ✅ Admin endpoints require authentication
- ✅ Store endpoints are public (read-only)
- ✅ Input validation on all endpoints
- ✅ SQL injection protection (parameterized queries)
- ✅ Rate limiting on search endpoints

## 📈 Performance Optimizations

1. **Database Indexes**
   - Full-text search index on `searchable_text`
   - B-tree indexes on `slug`, `sku`, `manufacturer_sku`
   - Composite indexes on frequently joined tables

2. **Caching**
   - Sitemap cached for 24 hours
   - Manufacturer list cached for 1 hour
   - Search results cached for 5 minutes

3. **Query Optimization**
   - Limit results to 100 per page
   - Use pagination for large result sets
   - Eager load related data (manufacturers, images)

4. **API Response**
   - Gzip compression enabled
   - JSON minification
   - Partial response support (select fields)

## 🚀 Scalability

Phase 0 is designed to scale:

- **100k+ products**: Full-text search with indexes
- **1000+ manufacturers**: Efficient SKU mapping
- **10k+ searches/day**: Cached results
- **Future-ready**: Can migrate to Elasticsearch

## 📊 Monitoring

Track these metrics:

- Search query performance (< 100ms target)
- Autocomplete latency (< 50ms target)
- Sitemap generation time (< 500ms target)
- Database query times
- API response times

## 🎉 Summary

Phase 0 provides a **solid foundation** for:
- ✅ SEO-optimized product pages
- ✅ Fast, accurate search
- ✅ Manufacturer data integration
- ✅ B2B pricing and quotes
- ✅ Technical documentation

**Ready for production!** 🚀
