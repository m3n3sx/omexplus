// Google Analytics & Ads Event Tracking

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

// ============ GA4 EVENTS ============

// View item (product page)
export function trackViewItem(item: {
  id: string
  name: string
  category?: string
  price?: number
  currency?: string
}) {
  window.gtag?.('event', 'view_item', {
    currency: item.currency || 'PLN',
    value: item.price || 0,
    items: [{
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
    }]
  })
}

// Add to cart
export function trackAddToCart(item: {
  id: string
  name: string
  category?: string
  price?: number
  quantity?: number
  currency?: string
}) {
  window.gtag?.('event', 'add_to_cart', {
    currency: item.currency || 'PLN',
    value: (item.price || 0) * (item.quantity || 1),
    items: [{
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity || 1,
    }]
  })
}

// Remove from cart
export function trackRemoveFromCart(item: {
  id: string
  name: string
  price?: number
  quantity?: number
  currency?: string
}) {
  window.gtag?.('event', 'remove_from_cart', {
    currency: item.currency || 'PLN',
    value: (item.price || 0) * (item.quantity || 1),
    items: [{
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }]
  })
}

// View cart
export function trackViewCart(items: Array<{
  id: string
  name: string
  price?: number
  quantity?: number
}>, totalValue: number, currency = 'PLN') {
  window.gtag?.('event', 'view_cart', {
    currency,
    value: totalValue,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
  })
}

// Begin checkout
export function trackBeginCheckout(items: Array<{
  id: string
  name: string
  price?: number
  quantity?: number
}>, totalValue: number, currency = 'PLN') {
  window.gtag?.('event', 'begin_checkout', {
    currency,
    value: totalValue,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
  })
}

// Purchase (conversion)
export function trackPurchase(transaction: {
  transactionId: string
  value: number
  currency?: string
  tax?: number
  shipping?: number
  items: Array<{
    id: string
    name: string
    price?: number
    quantity?: number
  }>
}) {
  // GA4 purchase event
  window.gtag?.('event', 'purchase', {
    transaction_id: transaction.transactionId,
    value: transaction.value,
    currency: transaction.currency || 'PLN',
    tax: transaction.tax || 0,
    shipping: transaction.shipping || 0,
    items: transaction.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
  })

  // Google Ads conversion (if configured)
  if (GOOGLE_ADS_ID) {
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/purchase`,
      value: transaction.value,
      currency: transaction.currency || 'PLN',
      transaction_id: transaction.transactionId,
    })
  }
}

// Search
export function trackSearch(searchTerm: string) {
  window.gtag?.('event', 'search', {
    search_term: searchTerm,
  })
}

// View item list (category page)
export function trackViewItemList(listName: string, items: Array<{
  id: string
  name: string
  category?: string
  price?: number
  position?: number
}>) {
  window.gtag?.('event', 'view_item_list', {
    item_list_name: listName,
    items: items.map((item, index) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      index: item.position || index,
    }))
  })
}

// Select item (click on product in list)
export function trackSelectItem(item: {
  id: string
  name: string
  category?: string
  price?: number
  listName?: string
}) {
  window.gtag?.('event', 'select_item', {
    item_list_name: item.listName,
    items: [{
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
    }]
  })
}

// ============ CUSTOM EVENTS ============

// Contact form submission
export function trackContactForm(formType: string) {
  window.gtag?.('event', 'generate_lead', {
    event_category: 'Contact',
    event_label: formType,
  })

  // Google Ads lead conversion
  if (GOOGLE_ADS_ID) {
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/lead`,
    })
  }
}

// Enquiry submission (B2B)
export function trackEnquiry(productId: string, productName: string) {
  window.gtag?.('event', 'generate_lead', {
    event_category: 'Enquiry',
    event_label: productName,
    item_id: productId,
  })

  if (GOOGLE_ADS_ID) {
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/enquiry`,
    })
  }
}

// Newsletter signup
export function trackNewsletterSignup() {
  window.gtag?.('event', 'sign_up', {
    method: 'newsletter',
  })
}

// Login
export function trackLogin(method: string) {
  window.gtag?.('event', 'login', {
    method,
  })
}

// Sign up
export function trackSignUp(method: string) {
  window.gtag?.('event', 'sign_up', {
    method,
  })
}

// Phone click
export function trackPhoneClick(phoneNumber: string) {
  window.gtag?.('event', 'click', {
    event_category: 'Contact',
    event_label: 'Phone',
    value: phoneNumber,
  })
}

// Email click
export function trackEmailClick(email: string) {
  window.gtag?.('event', 'click', {
    event_category: 'Contact',
    event_label: 'Email',
    value: email,
  })
}
