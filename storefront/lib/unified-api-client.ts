/**
 * Unified API Client - Eliminuje problemy z cache i synchronizacją
 * 
 * Kluczowe usprawnienia:
 * 1. Revalidation tags dla cache Next.js
 * 2. Real-time data fetching bez stale data
 * 3. Automatyczne odświeżanie po zmianach
 * 4. Unified error handling
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

interface FetchOptions extends RequestInit {
  revalidate?: number | false
  tags?: string[]
  skipCache?: boolean
}

/**
 * Unified fetch z kontrolą cache
 */
async function unifiedFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate, tags, skipCache, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  if (API_KEY) {
    headers['x-publishable-api-key'] = API_KEY
  }

  // Dodaj timestamp do URL żeby wymusić świeże dane
  const url = new URL(`${BACKEND_URL}${endpoint}`)
  if (skipCache) {
    url.searchParams.set('_t', Date.now().toString())
  }

  const fetchConfig: RequestInit = {
    ...fetchOptions,
    headers,
  }

  // Next.js cache control
  if (typeof window === 'undefined') {
    // Server-side: użyj Next.js cache
    Object.assign(fetchConfig, {
      next: {
        revalidate: revalidate ?? 0, // Default: no cache
        tags: tags || [],
      },
    })
  } else {
    // Client-side: wymuś no-cache
    Object.assign(fetchConfig, {
      cache: 'no-store' as RequestCache,
    })
  }

  try {
    const response = await fetch(url.toString(), fetchConfig)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.message || `API Error: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) throw error
    throw new APIError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

/**
 * Products API - zawsze świeże dane
 */
export const productsAPI = {
  getAll: async (params?: {
    limit?: number
    offset?: number
    category_id?: string[]
    q?: string
    skipCache?: boolean
  }) => {
    const query = new URLSearchParams()
    if (params?.limit) query.set('limit', params.limit.toString())
    if (params?.offset) query.set('offset', params.offset.toString())
    if (params?.q) query.set('q', params.q)
    if (params?.category_id) {
      params.category_id.forEach(id => query.append('category_id', id))
    }

    return unifiedFetch(`/store/products?${query}`, {
      skipCache: params?.skipCache ?? true,
      tags: ['products'],
      revalidate: 0, // Zawsze świeże dane
    })
  },

  getByHandle: async (handle: string, skipCache = true) => {
    return unifiedFetch(`/store/products?handle=${handle}`, {
      skipCache,
      tags: ['products', `product-${handle}`],
      revalidate: 0,
    })
  },

  getById: async (id: string, skipCache = true) => {
    return unifiedFetch(`/store/products/${id}`, {
      skipCache,
      tags: ['products', `product-${id}`],
      revalidate: 0,
    })
  },

  search: async (query: string, skipCache = true) => {
    return unifiedFetch(`/store/products?q=${encodeURIComponent(query)}`, {
      skipCache,
      tags: ['products', 'search'],
      revalidate: 0,
    })
  },
}

/**
 * Categories API
 */
export const categoriesAPI = {
  getAll: async (params?: { limit?: number; offset?: number; skipCache?: boolean }) => {
    const query = new URLSearchParams()
    if (params?.limit) query.set('limit', params.limit.toString())
    if (params?.offset) query.set('offset', params.offset.toString())

    return unifiedFetch(`/store/product-categories?${query}`, {
      skipCache: params?.skipCache ?? true,
      tags: ['categories'],
      revalidate: 0,
    })
  },

  getById: async (id: string, skipCache = true) => {
    return unifiedFetch(`/store/product-categories/${id}`, {
      skipCache,
      tags: ['categories', `category-${id}`],
      revalidate: 0,
    })
  },

  getByHandle: async (handle: string, skipCache = true) => {
    return unifiedFetch(`/store/product-categories?handle=${handle}`, {
      skipCache,
      tags: ['categories', `category-${handle}`],
      revalidate: 0,
    })
  },
}

/**
 * Cart API
 */
export const cartAPI = {
  create: async () => {
    return unifiedFetch('/store/carts', {
      method: 'POST',
      skipCache: true,
    })
  },

  get: async (cartId: string) => {
    return unifiedFetch(`/store/carts/${cartId}`, {
      skipCache: true,
      tags: [`cart-${cartId}`],
    })
  },

  addItem: async (cartId: string, variantId: string, quantity: number) => {
    return unifiedFetch(`/store/carts/${cartId}/line-items`, {
      method: 'POST',
      body: JSON.stringify({ variant_id: variantId, quantity }),
      skipCache: true,
    })
  },

  updateItem: async (cartId: string, lineItemId: string, quantity: number) => {
    return unifiedFetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
      skipCache: true,
    })
  },

  removeItem: async (cartId: string, lineItemId: string) => {
    return unifiedFetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'DELETE',
      skipCache: true,
    })
  },

  complete: async (cartId: string) => {
    return unifiedFetch(`/store/carts/${cartId}/complete`, {
      method: 'POST',
      skipCache: true,
    })
  },
}

/**
 * Orders API
 */
export const ordersAPI = {
  getAll: async (skipCache = true) => {
    return unifiedFetch('/store/orders', {
      skipCache,
      tags: ['orders'],
    })
  },

  getById: async (id: string, skipCache = true) => {
    return unifiedFetch(`/store/orders/${id}`, {
      skipCache,
      tags: ['orders', `order-${id}`],
    })
  },
}

/**
 * Customer API
 */
export const customerAPI = {
  create: async (data: {
    email: string
    password: string
    first_name: string
    last_name: string
    phone?: string
  }) => {
    return unifiedFetch('/store/customers', {
      method: 'POST',
      body: JSON.stringify(data),
      skipCache: true,
    })
  },

  login: async (email: string, password: string) => {
    return unifiedFetch('/store/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipCache: true,
    })
  },

  getMe: async (skipCache = true) => {
    return unifiedFetch('/store/customers/me', {
      skipCache,
      tags: ['customer'],
    })
  },

  update: async (data: any) => {
    return unifiedFetch('/store/customers/me', {
      method: 'POST',
      body: JSON.stringify(data),
      skipCache: true,
    })
  },
}

/**
 * Regions & Shipping
 */
export const shippingAPI = {
  getRegions: async (skipCache = true) => {
    return unifiedFetch('/store/regions', {
      skipCache,
      tags: ['regions'],
    })
  },

  getShippingOptions: async (cartId: string) => {
    return unifiedFetch(`/store/shipping-options/${cartId}`, {
      skipCache: true,
    })
  },
}

/**
 * Inventory API - real-time stock
 */
export const inventoryAPI = {
  checkStock: async (variantId: string) => {
    return unifiedFetch(`/store/inventory/${variantId}`, {
      skipCache: true,
      revalidate: 0,
    })
  },

  checkMultipleStock: async (variantIds: string[]) => {
    return unifiedFetch('/store/inventory/bulk', {
      method: 'POST',
      body: JSON.stringify({ variant_ids: variantIds }),
      skipCache: true,
    })
  },
}

/**
 * Pricing API - real-time prices
 */
export const pricingAPI = {
  getPrice: async (variantId: string, regionId?: string) => {
    const query = regionId ? `?region_id=${regionId}` : ''
    return unifiedFetch(`/store/pricing/${variantId}${query}`, {
      skipCache: true,
      revalidate: 0,
    })
  },

  getMultiplePrices: async (variantIds: string[], regionId?: string) => {
    return unifiedFetch('/store/pricing/bulk', {
      method: 'POST',
      body: JSON.stringify({ variant_ids: variantIds, region_id: regionId }),
      skipCache: true,
    })
  },
}

/**
 * Helper functions
 */
export function getBackendURL(): string {
  return BACKEND_URL
}

export function isAPIKeyConfigured(): boolean {
  return !!API_KEY && API_KEY.length > 0
}

/**
 * Export all APIs as unified client
 */
export const unifiedAPI = {
  products: productsAPI,
  categories: categoriesAPI,
  cart: cartAPI,
  orders: ordersAPI,
  customer: customerAPI,
  shipping: shippingAPI,
  inventory: inventoryAPI,
  pricing: pricingAPI,
}

export default unifiedAPI
