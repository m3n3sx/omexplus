import { NextResponse } from 'next/server'

// Payment methods available in Poland
const PAYMENT_METHODS = [
  {
    id: 'cash_on_delivery',
    name: 'Płatność przy odbiorze',
    description: 'Zapłać gotówką lub kartą przy odbiorze przesyłki',
    provider: 'cod',
    available: true,
  },
  {
    id: 'tpay_blik',
    name: 'BLIK',
    description: 'Szybka płatność kodem BLIK',
    provider: 'tpay',
    available: true,
  },
  {
    id: 'tpay_transfer',
    name: 'Przelew bankowy',
    description: 'Przelew online z Twojego banku',
    provider: 'tpay',
    available: true,
  },
  {
    id: 'tpay_card',
    name: 'Karta płatnicza',
    description: 'Visa, Mastercard, Maestro',
    provider: 'tpay',
    available: true,
  },
  {
    id: 'tpay_google_pay',
    name: 'Google Pay',
    description: 'Płatność przez Google Pay',
    provider: 'tpay',
    available: true,
  },
  {
    id: 'tpay_apple_pay',
    name: 'Apple Pay',
    description: 'Płatność przez Apple Pay',
    provider: 'tpay',
    available: true,
  },
]

export async function GET() {
  return NextResponse.json({ methods: PAYMENT_METHODS })
}
