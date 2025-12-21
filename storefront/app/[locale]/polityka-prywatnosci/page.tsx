'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function PolitykaPrywatnosciPage() {
  const locale = useLocale()

  const sections = [
    {
      title: '1. Informacje ogólne',
      content: [
        'Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem ze Sklepu internetowego OMEX.',
        'Administratorem danych osobowych jest OMEX z siedzibą we Wrześni, ul. Gnieźnieńska 19, 62-300 Września.'
      ]
    },
    {
      title: '2. Rodzaje przetwarzanych danych',
      list: [
        'Dane identyfikacyjne (imię, nazwisko)',
        'Dane kontaktowe (adres e-mail, numer telefonu)',
        'Dane adresowe (adres dostawy, adres rozliczeniowy)',
        'Dane dotyczące zamówień i transakcji',
        'Dane techniczne (adres IP, typ przeglądarki)'
      ]
    },
    {
      title: '3. Cele i podstawy przetwarzania',
      cards: [
        { title: 'Realizacja zamówień', desc: 'Art. 6 ust. 1 lit. b RODO (wykonanie umowy)' },
        { title: 'Marketing bezpośredni', desc: 'Art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes)' },
        { title: 'Newsletter', desc: 'Art. 6 ust. 1 lit. a RODO (zgoda)' },
        { title: 'Obsługa reklamacji', desc: 'Art. 6 ust. 1 lit. c RODO (obowiązek prawny)' }
      ]
    },
    {
      title: '4. Odbiorcy danych',
      list: [
        'Firmom kurierskim realizującym dostawy',
        'Operatorom płatności online',
        'Dostawcom usług IT i hostingu',
        'Firmom księgowym',
        'Organom państwowym (na żądanie)'
      ]
    },
    {
      title: '5. Okres przechowywania danych',
      list: [
        'Realizacji umowy oraz przez okres przedawnienia roszczeń (6 lat)',
        'Do czasu wycofania zgody (w przypadku przetwarzania na podstawie zgody)',
        'Wymagany przepisami prawa (np. przepisy podatkowe - 5 lat)'
      ]
    },
    {
      title: '6. Twoje prawa',
      rights: [
        { title: 'Prawo dostępu', desc: 'Do swoich danych osobowych' },
        { title: 'Prawo sprostowania', desc: 'Poprawiania nieprawidłowych danych' },
        { title: 'Prawo usunięcia', desc: 'Żądania usunięcia danych' },
        { title: 'Prawo ograniczenia', desc: 'Ograniczenia przetwarzania' },
        { title: 'Prawo przenoszenia', desc: 'Przenoszenia danych' },
        { title: 'Prawo sprzeciwu', desc: 'Wobec przetwarzania danych' }
      ]
    },
    {
      title: '7. Pliki cookies',
      content: [
        'Nasza strona wykorzystuje pliki cookies w celu zapewnienia prawidłowego działania serwisu, personalizacji treści oraz analizy ruchu.',
        'Możesz zarządzać plikami cookies w ustawieniach swojej przeglądarki.'
      ]
    },
    {
      title: '8. Bezpieczeństwo danych',
      list: [
        'Szyfrowanie połączenia SSL/TLS',
        'Regularne kopie zapasowe',
        'Ograniczony dostęp do danych',
        'Monitoring bezpieczeństwa'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>Polityka prywatności</span>
        </div>

        {/* Hero */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">RODO</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading">
            Polityka <span className="text-primary-500">Prywatności</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            Informacje o przetwarzaniu danych osobowych zgodnie z RODO. Twoja prywatność jest dla nas ważna.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-8 lg:p-12 shadow-sm mb-12">
          <div className="flex gap-1 mb-8">
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
          </div>

          <div className="space-y-12">
            {sections.map((section, idx) => (
              <section key={idx}>
                <h2 className="text-xl lg:text-2xl font-bold text-secondary-700 mb-4">{section.title}</h2>
                
                {section.content && (
                  <div className="space-y-3 text-secondary-600 leading-relaxed">
                    {section.content.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                )}

                {section.list && (
                  <ul className="space-y-2 text-secondary-600">
                    {section.list.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.cards && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {section.cards.map((card, cardIdx) => (
                      <div key={cardIdx} className="bg-neutral-50 rounded-lg p-4 border-l-4 border-primary-500">
                        <h3 className="font-bold text-secondary-700 mb-1">{card.title}</h3>
                        <p className="text-sm text-secondary-500">{card.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.rights && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.rights.map((right, rightIdx) => (
                      <div key={rightIdx} className="bg-primary-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="font-bold text-secondary-700">{right.title}</h3>
                        </div>
                        <p className="text-sm text-secondary-500">{right.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Contact Section */}
            <section>
              <h2 className="text-xl lg:text-2xl font-bold text-secondary-700 mb-4">9. Kontakt</h2>
              <div className="bg-neutral-100 rounded-lg p-6">
                <p className="text-secondary-600 mb-4">
                  W sprawach dotyczących ochrony danych osobowych możesz skontaktować się z nami:
                </p>
                <div className="space-y-2 text-secondary-700">
                  <p><strong>E-mail:</strong> <a href="mailto:omexplus@gmail.com" className="text-primary-500 hover:text-primary-600">omexplus@gmail.com</a></p>
                  <p><strong>Telefon:</strong> <a href="tel:+48500169060" className="text-primary-500 hover:text-primary-600">+48 500 169 060</a></p>
                  <p><strong>Adres:</strong> OMEX, ul. Gnieźnieńska 19, 62-300 Września</p>
                </div>
                <p className="text-secondary-500 text-sm mt-4">
                  Masz również prawo wniesienia skargi do organu nadzorczego - Prezesa Urzędu Ochrony Danych Osobowych.
                </p>
              </div>
            </section>
          </div>

          {/* Date info */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex flex-wrap gap-6 text-sm text-secondary-500">
              <p><strong className="text-secondary-700">Data wejścia w życie:</strong> 01.01.2024</p>
              <p><strong className="text-secondary-700">Ostatnia aktualizacja:</strong> 01.12.2024</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <h2 className="text-2xl font-bold mb-4">Masz pytania dotyczące prywatności?</h2>
          <p className="text-neutral-300 mb-6">Skontaktuj się z nami - chętnie odpowiemy na wszystkie pytania</p>
          <Link href={`/${locale}/kontakt`} className="inline-block px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
            Skontaktuj się z nami
          </Link>
        </div>
      </div>
    </div>
  )
}
