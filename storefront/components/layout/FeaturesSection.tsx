'use client'

interface Feature {
  icon: string
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: '✓',
    title: 'Gwarancja jakości',
    description: 'Oryginalne i certyfikowane części od sprawdzonych producentów',
    color: 'from-success/10 to-success/5'
  },
  {
    icon: '💰',
    title: 'Konkurencyjne ceny',
    description: 'Najlepsze ceny hurtowe dla firm i stałych klientów',
    color: 'from-secondary-500/10 to-secondary-500/5'
  },
  {
    icon: '🚚',
    title: 'Szybka dostawa',
    description: 'Realizacja zamówień w 24-48h na terenie całej Polski',
    color: 'from-info/10 to-info/5'
  },
  {
    icon: '💬',
    title: 'Wsparcie eksperckie',
    description: 'Profesjonalna pomoc techniczna i doradztwo',
    color: 'from-primary-500/10 to-primary-500/5'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Dlaczego OMEX?
          </h2>
          <p className="text-lg text-neutral-600">
            Jesteśmy liderem w dostawie części do maszyn budowlanych
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl border-2 border-neutral-200 p-6 md:p-8 transition-all duration-300 hover:border-primary-500 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary-500/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 pt-12 border-t border-neutral-200">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">ISO 9001</div>
              <div className="text-sm text-neutral-600">Certyfikat</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">5000+</div>
              <div className="text-sm text-neutral-600">Zadowolonych klientów</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">99.8%</div>
              <div className="text-sm text-neutral-600">Pozytywne opinie</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">24/7</div>
              <div className="text-sm text-neutral-600">Dostępność</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
