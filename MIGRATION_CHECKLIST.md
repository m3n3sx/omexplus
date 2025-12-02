# Database Migration Checklist

## Pre-Migration

- [ ] **Backup database**
  ```bash
  pg_dump -U postgres -d omex_db > backup_$(date +%Y%m%d_%H%M%S).sql
  ```

- [ ] **Check current migration status**
  ```bash
  npx medusa migrations show
  ```

- [ ] **Review migration files**
  - Check `src/migrations/` directory
  - Verify migration order (timestamps)
  - Review SQL statements

## Migration Order

The migrations will run in this order:

1. ✅ `1733150000000-add-seo-fields-to-product.ts`
   - Adds SEO fields to product table
   - Creates slug index

2. ✅ `1733150100000-create-manufacturer-table.ts`
   - Creates manufacturer table
   - Creates indexes on slug and is_active

3. ✅ `1733150200000-create-manufacturer-part-table.ts`
   - Creates manufacturer_part table
   - Creates foreign keys to manufacturer and product
   - Creates indexes on SKU and part number

4. ✅ `1733150300000-add-manufacturer-fields-to-product.ts`
   - Adds manufacturer fields to product table
   - Creates foreign key to manufacturer
   - Creates indexes

5. ✅ `1733150400000-add-search-fields-to-product.ts`
   - Adds search and filter fields
   - Creates full-text search index (GIN)
   - Creates JSONB index (GIN)

6. ✅ `1733150500000-add-b2b-product-fields.ts`
   - Adds B2B fields to product table
   - Creates stock indexes

7. ✅ `1733150600000-create-b2b-tables.ts`
   - Creates quote table
   - Creates purchase_order table
   - Creates b2b_customer_group table
   - Creates indexes

8. ✅ `1733150700000-create-technical-document-table.ts`
   - Creates technical_document table
   - Creates foreign key to manufacturer
   - Creates GIN index on products array

## Running Migrations

### Step 1: Build Project
```bash
npm run build
```

### Step 2: Run Migrations
```bash
npx medusa migrations run
```

Expected output:
```
Running migrations...
✓ 1733150000000-add-seo-fields-to-product
✓ 1733150100000-create-manufacturer-table
✓ 1733150200000-create-manufacturer-part-table
✓ 1733150300000-add-manufacturer-fields-to-product
✓ 1733150400000-add-search-fields-to-product
✓ 1733150500000-add-b2b-product-fields
✓ 1733150600000-create-b2b-tables
✓ 1733150700000-create-technical-document-table
Migrations completed successfully!
```

### Step 3: Verify Migrations
```bash
npx medusa migrations show
```

Expected output should show all migrations as "executed".

## Post-Migration Verification

### 1. Check Tables
```sql
-- List all tables
\dt

-- Should include:
-- - manufacturer
-- - manufacturer_part
-- - quote
-- - purchase_order
-- - b2b_customer_group
-- - technical_document
```

### 2. Check Product Table Columns
```sql
-- Check product table structure
\d product

-- Should include new columns:
-- SEO: meta_title, meta_description, slug, etc.
-- Manufacturer: manufacturer_id, manufacturer_sku, etc.
-- Search: searchable_text, filter_attributes, etc.
-- B2B: b2b_min_quantity, b2b_pricing_tiers, etc.
-- Stock: stock_level, stock_reserved, stock_available, etc.
```

### 3. Check Indexes
```sql
-- List all indexes on product table
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'product';

-- Should include:
-- - IDX_product_slug
-- - IDX_product_manufacturer_id
-- - IDX_product_manufacturer_sku
-- - IDX_product_searchable_text (GIN)
-- - IDX_product_filter_attributes (GIN)
-- - IDX_product_is_featured
-- - IDX_product_is_bestseller
-- - IDX_product_is_new
-- - IDX_product_stock_level
-- - IDX_product_stock_available
```

### 4. Check Foreign Keys
```sql
-- List foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';

-- Should include:
-- product.manufacturer_id -> manufacturer.id
-- manufacturer_part.manufacturer_id -> manufacturer.id
-- manufacturer_part.product_id -> product.id
-- technical_document.manufacturer_id -> manufacturer.id
```

### 5. Test Services
```bash
# Start server
npm run dev

# Test manufacturer service
curl "http://localhost:9000/admin/manufacturers"

# Test search service
curl "http://localhost:9000/store/products/search?query=test"

# Test SEO service
curl "http://localhost:9000/store/seo/sitemap.xml"
```

## Rollback (If Needed)

If something goes wrong, you can rollback:

### Option 1: Restore from Backup
```bash
psql -U postgres -d omex_db < backup_YYYYMMDD_HHMMSS.sql
```

### Option 2: Manual Rollback
Each migration has a `down()` method. You can manually rollback:

```bash
# This is not directly supported by Medusa CLI
# You would need to manually execute the down() methods
```

### Option 3: Drop and Recreate
```bash
# WARNING: This will delete all data!
dropdb omex_db
createdb omex_db
npx medusa migrations run
```

## Common Issues

### Issue 1: "relation already exists"
**Cause:** Migration was partially run or table already exists
**Solution:**
```sql
-- Check if table exists
SELECT * FROM pg_tables WHERE tablename = 'manufacturer';

-- If exists, either:
-- 1. Skip this migration (mark as executed)
-- 2. Drop table and re-run
DROP TABLE IF EXISTS manufacturer CASCADE;
```

### Issue 2: "column already exists"
**Cause:** Column was added in previous attempt
**Solution:**
```sql
-- Check if column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'product' AND column_name = 'meta_title';

-- If exists, either:
-- 1. Skip this migration
-- 2. Drop column and re-run
ALTER TABLE product DROP COLUMN IF EXISTS meta_title;
```

### Issue 3: "foreign key constraint violation"
**Cause:** Parent table doesn't exist yet
**Solution:**
- Ensure migrations run in correct order
- Check that manufacturer table exists before adding foreign keys

### Issue 4: "index already exists"
**Cause:** Index was created in previous attempt
**Solution:**
```sql
-- Drop index and re-run
DROP INDEX IF EXISTS IDX_product_slug;
```

## Performance Considerations

After migrations, you may want to:

### 1. Analyze Tables
```sql
ANALYZE product;
ANALYZE manufacturer;
ANALYZE manufacturer_part;
```

### 2. Vacuum Tables
```sql
VACUUM ANALYZE product;
```

### 3. Check Index Usage
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename = 'product'
ORDER BY idx_scan DESC;
```

## Data Population

After successful migration:

### 1. Populate searchable_text
```sql
UPDATE product 
SET searchable_text = 
    COALESCE(title, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(sku, '');
```

### 2. Generate slugs
```sql
UPDATE product 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;
```

### 3. Set default values
```sql
UPDATE product 
SET 
    is_featured = false,
    is_bestseller = false,
    is_new = false,
    b2b_bulk_discount_available = false,
    requires_quote = false,
    stock_level = 0,
    stock_reserved = 0,
    stock_available = 0
WHERE is_featured IS NULL;
```

## Final Checklist

- [ ] All migrations executed successfully
- [ ] All tables created
- [ ] All indexes created
- [ ] All foreign keys created
- [ ] Services resolve correctly
- [ ] API endpoints respond
- [ ] No TypeScript errors
- [ ] Database backup created
- [ ] Documentation reviewed

## Next Steps

After successful migration:

1. ✅ **Test all endpoints**
2. ✅ **Import manufacturer data**
3. ✅ **Import product data**
4. ✅ **Generate SEO for products**
5. ✅ **Configure B2B pricing**
6. ✅ **Test search functionality**

---

**Status**: Ready for migration

**Estimated Time**: 5-10 minutes

**Risk Level**: Low (all migrations have rollback methods)

**Backup Required**: Yes (always backup before migrations)
