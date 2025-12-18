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
  
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  })
  
  console.log(`API Response: ${response.status}`)
  
  if (!response.ok) {
    // If unauthorized, clear token and redirect to login
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("medusa_admin_token")
      if (!endpoint.includes("/auth/")) {
        window.location.href = "/login"
      }
    }
    
    const errorText = await response.text()
    console.error(`API Error: ${errorText}`)
    
    try {
      const error = JSON.parse(errorText)
      throw new Error(error.message || `HTTP ${response.status}`)
    } catch {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
  }
  
  const data = await response.json()
  return data
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
    return apiRequest(`/admin/orders/${orderId}`, {
      method: "POST",
      body: data,
    })
  },
  
  // Products
  getProducts: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
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
  
  // Customers
  getCustomers: async (params?: any) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/admin/customers${query ? `?${query}` : ""}`)
  },
  
  getCustomer: async (id: string) => {
    return apiRequest(`/admin/customers/${id}`)
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
    return apiRequest("/admin/cms/pages", {
      method: "POST",
      body: data,
    })
  },
  
  updatePage: async (id: string, data: any) => {
    return apiRequest(`/admin/cms/pages/${id}`, {
      method: "POST",
      body: data,
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
  
  // Translations
  getTranslations: async (type: 'product' | 'category', entityId: string) => {
    return apiRequest(`/admin/translations?type=${type}&entity_id=${entityId}`)
  },
  
  getTranslation: async (type: 'product' | 'category', entityId: string, locale: string) => {
    return apiRequest(`/admin/translations?type=${type}&entity_id=${entityId}&locale=${locale}`)
  },
  
  saveTranslation: async (data: {
    type: 'product' | 'category'
    entity_id: string
    locale: string
    data: any
  }) => {
    return apiRequest("/admin/translations", {
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
    return apiRequest("/admin/translations/auto-translate", {
      method: "POST",
      body: data,
    })
  },
  
  deleteTranslation: async (type: 'product' | 'category', entityId: string, locale: string) => {
    return apiRequest("/admin/translations", {
      method: "DELETE",
      body: { type, entity_id: entityId, locale },
    })
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
