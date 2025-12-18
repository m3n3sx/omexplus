'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-secondary-700 text-white mt-auto">
      {/* Orange accent line */}
      <div className="h-1 bg-primary-500"></div>
      
      <div className="container mx-auto px-6 lg:px-12 py-16 max-w-[1200px]">
        {/* Logo and tagline */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center font-bold text-3xl text-white font-heading">
              O
            </div>
            <div>
              <span className="text-3xl font-bold text-white tracking-wider font-heading">OMEX</span>
              <div className="h-1 w-20 bg-primary-500 mx-auto rounded-sm"></div>
            </div>
          </div>
          <p className="text-sm text-neutral-300 uppercase tracking-widest font-semibold">Quality Filtration Since 2006</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-primary-500 uppercase tracking-wider font-heading">O OMEX</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Profesjonalny dostawca części do maszyn budowlanych. 
              18 lat doświadczenia na rynku B2B. Najwyższa jakość filtracji.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-primary-500 uppercase tracking-wider font-heading">Wsparcie</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/pl/kontakt" className="text-neutral-300 hover:text-primary-500 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/pl/faq" className="text-neutral-300 hover:text-primary-500 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/pl/o-nas" className="text-neutral-300 hover:text-primary-500 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  O nas
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-primary-500 uppercase tracking-wider font-heading">Informacje prawne</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/pl/regulamin" className="text-neutral-300 hover:text-primary-500 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/pl/polityka-prywatnosci" className="text-neutral-300 hover:text-primary-500 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="/pl/zwroty" className="text-neutral-300 hover:text-primary-500 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Zwroty i reklamacje
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-primary-500 uppercase tracking-wider font-heading">Social Media</h3>
            <div className="flex gap-3">
              <a href="#" className="w-11 h-11 bg-neutral-600 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-all">
                📘
              </a>
              <a href="#" className="w-11 h-11 bg-neutral-600 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-all">
                💼
              </a>
              <a href="#" className="w-11 h-11 bg-neutral-600 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-all">
                📸
              </a>
              <a href="#" className="w-11 h-11 bg-neutral-600 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-all">
                🐦
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
            <p>© 2024 OMEX. Wszystkie prawa zastrzeżone.</p>
            <p className="text-xs uppercase tracking-wider">Trusted by professionals since 2006</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
