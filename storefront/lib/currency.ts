// Currency conversion utilities
// Note: In production, use real-time exchange rates from an API

export const CURRENCY_SYMBOLS: Record<string, string> = {
  PLN: 'zł',
  EUR: '€',
  USD: '$',
  GBP: '£',
  UAH: '₴',
}

export const CURRENCY_NAMES: Record<string, string> = {
  PLN: 'Polski Złoty',
  EUR: 'Euro',
  USD: 'US Dollar',
  GBP: 'British Pound',
  UAH: 'Українська гривня',
}

// Approximate exchange rates (PLN as base)
// In production, fetch from API like exchangerate-api.com
export const EXCHANGE_RATES: Record<string, number> = {
  PLN: 1,
  EUR: 0.23,
  USD: 0.25,
  GBP: 0.20,
  UAH: 10.5,
}

export function convertPrice(amountInCents: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amountInCents
  
  // Convert to PLN first (base currency)
  const amountInPLN = amountInCents / (EXCHANGE_RATES[fromCurrency] || 1)
  
  // Convert to target currency
  const convertedAmount = amountInPLN * (EXCHANGE_RATES[toCurrency] || 1)
  
  return Math.round(convertedAmount)
}

export function formatPrice(amountInCents: number, currency: string): string {
  const amount = amountInCents / 100
  const symbol = CURRENCY_SYMBOLS[currency] || currency
  
  // Format based on currency
  if (currency === 'UAH') {
    return `${amount.toFixed(2)} ${symbol}`
  }
  
  if (currency === 'PLN') {
    return `${amount.toFixed(2)} ${symbol}`
  }
  
  return `${symbol}${amount.toFixed(2)}`
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] || currency
}

export function getCurrencyName(currency: string): string {
  return CURRENCY_NAMES[currency] || currency
}
