export default function ZwrotyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Zwroty i Reklamacje</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Prawo do zwrotu</h2>
            <p className="text-neutral-700 mb-4">
              Zgodnie z przepisami prawa, masz prawo do odstąpienia od umowy w ciągu 14 dni bez podania przyczyny.
            </p>
            <div className="bg-primary-50 border-l-4 border-primary-600 p-4 mb-4">
              <p className="font-semibold text-primary-900">Termin zwrotu: 14 dni od otrzymania towaru</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Jak dokonać zwrotu?</h2>
            <ol className="list-decimal list-inside space-y-3 text-neutral-700">
              <li>Skontaktuj się z nami przez e-mail: <a href="mailto:zwroty@omex.pl" className="text-primary-600 hover:text-primary-700">zwroty@omex.pl</a></li>
              <li>Podaj numer zamówienia i powód zwrotu</li>
              <li>Otrzymasz instrukcje dotyczące odesłania towaru</li>
              <li>Zapakuj produkt w oryginalne opakowanie</li>
              <li>Wyślij paczkę na wskazany adres</li>
              <li>Zwrot kosztów nastąpi w ciągu 14 dni od otrzymania przesyłki</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Warunki zwrotu</h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>Produkt musi być nieużywany i w oryginalnym opakowaniu</li>
              <li>Dołącz wszystkie akcesoria i dokumenty</li>
              <li>Zachowaj dowód zakupu</li>
              <li>Koszt odesłania ponosi klient (chyba że produkt jest wadliwy)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Reklamacje</h2>
            <p className="text-neutral-700 mb-4">
              Wszystkie nasze produkty objęte są gwarancją producenta. W przypadku wady produktu:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-neutral-700">
              <li>Zgłoś reklamację przez e-mail: <a href="mailto:reklamacje@omex.pl" className="text-primary-600 hover:text-primary-700">reklamacje@omex.pl</a></li>
              <li>Opisz problem i dołącz zdjęcia</li>
              <li>Otrzymasz numer RMA i instrukcje dalszego postępowania</li>
              <li>Wyślij produkt na wskazany adres</li>
              <li>Rozpatrzymy reklamację w ciągu 14 dni roboczych</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
            <div className="bg-neutral-50 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Zwroty</h3>
                  <p className="text-neutral-700">
                    <a href="mailto:zwroty@omex.pl" className="text-primary-600 hover:text-primary-700">zwroty@omex.pl</a><br />
                    <a href="tel:+48123456789" className="text-primary-600 hover:text-primary-700">+48 123 456 789</a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Reklamacje</h3>
                  <p className="text-neutral-700">
                    <a href="mailto:reklamacje@omex.pl" className="text-primary-600 hover:text-primary-700">reklamacje@omex.pl</a><br />
                    <a href="tel:+48123456790" className="text-primary-600 hover:text-primary-700">+48 123 456 790</a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
