'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { getCMSContent } from '@/lib/cms'

// Typy elementów (muszą być zgodne z VisualEditor)
interface ElementStyle {
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
  marginTop?: string
  marginRight?: string
  marginBottom?: string
  marginLeft?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderWidth?: string
  borderStyle?: string
  borderRadius?: string
  fontSize?: string
  fontWeight?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  lineHeight?: string
  letterSpacing?: string
  width?: string
  maxWidth?: string
  minHeight?: string
  boxShadow?: string
  opacity?: string
}

interface PageElement {
  id: string
  type: string
  content: any
  style: ElementStyle
  children?: PageElement[]
  settings?: any
}

// Konwersja stylu na CSS
function styleToCSS(style: ElementStyle): React.CSSProperties {
  return {
    paddingTop: style.paddingTop,
    paddingRight: style.paddingRight,
    paddingBottom: style.paddingBottom,
    paddingLeft: style.paddingLeft,
    marginTop: style.marginTop,
    marginRight: style.marginRight,
    marginBottom: style.marginBottom,
    marginLeft: style.marginLeft,
    backgroundColor: style.backgroundColor,
    color: style.textColor,
    borderColor: style.borderColor,
    borderWidth: style.borderWidth,
    borderStyle: style.borderWidth ? 'solid' : undefined,
    borderRadius: style.borderRadius,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight as any,
    textAlign: style.textAlign,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    width: style.width,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    boxShadow: style.boxShadow,
    opacity: style.opacity ? parseFloat(style.opacity) : undefined,
  }
}

// Renderer pojedynczego elementu
function RenderElement({ element, locale }: { element: PageElement; locale: string }) {
  const style = styleToCSS(element.style)

  switch (element.type) {
    case 'section':
      return (
        <section style={style}>
          {element.children?.map(child => (
            <RenderElement key={child.id} element={child} locale={locale} />
          ))}
        </section>
      )

    case 'container':
      return (
        <div style={style}>
          {element.children?.map(child => (
            <RenderElement key={child.id} element={child} locale={locale} />
          ))}
        </div>
      )

    case 'heading':
      const Tag = (element.content.level || 'h2') as keyof JSX.IntrinsicElements
      return <Tag style={style}>{element.content.text}</Tag>

    case 'text':
      return <div style={style} dangerouslySetInnerHTML={{ __html: element.content.html || '' }} />

    case 'image':
      if (!element.content.src) return null
      return (
        <figure style={style}>
          <img 
            src={element.content.src} 
            alt={element.content.alt || ''} 
            className="w-full h-auto"
            style={{ borderRadius: style.borderRadius }}
          />
          {element.content.caption && (
            <figcaption className="text-sm text-gray-500 mt-2 text-center">
              {element.content.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'button':
      const ButtonWrapper = element.content.url ? Link : 'span'
      return (
        <ButtonWrapper 
          href={element.content.url?.startsWith('/') ? `/${locale}${element.content.url}` : element.content.url || '#'}
          target={element.content.target}
          style={{ ...style, display: 'inline-block', textDecoration: 'none' }}
          className="cursor-pointer hover:opacity-90 transition-opacity"
        >
          {element.content.text || 'Przycisk'}
        </ButtonWrapper>
      )

    case 'spacer':
      return <div style={{ height: element.content.height || '32px' }} />

    case 'divider':
      return (
        <hr 
          style={{ 
            ...style, 
            border: 'none', 
            borderTop: `${element.style.borderWidth || '1px'} solid ${element.style.borderColor || '#E5E7EB'}` 
          }} 
        />
      )

    case 'columns':
      const cols = element.content.columns || 2
      return (
        <div 
          style={{ 
            ...style, 
            display: 'grid', 
            gridTemplateColumns: `repeat(${cols}, 1fr)`, 
            gap: element.content.gap || '24px' 
          }}
        >
          {element.children?.map(child => (
            <RenderElement key={child.id} element={child} locale={locale} />
          ))}
        </div>
      )

    case 'html':
      return <div style={style} dangerouslySetInnerHTML={{ __html: element.content.code || '' }} />

    case 'video':
      if (!element.content.url) return null
      
      // YouTube embed
      if (element.content.type === 'youtube' || element.content.url.includes('youtube')) {
        const videoId = element.content.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
        if (videoId) {
          return (
            <div style={{ ...style, aspectRatio: '16/9' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full"
                style={{ borderRadius: style.borderRadius }}
                allowFullScreen
              />
            </div>
          )
        }
      }
      
      // Vimeo embed
      if (element.content.type === 'vimeo' || element.content.url.includes('vimeo')) {
        const videoId = element.content.url.match(/vimeo\.com\/(\d+)/)?.[1]
        if (videoId) {
          return (
            <div style={{ ...style, aspectRatio: '16/9' }}>
              <iframe
                src={`https://player.vimeo.com/video/${videoId}`}
                className="w-full h-full"
                style={{ borderRadius: style.borderRadius }}
                allowFullScreen
              />
            </div>
          )
        }
      }
      
      // MP4
      return (
        <video 
          src={element.content.url} 
          controls 
          style={style}
          className="w-full"
        />
      )

    case 'icon':
      return (
        <div style={{ ...style, fontSize: element.content.size || '48px' }}>
          {element.content.icon || '⭐'}
        </div>
      )

    default:
      return null
  }
}

// Główny komponent renderujący stronę CMS
export function CMSPageRenderer({ pageKey }: { pageKey: string }) {
  const locale = useLocale()
  const [elements, setElements] = useState<PageElement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPage() {
      try {
        const content = await getCMSContent(pageKey, locale)
        if (content?.content?.elements) {
          setElements(content.content.elements)
        }
      } catch (error) {
        console.error('Failed to load CMS page:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPage()
  }, [pageKey, locale])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (elements.length === 0) {
    return null
  }

  return (
    <div className="cms-page">
      {elements.map(element => (
        <RenderElement key={element.id} element={element} locale={locale} />
      ))}
    </div>
  )
}

export default CMSPageRenderer
