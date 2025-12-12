'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCurrency } from '@/contexts/CurrencyContext'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

export default function PromocjePage() {
  const { currency } = useCurrency()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products?limit=12')
        const data = await response.json()
        // Filter products with discount or mark first 6 as promotional
        const promoProducts = data.products?.slice(0, 12) || []
        setProducts(promoProducts)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-neutral-600">Ładowanie promocji...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-12 mb-12 text-white">
        <div className="max-w-3xl">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🔥 Gorące promocje
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Promocje i Wyprzedaże
          </h1>
          <p className="text-xl mb-6 text-white/90">
            Najlepsze oferty na części do maszyn budowlanych. Oszczędź nawet do 50%!
          </p>
          <div className="flex gap-4 text-sm">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              ✓ Darmowa dostawa od 500 PLN
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              ✓ Gwarancja najniższej ceny
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold">
          Wszystkie
        </button>
        <button className="px-6 py-2 bg-white border-2 border-neutral-200 rounded-lg font-semibold hover:border-primary-500 transition-colors">
          Do -20%
        </button>
        <button className="px-6 py-2 bg-white border-2 border-neutral-200 rounded-lg font-semibold hover:border-primary-500 transition-colors">
          Do -30%
        </button>
        <button className="px-6 py-2 bg-white border-2 border-neutral-200 rounded-lg font-semibold hover:border-primary-500 transition-colors">
          Do -50%
        </button>
        <button className="px-6 py-2 bg-white border-2 border-neutral-200 rounded-lg font-semibold hover:border-primary-500 transition-colors">
          Wyprzedaż
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCardTemplate key={product.id} product={product} />
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Nie przegap najlepszych okazji!</h2>
        <p className="mb-6 text-white/90">
          Zapisz się do newslettera i otrzymuj informacje o nowych promocjach
        </p>
        <div className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Twój adres e-mail"
            className="flex-1 px-4 py-3 rounded-lg text-neutral-900"
          />
          <button className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-neutral-100 transition-colors">
            Zapisz się
          </button>
        </div>
      </div>
    </div>
  )
}
