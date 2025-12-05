'use client'

import { useEffect, useState } from 'react'
import { getCMSContent } from '@/lib/cms'

interface DynamicSectionProps {
  sectionKey: string
  locale?: string
  className?: string
}

export default function DynamicSection({ 
  sectionKey, 
  locale = 'pl',
  className = ''
}: DynamicSectionProps) {
  const [section, setSection] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSection() {
      try {
        const data = await getCMSContent(sectionKey, locale)
        setSection(data)
      } catch (error) {
        console.error('Failed to load section:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadSection()
  }, [sectionKey, locale])

  if (loading) {
    return <div className={`animate-pulse bg-gray-100 h-64 ${className}`} />
  }

  if (!section) {
    return null
  }

  const { content } = section

  // Renderuj w zależności od typu
  switch (section.type) {
    case 'hero':
      return <HeroSection content={content} className={className} />
    case 'section':
      return <ContentSection content={content} className={className} />
    case 'text':
      return <TextSection content={content} className={className} />
    case 'button':
      return <ButtonSection content={content} className={className} />
    case 'banner':
      return <BannerSection content={content} className={className} />
    default:
      return <GenericSection content={content} className={className} />
  }
}

// Hero Section
function HeroSection({ content, className }: any) {
  const { title, subtitle, backgroundImage, cta } = content
  
  return (
    <section 
      className={`relative py-20 px-4 text-center ${className}`}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className="container mx-auto relative z-10">
        {title && <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>}
        {subtitle && <p className="text-lg md:text-xl mb-8">{subtitle}</p>}
        {cta && (
          <a 
            href={cta.url}
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {cta.text}
          </a>
        )}
      </div>
    </section>
  )
}

// Content Section
function ContentSection({ content, className }: any) {
  const { title, content: text, layout } = content
  
  const layoutClasses = {
    'default': 'container mx-auto',
    'full-width': 'w-full',
    'centered': 'container mx-auto text-center',
    'two-column': 'container mx-auto grid md:grid-cols-2 gap-8'
  }
  
  return (
    <section className={`py-12 px-4 ${className}`}>
      <div className={layoutClasses[layout as keyof typeof layoutClasses] || layoutClasses.default}>
        {title && <h2 className="text-3xl font-bold mb-6">{title}</h2>}
        {text && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: text }} />}
      </div>
    </section>
  )
}

// Text Section
function TextSection({ content, className }: any) {
  const { text, style } = content
  
  const styleClasses = {
    'normal': 'text-base',
    'heading': 'text-3xl font-bold',
    'subheading': 'text-xl font-semibold',
    'caption': 'text-sm text-gray-600'
  }
  
  return (
    <div className={`${styleClasses[style as keyof typeof styleClasses] || styleClasses.normal} ${className}`}>
      {text}
    </div>
  )
}

// Button Section
function ButtonSection({ content, className }: any) {
  const { text, url, style } = content
  
  const styleClasses = {
    'primary': 'bg-blue-600 text-white hover:bg-blue-700',
    'secondary': 'bg-gray-600 text-white hover:bg-gray-700',
    'outline': 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
  }
  
  return (
    <a 
      href={url}
      className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${styleClasses[style as keyof typeof styleClasses] || styleClasses.primary} ${className}`}
    >
      {text}
    </a>
  )
}

// Banner Section
function BannerSection({ content, className }: any) {
  const { text, backgroundColor, textColor, link } = content
  
  return (
    <div 
      className={`py-4 px-4 text-center ${className}`}
      style={{ 
        backgroundColor: backgroundColor || '#3b82f6',
        color: textColor || '#ffffff'
      }}
    >
      {link ? (
        <a href={link.url} className="hover:underline">
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </div>
  )
}

// Generic Section (fallback)
function GenericSection({ content, className }: any) {
  return (
    <div className={`py-8 px-4 ${className}`}>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  )
}
