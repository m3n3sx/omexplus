import Link from 'next/link'

export function NewFooter() {
  return (
    <footer className="bg-primary text-white mt-16">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: OMEX Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">OMEX</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/o-nas" className="text-gray-300 hover:text-white transition-colors">
                  O nas
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Katalog
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-300 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a href="#" className="text-2xl hover:text-secondary transition-colors" aria-label="Facebook">
                f
              </a>
              <a href="#" className="text-2xl hover:text-secondary transition-colors" aria-label="Twitter">
                t
              </a>
              <a href="#" className="text-2xl hover:text-secondary transition-colors" aria-label="LinkedIn">
                in
              </a>
              <a href="#" className="text-2xl hover:text-secondary transition-colors" aria-label="YouTube">
                Y
              </a>
            </div>
          </div>

          {/* Column 2: Centrum Pomocy */}
          <div>
            <h3 className="text-xl font-bold mb-4">Centrum Pomocy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/kontakt" className="text-gray-300 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/pomoc" className="text-gray-300 hover:text-white transition-colors">
                  Pomoc
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-300 hover:text-white transition-colors">
                  Status zamówienia
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subskrybuj do naszego newslettera
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Twój email"
                className="w-full px-4 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
                aria-label="Email do newslettera"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-secondary text-white rounded font-semibold hover:bg-secondary-dark transition-colors"
              >
                Zapisz się
              </button>
            </form>
          </div>

          {/* Column 4: Prawne */}
          <div>
            <h3 className="text-xl font-bold mb-4">Prawne</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/o-nas" className="text-gray-300 hover:text-white transition-colors">
                  O nas
                </Link>
              </li>
              <li>
                <Link href="/warunki" className="text-gray-300 hover:text-white transition-colors">
                  Warunki użytkowania
                </Link>
              </li>
              <li>
                <Link href="/prywatnosc" className="text-gray-300 hover:text-white transition-colors">
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Polityka cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
            <div>
              © 2025 OMEX. Wszelkie prawa zastrzeżone.
            </div>
            <div className="flex items-center gap-4">
              <span>💳 Visa Mastercard Amex</span>
              <span>📦 InPost DPD DHL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
