---
name: "medusa-api-reference"
displayName: "Medusa API Reference"
description: "Szybki przewodnik po Medusa Store API - produkty, koszyk, zamówienia, klienci, płatności. Przykłady requestów i responsów."
keywords: ["medusa", "api", "reference", "endpoints", "store-api"]
author: "Medusa Team"
---

# Medusa API Reference

## Przegląd

Szybki przewodnik po najważniejszych endpointach Medusa Store API z przykładami użycia.

**Base URL:** `http://localhost:9000` (development) lub `https://api.yourdomain.com` (production)

## Authentication

Większość Store API endpoints nie wymaga autentykacji. Dla operacji wymagających autentykacji (np. customer endpoints), używaj cookies z session ID.

```typescript
// Fetch z credentials
fetch('http://localhost:9000/store/customers/me', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
```

## Products API

### List Products

```bash
GET /store/products
```

**Query Parameters:**
- `limit` - Liczba produktów (default: 100)
- `offset` - Offset dla paginacji
- `q` - Search query
- `collection_id[]` - Filter by collection
- `category_id[]` - Filter by category
- `is_giftcard` - Filter gift cards

**Example:**
```bash
curl http://localhost:9000/store/products?limit=10&offset=0

# Z filtrem
curl "http://localhost:9000/store/products?collection_id[]=col_123"
```

**Response:**
```json
{
  "products": [
    {
      "id": "prod_123",
      "title": "Product Name",
      "description": "Product description",
      "thumbnail": "https://...",
      "variants": [
        {
          "id": "variant_123",
          "title": "Default",
          "prices": [
            {
              "amount": 1000,
              "currency_code": "pln"
            }
          ],
          "inventory_quantity": 10
        }
      ],
      "images": [
        {
          "url": "https://..."
        }
      ]
    }
  ],
  "count": 50,
  "offset": 0,
  "limit": 10
}
```

### Get Product

```bash
GET /store/products/:id
```

**Example:**
```bash
curl http://localhost:9000/store/products/prod_123
```

## Cart API

### Create Cart

```bash
POST /store/carts
```

**Body:**
```json
{
  "region_id": "reg_123"
}
```

**Example:**
```bash
curl -X POST http://localhost:9000/store/carts \
  -H "Content-Type: application/json" \
  -d '{"region_id": "reg_123"}'
```

**Response:**
```json
{
  "cart": {
    "id": "cart_123",
    "region_id": "reg_123",
    "items": [],
    "total": 0
  }
}
```

### Add Line Item

```bash
POST /store/carts/:id/line-items
```

**Body:**
```json
{
  "variant_id": "variant_123",
  "quantity": 1
}
```

**Example:**
```bash
curl -X POST http://localhost:9000/store/carts/cart_123/line-items \
  -H "Content-Type: application/json" \
  -d '{
    "variant_id": "variant_123",
    "quantity": 2
  }'
```

### Update Line Item

```bash
POST /store/carts/:id/line-items/:line_id
```

**Body:**
```json
{
  "quantity": 3
}
```

### Remove Line Item

```bash
DELETE /store/carts/:id/line-items/:line_id
```

### Get Cart

```bash
GET /store/carts/:id
```

**Example:**
```bash
curl http://localhost:9000/store/carts/cart_123
```

**Response:**
```json
{
  "cart": {
    "id": "cart_123",
    "items": [
      {
        "id": "item_123",
        "title": "Product Name",
        "variant": {
          "id": "variant_123",
          "title": "Default"
        },
        "quantity": 2,
        "unit_price": 1000,
        "total": 2000
      }
    ],
    "subtotal": 2000,
    "total": 2000,
    "region": {
      "id": "reg_123",
      "currency_code": "pln"
    }
  }
}
```

## Checkout API

### Add Shipping Address

```bash
POST /store/carts/:id
```

**Body:**
```json
{
  "shipping_address": {
    "first_name": "Jan",
    "last_name": "Kowalski",
    "address_1": "ul. Przykładowa 123",
    "city": "Warszawa",
    "postal_code": "00-001",
    "country_code": "pl",
    "phone": "+48123456789"
  }
}
```

### Add Email

```bash
POST /store/carts/:id
```

**Body:**
```json
{
  "email": "jan@example.com"
}
```

### Select Shipping Method

```bash
POST /store/carts/:id/shipping-methods
```

**Body:**
```json
{
  "option_id": "so_123"
}
```

### Complete Cart

```bash
POST /store/carts/:id/complete
```

**Response:**
```json
{
  "type": "order",
  "data": {
    "id": "order_123",
    "status": "pending",
    "payment_status": "awaiting",
    "total": 2000
  }
}
```

## Payment API

### Create Payment Session

```bash
POST /store/carts/:id/payment-sessions
```

**Response:**
```json
{
  "cart": {
    "payment_sessions": [
      {
        "id": "ps_123",
        "provider_id": "stripe",
        "data": {
          "client_secret": "pi_xxx_secret_xxx"
        }
      }
    ]
  }
}
```

### Set Payment Session

```bash
POST /store/carts/:id/payment-session
```

**Body:**
```json
{
  "provider_id": "stripe"
}
```

## Customer API

### Create Customer

```bash
POST /store/customers
```

**Body:**
```json
{
  "email": "jan@example.com",
  "password": "secure_password",
  "first_name": "Jan",
  "last_name": "Kowalski"
}
```

### Login

```bash
POST /store/auth
```

**Body:**
```json
{
  "email": "jan@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "customer": {
    "id": "cus_123",
    "email": "jan@example.com",
    "first_name": "Jan",
    "last_name": "Kowalski"
  }
}
```

### Get Current Customer

```bash
GET /store/customers/me
```

**Requires:** Authentication cookie

### Logout

```bash
DELETE /store/auth
```

## Orders API

### List Customer Orders

```bash
GET /store/customers/me/orders
```

**Requires:** Authentication

**Response:**
```json
{
  "orders": [
    {
      "id": "order_123",
      "status": "pending",
      "payment_status": "captured",
      "fulfillment_status": "not_fulfilled",
      "total": 2000,
      "items": [
        {
          "title": "Product Name",
          "quantity": 2,
          "unit_price": 1000
        }
      ],
      "created_at": "2024-12-11T10:00:00Z"
    }
  ]
}
```

### Get Order

```bash
GET /store/orders/:id
```

## Regions API

### List Regions

```bash
GET /store/regions
```

**Response:**
```json
{
  "regions": [
    {
      "id": "reg_123",
      "name": "Poland",
      "currency_code": "pln",
      "countries": [
        {
          "iso_2": "pl",
          "name": "Poland"
        }
      ],
      "payment_providers": [
        {
          "id": "stripe"
        }
      ]
    }
  ]
}
```

## Collections API

### List Collections

```bash
GET /store/collections
```

**Response:**
```json
{
  "collections": [
    {
      "id": "col_123",
      "title": "Summer Collection",
      "handle": "summer-collection"
    }
  ]
}
```

### Get Collection

```bash
GET /store/collections/:id
```

## Custom Endpoints

### Featured Products (Example)

```bash
GET /store/featured-products
```

**Query Parameters:**
- `limit` - Number of products (default: 10)

**Example:**
```bash
curl http://localhost:9000/store/featured-products?limit=5
```

**Response:**
```json
{
  "products": [
    {
      "id": "prod_123",
      "title": "Featured Product",
      "is_featured": true,
      "featured_priority": 10
    }
  ],
  "count": 5
}
```

## Error Responses

### 400 Bad Request

```json
{
  "type": "invalid_data",
  "message": "Invalid request data"
}
```

### 404 Not Found

```json
{
  "type": "not_found",
  "message": "Product not found"
}
```

### 500 Internal Server Error

```json
{
  "type": "unexpected_error",
  "message": "An unexpected error occurred"
}
```

## TypeScript Types

### Product Type

```typescript
interface Product {
  id: string
  title: string
  description: string
  thumbnail: string
  variants: ProductVariant[]
  images: Image[]
  collection_id?: string
  created_at: string
  updated_at: string
}

interface ProductVariant {
  id: string
  title: string
  sku?: string
  prices: Price[]
  inventory_quantity: number
}

interface Price {
  amount: number
  currency_code: string
}
```

### Cart Type

```typescript
interface Cart {
  id: string
  email?: string
  region_id: string
  items: LineItem[]
  shipping_address?: Address
  payment_sessions: PaymentSession[]
  subtotal: number
  total: number
}

interface LineItem {
  id: string
  title: string
  variant_id: string
  variant: ProductVariant
  quantity: number
  unit_price: number
  total: number
}
```

### Order Type

```typescript
interface Order {
  id: string
  status: OrderStatus
  payment_status: PaymentStatus
  fulfillment_status: FulfillmentStatus
  email: string
  items: LineItem[]
  shipping_address: Address
  total: number
  created_at: string
}

type OrderStatus = 'pending' | 'completed' | 'canceled'
type PaymentStatus = 'awaiting' | 'captured' | 'refunded'
type FulfillmentStatus = 'not_fulfilled' | 'fulfilled' | 'shipped'
```

## Frontend Integration Examples

### Fetch Products

```typescript
// lib/api/products.ts
export async function getProducts(params?: {
  limit?: number
  offset?: number
  q?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.offset) searchParams.set('offset', params.offset.toString())
  if (params?.q) searchParams.set('q', params.q)
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?${searchParams}`,
    { next: { revalidate: 60 } }
  )
  
  if (!response.ok) throw new Error('Failed to fetch products')
  
  return response.json()
}
```

### Add to Cart

```typescript
// lib/api/cart.ts
export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variant_id: variantId,
        quantity,
      }),
    }
  )
  
  if (!response.ok) throw new Error('Failed to add to cart')
  
  return response.json()
}
```

### Complete Checkout

```typescript
// lib/api/checkout.ts
export async function completeCart(cartId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  
  if (!response.ok) throw new Error('Failed to complete cart')
  
  return response.json()
}
```

## Rate Limiting

Medusa nie ma domyślnego rate limitingu, ale zaleca się implementację:

```typescript
// middleware.ts (Next.js)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip ?? 'unknown'
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 100
  
  const requests = rateLimit.get(ip) || []
  const recentRequests = requests.filter((time: number) => now - time < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  recentRequests.push(now)
  rateLimit.set(ip, recentRequests)
  
  return NextResponse.next()
}
```

## Best Practices

- **Zawsze używaj HTTPS** w production
- **Cache responses** gdzie to możliwe (ISR, client-side cache)
- **Handle errors gracefully** - pokazuj user-friendly messages
- **Validate input** przed wysłaniem do API
- **Use TypeScript** dla type safety
- **Implement retry logic** dla failed requests
- **Monitor API performance** - track response times

## Dodatkowe Zasoby

- [Medusa Store API Docs](https://docs.medusajs.com/api/store)
- [Medusa Admin API Docs](https://docs.medusajs.com/api/admin)
- [Medusa JS Client](https://docs.medusajs.com/js-client/overview)

---

**API Version:** Medusa 1.x / 2.x
**Type:** Knowledge Base Power
**Focus:** Quick Reference
