'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { getCMSContent } from '@/lib/cms'

interface HeroButton {
  text: string
  url: string
  style?: 'button' | 'link' | 'outline'
  color?: string
  target?: string
}

interface HeroStat {
  value: string
  label: string
}

interface HeroContent {
  badge?: string
  title?: string
  subtitle?: string
  description?: string
  backgroundColor?: string
  textColor?: string
  image?: { src?: string; alt?: string }
  backgroundImage?: string
  buttons?: HeroButton[]
  stats?: HeroStat[]
  layout?: 'left' | 'right' | 'center'
  overlay?: boolean
  overlayColor?: string
  overlayOpacity?: number
}

const defaultContent: HeroContent = {
  badge: 'Nowa kolekcja 2024',
  title: 'Części do maszyn budowlanych',
  description: 'Odkryj najwyższej jakości części zamienne do koparek, ładowarek i innych maszyn budowlanych. Gwarancja najlepszych cen.',
  backgroundColor: '#F9FAFB',
  textColor: '#111827',
  buttons: [
    { text: 'Przeglądaj produkty', url: '/products', style: 'button', color: '#111827' },
    { text: 'Zobacz kategorie', url: '/categories', style: 'outline' },
  ],
  stats: [
    { value: '5000+', label: 'Produktów' },
    { value: '50+', label: 'Marek' },
    { value: '24/7', label: 'Wsparcie' },
  ],
  layout: 'left',
}

export function CMSHero() {
  const locale = useLocale()
  const [content, setContent] = useState<HeroContent>(defaultContent)

  useEffect(() => {
    async function loadContent() {
      const cmsData = await getCMSContent('home-hero', locale)
      if (cmsData?.content) {
        setContent({ ...defaultContent, ...cmsData.content })
      }
    }
    loadContent()
  }, [locale])

  const containerStyle: React.CSSProperties = {
    backgroundColor: content.backgroundImage ? 'transparent' : content.backgroundColor,
    backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  }

  const overlayStyle: React.CSSProperties = content.overlay ? {
    position: 'absolute',
    inset: 0,
    backgroundColor: content.overlayColor || '#000000',
    opacity: (content.overlayOpacity || 50) / 100,
  } : {}

  return (
    <section className="relative overflow-hidden" style={containerStyle}>
      {content.overlay && <div style={overlayStyle} />}
      
      <div className="container mx-auto px-4 md:px-[60px] relative z-10">
        <div className={`grid gap-8 md:gap-12 items-center py-12 md:py-20 ${
          content.layout === 'center' 
            ? 'text-center max-w-3xl mx-auto' 
            : content.layout === 'right'
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2'
        }`}>
          {/* Content */}
          <div className={`space-y-6 md:space-y-8 ${content.layout === 'right' ? 'md:order-2' : ''}`}>
            {content.badge && (
              <div className="inline-block">
                <span 
                  className="text-[13px] font-medium px-4 py-2 rounded-full"
                  style={{ 
                    backgroundColor: `${content.textColor}10`,
                    color: content.textColor 
                  }}
                >
                  {content.badge}
                </span>
              </div>
            )}
            
            {content.title && (
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ color: content.textColor }}
              >
                {content.title}
              </h1>
            )}
            
            {content.subtitle && (
              <h2 
                className="text-xl md:text-2xl font-medium"
                style={{ color: content.textColor, opacity: 0.8 }}
              >
                {content.subtitle}
              </h2>
            )}
            
            {content.description && (
              <p 
                className="text-lg md:text-xl leading-relaxed max-w-lg"
                style={{ color: content.textColor, opacity: 0.7 }}
              >
                {content.description}
              </p>
            )}
            
            {/* Buttons */}
            {content.buttons && content.buttons.length > 0 && (
              <div className={`flex flex-col sm:flex-row gap-4 ${content.layout === 'center' ? 'justify-center' : ''}`}>
                {content.buttons.map((btn, i) => (
                  <Link
                    key={i}
                    href={`/${locale}${btn.url}`}
                    target={btn.target}
                    className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-semibold rounded-lg transition-colors ${
                      btn.style === 'outline' 
                        ? 'border-2 hover:bg-gray-100' 
                        : btn.style === 'link'
                          ? 'underline'
                          : 'text-white'
                    }`}
                    style={{
                      backgroundColor: btn.style === 'button' ? (btn.color || '#111827') : 'transparent',
                      borderColor: btn.style === 'outline' ? (btn.color || '#111827') : 'transparent',
                      color: btn.style === 'button' ? 'white' : (btn.color || '#111827'),
                    }}
                  >
                    {btn.text}
                    {btn.style === 'button' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Stats */}
            {content.stats && content.stats.length > 0 && (
              <div className={`flex gap-8 pt-4 ${content.layout === 'center' ? 'justify-center' : ''}`}>
                {content.stats.map((stat, i) => (
                  <div key={i}>
                    <div 
                      className="text-3xl font-bold"
                      style={{ color: content.textColor }}
                    >
                      {stat.value}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: content.textColor, opacity: 0.6 }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Image */}
          {content.layout !== 'center' && content.image?.src && (
            <div className={`relative ${content.layout === 'right' ? 'md:order-1' : ''}`}>
              <div className="relative aspect-square md:aspect-[4/5] rounded-lg overflow-hidden">
                <img 
                  src={content.image.src} 
                  alt={content.image.alt || ''} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          {/* Placeholder when no image */}
          {content.layout !== 'center' && !content.image?.src && (
            <div className="relative">
              <div className="relative aspect-square md:aspect-[4/5] rounded-lg overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">🚜</div>
                  <div className="text-neutral-600 font-medium">Maszyny budowlane</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CMSHero
