'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { getCMSContent } from '@/lib/cms'

interface FooterColumn {
  title: string
  links: { text: string; url: string; target?: string }[]
}

interface SocialLink {
  platform: string
  url: string
}

interface FooterContent {
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  logoText?: string
  description?: string
  columns?: FooterColumn[]
  socialLinks?: SocialLink[]
  contact?: { phone?: string; email?: string; address?: string }
  copyright?: string
  paymentMethods?: string[]
}

const defaultContent: FooterContent = {
  backgroundColor: '#111827',
  textColor: '#9CA3AF',
  borderColor: '#1F2937',
  logoText: 'OMEX',
  description: 'Twój zaufany partner w dostawie części zamiennych do maszyn budowlanych.',
  columns: [
    {
      title: 'Sklep',
      links: [
        { text: 'Wszystkie produkty', url: '/products' },
        { text: 'Kategorie', url: '/categories' },
        { text: 'Promocje', url: '/promocje' },
      ]
    },
    {
      title: 'Obsługa klienta',
      links: [
        { text: 'Kontakt', url: '/kontakt' },
        { text: 'FAQ', url: '/faq' },
        { text: 'Śledzenie paczki', url: '/tracking' },
      ]
    },
    {
      title: 'Firma',
      links: [
        { text: 'O nas', url: '/o-nas' },
        { text: 'Regulamin', url: '/regulamin' },
        { text: 'Polityka prywatności', url: '/polityka-prywatnosci' },
      ]
    }
  ],
  socialLinks: [],
  copyright: '© 2024 OMEX. Wszystkie prawa zastrzeżone.',
  paymentMethods: ['VISA', 'MC', 'BLIK', 'P24'],
}

const socialIcons: Record<string, string> = {
  facebook: '📘',
  instagram: '📷',
  linkedin: '💼',
  youtube: '📺',
  twitter: '🐦',
  tiktok: '🎵',
}

export function CMSFooter() {
  const locale = useLocale()
  const [content, setContent] = useState<FooterContent>(defaultContent)

  useEffect(() => {
    async function loadContent() {
      const cmsData = await getCMSContent('main-footer', locale)
      if (cmsData?.content) {
        setContent({ ...defaultContent, ...cmsData.content })
      }
    }
    loadContent()
  }, [locale])

  return (
    <footer style={{ backgroundColor: content.backgroundColor, color: content.textColor }}>
      <div className="container mx-auto px-4 md:px-[60px] py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-block mb-4">
              <span className="text-2xl font-extrabold text-white">{content.logoText}</span>
            </Link>
            <p className="text-[14px] leading-relaxed mb-6 max-w-sm" style={{ color: content.textColor }}>
              {content.description}
            </p>
            
            {/* Social Links */}
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex gap-3">
                {content.socialLinks.map((social, i) => (
                  <a 
                    key={i}
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-yellow-500 transition-colors text-xl"
                  >
                    {socialIcons[social.platform] || '🔗'}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Dynamic Columns */}
          {content.columns?.map((column, i) => (
            <div key={i}>
              <h3 className="text-[14px] font-semibold mb-4 text-white">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href={`/${locale}${link.url}`} 
                      className="text-[13px] hover:text-white transition-colors"
                      style={{ color: content.textColor }}
                      target={link.target}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div style={{ borderColor: content.borderColor }} className="border-t">
        <div className="container mx-auto px-4 md:px-[60px] py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[13px]" style={{ color: content.textColor }}>
              {content.copyright}
            </p>
            
            {/* Payment Methods */}
            {content.paymentMethods && content.paymentMethods.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[13px]" style={{ color: content.textColor }}>Akceptujemy:</span>
                <div className="flex gap-2">
                  {content.paymentMethods.map((method, i) => (
                    <div key={i} className="w-10 h-7 bg-white rounded flex items-center justify-center text-[10px] font-bold text-gray-800">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CMSFooter
