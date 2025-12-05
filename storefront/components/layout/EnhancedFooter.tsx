'use client'

import Link from 'next/link'

export function EnhancedFooter() {
  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                O
              </div>
              <div>
                <div className="text-2xl font-bold">OMEX</div>
                <div className="text-sm text-neutral-400">Części budowlane</div>
              </div>
            </div>
            <p className="text-neutral-400 leading-relaxed mb-6">
              Profesjonalny dostawca części do maszyn budowlanych. 
              18 lat doświadczenia na rynku B2B. Zaufało nam ponad 5000 firm.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-semibold border border-white/20">
                ISO 9001
              </div>
              <div className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-semibold border border-white/20">
                Certyfikowane
              </div>
              <div className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-semibold border border-white/20">
                Gwarancja
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Szybkie linki
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/pl/o-nas" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  O nas
                </Link>
              </li>
              <li>
                <Link href="/pl/kontakt" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/pl/faq" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/pl/products" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Produkty
                </Link>
              </li>
              <li>
                <Link href="/pl/categories" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Kategorie
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Obsługa klienta
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/pl/dostawa" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Dostawa
                </Link>
              </li>
              <li>
                <Link href="/pl/zwroty" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Zwroty
                </Link>
              </li>
              <li>
                <Link href="/pl/reklamacje" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Reklamacje
                </Link>
              </li>
              <li>
                <Link href="/pl/regulamin" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/pl/polityka-prywatnosci" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Polityka prywatności
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Kontakt
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <div className="text-sm text-neutral-400">Telefon</div>
                  <a href="tel:+48123456789" className="text-white hover:text-primary-400 transition-colors font-semibold">
                    +48 123 456 789
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-sm text-neutral-400">Email</div>
                  <a href="mailto:kontakt@omex.pl" className="text-white hover:text-primary-400 transition-colors font-semibold">
                    kontakt@omex.pl
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-sm text-neutral-400">Godziny pracy</div>
                  <div className="text-white font-semibold">Pn-Pt: 8:00-18:00</div>
                  <div className="text-neutral-400 text-sm">Sb: 9:00-14:00</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-3">Śledź nas</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110 border border-white/20">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110 border border-white/20">
                  <span className="text-xl">💼</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110 border border-white/20">
                  <span className="text-xl">📸</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110 border border-white/20">
                  <span className="text-xl">🐦</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Metody płatności</h4>
              <div className="flex gap-2">
                <div className="px-3 py-2 bg-white/10 rounded-lg text-xs font-semibold border border-white/20">
                  VISA
                </div>
                <div className="px-3 py-2 bg-white/10 rounded-lg text-xs font-semibold border border-white/20">
                  Mastercard
                </div>
                <div className="px-3 py-2 bg-white/10 rounded-lg text-xs font-semibold border border-white/20">
                  PayPal
                </div>
                <div className="px-3 py-2 bg-white/10 rounded-lg text-xs font-semibold border border-white/20">
                  Przelew
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
            <div>
              © 2024 OMEX. Wszystkie prawa zastrzeżone.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/pl/regulamin" className="hover:text-white transition-colors">
                Regulamin
              </Link>
              <Link href="/pl/polityka-prywatnosci" className="hover:text-white transition-colors">
                Prywatność
              </Link>
              <Link href="/pl/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
