/**
 * API Client for Medusa Backend
 * Handles all API calls with proper headers and error handling
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

/**
 * Fetch data from Medusa backend
 */
export async function fetchFromBackend<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Add API key if available
  if (API_KEY) {
    headers['x-publishable-api-key'] = API_KEY
  }

  // Merge with provided headers
  if (options.headers && typeof options.headers === 'object') {
    Object.assign(headers, options.headers)
  }

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    })

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
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

/**
 * Store API - Public endpoints
 */
export const storeAPI = {
  // Categories
  getCategories: async (params?: { limit?: number; offset?: number }) => {
    const query = new URLSearchParams()
    if (params?.limit) query.set('limit', params.limit.toString())
    if (params?.offset) query.set('offset', params.offset.toString())
    
    return fetchFromBackend(`/store/product-categories?${query}`)
  },

  getCategoryById: async (id: string) => {
    return fetchFromBackend(`/store/product-categories/${id}`)
  },

  // Products
  getProducts: async (params?: {
    limit?: number
    offset?: number
    category_id?: string[]
    q?: string
  }) => {
    const query = new URLSearchParams()
    if (params?.limit) query.set('limit', params.limit.toString())
    if (params?.offset) query.set('offset', params.offset.toString())
    if (params?.q) query.set('q', params.q)
    if (params?.category_id) {
      params.category_id.forEach(id => query.append('category_id', id))
    }
    
    // Use omex-products endpoint which supports category filtering
    return fetchFromBackend(`/store/omex-products?${query}`)
  },

  getProductById: async (id: string) => {
    return fetchFromBackend(`/store/products/${id}`)
  },

  // Cart
  createCart: async () => {
    return fetchFromBackend('/store/carts', {
      method: 'POST',
    })
  },

  getCart: async (cartId: string) => {
    return fetchFromBackend(`/store/carts/${cartId}`)
  },

  addToCart: async (cartId: string, variantId: string, quantity: number) => {
    return fetchFromBackend(`/store/carts/${cartId}/line-items`, {
      method: 'POST',
      body: JSON.stringify({
        variant_id: variantId,
        quantity,
      }),
    })
  },

  updateLineItem: async (cartId: string, lineItemId: string, quantity: number) => {
    return fetchFromBackend(`/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    })
  },

  removeLineItem: async (cartId: string, lineItemId: string) => {
    return fetchFromBackend(`/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'DELETE',
    })
  },

  // Orders
  getOrders: async () => {
    return fetchFromBackend('/store/orders')
  },

  getOrderById: async (id: string) => {
    return fetchFromBackend(`/store/orders/${id}`)
  },

  // Customers
  createCustomer: async (data: {
    email: string
    password: string
    first_name: string
    last_name: string
    phone?: string
  }) => {
    return fetchFromBackend('/store/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  login: async (email: string, password: string) => {
    return fetchFromBackend('/store/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  getCustomer: async () => {
    return fetchFromBackend('/store/customers/me')
  },

  // Regions
  getRegions: async () => {
    return fetchFromBackend('/store/regions')
  },

  // Shipping Options
  getShippingOptions: async (cartId: string) => {
    return fetchFromBackend(`/store/shipping-options/${cartId}`)
  },
}

/**
 * OMEX Search API - Custom endpoints
 */
export const omexSearchAPI = {
  // Machine-based search
  getMachineBrands: async () => {
    return fetchFromBackend('/store/omex-search/machine/brands')
  },

  getMachineTypes: async (brand: string) => {
    return fetchFromBackend(`/store/omex-search/machine/types?brand=${brand}`)
  },

  getMachineModels: async (brand: string, type: string) => {
    return fetchFromBackend(`/store/omex-search/machine/models?brand=${brand}&type=${type}`)
  },

  searchByMachine: async (data: {
    brand: string
    type: string
    model: string
    series?: string
    engine?: string
  }) => {
    return fetchFromBackend('/store/omex-search/machine', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Part number search
  searchByPartNumber: async (partNumber: string) => {
    return fetchFromBackend(`/store/omex-search/part-number?part_number=${partNumber}`)
  },

  // Visual search
  searchByImage: async (imageFile: File) => {
    const formData = new FormData()
    formData.append('image', imageFile)

    return fetch(`${BACKEND_URL}/store/omex-search/visual`, {
      method: 'POST',
      headers: {
        'x-publishable-api-key': API_KEY,
      },
      body: formData,
    }).then(res => res.json())
  },

  // Text search
  searchByText: async (query: string) => {
    return fetchFromBackend(`/store/omex-search/text?q=${encodeURIComponent(query)}`)
  },

  // Advanced filters
  searchWithFilters: async (filters: {
    categories?: string[]
    brands?: string[]
    price_min?: number
    price_max?: number
    in_stock?: boolean
    equipment_type?: string
  }) => {
    return fetchFromBackend('/store/omex-search/filters', {
      method: 'POST',
      body: JSON.stringify(filters),
    })
  },

  // Autocomplete
  getSuggestions: async (query: string) => {
    return fetchFromBackend(`/store/omex-search/suggestions?q=${encodeURIComponent(query)}`)
  },

  // Filter options
  getFilterOptions: async () => {
    return fetchFromBackend('/store/omex-search/filters/options')
  },
}

/**
 * Advanced Search API - Wizard-based search
 */
export const advancedSearchApi = {
  // Autocomplete for wizard steps
  // step: 1=machineType, 2=manufacturer, 3=model, 4=symptom
  autocomplete: async (step: number, query: string, context?: { machineTypeId?: string; manufacturerId?: string }) => {
    const params = new URLSearchParams()
    params.set('step', step.toString())
    params.set('q', query)
    if (context?.machineTypeId) params.set('machine_type_id', context.machineTypeId)
    if (context?.manufacturerId) params.set('manufacturer_id', context.manufacturerId)
    
    return fetchFromBackend(`/store/advanced-search/autocomplete?${params}`)
  },

  // Analyze query with AI
  analyzeQuery: async (query: string) => {
    return fetchFromBackend('/store/advanced-search/analyze', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  },

  // Search products with filters
  searchProducts: async (filters: {
    machineType?: string
    manufacturer?: string
    model?: string
    category?: string
    symptom?: string
  }) => {
    return fetchFromBackend('/store/advanced-search/products', {
      method: 'POST',
      body: JSON.stringify(filters),
    })
  },

  // Get categories for machine/symptom
  getCategories: async (machineModelId: string, symptom?: string) => {
    const params = new URLSearchParams()
    params.set('machine_model_id', machineModelId)
    if (symptom) params.set('symptom', symptom)
    
    return fetchFromBackend(`/store/advanced-search/categories?${params}`)
  },

  // Validate compatibility
  validateCompatibility: async (partId: string, machineModelId: string) => {
    return fetchFromBackend('/store/advanced-search/compatibility', {
      method: 'POST',
      body: JSON.stringify({ part_id: partId, machine_model_id: machineModelId }),
    })
  },
}

/**
 * Helper to check if API key is configured
 */
export function isAPIKeyConfigured(): boolean {
  return !!API_KEY && API_KEY.length > 0
}

/**
 * Get backend URL
 */
export function getBackendURL(): string {
  return BACKEND_URL
}
