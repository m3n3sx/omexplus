'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Cart } from '@/types'

interface CartContextType {
  cart: Cart | null
  loading: boolean
  error: string | null
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  clearCart: () => void
  refreshCart: () => Promise<void>
  itemCount: number
  setShippingAddress: (address: any) => Promise<void>
  setBillingAddress: (address: any) => Promise<void>
  addShippingMethod: (optionId: string) => Promise<void>
  completeCart: () => Promise<any>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// API helper for cart operations
// Hardcoded for reliability - env vars can be undefined in client components
const BACKEND_URL = 'http://localhost:9000'
const API_KEY = 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0'
const REGION_ID = 'reg_01KBDXHQAFG1GS7F3WH2680KP0'

async function cartApi(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-publishable-api-key': API_KEY,
    ...options.headers,
  }

  const url = `${BACKEND_URL}${endpoint}`
  console.log(`🛒 Cart API: ${options.method || 'GET'} ${url}`)
  console.log(`🔑 API Key: ${API_KEY ? API_KEY.substring(0, 20) + '...' : 'MISSING'}`)

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const responseText = await response.text()
    console.log(`📦 Cart API Response (${response.status}):`, responseText.substring(0, 300))

    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}`
      try {
        const error = JSON.parse(responseText)
        errorMsg = error.message || error.error || errorMsg
      } catch {}
      console.error(`❌ Cart API Error:`, errorMsg)
      throw new Error(errorMsg)
    }

    try {
      return JSON.parse(responseText)
    } catch {
      return {}
    }
  } catch (fetchError: any) {
    console.error(`❌ Fetch Error:`, fetchError.message)
    throw fetchError
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    
    const cartId = localStorage.getItem('cart_id')
    if (cartId) {
      loadCart(cartId).catch((err) => {
        console.log('Cart load failed, will create new cart on first add:', err.message)
        localStorage.removeItem('cart_id')
      })
    }
  }, [mounted])

  const loadCart = async (cartId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await cartApi(`/store/carts/${cartId}`)
      setCart(data.cart as Cart)
    } catch (err: any) {
      console.error('Failed to load cart:', err)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_id')
      }
      setCart(null)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createCart = async () => {
    try {
      const data = await cartApi('/store/carts', {
        method: 'POST',
        body: JSON.stringify({ region_id: REGION_ID }),
      })
      
      const newCart = data.cart as Cart
      setCart(newCart)
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart_id', newCart.id)
      }
      return newCart
    } catch (err: any) {
      console.error('Failed to create cart:', err)
      setError(err.message)
      throw err
    }
  }

  const addItem = async (variantId: string, quantity: number) => {
    try {
      setLoading(true)
      setError(null)

      let currentCart = cart
      if (!currentCart) {
        currentCart = await createCart()
      }

      const data = await cartApi(`/store/carts/${currentCart.id}/line-items`, {
        method: 'POST',
        body: JSON.stringify({
          variant_id: variantId,
          quantity,
        }),
      })

      setCart(data.cart as Cart)
    } catch (err: any) {
      console.error('Failed to add item:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return

    try {
      setLoading(true)
      setError(null)

      const data = await cartApi(`/store/carts/${cart.id}/line-items/${lineId}`, {
        method: 'POST',
        body: JSON.stringify({ quantity }),
      })

      setCart(data.cart as Cart)
    } catch (err: any) {
      console.error('Failed to update item:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (lineId: string) => {
    if (!cart) return

    try {
      setLoading(true)
      setError(null)

      const data = await cartApi(`/store/carts/${cart.id}/line-items/${lineId}`, {
        method: 'DELETE',
      })
      
      setCart(data.cart as Cart)
    } catch (err: any) {
      console.error('Failed to remove item:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearCart = () => {
    setCart(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart_id')
    }
  }

  const refreshCart = async () => {
    if (cart) {
      await loadCart(cart.id)
    }
  }

  const setShippingAddress = async (address: any) => {
    if (!cart) throw new Error('No cart found')

    try {
      setLoading(true)
      const data = await cartApi(`/store/carts/${cart.id}`, {
        method: 'POST',
        body: JSON.stringify({ shipping_address: address }),
      })
      setCart(data.cart as Cart)
    } catch (err: any) {
      console.error('Failed to set shipping address:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const setBillingAddress = async (address: any) => {
    if (!cart) throw new Error('No cart found')

    try {
      setLoading(true)
      const data = await cartApi(`/store/carts/${cart.id}`, {
        method: 'POST',
        body: JSON.stringify({ billing_address: address }),
      })
      setCart(data.cart as Cart)
    } catch (err: any) {
      console.error('Failed to set billing address:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addShippingMethod = async (optionId: string) => {
    if (!cart) throw new Error('No cart found')

    try {
      setLoading(true)
      const data = await cartApi(`/store/carts/${cart.id}/shipping-methods`, {
        method: 'POST',
        body: JSON.stringify({ option_id: optionId }),
      })
      setCart(data.cart as Cart)
    } catch (err: any) {
      console.error('Failed to add shipping method:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const completeCart = async () => {
    if (!cart) throw new Error('No cart found')

    try {
      setLoading(true)
      const data = await cartApi(`/store/carts/${cart.id}/complete`, {
        method: 'POST',
      })
      
      clearCart()
      return data
    } catch (err: any) {
      console.error('Failed to complete cart:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
        itemCount,
        setShippingAddress,
        setBillingAddress,
        addShippingMethod,
        completeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}
