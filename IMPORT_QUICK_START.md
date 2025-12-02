# Bulk Import - Quick Start Guide

## 🚀 Setup (One-time)

```bash
# 1. Install dependencies
npm install

# 2. Run migrations
npm run build
npx medusa migrations run

# 3. Start Medusa
npm run dev
```

## ✅ Test CSV Before Import

```bash
npm run test:import
```

This validates:
- Required fields present
- SKU format correct
- Prices are valid numbers
- JSON specs are valid
- Shows category breakdown

## 📤 Import Products

### Option 1: Using curl (with progress)

```bash
curl -X POST http://localhost:9000/admin/products/import \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "file=@sample-products-120.csv"
```

### Option 2: Using curl (simple response)

```bash
curl -X PUT http://localhost:9000/admin/products/import \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "file=@sample-products-120.csv"
```

### Option 3: Using Postman

1. Method: `POST`
2. URL: `http://localhost:9000/admin/products/import`
3. Headers: `Authorization: Bearer YOUR_TOKEN`
4. Body: `form-data`, key: `file`, value: select CSV file

## 📊 Sample Data

The `sample-products-120.csv` includes:

| Category | Products | SKU Range |
|----------|----------|-----------|
| Hydraulika | 20 | HYD-001 to HYD-020 |
| Filtry | 20 | FLT-001 to FLT-020 |
| Osprzęt | 20 | SPW-001 to SPW-020 |
| Łożyska | 20 | LŁ-001 to LŁ-020 |
| Silniki | 20 | SIL-001 to SIL-020 |
| Łyżki | 20 | LŻ-001 to LŻ-020 |

## 🔍 CSV Format

```csv
SKU,name_pl,name_en,name_de,desc_pl,desc_en,desc_de,price,cost,category_id,equipment_type,min_order_qty,technical_specs_json
HYD-001,Pompa hydrauliczna,Hydraulic pump,Hydraulische Pumpe,Opis...,Description...,Beschreibung...,599.99,299.99,cat-hydraulika,Hydraulika,1,"{""power"": ""5kW""}"
```

### Required Fields
- `sku` - Format: XXX-000 (e.g., HYD-001)
- `name_pl` - Polish name
- `price` - Decimal number
- `category_id` - Category identifier

## 📈 Response Format

```json
{
  "status": "completed",
  "total": 120,
  "successful": 118,
  "failed": 2,
  "errors": [
    {
      "line": 15,
      "field": "price",
      "reason": "Price must be a positive number",
      "value": "invalid"
    }
  ],
  "duration_ms": 5432
}
```

## ⚠️ Common Issues

### 1. "No file provided"
- Make sure you're using `-F "file=@filename.csv"` in curl
- In Postman, use `form-data` not `raw`

### 2. "Invalid file type"
- File must have `.csv` extension
- Check file is not corrupted

### 3. "File too large"
- Maximum size: 50MB
- Split large files into smaller chunks

### 4. SKU validation errors
- Format must be: 3 uppercase letters + dash + 3 digits
- Examples: `HYD-001`, `FLT-020`, `SIL-015`

## 🎯 Next Steps

1. ✅ Test with sample CSV
2. ✅ Verify products imported correctly
3. ✅ Create your own CSV with real data
4. ✅ Import in batches (1000-5000 products at a time)

## 📚 Full Documentation

See `BULK_IMPORT_README.md` for complete documentation.

## 🆘 Need Help?

1. Run validation: `npm run test:import`
2. Check Medusa logs: `npm run dev` (watch console)
3. Verify database: `psql -d your_db -c "SELECT COUNT(*) FROM product;"`
