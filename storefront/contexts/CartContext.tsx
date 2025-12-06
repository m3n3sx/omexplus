'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Cart, LineItem } from '@/types'
import medusaClient from '@/lib/medusa'

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load cart on mount
  useEffect(() => {
    // Only run on client side after mount
    if (!mounted || typeof window === 'undefined') return
    
    const cartId = localStorage.getItem('cart_id')
    if (cartId) {
      loadCart(cartId).catch((err) => {
        console.log('Cart load failed, will create new cart on first add:', err.message)
      })
    }
  }, [mounted])

  const loadCart = async (cartId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await medusaClient.carts.retrieve(cartId)
      setCart(response.cart as Cart)
    } catch (err: any) {
      console.error('Failed to load cart:', err)
      // If cart not found or network error, clear localStorage
      if (err.response?.status === 404 || err.message?.includes('Network')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart_id')
        }
        setCart(null)
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createCart = async () => {
    try {
      const response = await medusaClient.carts.create({
        region_id: 'reg_01KBDXHQAFG1GS7F3WH2680KP0' // Europe region with Poland
      })
      const newCart = response.cart as Cart
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

      const response = await medusaClient.carts.lineItems.create(currentCart.id, {
        variant_id: variantId,
        quantity,
      })

      setCart(response.cart as Cart)
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

      const response = await medusaClient.carts.lineItems.update(cart.id, lineId, {
        quantity,
      })

      setCart(response.cart as Cart)
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

      const response = await medusaClient.carts.lineItems.delete(cart.id, lineId)
      setCart(response.cart as Cart)
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
    localStorage.removeItem('cart_id')
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
      const response = await medusaClient.carts.update(cart.id, {
        shipping_address: address,
      })
      setCart(response.cart as Cart)
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
      const response = await medusaClient.carts.update(cart.id, {
        billing_address: address,
      })
      setCart(response.cart as Cart)
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
      const response = await medusaClient.carts.addShippingMethod(cart.id, {
        option_id: optionId,
      })
      setCart(response.cart as Cart)
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
      const response = await medusaClient.carts.complete(cart.id)
      
      // Clear cart after successful completion
      clearCart()
      
      return response
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
