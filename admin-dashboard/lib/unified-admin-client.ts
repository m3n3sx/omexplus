/**
 * Unified Admin API Client
 * 
 * Synchronizuje się z tym samym backendem co storefront
 * Automatycznie invaliduje cache po zmianach
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://api.ooxo.pl'

export class AdminAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'AdminAPIError'
  }
}

interface AdminFetchOptions extends RequestInit {
  skipAuth?: boolean
}

/**
 * Admin fetch z automatyczną autoryzacją
 */
async function adminFetch<T = any>(
  endpoint: string,
  options: AdminFetchOptions = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options
  
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('medusa_admin_token') 
    : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  // Add auth token (except for login endpoint)
  if (token && !skipAuth && !endpoint.includes('/auth/')) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Always no-cache for admin to see latest data
  const fetchConfig: RequestInit = {
    ...fetchOptions,
    headers,
    cache: 'no-store' as RequestCache,
  }

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, fetchConfig)

    // Handle unauthorized
    if (response.status === 401 && typeof window !== 'undefined' && !skipAuth) {
      localStorage.removeItem('medusa_admin_token')
      if (!endpoint.includes('/auth/')) {
        window.location.href = '/login'
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AdminAPIError(
        errorData.message || `API Error: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof AdminAPIError) throw error
    throw new AdminAPIError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

/**
 * Webhook trigger - invaliduje cache storefront po zmianach
 */
async function triggerStorefrontRevalidation(tags: string[]) {
  // W przyszłości: webhook do storefront żeby zrevalidować cache
  console.log('🔄 Revalidating storefront cache for tags:', tags)
  
  // Opcjonalnie: wywołaj revalidation endpoint Next.js
  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags }),
      }).catch(() => {
        // Ignore errors - revalidation is optional
      })
    } catch (e) {
      // Silent fail
    }
  }
}

/**
 * Products Admin API
 */
export const adminProductsAPI = {
  getAll: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return adminFetch(`/admin/products${query ? `?${query}` : ''}`)
  },

  getById: async (id: string) => {
    return adminFetch(`/admin/products/${id}`)
  },

  create: async (data: any) => {
    const result = await adminFetch('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['products'])
    return result
  },

  update: async (id: string, data: any) => {
    const result = await adminFetch(`/admin/products/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['products', `product-${id}`])
    return result
  },

  delete: async (id: string) => {
    const result = await adminFetch(`/admin/products/${id}`, {
      method: 'DELETE',
    })
    await triggerStorefrontRevalidation(['products', `product-${id}`])
    return result
  },

  updateVariant: async (productId: string, variantId: string, data: any) => {
    const result = await adminFetch(`/admin/products/${productId}/variants/${variantId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['products', `product-${productId}`])
    return result
  },

  updateInventory: async (variantId: string, quantity: number, locationId?: string) => {
    const result = await adminFetch(`/admin/inventory-items/${variantId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity, location_id: locationId }),
    })
    await triggerStorefrontRevalidation(['products', 'inventory'])
    return result
  },

  updatePrice: async (variantId: string, prices: any[]) => {
    const result = await adminFetch(`/admin/products/variants/${variantId}/prices`, {
      method: 'POST',
      body: JSON.stringify({ prices }),
    })
    await triggerStorefrontRevalidation(['products', 'pricing'])
    return result
  },
}

/**
 * Categories Admin API
 */
export const adminCategoriesAPI = {
  getAll: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return adminFetch(`/admin/product-categories${query ? `?${query}` : ''}`)
  },

  getById: async (id: string) => {
    return adminFetch(`/admin/product-categories/${id}`)
  },

  create: async (data: any) => {
    const result = await adminFetch('/admin/product-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['categories'])
    return result
  },

  update: async (id: string, data: any) => {
    const result = await adminFetch(`/admin/product-categories/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['categories', `category-${id}`])
    return result
  },

  delete: async (id: string) => {
    const result = await adminFetch(`/admin/product-categories/${id}`, {
      method: 'DELETE',
    })
    await triggerStorefrontRevalidation(['categories', `category-${id}`])
    return result
  },
}

/**
 * Orders Admin API
 */
export const adminOrdersAPI = {
  getAll: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return adminFetch(`/admin/orders${query ? `?${query}` : ''}`)
  },

  getById: async (id: string) => {
    return adminFetch(`/admin/orders/${id}`)
  },

  update: async (id: string, data: any) => {
    const result = await adminFetch(`/admin/orders/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['orders', `order-${id}`])
    return result
  },

  createFulfillment: async (orderId: string, data: any) => {
    const result = await adminFetch(`/admin/orders/${orderId}/fulfillment`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['orders', `order-${orderId}`])
    return result
  },

  refund: async (orderId: string, data: any) => {
    const result = await adminFetch(`/admin/orders/${orderId}/refund`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['orders', `order-${orderId}`])
    return result
  },
}

/**
 * Customers Admin API
 */
export const adminCustomersAPI = {
  getAll: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return adminFetch(`/admin/customers${query ? `?${query}` : ''}`)
  },

  getById: async (id: string) => {
    return adminFetch(`/admin/customers/${id}`)
  },

  create: async (data: any) => {
    return adminFetch('/admin/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: any) => {
    return adminFetch(`/admin/customers/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

/**
 * Inventory Admin API
 */
export const adminInventoryAPI = {
  getAll: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return adminFetch(`/admin/inventory${query ? `?${query}` : ''}`)
  },

  updateStock: async (variantId: string, quantity: number, locationId?: string) => {
    const result = await adminFetch(`/admin/inventory/${variantId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity, location_id: locationId }),
    })
    await triggerStorefrontRevalidation(['products', 'inventory'])
    return result
  },

  bulkUpdate: async (updates: Array<{ variant_id: string; quantity: number }>) => {
    const result = await adminFetch('/admin/inventory/bulk', {
      method: 'POST',
      body: JSON.stringify({ updates }),
    })
    await triggerStorefrontRevalidation(['products', 'inventory'])
    return result
  },
}

/**
 * Auth API
 */
export const adminAuthAPI = {
  login: async (email: string, password: string) => {
    return adminFetch('/auth/user/emailpass', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    })
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medusa_admin_token')
    }
  },

  getMe: async () => {
    return adminFetch('/admin/users/me')
  },
}

/**
 * Store Settings API
 */
export const adminStoreAPI = {
  get: async () => {
    return adminFetch('/admin/stores')
  },

  update: async (data: any) => {
    const result = await adminFetch('/admin/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['store'])
    return result
  },
}

/**
 * Analytics API
 */
export const adminAnalyticsAPI = {
  getDashboard: async (params?: { from?: string; to?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    return adminFetch(`/admin/analytics/dashboard${query ? `?${query}` : ''}`)
  },

  getSales: async (params?: { from?: string; to?: string; groupBy?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    return adminFetch(`/admin/analytics/sales${query ? `?${query}` : ''}`)
  },

  getTopProducts: async (params?: { limit?: number; from?: string; to?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    return adminFetch(`/admin/analytics/top-products${query ? `?${query}` : ''}`)
  },
}

/**
 * Bulk Operations API
 */
export const adminBulkAPI = {
  updateProducts: async (productIds: string[], updates: any) => {
    const result = await adminFetch('/admin/products/bulk/update', {
      method: 'POST',
      body: JSON.stringify({ productIds, updates }),
    })
    await triggerStorefrontRevalidation(['products', ...productIds.map(id => `product-${id}`)])
    return result
  },

  updatePrices: async (updates: Array<{ variantId: string; amount: number; currencyCode?: string }>) => {
    const result = await adminFetch('/admin/products/bulk-price/update', {
      method: 'POST',
      body: JSON.stringify({ updates }),
    })
    await triggerStorefrontRevalidation(['products', 'pricing'])
    return result
  },

  updateStock: async (updates: Array<{ variantId: string; quantity: number; locationId?: string }>) => {
    const result = await adminFetch('/admin/products/bulk-stock/update', {
      method: 'POST',
      body: JSON.stringify({ updates }),
    })
    await triggerStorefrontRevalidation(['products', 'inventory'])
    return result
  },

  exportProducts: async (format: 'csv' | 'json' = 'csv', filters?: any) => {
    const query = new URLSearchParams({ format, ...filters }).toString()
    const response = await fetch(
      `${BACKEND_URL}/admin/products/export?${query}`,
      {
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('medusa_admin_token') : ''}`,
        },
      }
    )
    
    if (format === 'csv') {
      const blob = await response.blob()
      return blob
    } else {
      return await response.json()
    }
  },

  importProducts: async (file: File, updateMode: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('updateMode', updateMode)

    const response = await fetch(`${BACKEND_URL}/admin/products/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('medusa_admin_token') : ''}`,
      },
      body: formData,
    })

    const result = await response.json()
    await triggerStorefrontRevalidation(['products', 'categories'])
    return result
  },
}

/**
 * Stock Movements API
 */
export const adminStockMovementsAPI = {
  getAll: async (params?: {
    variantId?: string
    productId?: string
    reason?: string
    from?: string
    to?: string
    limit?: number
    offset?: number
  }) => {
    const query = new URLSearchParams(params as any).toString()
    return adminFetch(`/admin/stock-movements${query ? `?${query}` : ''}`)
  },

  create: async (data: {
    variantId: string
    quantityChange: number
    reason: string
    notes?: string
    locationId?: string
  }) => {
    const result = await adminFetch('/admin/stock-movements', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['products', 'inventory'])
    return result
  },
}

/**
 * Price Rules API
 */
export const adminPriceRulesAPI = {
  getAll: async () => {
    return adminFetch('/admin/price-rules')
  },

  getById: async (id: string) => {
    return adminFetch(`/admin/price-rules/${id}`)
  },

  create: async (data: any) => {
    const result = await adminFetch('/admin/price-rules', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await triggerStorefrontRevalidation(['products', 'pricing'])
    return result
  },

  update: async (id: string, data: any) => {
    const result = await adminFetch(`/admin/price-rules/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return result
  },

  delete: async (id: string) => {
    return adminFetch(`/admin/price-rules/${id}`, {
      method: 'DELETE',
    })
  },

  apply: async (id: string, dryRun = false) => {
    const result = await adminFetch(`/admin/price-rules/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify({ dryRun }),
    })
    if (!dryRun) {
      await triggerStorefrontRevalidation(['products', 'pricing'])
    }
    return result
  },
}

/**
 * Stock Alerts API
 */
export const adminStockAlertsAPI = {
  getAll: async (params?: { active?: boolean; variant_id?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    return adminFetch(`/admin/stock-alerts${query ? `?${query}` : ''}`)
  },

  create: async (data: any) => {
    return adminFetch('/admin/stock-alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: any) => {
    return adminFetch(`/admin/stock-alerts/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string) => {
    return adminFetch(`/admin/stock-alerts/${id}`, {
      method: 'DELETE',
    })
  },
}

/**
 * Export unified admin client
 */
export const unifiedAdminAPI = {
  products: adminProductsAPI,
  categories: adminCategoriesAPI,
  orders: adminOrdersAPI,
  customers: adminCustomersAPI,
  inventory: adminInventoryAPI,
  auth: adminAuthAPI,
  store: adminStoreAPI,
  analytics: adminAnalyticsAPI,
  bulk: adminBulkAPI,
  stockMovements: adminStockMovementsAPI,
  priceRules: adminPriceRulesAPI,
  stockAlerts: adminStockAlertsAPI,
}

export default unifiedAdminAPI
