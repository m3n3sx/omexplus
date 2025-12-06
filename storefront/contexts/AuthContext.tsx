'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Customer } from '@/types'
import medusaClient from '@/lib/medusa'

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

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if user is logged in on mount
  useEffect(() => {
    // Only run on client side after mount
    if (!mounted || typeof window === 'undefined') return
    checkAuth().catch((err) => {
      console.log('Auth check failed on mount, user not logged in')
    })
  }, [mounted])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const response = await medusaClient.customers.retrieve()
      setCustomer(response.customer as Customer)
    } catch (err: any) {
      // Not authenticated - this is normal for non-logged-in users
      // Only log if it's not a 401 error
      if (err?.response?.status !== 401) {
        console.error('Auth check error:', err)
      }
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await medusaClient.auth.authenticate({
        email,
        password,
      })

      if (response.customer) {
        setCustomer(response.customer as Customer)
      }
    } catch (err: any) {
      console.error('Login failed:', err)
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await medusaClient.customers.create(data)
      
      // Auto-login after registration
      if (response.customer) {
        await login(data.email, data.password)
      }
    } catch (err: any) {
      console.error('Registration failed:', err)
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await medusaClient.auth.deleteSession()
      setCustomer(null)
    } catch (err: any) {
      console.error('Logout failed:', err)
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
      console.error('Update failed:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshCustomer = async () => {
    await checkAuth()
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
