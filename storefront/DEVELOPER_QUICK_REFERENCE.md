# 🚀 Developer Quick Reference

## Essential Imports

```typescript
// Cart
import { useCartContext } from '@/contexts/CartContext'

// Auth
import { useAuth } from '@/contexts/AuthContext'

// Components
import { AddToCartButton } from '@/components/product/AddToCartButton'

// Types
import { Product, Cart, Order, Customer } from '@/types'

// Medusa Client
import medusaClient from '@/lib/medusa'
```

## Cart Operations

```typescript
const { cart, addItem, updateItem, removeItem, itemCount } = useCartContext()

// Add to cart
await addItem(variantId, quantity)

// Update quantity
await updateItem(lineItemId, newQuantity)

// Remove item
await removeItem(lineItemId)

// Get item count
const count = itemCount // number

// Access cart data
const total = cart?.total // in cents
const items = cart?.items // LineItem[]
```

## Authentication

```typescript
const { customer, login, register, logout, isAuthenticated } = useAuth()

// Register
await register({
  email: 'user@example.com',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+48123456789', // optional
})

// Login
await login('user@example.com', 'password123')

// Logout
await logout()

// Check auth status
if (isAuthenticated) {
  console.log(customer.first_name)
}
```

## Checkout Flow

```typescript
const { setShippingAddress, setBillingAddress, addShippingMethod, completeCart } = useCartContext()

// 1. Set shipping address
await setShippingAddress({
  first_name: 'John',
  last_name: 'Doe',
  address_1: 'Street 123',
  city: 'Warsaw',
  country_code: 'pl',
  postal_code: '00-001',
  phone: '+48123456789',
})

// 2. Set billing address
await setBillingAddress({
  // same structure as shipping
})

// 3. Add shipping method
await addShippingMethod(shippingOptionId)

// 4. Complete order
const response = await completeCart()
const order = response.data // Order object
```

## Medusa API Direct Calls

```typescript
import medusaClient from '@/lib/medusa'

// Products
const { products } = await medusaClient.products.list()
const { product } = await medusaClient.products.retrieve(productId)

// Cart
const { cart } = await medusaClient.carts.create()
const { cart } = await medusaClient.carts.retrieve(cartId)
const { cart } = await medusaClient.carts.lineItems.create(cartId, {
  variant_id: variantId,
  quantity: 1,
})

// Customer
const { customer } = await medusaClient.customers.create({
  email: 'user@example.com',
  password: 'password',
  first_name: 'John',
  last_name: 'Doe',
})

// Orders
const { orders } = await medusaClient.customers.listOrders()
const { order } = await medusaClient.orders.retrieve(orderId)

// Regions
const { regions } = await medusaClient.regions.list()

// Shipping Options
const { shipping_options } = await medusaClient.shippingOptions.listCartOptions(cartId)
```

## Price Formatting

```typescript
const formatPrice = (amount: number, currencyCode: string = 'PLN') => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount / 100) // Medusa stores prices in cents
}

// Usage
formatPrice(1999, 'PLN') // "19,99 zł"
formatPrice(2500, 'EUR') // "25,00 €"
```

## Date Formatting

```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Usage
formatDate('2024-12-03T10:00:00Z') // "3 grudnia 2024"
```

## Protected Routes

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/account/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) return <div>Loading...</div>

  return <div>Protected Content</div>
}
```

## Error Handling

```typescript
try {
  await addItem(variantId, quantity)
} catch (error: any) {
  // Error is already set in context
  console.error('Failed:', error)
  
  // Show user-friendly message
  if (error.response?.status === 404) {
    alert('Product not found')
  } else if (error.response?.status === 400) {
    alert('Invalid request')
  } else {
    alert('Something went wrong')
  }
}
```

## Loading States

```typescript
const { loading } = useCartContext()

return (
  <button disabled={loading}>
    {loading ? 'Loading...' : 'Add to Cart'}
  </button>
)
```

## Translations

```typescript
import { useTranslations } from 'next-intl'

const t = useTranslations()

// Usage
t('cart.empty')              // "Koszyk pusty"
t('products.addToCart')      // "Dodaj do koszyka"
t('checkout.shippingAddress') // "Adres dostawy"
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...

# Optional (for Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Common Patterns

### Add to Cart Button

```typescript
<AddToCartButton 
  variantId={product.variants[0].id}
  disabled={!product.variants[0].inventory_quantity}
/>
```

### Cart Badge

```typescript
const { itemCount } = useCartContext()

<Link href="/cart">
  🛒 ({itemCount})
</Link>
```

### User Menu

```typescript
const { customer, isAuthenticated, logout } = useAuth()

{isAuthenticated ? (
  <>
    <Link href="/account">
      👤 {customer?.first_name}
    </Link>
    <button onClick={logout}>Logout</button>
  </>
) : (
  <Link href="/account/login">Login</Link>
)}
```

### Order Status Badge

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return { bg: '#d1fae5', text: '#065f46' }
    case 'pending':
      return { bg: '#fef3c7', text: '#92400e' }
    case 'canceled':
      return { bg: '#fee2e2', text: '#991b1b' }
    default:
      return { bg: '#e5e7eb', text: '#374151' }
  }
}

const colors = getStatusColor(order.status)
<span style={{ backgroundColor: colors.bg, color: colors.text }}>
  {order.status}
</span>
```

## TypeScript Types

```typescript
// Cart
interface Cart {
  id: string
  items: LineItem[]
  subtotal: number
  tax_total: number
  shipping_total: number
  total: number
  region?: Region
}

// Line Item
interface LineItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  total: number
  variant?: ProductVariant
}

// Customer
interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  orders?: Order[]
}

// Order
interface Order {
  id: string
  display_id: number
  status: OrderStatus
  total: number
  items: LineItem[]
  created_at: string
}
```

## Useful Hooks

```typescript
// Get locale
import { useLocale } from 'next-intl'
const locale = useLocale() // 'pl', 'en', etc.

// Navigation
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/cart')

// Params
import { useParams } from 'next/navigation'
const params = useParams()
```

## API Routes

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process request
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

## Testing

```typescript
// Check if cart exists
if (cart && cart.items.length > 0) {
  // Cart has items
}

// Check if user is logged in
if (isAuthenticated && customer) {
  // User is authenticated
}

// Check loading state
if (loading) {
  return <div>Loading...</div>
}
```

## Debugging

```typescript
// Log cart state
console.log('Cart:', cart)
console.log('Items:', cart?.items)
console.log('Total:', cart?.total)

// Log auth state
console.log('Customer:', customer)
console.log('Authenticated:', isAuthenticated)

// Check localStorage
console.log('Cart ID:', localStorage.getItem('cart_id'))
```

## Performance Tips

```typescript
// Memoize expensive calculations
import { useMemo } from 'react'

const total = useMemo(() => {
  return cart?.items.reduce((sum, item) => sum + item.total, 0)
}, [cart?.items])

// Debounce search
import { useState, useEffect } from 'react'

const [search, setSearch] = useState('')
const [debouncedSearch, setDebouncedSearch] = useState('')

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search)
  }, 500)
  return () => clearTimeout(timer)
}, [search])
```

## Common Issues

### Cart not loading
```typescript
// Check if backend is running
// Check if cart_id exists in localStorage
// Check CORS settings in medusa-config.ts
```

### Authentication failing
```typescript
// Verify backend URL
// Check if customer exists
// Clear cookies and try again
```

### Prices showing as 0
```typescript
// Prices are in cents, divide by 100
const price = amount / 100
```

---

**Quick Links:**
- [Full Guide](../ECOMMERCE_IMPLEMENTATION_GUIDE.md)
- [Quick Start](./ECOMMERCE_QUICK_START.md)
- [Testing](../TEST_ECOMMERCE.md)
- [Summary](../ECOMMERCE_COMPLETE_SUMMARY.md)
