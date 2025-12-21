'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ProductCardTemplate } from '@/components/product/ProductCardTemplate'

export default function FiltersPage() {
  const locale = useLocale()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products?limit=12&category=filtry')
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const brands = [
    'Yanmar', 'Atlas', 'Fiat-Kobelco', 'Fiat-Hitachi', 'Hitachi', 'New Holland',
    'Kramer Allrad', 'Wacker Neuson', 'Bobcat', 'O&K', 'Case', 'JCB', 'Schaeff',
    'Terex', 'Komatsu', 'Caterpillar', 'Fermec', 'Kubota'
  ]

  const filterTypes = [
    { icon: <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, name: 'Filtry oleju', desc: 'Do silników i układów hydraulicznych' },
    { icon: <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, name: 'Filtry paliwa', desc: 'Ochrona układu paliwowego' },
    { icon: <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>, name: 'Filtry powietrza', desc: 'Czyste powietrze dla silnika' },
    { icon: <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, name: 'Filtry hydrauliczne', desc: 'Dla układów hydraulicznych' },
    { icon: <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, name: 'Filtry kabinowe', desc: 'Komfort operatora' },
    { icon: <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, name: 'Filtry przekładniowe', desc: 'Ochrona skrzyni biegów' },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>Filtry</span>
        </div>

        {/* Hero Section */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <div className="relative z-10">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Do każdej maszyny</span>
            <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading">
              Filtry do Maszyn <span className="text-primary-500">Budowlanych</span>
            </h1>
            <p className="text-neutral-300 text-lg max-w-3xl leading-relaxed">
              Kompleksowa oferta filtrów do koparek, ładowarek i innych maszyn budowlanych. 
              Oryginalne i zamienne filtry najwyższej jakości.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg p-8 lg:p-12 mb-12 shadow-sm">
          <div className="flex gap-1 mb-6">
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mb-6 font-heading">
            Filtry
          </h2>
          <div className="text-secondary-600 leading-relaxed space-y-4">
            <p>
              Wiemy, że odpowiednie filtry są kluczowe dla utrzymania wydajności Państwa maszyn, 
              dlatego w naszej szerokiej ofercie znajdują się produkty, które <strong className="text-secondary-700">zapewnią ochronę 
              przed zanieczyszczeniami</strong> i przedłużą żywotność Państwa urządzeń.
            </p>
            <p>
              W naszej ofercie znajdą Państwo specjalnie dostosowane filtry do różnych typów 
              maszyn budowlanych, takich jak <strong className="text-primary-500">koparki, ładowarki, minikoparki, spychacze</strong> i wiele innych.
            </p>
            <p>
              Nasi wykwalifikowani specjaliści są gotowi służyć fachowym doradztwem w doborze 
              odpowiednich filtrów do Państwa maszyn budowlanych. Zależy nam na zapewnieniu 
              Państwu kompleksowej obsługi, dlatego nie tylko dostarczamy produkty, ale również 
              służymy wskazówkami dotyczącymi prawidłowego stosowania, terminów wymiany i konserwacji 
              filtrów.
            </p>
          </div>
        </div>

        {/* Filter Types */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Rodzaje</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mt-4 font-heading">
              Typy <span className="text-primary-500">filtrów</span>
            </h2>
            <div className="flex justify-center gap-1 mt-4">
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {filterTypes.map((type, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary-500">
                <div className="flex justify-center mb-4">{type.icon}</div>
                <h3 className="font-bold text-secondary-700 mb-2">{type.name}</h3>
                <p className="text-secondary-500 text-sm">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="bg-neutral-100 rounded-lg p-8 mb-12">
          <h3 className="text-xl font-bold text-secondary-700 mb-4 text-center">Współpracujemy z producentami:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {brands.map((brand, idx) => (
              <span key={idx} className="bg-white px-4 py-2 rounded-full text-sm text-secondary-600 shadow-sm hover:shadow-md transition-shadow">
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Products Section */}
        {!loading && products.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Produkty</span>
                <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mt-4 font-heading">
                  Filtry w <span className="text-primary-500">ofercie</span>
                </h2>
              </div>
              <Link href={`/${locale}/search?category=filtry`} className="bg-primary-500 text-white hover:bg-secondary-700 px-6 py-2 rounded-full font-bold text-sm transition-all">
                Zobacz wszystkie
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCardTemplate key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-primary-500 rounded-lg p-8 lg:p-12 text-center text-white">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 font-heading">
            Nie znalazłeś filtra którego szukasz?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Chętnie pomożemy! Skontaktuj się z nami, a nasi specjaliści dobiorą odpowiednie filtry do Twojej maszyny.
          </p>
          <Link
            href={`/${locale}/kontakt`}
            className="inline-block px-8 py-3 bg-white text-primary-500 rounded-full font-bold hover:bg-secondary-700 hover:text-white transition-colors"
          >
            Skontaktuj się z nami
          </Link>
        </div>
      </div>
    </div>
  )
}
