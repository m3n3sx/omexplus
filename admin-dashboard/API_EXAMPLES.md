# Medusa Admin API Examples

Complete examples for integrating with Medusa Admin API.

## Authentication

```typescript
import medusaClient from "@/lib/medusa-client"

// Login
const login = async (email: string, password: string) => {
  const response = await medusaClient.admin.auth.getToken({
    email,
    password,
  })
  
  localStorage.setItem("medusa_admin_token", response.access_token)
  return response.user
}

// Logout
const logout = () => {
  localStorage.removeItem("medusa_admin_token")
}
```

## Orders

### List Orders
```typescript
const listOrders = async () => {
  const response = await medusaClient.admin.orders.list({
    limit: 20,
    offset: 0,
    status: ["pending", "completed"],
    payment_status: ["captured"],
  })
  
  return response.orders
}
```

### Get Order Details
```typescript
const getOrder = async (orderId: string) => {
  const response = await medusaClient.admin.orders.retrieve(orderId)
  return response.order
}
```

### Create Fulfillment (Mark as Shipped)
```typescript
const markAsShipped = async (orderId: string, items: any[]) => {
  const response = await medusaClient.admin.orders.createFulfillment(orderId, {
    items: items.map(item => ({
      item_id: item.id,
      quantity: item.quantity,
    })),
  })
  
  return response.order
}
```

### Process Refund
```typescript
const processRefund = async (orderId: string, amount: number) => {
  const response = await medusaClient.admin.orders.refund(orderId, {
    amount: amount * 100, // Convert to cents
    reason: "requested_by_customer",
  })
  
  return response.order
}
```

### Cancel Order
```typescript
const cancelOrder = async (orderId: string) => {
  const response = await medusaClient.admin.orders.cancel(orderId)
  return response.order
}
```

## Products

### List Products
```typescript
const listProducts = async (filters?: any) => {
  const response = await medusaClient.admin.products.list({
    limit: 20,
    offset: 0,
    status: ["published", "draft"],
    q: filters?.search, // Search query
    ...filters,
  })
  
  return {
    products: response.products,
    count: response.count,
  }
}
```

### Get Product Details
```typescript
const getProduct = async (productId: string) => {
  const response = await medusaClient.admin.products.retrieve(productId)
  return response.product
}
```

### Create Product
```typescript
const createProduct = async (data: any) => {
  const response = await medusaClient.admin.products.create({
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    handle: data.handle,
    status: data.status, // "draft" or "published"
    variants: [
      {
        title: "Default Variant",
        sku: data.sku,
        inventory_quantity: data.inventory_quantity,
        prices: [
          {
            amount: data.price * 100, // Convert to cents
            currency_code: "usd",
          },
        ],
      },
    ],
  })
  
  return response.product
}
```

### Update Product
```typescript
const updateProduct = async (productId: string, data: any) => {
  const response = await medusaClient.admin.products.update(productId, {
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    status: data.status,
  })
  
  return response.product
}
```

### Delete Product
```typescript
const deleteProduct = async (productId: string) => {
  await medusaClient.admin.products.delete(productId)
}
```

### Upload Product Images
```typescript
const uploadProductImages = async (productId: string, files: File[]) => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append("files", file)
  })
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/products/${productId}/images`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("medusa_admin_token")}`,
      },
      body: formData,
    }
  )
  
  return response.json()
}
```

### Add Product Variant
```typescript
const addVariant = async (productId: string, variant: any) => {
  const response = await medusaClient.admin.products.createVariant(productId, {
    title: variant.title,
    sku: variant.sku,
    inventory_quantity: variant.inventory_quantity,
    prices: [
      {
        amount: variant.price * 100,
        currency_code: "usd",
      },
    ],
    options: variant.options, // e.g., [{ option_id: "opt_123", value: "Large" }]
  })
  
  return response.product
}
```

## Customers

### List Customers
```typescript
const listCustomers = async () => {
  const response = await medusaClient.admin.customers.list({
    limit: 20,
    offset: 0,
    q: "", // Search query
  })
  
  return {
    customers: response.customers,
    count: response.count,
  }
}
```

### Get Customer Details
```typescript
const getCustomer = async (customerId: string) => {
  const response = await medusaClient.admin.customers.retrieve(customerId)
  return response.customer
}
```

### Update Customer
```typescript
const updateCustomer = async (customerId: string, data: any) => {
  const response = await medusaClient.admin.customers.update(customerId, {
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
  })
  
  return response.customer
}
```

## Collections

### List Collections
```typescript
const listCollections = async () => {
  const response = await medusaClient.admin.collections.list()
  return response.collections
}
```

### Create Collection
```typescript
const createCollection = async (data: any) => {
  const response = await medusaClient.admin.collections.create({
    title: data.title,
    handle: data.handle,
  })
  
  return response.collection
}
```

### Add Products to Collection
```typescript
const addProductsToCollection = async (collectionId: string, productIds: string[]) => {
  const response = await medusaClient.admin.collections.update(collectionId, {
    product_ids: productIds,
  })
  
  return response.collection
}
```

## Regions & Shipping

### List Regions
```typescript
const listRegions = async () => {
  const response = await medusaClient.admin.regions.list()
  return response.regions
}
```

### Create Shipping Option
```typescript
const createShippingOption = async (regionId: string, data: any) => {
  const response = await medusaClient.admin.shippingOptions.create({
    name: data.name,
    region_id: regionId,
    provider_id: "manual",
    price_type: "flat_rate",
    amount: data.amount * 100,
  })
  
  return response.shipping_option
}
```

## Analytics & Reports

### Get Sales Analytics
```typescript
const getSalesAnalytics = async (startDate: Date, endDate: Date) => {
  const response = await medusaClient.admin.orders.list({
    created_at: {
      gte: startDate.toISOString(),
      lte: endDate.toISOString(),
    },
  })
  
  const orders = response.orders
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const averageOrderValue = totalRevenue / orders.length
  
  return {
    totalOrders: orders.length,
    totalRevenue,
    averageOrderValue,
    orders,
  }
}
```

### Get Top Products
```typescript
const getTopProducts = async (limit: number = 10) => {
  const response = await medusaClient.admin.orders.list({ limit: 100 })
  const orders = response.orders
  
  const productSales = new Map()
  
  orders.forEach(order => {
    order.items?.forEach(item => {
      const existing = productSales.get(item.product_id) || {
        id: item.product_id,
        title: item.title,
        quantity: 0,
        revenue: 0,
      }
      
      existing.quantity += item.quantity
      existing.revenue += item.total
      productSales.set(item.product_id, existing)
    })
  })
  
  return Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}
```

## Inventory Management

### Update Inventory
```typescript
const updateInventory = async (variantId: string, quantity: number) => {
  const response = await medusaClient.admin.variants.update(variantId, {
    inventory_quantity: quantity,
  })
  
  return response.variant
}
```

### Get Low Stock Products
```typescript
const getLowStockProducts = async (threshold: number = 10) => {
  const response = await medusaClient.admin.products.list({ limit: 100 })
  
  return response.products.filter(product => {
    return product.variants?.some(variant => 
      variant.inventory_quantity < threshold
    )
  })
}
```

## Discounts & Promotions

### Create Discount
```typescript
const createDiscount = async (data: any) => {
  const response = await medusaClient.admin.discounts.create({
    code: data.code,
    rule: {
      type: "percentage", // or "fixed"
      value: data.value,
      allocation: "total",
    },
    regions: [data.region_id],
    starts_at: data.starts_at,
    ends_at: data.ends_at,
  })
  
  return response.discount
}
```

## Error Handling

```typescript
const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  errorMessage: string = "An error occurred"
): Promise<T | null> => {
  try {
    return await apiCall()
  } catch (error: any) {
    console.error(errorMessage, error)
    
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = "/login"
    }
    
    alert(error.response?.data?.message || errorMessage)
    return null
  }
}

// Usage
const orders = await safeApiCall(
  () => medusaClient.admin.orders.list(),
  "Failed to load orders"
)
```

## Pagination Helper

```typescript
const usePagination = (fetchFunction: Function, itemsPerPage: number = 20) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  
  const loadPage = async (page: number) => {
    setLoading(true)
    try {
      const offset = (page - 1) * itemsPerPage
      const response = await fetchFunction({ limit: itemsPerPage, offset })
      
      setItems(response.items)
      setTotalPages(Math.ceil(response.count / itemsPerPage))
      setCurrentPage(page)
    } catch (error) {
      console.error("Pagination error:", error)
    } finally {
      setLoading(false)
    }
  }
  
  return { items, currentPage, totalPages, loading, loadPage }
}
```

## Batch Operations

```typescript
const batchUpdateProducts = async (productIds: string[], updates: any) => {
  const promises = productIds.map(id =>
    medusaClient.admin.products.update(id, updates)
  )
  
  const results = await Promise.allSettled(promises)
  
  const successful = results.filter(r => r.status === "fulfilled").length
  const failed = results.filter(r => r.status === "rejected").length
  
  return { successful, failed }
}
```
