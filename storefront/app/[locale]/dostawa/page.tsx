export default function DostawaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Dostawa i Płatność</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Opcje dostawy</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Kurier DPD</h3>
                    <p className="text-sm text-neutral-600">Dostawa 1-2 dni robocze</p>
                  </div>
                </div>
                <p className="text-neutral-700 mb-3">
                  Standardowa dostawa kurierem na terenie całej Polski.
                </p>
                <p className="text-2xl font-bold text-secondary-700">19,99 PLN</p>
                <p className="text-sm text-secondary-600 font-semibold">Darmowa dostawa od 500 PLN</p>
              </div>

              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Paczkomat InPost</h3>
                    <p className="text-sm text-neutral-600">Dostawa 1-2 dni robocze</p>
                  </div>
                </div>
                <p className="text-neutral-700 mb-3">
                  Odbiór w jednym z ponad 20 000 paczkomatów w Polsce.
                </p>
                <p className="text-2xl font-bold text-secondary-700">14,99 PLN</p>
                <p className="text-sm text-secondary-600 font-semibold">Darmowa dostawa od 500 PLN</p>
              </div>

              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Dostawa paletowa</h3>
                    <p className="text-sm text-neutral-600">Dostawa 2-3 dni robocze</p>
                  </div>
                </div>
                <p className="text-neutral-700 mb-3">
                  Dla większych zamówień - dostawa na palecie.
                </p>
                <p className="text-2xl font-bold text-primary-600">Od 99 PLN</p>
                <p className="text-sm text-neutral-600">Cena zależy od wagi i lokalizacji</p>
              </div>

              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Odbiór osobisty</h3>
                    <p className="text-sm text-neutral-600">Katowice, ul. Przykładowa 1</p>
                  </div>
                </div>
                <p className="text-neutral-700 mb-3">
                  Odbierz zamówienie osobiście w naszym magazynie.
                </p>
                <p className="text-2xl font-bold text-primary-600">GRATIS</p>
                <p className="text-sm text-neutral-600">Pn-Pt: 8:00-16:00</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Metody płatności</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💳</span>
                </div>
                <h3 className="font-semibold mb-2">Karta płatnicza</h3>
                <p className="text-sm text-neutral-600">Visa, Mastercard, Maestro</p>
              </div>

              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="font-semibold mb-2">BLIK</h3>
                <p className="text-sm text-neutral-600">Szybka płatność mobilna</p>
              </div>

              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏦</span>
                </div>
                <h3 className="font-semibold mb-2">Przelew bankowy</h3>
                <p className="text-sm text-neutral-600">Tradycyjny przelew</p>
              </div>

              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="font-semibold mb-2">Płatność przy odbiorze</h3>
                <p className="text-sm text-neutral-600">Gotówka lub karta u kuriera</p>
              </div>

              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧾</span>
                </div>
                <h3 className="font-semibold mb-2">Faktura VAT</h3>
                <p className="text-sm text-neutral-600">Płatność z odroczonym terminem</p>
              </div>

              <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="font-semibold mb-2">Raty 0%</h3>
                <p className="text-sm text-neutral-600">Dla zamówień powyżej 1000 PLN</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Czas realizacji</h2>
            <div className="bg-neutral-50 rounded-xl p-6">
              <ul className="space-y-3 text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Produkty dostępne:</strong> Wysyłka w ciągu 24h od zaksięgowania płatności</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">⏱</span>
                  <span><strong>Produkty na zamówienie:</strong> Czas realizacji 3-7 dni roboczych</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">📦</span>
                  <span><strong>Duże zamówienia:</strong> Skontaktuj się z nami w celu ustalenia terminu</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Pytania?</h2>
            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-r-xl">
              <p className="text-neutral-700 mb-3">
                Masz pytania dotyczące dostawy lub płatności? Skontaktuj się z nami:
              </p>
              <div className="flex flex-col gap-2">
                <a href="tel:+48123456789" className="text-primary-600 hover:text-primary-700 font-semibold">
                  📞 +48 123 456 789
                </a>
                <a href="mailto:kontakt@omex.pl" className="text-primary-600 hover:text-primary-700 font-semibold">
                  ✉️ kontakt@omex.pl
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
