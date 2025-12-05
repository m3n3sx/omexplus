'use client'

interface Brand {
  name: string
  logo: string
}

const brands: Brand[] = [
  { name: 'Caterpillar', logo: '/brands/caterpillar.svg' },
  { name: 'Komatsu', logo: '/brands/komatsu.svg' },
  { name: 'Volvo', logo: '/brands/volvo.svg' },
  { name: 'JCB', logo: '/brands/jcb.svg' },
  { name: 'Hitachi', logo: '/brands/hitachi.svg' },
  { name: 'Liebherr', logo: '/brands/liebherr.svg' }
]

export function BrandsSection() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Zaufane marki
          </h2>
          <p className="text-lg text-neutral-600">
            Współpracujemy z wiodącymi producentami maszyn budowlanych
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-lg border-2 border-neutral-200 p-6 transition-all duration-300 hover:border-primary-500 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative h-16 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                {/* Fallback text if logo doesn't exist */}
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-700 group-hover:text-primary-600 transition-colors">
                    {brand.name}
                  </div>
                </div>
                {/* Uncomment when logos are available */}
                {/* <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain filter grayscale group-hover:grayscale-0 transition-all"
                /> */}
              </div>
            </div>
          ))}
        </div>

        {/* Trust message */}
        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-600">
            Oryginalne części i zamienniki najwyższej jakości od sprawdzonych producentów
          </p>
        </div>
      </div>
    </section>
  )
}
