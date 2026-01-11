import { NextResponse } from 'next/server'

// Shipping methods available in Poland
const SHIPPING_METHODS = [
  {
    id: 'pickup',
    provider: 'omex',
    method: 'pickup',
    name: 'Odbiór osobisty',
    description: 'Odbiór w siedzibie firmy: ul. Gnieźnieńska 19, 62-300 Września',
    price: 0,
    currency: 'PLN',
    delivery_days: 0,
  },
  {
    id: 'inpost_paczkomat',
    provider: 'inpost',
    method: 'paczkomat',
    name: 'InPost Paczkomat 24/7',
    description: 'Odbiór w Paczkomacie - dostępny całą dobę',
    price: 13.99,
    currency: 'PLN',
    delivery_days: 2,
  },
  {
    id: 'inpost_courier',
    provider: 'inpost',
    method: 'courier',
    name: 'InPost Kurier',
    description: 'Dostawa kurierem pod wskazany adres',
    price: 18.99,
    currency: 'PLN',
    delivery_days: 1,
  },
  {
    id: 'dpd_standard',
    provider: 'dpd',
    method: 'standard',
    name: 'DPD Standard',
    description: 'Standardowa dostawa 1-2 dni robocze',
    price: 16.99,
    currency: 'PLN',
    delivery_days: 2,
  },
  {
    id: 'dhl_standard',
    provider: 'dhl',
    method: 'standard',
    name: 'DHL Standard',
    description: 'Dostawa 2-3 dni robocze',
    price: 19.99,
    currency: 'PLN',
    delivery_days: 3,
  },
]

export async function GET() {
  return NextResponse.json({
    methods: SHIPPING_METHODS,
    free_shipping_threshold: 500,
    currency: 'PLN',
  })
}
