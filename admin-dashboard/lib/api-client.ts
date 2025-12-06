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
    headers["x-medusa-access-token"] = token
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
}

export default api
