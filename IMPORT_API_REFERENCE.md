# Bulk Import API Reference

Complete API documentation for the OMEX bulk product import system.

## Base URL

```
http://localhost:9000/admin/products/import
```

All endpoints require authentication with Bearer token.

---

## Import Endpoints

### 1. Import Products (with SSE)

**POST** `/admin/products/import`

Import products from CSV with real-time progress updates via Server-Sent Events.

**Request:**
```bash
curl -X POST http://localhost:9000/admin/products/import \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@products.csv"
```

**Response:** (Server-Sent Events stream)
```
data: {"status":"processing","total":10,"successful":5,"failed":0,"current_line":6}

data: {"status":"processing","total":20,"successful":15,"failed":0,"current_line":16}

data: {"status":"completed","total":120,"successful":118,"failed":2,"errors":[...],"duration_ms":5432}
```

**Status Codes:**
- `200` - Import started successfully
- `400` - Invalid file or missing file
- `500` - Server error

---

### 2. Import Products (simple)

**PUT** `/admin/products/import`

Import products from CSV with single response (no streaming).

**Request:**
```bash
curl -X PUT http://localhost:9000/admin/products/import \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@products.csv"
```

**Response:**
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

**Status Codes:**
- `200` - Import completed
- `400` - Invalid file
- `500` - Import failed

---

### 3. Validate CSV (Dry Run)

**POST** `/admin/products/import/validate`

Validate CSV without importing products.

**Request:**
```bash
curl -X POST http://localhost:9000/admin/products/import/validate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@products.csv"
```

**Response:**
```json
{
  "valid": false,
  "total_rows": 120,
  "validation_errors": [
    {
      "line": 15,
      "field": "sku",
      "reason": "SKU must match format XXX-000",
      "value": "INVALID"
    }
  ],
  "warnings": [
    "10 products missing English translations"
  ],
  "summary": {
    "duplicate_skus": ["HYD-001", "FLT-005"],
    "invalid_categories": ["cat-unknown"],
    "missing_translations": 10
  }
}
```

**Status Codes:**
- `200` - Validation completed
- `400` - Invalid file
- `500` - Validation failed

---

## History Endpoints

### 4. List Import History

**GET** `/admin/products/import/history`

Get list of all import operations.

**Query Parameters:**
- `limit` (number, default: 20) - Number of records per page
- `offset` (number, default: 0) - Pagination offset
- `status` (string, optional) - Filter by status: `processing`, `completed`, `failed`

**Request:**
```bash
curl -X GET "http://localhost:9000/admin/products/import/history?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "imports": [
    {
      "id": "imp_01HQ123ABC",
      "filename": "products-batch-1.csv",
      "user_id": "usr_01HQ456DEF",
      "status": "completed",
      "total_rows": 120,
      "successful_rows": 118,
      "failed_rows": 2,
      "duration_ms": 5432,
      "started_at": "2024-12-02T10:30:00Z",
      "completed_at": "2024-12-02T10:30:05Z"
    }
  ],
  "count": 1,
  "limit": 10,
  "offset": 0
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### 5. Get Import Details

**GET** `/admin/products/import/history/:id`

Get detailed information about a specific import.

**Request:**
```bash
curl -X GET http://localhost:9000/admin/products/import/history/imp_01HQ123ABC \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "id": "imp_01HQ123ABC",
  "filename": "products-batch-1.csv",
  "status": "completed",
  "total_rows": 120,
  "successful_rows": 118,
  "failed_rows": 2,
  "duration_ms": 5432,
  "started_at": "2024-12-02T10:30:00Z",
  "completed_at": "2024-12-02T10:30:05Z",
  "errors": [
    {
      "line": 15,
      "field": "price",
      "reason": "Price must be a positive number",
      "value": "invalid"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `404` - Import not found
- `500` - Server error

---

### 6. Delete Import History

**DELETE** `/admin/products/import/history/:id`

Delete an import history record.

**Request:**
```bash
curl -X DELETE http://localhost:9000/admin/products/import/history/imp_01HQ123ABC \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "id": "imp_01HQ123ABC",
  "deleted": true
}
```

**Status Codes:**
- `200` - Deleted successfully
- `404` - Import not found
- `500` - Server error

---

## Error & Template Endpoints

### 7. Download Error Report

**GET** `/admin/products/import/errors/:id`

Download error report for a specific import.

**Query Parameters:**
- `format` (string, default: `txt`) - Format: `txt` or `csv`

**Request (Text):**
```bash
curl -X GET "http://localhost:9000/admin/products/import/errors/imp_01HQ123ABC?format=txt" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o errors.txt
```

**Request (CSV):**
```bash
curl -X GET "http://localhost:9000/admin/products/import/errors/imp_01HQ123ABC?format=csv" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o errors.csv
```

**Response (Text):**
```
Import Error Report
===================

Total Errors: 2

Errors by Field:
  price: 1 errors
  sku: 1 errors

Detailed Errors:
================

Line 15: price
  Reason: Price must be a positive number
  Value: invalid

Line 42: sku
  Reason: SKU must match format XXX-000
  Value: INVALID-SKU
```

**Response (CSV):**
```csv
Line,Field,Reason,Value
15,price,Price must be a positive number,invalid
42,sku,SKU must match format XXX-000,INVALID-SKU
```

**Status Codes:**
- `200` - Success
- `404` - Import not found
- `500` - Server error

---

### 8. Download CSV Template

**GET** `/admin/products/import/template`

Download CSV template for product import.

**Query Parameters:**
- `type` (string, default: `basic`) - Template type: `basic` or `sample`

**Request (Basic):**
```bash
curl -X GET "http://localhost:9000/admin/products/import/template?type=basic" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o template.csv
```

**Request (With Sample Data):**
```bash
curl -X GET "http://localhost:9000/admin/products/import/template?type=sample" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o template-sample.csv
```

**Response:**
```csv
SKU,name_pl,name_en,name_de,desc_pl,desc_en,desc_de,price,cost,category_id,equipment_type,min_order_qty,technical_specs_json
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### 9. Get Import Statistics

**GET** `/admin/products/import/stats`

Get overall import statistics and metrics.

**Request:**
```bash
curl -X GET http://localhost:9000/admin/products/import/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "total_imports": 15,
  "successful_products": 1780,
  "failed_products": 20,
  "last_import_date": "2024-12-02T10:30:00Z",
  "success_rate": "98.89",
  "average_products_per_import": 120
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Error Codes

| Code | Description |
|------|-------------|
| `NO_FILE` | No file provided in request |
| `INVALID_FILE_TYPE` | File is not a CSV |
| `FILE_TOO_LARGE` | File exceeds 50MB limit |
| `IMPORT_FAILED` | Import process failed |
| `VALIDATION_FAILED` | CSV validation failed |
| `HISTORY_FETCH_ERROR` | Failed to fetch import history |
| `IMPORT_DETAIL_ERROR` | Failed to fetch import details |
| `IMPORT_DELETE_ERROR` | Failed to delete import record |
| `ERROR_REPORT_FAILED` | Failed to generate error report |
| `TEMPLATE_GENERATION_FAILED` | Failed to generate template |
| `STATS_FETCH_ERROR` | Failed to fetch statistics |

---

## CSV Format

### Required Fields

| Field | Type | Format | Example |
|-------|------|--------|---------|
| `sku` | string | XXX-000 | HYD-001 |
| `name_pl` | string | - | Pompa hydrauliczna |
| `price` | decimal | 0.00 | 599.99 |
| `category_id` | string | - | cat-hydraulika |

### Optional Fields

| Field | Type | Default | Example |
|-------|------|---------|---------|
| `name_en` | string | name_pl | Hydraulic pump |
| `name_de` | string | name_pl | Hydraulische Pumpe |
| `desc_pl` | string | "" | Opis produktu |
| `desc_en` | string | desc_pl | Product description |
| `desc_de` | string | desc_pl | Produktbeschreibung |
| `cost` | decimal | 0 | 299.99 |
| `equipment_type` | string | "" | Hydraulika |
| `min_order_qty` | integer | 1 | 1 |
| `technical_specs_json` | JSON string | {} | {"power": "5kW"} |

---

## Rate Limiting

- **Import**: 1 concurrent import per user
- **Validation**: 10 requests per minute
- **History**: 100 requests per minute
- **Templates**: 50 requests per minute

---

## Best Practices

1. **Validate First**: Always use `/validate` endpoint before importing
2. **Batch Size**: Keep imports under 5,000 products per file
3. **Error Handling**: Download error reports for failed imports
4. **Monitoring**: Check `/stats` regularly for success rates
5. **Templates**: Use `/template?type=sample` to understand format

---

## Examples

### Complete Import Workflow

```bash
# 1. Download template
curl -X GET "http://localhost:9000/admin/products/import/template?type=sample" \
  -H "Authorization: Bearer TOKEN" -o template.csv

# 2. Validate CSV
curl -X POST http://localhost:9000/admin/products/import/validate \
  -H "Authorization: Bearer TOKEN" -F "file=@my-products.csv"

# 3. Import products
curl -X PUT http://localhost:9000/admin/products/import \
  -H "Authorization: Bearer TOKEN" -F "file=@my-products.csv"

# 4. Check statistics
curl -X GET http://localhost:9000/admin/products/import/stats \
  -H "Authorization: Bearer TOKEN"

# 5. Download errors (if any)
curl -X GET "http://localhost:9000/admin/products/import/errors/imp_123?format=csv" \
  -H "Authorization: Bearer TOKEN" -o errors.csv
```

---

## Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "OMEX Bulk Import API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Import Products (SSE)",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/admin/products/import",
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "file",
              "type": "file",
              "src": "products.csv"
            }
          ]
        }
      }
    }
  ]
}
```

---

**Version**: 1.0.0  
**Last Updated**: December 2024
