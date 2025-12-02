'use client'

import Link from 'next/link'

export default function Footer() {
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

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Wsparcie</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pl/kontakt" className="text-gray-400 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/pl/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/pl/o-nas" className="text-gray-400 hover:text-white transition-colors">
                  O nas
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Informacje prawne</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pl/regulamin" className="text-gray-400 hover:text-white transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/pl/polityka-prywatnosci" className="text-gray-400 hover:text-white transition-colors">
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="/pl/zwroty" className="text-gray-400 hover:text-white transition-colors">
                  Zwroty i reklamacje
                </Link>
              </li>
            </ul>
          </div>

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
          <p>© 2024 OMEX. Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  )
}
