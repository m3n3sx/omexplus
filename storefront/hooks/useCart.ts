import { useState, useEffect, createContext, useContext } from 'react'
import apiClient from '../lib/api-client'

interface CartItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  total: number
}

interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load cart from localStorage
    const cartId = localStorage.getItem('cart_id')
    if (cartId) {
      loadCart(cartId)
    }
  }, [])

  const loadCart = async (cartId: string) => {
    try {
      setLoading(true)
      const data = await apiClient.getCart(cartId)
      setCart(data.cart)
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCart = async () => {
    try {
      const data = await apiClient.createCart()
      setCart(data.cart)
      localStorage.setItem('cart_id', data.cart.id)
      return data.cart
    } catch (error) {
      console.error('Failed to create cart:', error)
      throw error
    }
  }

  const addItem = async (productId: string, quantity: number) => {
    try {
      let currentCart = cart

      if (!currentCart) {
        currentCart = await createCart()
      }

      const data = await apiClient.addToCart(currentCart.id, productId, quantity)
      
      // Reload cart to get updated totals
      await loadCart(currentCart.id)

      return data.line_item
    } catch (error) {
      console.error('Failed to add to cart:', error)
      throw error
    }
  }

  const updateItem = async (itemId: string, quantity: number) => {
    if (!cart) return

    try {
      await apiClient.updateCartItem(cart.id, itemId, quantity)
      await loadCart(cart.id)
    } catch (error) {
      console.error('Failed to update cart item:', error)
      throw error
    }
  }

  const removeItem = async (itemId: string) => {
    if (!cart) return

    try {
      await apiClient.removeCartItem(cart.id, itemId)
      await loadCart(cart.id)
    } catch (error) {
      console.error('Failed to remove cart item:', error)
      throw error
    }
  }

  const clearCart = () => {
    setCart(null)
    localStorage.removeItem('cart_id')
  }

  return {
    cart,
    loading,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    itemCount: cart?.items?.length || 0,
  }
}
