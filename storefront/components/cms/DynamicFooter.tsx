'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCMSContent, getCMSMenu } from '@/lib/cms'

export default function DynamicFooter({ locale = 'pl' }: { locale?: string }) {
  const [footerContent, setFooterContent] = useState<any>(null)
  const [footerMenus, setFooterMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFooter() {
      try {
        const [content, menu1, menu2] = await Promise.all([
          getCMSContent('main-footer', locale),
          getCMSMenu('footer-menu-1', locale),
          getCMSMenu('footer-menu-2', locale)
        ])
        
        setFooterContent(content)
        setFooterMenus([menu1, menu2].filter(Boolean))
      } catch (error) {
        console.error('Failed to load footer:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadFooter()
  }, [locale])

  if (loading) {
    return <div className="h-64 bg-gray-900 animate-pulse" />
  }

  // Fallback do domyślnego footera jeśli brak danych CMS
  if (!footerContent) {
    return <DefaultFooter />
  }

  const { copyright, columns } = footerContent.content || {}

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">O OMEX</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Profesjonalny dostawca części do maszyn budowlanych. 
              18 lat doświadczenia na rynku B2B.
            </p>
          </div>

          {/* Dynamic Menus */}
          {footerMenus.map((menu, index) => (
            <div key={menu.id || index}>
              <h3 className="text-lg font-bold mb-4">{menu.name}</h3>
              <ul className="space-y-2 text-sm">
                {menu.items?.map((item: any) => (
                  <li key={item.id}>
                    <Link 
                      href={item.url}
                      target={item.open_in_new_tab ? '_blank' : undefined}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Custom Columns from CMS */}
          {columns && columns.map((column: any, index: number) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-4">{column.title}</h3>
              <ul className="space-y-2 text-sm">
                {column.links?.map((link: any, linkIndex: number) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.url}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">Social Media</h3>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">📘</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">💼</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">📸</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">🐦</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>{copyright || '© 2024 OMEX. Wszystkie prawa zastrzeżone.'}</p>
        </div>
      </div>
    </footer>
  )
}

// Fallback footer
function DefaultFooter() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-sm text-gray-400">© 2024 OMEX. Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  )
}
