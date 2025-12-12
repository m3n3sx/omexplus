export default function PolitykaPrywatnosciPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Polityka Prywatności</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Informacje ogólne</h2>
            <p className="text-neutral-700 mb-4">
              Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem ze Sklepu internetowego OMEX.
            </p>
            <p className="text-neutral-700">
              Administratorem danych osobowych jest OMEX Sp. z o.o. z siedzibą w Katowicach, ul. Przykładowa 1, 40-000 Katowice, NIP: 1234567890.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Rodzaje przetwarzanych danych</h2>
            <p className="text-neutral-700 mb-3">Przetwarzamy następujące kategorie danych osobowych:</p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>Dane identyfikacyjne (imię, nazwisko)</li>
              <li>Dane kontaktowe (adres e-mail, numer telefonu)</li>
              <li>Dane adresowe (adres dostawy, adres rozliczeniowy)</li>
              <li>Dane dotyczące zamówień i transakcji</li>
              <li>Dane techniczne (adres IP, typ przeglądarki)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cele i podstawy przetwarzania</h2>
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">Realizacja zamówień</h3>
                <p className="text-sm text-neutral-700">
                  Podstawa prawna: Art. 6 ust. 1 lit. b RODO (wykonanie umowy)
                </p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">Marketing bezpośredni</h3>
                <p className="text-sm text-neutral-700">
                  Podstawa prawna: Art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes)
                </p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">Newsletter</h3>
                <p className="text-sm text-neutral-700">
                  Podstawa prawna: Art. 6 ust. 1 lit. a RODO (zgoda)
                </p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">Obsługa reklamacji</h3>
                <p className="text-sm text-neutral-700">
                  Podstawa prawna: Art. 6 ust. 1 lit. c RODO (obowiązek prawny)
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Odbiorcy danych</h2>
            <p className="text-neutral-700 mb-3">Twoje dane osobowe mogą być przekazywane:</p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>Firmom kurierskim realizującym dostawy</li>
              <li>Operatorom płatności online</li>
              <li>Dostawcom usług IT i hostingu</li>
              <li>Firmom księgowym</li>
              <li>Organom państwowym (na żądanie)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Okres przechowywania danych</h2>
            <p className="text-neutral-700 mb-3">Dane osobowe przechowujemy przez okres:</p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>Realizacji umowy oraz przez okres przedawnienia roszczeń (6 lat)</li>
              <li>Do czasu wycofania zgody (w przypadku przetwarzania na podstawie zgody)</li>
              <li>Wymagany przepisami prawa (np. przepisy podatkowe - 5 lat)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Twoje prawa</h2>
            <p className="text-neutral-700 mb-3">Przysługują Ci następujące prawa:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">✓ Prawo dostępu</h3>
                <p className="text-sm text-neutral-700">Do swoich danych osobowych</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">✓ Prawo sprostowania</h3>
                <p className="text-sm text-neutral-700">Poprawiania nieprawidłowych danych</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">✓ Prawo usunięcia</h3>
                <p className="text-sm text-neutral-700">Żądania usunięcia danych</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">✓ Prawo ograniczenia</h3>
                <p className="text-sm text-neutral-700">Ograniczenia przetwarzania</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">✓ Prawo przenoszenia</h3>
                <p className="text-sm text-neutral-700">Przenoszenia danych</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">✓ Prawo sprzeciwu</h3>
                <p className="text-sm text-neutral-700">Wobec przetwarzania danych</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Pliki cookies</h2>
            <p className="text-neutral-700 mb-4">
              Nasza strona wykorzystuje pliki cookies w celu zapewnienia prawidłowego działania serwisu, personalizacji treści oraz analizy ruchu.
            </p>
            <p className="text-neutral-700">
              Możesz zarządzać plikami cookies w ustawieniach swojej przeglądarki.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Bezpieczeństwo danych</h2>
            <p className="text-neutral-700 mb-3">
              Stosujemy odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo danych:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>Szyfrowanie połączenia SSL/TLS</li>
              <li>Regularne kopie zapasowe</li>
              <li>Ograniczony dostęp do danych</li>
              <li>Monitoring bezpieczeństwa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Kontakt</h2>
            <div className="bg-neutral-50 rounded-xl p-6">
              <p className="text-neutral-700 mb-4">
                W sprawach dotyczących ochrony danych osobowych możesz skontaktować się z nami:
              </p>
              <div className="space-y-2">
                <p className="text-neutral-700">
                  <strong>E-mail:</strong> <a href="mailto:rodo@omex.pl" className="text-primary-600 hover:text-primary-700">rodo@omex.pl</a>
                </p>
                <p className="text-neutral-700">
                  <strong>Adres:</strong> OMEX Sp. z o.o., ul. Przykładowa 1, 40-000 Katowice
                </p>
                <p className="text-neutral-700 mt-4">
                  Masz również prawo wniesienia skargi do organu nadzorczego - Prezesa Urzędu Ochrony Danych Osobowych.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-neutral-50 rounded-xl p-6 mt-8">
            <p className="text-sm text-neutral-600">
              <strong>Data wejścia w życie:</strong> 01.01.2024<br />
              <strong>Ostatnia aktualizacja:</strong> 01.01.2024
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
