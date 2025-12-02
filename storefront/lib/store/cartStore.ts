import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  product_id: string
  variant_id: string
  title: string
  sku: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  cartId: string | null
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,

      addToCart: (item) => {
        const items = get().items
        const existingItem = items.find(i => i.variant_id === item.variant_id)

        if (existingItem) {
          set({
            items: items.map(i =>
              i.variant_id === item.variant_id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeFromCart: (itemId) => {
        set({ items: get().items.filter(i => i.id !== itemId) })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId)
        } else {
          set({
            items: get().items.map(i =>
              i.id === itemId ? { ...i, quantity } : i
            ),
          })
        }
      },

      clearCart: () => {
        set({ items: [], cartId: null })
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'omex-cart-storage',
    }
  )
)
