'use client'

import Link from 'next/link'
import Image from 'next/image'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: string
}

export function HeroSection({
  title = 'Części do Maszyn Budowlanych',
  subtitle = 'Profesjonalny sklep B2B • 18 lat doświadczenia • 50,000+ części',
  ctaText = 'Przeglądaj katalog',
  ctaLink = '/pl/products',
  backgroundImage
}: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Background Image Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium">Dostępne 24/7</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={ctaLink}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary-500 text-white rounded-lg font-semibold hover:bg-secondary-600 transition-all hover:scale-105 shadow-lg"
            >
              {ctaText}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link
              href="/pl/kontakt"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Skontaktuj się
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">50K+</div>
              <div className="text-sm text-white/80">Części w magazynie</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">18</div>
              <div className="text-sm text-white/80">Lat doświadczenia</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">24h</div>
              <div className="text-sm text-white/80">Szybka dostawa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-secondary-500/20 to-transparent rounded-tl-full" />
    </section>
  )
}
