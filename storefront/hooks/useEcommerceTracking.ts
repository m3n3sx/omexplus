'use client'

import { useCallback } from 'react'

// Extend Window interface for gtag
interface GtagWindow extends Window {
  gtag?: (...args: any[]) => void
  dataLayer?: any[]
}

declare const window: GtagWindow

export interface TrackingProduct {
  id: string
  title: string
  category?: string
  price: number
  currency?: string
  quantity?: number
  variant?: string
}

export interface TrackingOrder {
  id: string
  total: number
  tax?: number
  shipping?: number
  currency?: string
  items: TrackingProduct[]
}

export function useEcommerceTracking() {
  // Check if gtag is available
  const isGtagAvailable = () => typeof window !== 'undefined' && typeof window.gtag === 'function'

  // Track page view
  const trackPageView = useCallback((url: string, title?: string) => {
    if (!isGtagAvailable()) return
    
    window.gtag!('event', 'page_view', {
      page_path: url,
      page_title: title || document.title,
    })
  }, [])

  // Track product view (view_item)
  const trackProductView = useCallback((product: TrackingProduct) => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'view_item', {
      currency: product.currency || 'PLN',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.title,
        item_category: product.category || 'Części do maszyn',
        price: product.price,
        quantity: 1,
      }],
    })
  }, [])

  // Track product list view (view_item_list)
  const trackProductListView = useCallback((products: TrackingProduct[], listName: string) => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'view_item_list', {
      item_list_name: listName,
      items: products.map((product, index) => ({
        item_id: product.id,
        item_name: product.title,
        item_category: product.category || 'Części do maszyn',
        price: product.price,
        index: index,
      })),
    })
  }, [])

  // Track add to cart
  const trackAddToCart = useCallback((product: TrackingProduct, quantity: number = 1) => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'add_to_cart', {
      currency: product.currency || 'PLN',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.title,
        item_category: product.category || 'Części do maszyn',
        price: product.price,
        quantity: quantity,
      }],
    })
  }, [])

  // Track remove from cart
  const trackRemoveFromCart = useCallback((product: TrackingProduct, quantity: number = 1) => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'remove_from_cart', {
      currency: product.currency || 'PLN',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: quantity,
      }],
    })
  }, [])

  // Track view cart
  const trackViewCart = useCallback((products: TrackingProduct[], total: number) => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'view_cart', {
      currency: 'PLN',
      value: total,
      items: products.map(product => ({
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: product.quantity || 1,
      })),
    })
  }, [])

  // Track begin checkout
  const trackBeginCheckout = useCallback((products: TrackingProduct[], total: number) => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'begin_checkout', {
      currency: 'PLN',
      value: total,
      items: products.map(product => ({
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: product.quantity || 1,
      })),
    })
  }, [])

  // Track add shipping info
  const trackAddShippingInfo = useCallback((products: TrackingProduct[], total: number, shippingMethod: string) => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'add_shipping_info', {
      currency: 'PLN',
      value: total,
      shipping_tier: shippingMethod,
      items: products.map(product => ({
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: product.quantity || 1,
      })),
    })
  }, [])

  // Track add payment info
  const trackAddPaymentInfo = useCallback((products: TrackingProduct[], total: number, paymentMethod: string) => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'add_payment_info', {
      currency: 'PLN',
      value: total,
      payment_type: paymentMethod,
      items: products.map(product => ({
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: product.quantity || 1,
      })),
    })
  }, [])

  // Track purchase
  const trackPurchase = useCallback((order: TrackingOrder) => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'purchase', {
      transaction_id: order.id,
      affiliation: 'OMEX',
      value: order.total,
      currency: order.currency || 'PLN',
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.title,
        item_category: item.category || 'Części do maszyn',
        price: item.price,
        quantity: item.quantity || 1,
      })),
    })

    // Also track conversion for Google Ads
    window.gtag!('event', 'conversion', {
      send_to: 'AW-751186138/purchase',
      value: order.total,
      currency: order.currency || 'PLN',
      transaction_id: order.id,
    })
  }, [])

  // Track search
  const trackSearch = useCallback((searchTerm: string, resultsCount?: number) => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'search', {
      search_term: searchTerm,
      ...(resultsCount !== undefined && { results_count: resultsCount }),
    })
  }, [])

  // Track sign up
  const trackSignUp = useCallback((method: string = 'email') => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'sign_up', {
      method: method,
    })
  }, [])

  // Track login
  const trackLogin = useCallback((method: string = 'email') => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'login', {
      method: method,
    })
  }, [])

  // Track contact form submission
  const trackContactForm = useCallback((formType: string = 'contact') => {
    if (!isGtagAvailable()) return

    window.gtag!('event', 'generate_lead', {
      currency: 'PLN',
      value: 50, // Estimated lead value
      lead_source: formType,
    })
  }, [])

  return {
    trackPageView,
    trackProductView,
    trackProductListView,
    trackAddToCart,
    trackRemoveFromCart,
    trackViewCart,
    trackBeginCheckout,
    trackAddShippingInfo,
    trackAddPaymentInfo,
    trackPurchase,
    trackSearch,
    trackSignUp,
    trackLogin,
    trackContactForm,
  }
}
