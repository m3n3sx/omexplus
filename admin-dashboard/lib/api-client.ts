// Simple API client for Medusa v2
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

interface RequestOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
}

async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("medusa_admin_token") : null
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  }
  
  // Add authorization header if we have a token
  if (token && !endpoint.includes("/auth/")) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  console.log(`API Request: ${options.method || "GET"} ${endpoint}`, token ? 'with token' : 'no token')
  
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include",
    })
    
    console.log(`API Response: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error: ${errorText}`)
      
      // If unauthorized, clear token but DON'T auto-redirect
      // Let the component handle the redirect
      if (response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("medusa_admin_token")
        localStorage.removeItem("admin_user")
      }
      
      // Try to parse error message from response
      let errorMessage = `Request failed: ${response.status} ${response.statusText}`
      try {
        const error = JSON.parse(errorText)
        if (error.message) {
          errorMessage = error.message
        }
      } catch {
        // JSON parse failed, use default message
      }
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    return data
  } catch (error: any) {
    // Handle network errors (backend not available)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.warn(`Backend not available: ${BACKEND_URL}${endpoint}`)
      // Return empty result instead of throwing
      return { data: [], orders: [], products: [], customers: [], count: 0 }
    }
    throw error
  }
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    return apiRequest("/auth/user/emailpass", {
      method: "POST",
      body: { email, password },
    })
  },
  
  // Orders
  getOrders: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/admin/orders${query ? `?${query}` : ""}`)
  },
  
  getOrder: async (id: string) => {
    return apiRequest(`/admin/orders/${id}`)
  },
  
  createFulfillment: async (orderId: string, data: any) => {
    return apiRequest(`/admin/orders/${orderId}/fulfillment`, {
      method: "POST",
      body: data,
    })
  },
  
  refundOrder: async (orderId: string, data: any) => {
    return apiRequest(`/admin/orders/${orderId}/refund`, {
      method: "POST",
      body: data,
    })
  },
  
  updateOrder: async (orderId: string, data: any) => {
    return apiRequest(`/public/banners`, {
      method: "POST",
      body: {
        type: "order",
        orderId,
        ...data,
      },
    })
  },
  
  updateOrderStatus: async (orderId: string, status: string) => {
    return apiRequest(`/public/banners`, {
      method: "POST",
      body: { type: "order", orderId, status },
    })
  },
  
  // Products
  getProducts: async (params?: any) => {
    // Medusa API expects status as array
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'status' && typeof value === 'string') {
          // Convert status to array format: status[]=value
          queryParams.append('status[]', value)
        } else if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }
    const query = queryParams.toString()
    return apiRequest(`/admin/products${query ? `?${query}` : ""}`)
  },
  
  getProduct: async (id: string) => {
    return apiRequest(`/admin/products/${id}`)
  },
  
  createProduct: async (data: any) => {
    return apiRequest("/admin/products", {
      method: "POST",
      body: data,
    })
  },
  
  updateProduct: async (id: string, data: any) => {
    return apiRequest(`/admin/products/${id}`, {
      method: "POST",
      body: data,
    })
  },
  
  deleteProduct: async (id: string) => {
    return apiRequest(`/admin/products/${id}`, {
      method: "DELETE",
    })
  },
  
  // Inventory
  updateInventory: async (variantId: string, quantity: number) => {
    // Update variant's inventory_quantity directly
    // This works for simple inventory management
    return apiRequest(`/admin/products/variants/${variantId}`, {
      method: "POST",
      body: {
        inventory_quantity: quantity,
        manage_inventory: false, // Disable complex inventory management
      },
    })
  },
  
  // Bulk update inventory for multiple variants
  bulkUpdateInventory: async (updates: Array<{ variantId: string, quantity: number }>) => {
    const results = await Promise.all(
      updates.map(({ variantId, quantity }) => 
        apiRequest(`/admin/products/variants/${variantId}`, {
          method: "POST",
          body: {
            inventory_quantity: quantity,
            manage_inventory: false,
          },
        }).catch(err => ({ error: err.message, variantId }))
      )
    )
    return { results }
  },
  
  // Variants
  updateVariant: async (productId: string, variantId: string, data: any) => {
    return apiRequest(`/admin/products/${productId}/variants/${variantId}`, {
      method: "POST",
      body: data,
    })
  },
  
  // Customers
  getCustomers: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/admin/customers${query ? `?${query}` : ""}`)
  },
  
  getCustomer: async (id: string) => {
    return apiRequest(`/admin/customers/${id}`)
  },
  
  createCustomer: async (data: any) => {
    return apiRequest("/admin/customers", {
      method: "POST",
      body: data,
    })
  },
  
  updateCustomer: async (id: string, data: any) => {
    return apiRequest(`/admin/customers/${id}`, {
      method: "POST",
      body: data,
    })
  },
  
  // Categories
  getCategories: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/admin/product-categories${query ? `?${query}` : ""}`)
  },
  
  getCategory: async (id: string) => {
    return apiRequest(`/admin/product-categories/${id}`)
  },
  
  createCategory: async (data: any) => {
    return apiRequest("/admin/product-categories", {
      method: "POST",
      body: data,
    })
  },
  
  updateCategory: async (id: string, data: any) => {
    return apiRequest(`/admin/product-categories/${id}`, {
      method: "POST",
      body: data,
    })
  },
  
  deleteCategory: async (id: string) => {
    return apiRequest(`/admin/product-categories/${id}`, {
      method: "DELETE",
    })
  },
  
  // Store Settings
  getStore: async () => {
    return apiRequest("/admin/stores")
  },
  
  updateStore: async (data: any) => {
    return apiRequest("/admin/stores", {
      method: "POST",
      body: data,
    })
  },
  
  // Custom CMS endpoints
  getPages: async () => {
    return apiRequest("/admin/cms/pages")
  },
  
  getPage: async (id: string) => {
    return apiRequest(`/admin/cms/pages/${id}`)
  },
  
  createPage: async (data: any) => {
    // Map is_published to status
    const payload = {
      ...data,
      status: data.is_published ? 'published' : 'draft'
    }
    return apiRequest("/admin/cms/pages", {
      method: "POST",
      body: payload,
    })
  },
  
  updatePage: async (id: string, data: any) => {
    // Map is_published to status
    const payload = {
      ...data,
      status: data.is_published ? 'published' : 'draft'
    }
    return apiRequest(`/admin/cms/pages/${id}`, {
      method: "POST",
      body: payload,
    })
  },
  
  deletePage: async (id: string) => {
    return apiRequest(`/admin/cms/pages/${id}`, {
      method: "DELETE",
    })
  },
  
  // Topbar Settings
  getTopbarSettings: async () => {
    return apiRequest("/public/settings/topbar")
  },
  
  updateTopbarSettings: async (data: any) => {
    return apiRequest("/admin/settings/topbar", {
      method: "POST",
      body: data,
    })
  },
  
  // Mega Menu Settings
  getMegaMenuSettings: async () => {
    return apiRequest("/public/settings/megamenu")
  },
  
  updateMegaMenuSettings: async (data: any) => {
    return apiRequest("/admin/settings/megamenu", {
      method: "POST",
      body: data,
    })
  },
  
  // Banners
  getBanners: async () => {
    return apiRequest("/public/banners")
  },
  
  createBanner: async (data: any) => {
    return apiRequest("/admin/banners", {
      method: "POST",
      body: data,
    })
  },
  
  updateBanner: async (id: string, data: any) => {
    return apiRequest(`/admin/banners/${id}`, {
      method: "POST",
      body: data,
    })
  },
  
  deleteBanner: async (id: string) => {
    return apiRequest(`/admin/banners/${id}`, {
      method: "DELETE",
    })
  },
  
  // Translations (using public endpoints - no auth required)
  getTranslations: async (type: 'product' | 'category', entityId: string) => {
    return apiRequest(`/public/translations?type=${type}&entity_id=${entityId}`)
  },
  
  getTranslation: async (type: 'product' | 'category', entityId: string, locale: string) => {
    return apiRequest(`/public/translations?type=${type}&entity_id=${entityId}&locale=${locale}`)
  },
  
  saveTranslation: async (data: {
    type: 'product' | 'category'
    entity_id: string
    locale: string
    data: any
  }) => {
    return apiRequest("/public/translations", {
      method: "POST",
      body: data,
    })
  },
  
  autoTranslate: async (data: {
    type: 'product' | 'category'
    entity_id: string
    source_locale?: string
    target_locales?: string[]
    source_data: any
  }) => {
    return apiRequest("/public/translations/auto-translate", {
      method: "POST",
      body: data,
    })
  },
  
  deleteTranslation: async (type: 'product' | 'category', entityId: string, locale: string) => {
    return apiRequest("/public/translations", {
      method: "DELETE",
      body: { type, entity_id: entityId, locale },
    })
  },
  
  // Chat / Conversations
  getConversations: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    // Use store API for chat conversations (no admin auth required)
    const url = `${BACKEND_URL}/store/chat/conversations${query ? `?${query}` : ""}`
    const response = await fetch(url, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
    })
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return response.json()
  },

  getConversation: async (id: string) => {
    // Use store API for chat conversations
    const url = `${BACKEND_URL}/store/chat/conversations/${id}`
    const response = await fetch(url, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
    })
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return response.json()
  },

  // Machines
  getMachines: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/admin/machines${query ? `?${query}` : ""}`)
  },
  
  getMachine: async (id: string) => {
    return apiRequest(`/admin/machines/${id}`)
  },
  
  createMachine: async (data: any) => {
    return apiRequest("/admin/machines", {
      method: "POST",
      body: data,
    })
  },
  
  updateMachine: async (id: string, data: any) => {
    return apiRequest(`/admin/machines/${id}`, {
      method: "PUT",
      body: data,
    })
  },
  
  deleteMachine: async (id: string) => {
    return apiRequest(`/admin/machines/${id}`, {
      method: "DELETE",
    })
  },

  enrichMachine: async (id: string) => {
    return apiRequest(`/admin/machines/${id}/enrich`, {
      method: "POST",
    })
  },
}

// Generic HTTP methods for backward compatibility
export const apiClient = {
  ...api,
  get: (endpoint: string) => apiRequest(endpoint),
  post: (endpoint: string, data?: any) => apiRequest(endpoint, { method: "POST", body: data }),
  put: (endpoint: string, data?: any) => apiRequest(endpoint, { method: "PUT", body: data }),
  delete: (endpoint: string) => apiRequest(endpoint, { method: "DELETE" }),
}

export default api
