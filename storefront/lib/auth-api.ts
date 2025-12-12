/**
 * Authentication API Client
 * Handles user authentication, registration, and session management
 */

import { Customer } from '@/types'

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  customer: Customer
}

export interface SessionData {
  customer: Customer
  token?: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

/**
 * Make authenticated request to backend API
 * Uses fetch directly to ensure proper cookie handling
 */
async function authRequest(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: any
  } = {}
): Promise<any> {
  const { method = 'GET', body } = options
  const url = `${BACKEND_URL}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-publishable-api-key': PUBLISHABLE_KEY,
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'include', // Critical: include cookies
  }

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error(`Auth request failed: ${endpoint}`, error)
    throw error
  }
}

/**
 * Authentication API Client
 */
export class AuthAPI {
  /**
   * Register a new customer account
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Registering new customer...')
      
      const response = await authRequest('/store/customers', {
        method: 'POST',
        body: {
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
        },
      })

      console.log('Registration successful')
      return {
        customer: response.customer as Customer,
      }
    } catch (error: any) {
      console.error('Registration failed:', error)
      throw new Error(
        error.message || 
        'Registration failed. Please try again.'
      )
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login...')
      console.log('Backend URL:', BACKEND_URL)
      
      // Step 1: Authenticate and get session cookie
      const authResponse = await authRequest('/auth/customer/emailpass', {
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      })

      console.log('Authentication successful, fetching customer data...')

      // Step 2: Fetch customer data with the session cookie
      // The cookie from step 1 is automatically included due to credentials: 'include'
      const customerResponse = await authRequest('/store/customers/me')

      console.log('Customer data fetched successfully')
      return {
        customer: customerResponse.customer as Customer,
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      
      // Provide more specific error messages
      if (error.message?.includes('connect')) {
        throw new Error(
          'Cannot connect to backend server. Please ensure the backend is running at ' + BACKEND_URL
        )
      }
      
      throw new Error(
        error.message || 
        'Invalid email or password'
      )
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      console.log('Logging out...')
      await authRequest('/auth/session', {
        method: 'DELETE',
      })
      console.log('Logout successful')
    } catch (error: any) {
      console.error('Logout failed:', error)
      // Don't throw error on logout failure - just log it
    }
  }

  /**
   * Get current session/customer
   */
  async getSession(): Promise<Customer | null> {
    try {
      const response = await authRequest('/store/customers/me')
      return response.customer as Customer || null
    } catch (error: any) {
      // 401 is expected when not authenticated
      if (error.message?.includes('401')) {
        console.log('No active session')
        return null
      }
      console.error('Get session failed:', error)
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const customer = await this.getSession()
      return !!customer
    } catch (error) {
      return false
    }
  }

  /**
   * Refresh session token (if needed)
   * Note: Medusa uses httpOnly cookies for session management
   */
  async refreshToken(): Promise<string | null> {
    try {
      // Medusa uses httpOnly cookies for session management
      // Token refresh is handled automatically by the backend
      const customer = await this.getSession()
      return customer ? 'session-active' : null
    } catch (error) {
      console.error('Token refresh failed:', error)
      return null
    }
  }
}

// Export singleton instance
export const authAPI = new AuthAPI()
export default authAPI
