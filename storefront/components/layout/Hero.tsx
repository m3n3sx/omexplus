import Link from 'next/link'

export function Hero() {
  const categories = [
    { name: 'Hydraulika', href: '/kategoria/hydraulika' },
    { name: 'Filtry', href: '/kategoria/filtry' },
    { name: 'Osprzęt', href: '/kategoria/osprzet' },
    { name: 'Łożyska', href: '/kategoria/loziska' },
    { name: 'Silniki', href: '/kategoria/silniki' },
    { name: 'Łyżki', href: '/kategoria/lyzki' },
  ]

  const trustBadges = [
    { icon: '🚚', title: 'Szybka wysyłka', subtitle: 'InPost, DPD, DHL' },
    { icon: '✓', title: 'Gwarancja', subtitle: '24 miesiące' },
    { icon: '📞', title: '24/7 Support', subtitle: 'Wsparcie techniczne' },
  ]

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Main Headline */}
        <div className="text-center mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
            OMEX - Części Do Maszyn Budowlanych
          </h1>
          <p className="text-lg text-gray-600">
            50,000+ produktów | Szybka dostawa | Wsparcie B2B
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="px-6 py-2 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
            >
              <span className="text-3xl flex-shrink-0" aria-hidden="true">
                {badge.icon}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
