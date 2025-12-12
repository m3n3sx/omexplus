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
    <section className="relative bg-gradient-to-b from-neutral-50 via-white to-neutral-50 py-16 lg:py-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(235, 174, 52, 0.1) 2px, rgba(235, 174, 52, 0.1) 4px)',
        }}></div>
      </div>

      {/* Yellow accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Headline - WIX style */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-xs uppercase tracking-widest text-primary-600 font-bold mb-2">
              Quality Filtration Since 2006
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-secondary-700 mb-2 tracking-tight">
              OMEX
            </h1>
            <div className="h-1 bg-primary-500 w-32 mx-auto mb-4"></div>
          </div>
          <p className="text-xl lg:text-2xl text-secondary-600 font-light mb-4">
            Części Do Maszyn Budowlanych
          </p>
          <p className="text-sm text-secondary-500 uppercase tracking-wider">
            50,000+ produktów | Szybka dostawa | Wsparcie B2B
          </p>
        </div>

        {/* Category Pills - Light style */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="px-6 py-3 bg-white border-2 border-neutral-200 rounded text-secondary-700 font-semibold uppercase text-sm tracking-wide hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Trust Badges - Light cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-4 p-6 bg-white rounded-lg border-2 border-neutral-200 hover:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="text-4xl flex-shrink-0" aria-hidden="true">
                  {badge.icon}
                </span>
                <div>
                  <h3 className="font-bold text-secondary-700 uppercase tracking-wide text-sm">{badge.title}</h3>
                  <p className="text-xs text-secondary-500 mt-1">{badge.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
