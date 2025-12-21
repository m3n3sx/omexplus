'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-secondary-700 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-secondary-600">
        <div className="container mx-auto px-4 lg:px-12 py-12 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Zapisz się do newslettera</h3>
              <p className="text-neutral-400 text-sm">Otrzymuj najnowsze oferty i porady prosto na email</p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Twój adres e-mail"
                className="flex-1 lg:w-80 px-4 py-3 rounded-lg text-secondary-700 focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-6 py-3 bg-primary-500 text-white rounded-lg font-bold hover:bg-primary-600 transition-colors whitespace-nowrap">
                Zapisz się
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-12 py-12 lg:py-16 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/pl" className="inline-block mb-4">
              <span className="text-2xl font-extrabold">OMEX</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-sm">
              Twój zaufany partner w dostawie części do maszyn budowlanych. Najwyższa jakość, konkurencyjne ceny, szybka dostawa. Od 2007 roku na rynku.
            </p>
            <div className="text-neutral-400 text-sm space-y-2 mb-6">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ul. Gnieźnieńska 19, 62-300 Września
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href="tel:+48500169060" className="hover:text-white">+48 500 169 060</a>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:omexplus@gmail.com" className="hover:text-white">omexplus@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Pon-Pt: 8:00-16:00
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6 mb-6">
              <div>
                <div className="text-2xl font-bold text-primary-500">17+</div>
                <div className="text-xs text-neutral-400">Lat doświadczenia</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-500">500+</div>
                <div className="text-xs text-neutral-400">Klientów</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-500">24h</div>
                <div className="text-xs text-neutral-400">Dostawa</div>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-secondary-600 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-600 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-600 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-600 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Sklep */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Sklep</h3>
            <ul className="space-y-3">
              <li><Link href="/pl/products" className="text-sm text-neutral-400 hover:text-white transition-colors">Wszystkie produkty</Link></li>
              <li><Link href="/pl/categories" className="text-sm text-neutral-400 hover:text-white transition-colors">Kategorie</Link></li>
              <li><Link href="/pl/promocje" className="text-sm text-neutral-400 hover:text-white transition-colors">Promocje</Link></li>
              <li><Link href="/pl/nowosci" className="text-sm text-neutral-400 hover:text-white transition-colors">Nowości</Link></li>
              <li><Link href="/pl/bestsellery" className="text-sm text-neutral-400 hover:text-white transition-colors">Bestsellery</Link></li>
            </ul>
          </div>
          
          {/* Obsługa klienta */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Obsługa klienta</h3>
            <ul className="space-y-3">
              <li><Link href="/pl/kontakt" className="text-sm text-neutral-400 hover:text-white transition-colors">Kontakt</Link></li>
              <li><Link href="/pl/faq" className="text-sm text-neutral-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/pl/sledzenie" className="text-sm text-neutral-400 hover:text-white transition-colors">Śledzenie przesyłki</Link></li>
              <li><Link href="/pl/zwroty" className="text-sm text-neutral-400 hover:text-white transition-colors">Zwroty i reklamacje</Link></li>
              <li><Link href="/pl/dostawa" className="text-sm text-neutral-400 hover:text-white transition-colors">Dostawa i płatności</Link></li>
            </ul>
          </div>
          
          {/* Firma */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Firma</h3>
            <ul className="space-y-3">
              <li><Link href="/pl/o-nas" className="text-sm text-neutral-400 hover:text-white transition-colors">O nas</Link></li>
              <li><Link href="/pl/kariera" className="text-sm text-neutral-400 hover:text-white transition-colors">Kariera</Link></li>
              <li><Link href="/pl/blog" className="text-sm text-neutral-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/pl/regulamin" className="text-sm text-neutral-400 hover:text-white transition-colors">Regulamin</Link></li>
              <li><Link href="/pl/polityka-prywatnosci" className="text-sm text-neutral-400 hover:text-white transition-colors">Polityka prywatności</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-secondary-600">
        <div className="container mx-auto px-4 lg:px-12 py-6 max-w-[1200px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-400">
              © 2024 OMEX. Wszystkie prawa zastrzeżone.
            </p>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-400">Akceptujemy:</span>
              <div className="flex gap-2">
                {['VISA', 'MC', 'BLIK', 'P24'].map((method) => (
                  <div key={method} className="w-10 h-7 bg-white rounded flex items-center justify-center text-[10px] font-bold text-secondary-700">
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
