'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Customer } from '@/types'
import medusaClient from '@/lib/medusa'

// Import auth API if needed
// import { authAPI } from '@/lib/auth-api'

interface AuthContextType {
  customer: Customer | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateCustomer: (data: Partial<Customer>) => Promise<void>
  refreshCustomer: () => Promise<void>
  isAuthenticated: boolean
  clearError: () => void
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const checkAuth = async () => {
    try {
      setLoading(true)
      
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('medusa_auth_token') : null
      
      if (!token) {
        setCustomer(null)
        setLoading(false)
        return
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/customers/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0',
        },
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.customer) {
          console.log('Customer loaded:', data.customer)
          setCustomer(data.customer as Customer)
        }
      } else {
        console.log('Failed to load customer, clearing token')
        localStorage.removeItem('medusa_auth_token')
        setCustomer(null)
      }
    } catch (err: any) {
      // Not authenticated - this is normal for non-logged-in users
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }

  // Set mounted state and check auth on mount
  useEffect(() => {
    setMounted(true)
    
    // Check if user is logged in on mount
    if (typeof window === 'undefined') return
    
    checkAuth()
  }, []) // Empty dependency array - run only once on mount

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const loginData = await response.json()
      console.log('Login successful:', loginData)

      // Store token in localStorage
      if (loginData.token) {
        localStorage.setItem('medusa_auth_token', loginData.token)
      }

      // Set customer data immediately
      if (loginData.customer) {
        setCustomer(loginData.customer as Customer)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setLoading(true)
      setError(null)

      console.log('Starting registration for:', data.email)

      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: data.email, 
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Registration failed:', errorData)
        throw new Error(errorData.message || 'Failed to register')
      }

      const registerData = await response.json()
      console.log('Registration successful:', registerData)

      // Store token from registration
      if (registerData.token) {
        localStorage.setItem('medusa_auth_token', registerData.token)
      }

      // Set customer data immediately
      if (registerData.customer) {
        setCustomer(registerData.customer as Customer)
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('medusa_auth_token') : null
      
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/auth/session`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0',
          },
          credentials: 'include',
        })
      }
      
      // Clear token from localStorage
      localStorage.removeItem('medusa_auth_token')
      setCustomer(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateCustomer = async (data: Partial<Customer>) => {
    if (!customer) throw new Error('No customer logged in')

    try {
      setLoading(true)
      setError(null)

      const response = await medusaClient.customers.update(data)
      setCustomer(response.customer as Customer)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshCustomer = async () => {
    await checkAuth()
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        error,
        login,
        register,
        logout,
        updateCustomer,
        refreshCustomer,
        isAuthenticated: !!customer,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
