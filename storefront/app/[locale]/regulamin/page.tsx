'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function RegulaminPage() {
  const locale = useLocale()

  const sections = [
    {
      title: '§1 Postanowienia ogólne',
      items: [
        'Sklep internetowy OMEX, działający pod adresem omex.pl, prowadzony jest przez firmę OMEX z siedzibą we Wrześni.',
        'Niniejszy Regulamin określa zasady korzystania ze Sklepu internetowego.',
        'Regulamin jest dostępny nieodpłatnie na stronie internetowej Sklepu.',
        'Warunkiem złożenia Zamówienia jest akceptacja Regulaminu.'
      ]
    },
    {
      title: '§2 Definicje',
      definitions: [
        { term: 'Sklep', desc: 'Sklep internetowy prowadzony przez Sprzedawcę pod adresem omex.pl' },
        { term: 'Sprzedawca', desc: 'OMEX, ul. Gnieźnieńska 19, 62-300 Września' },
        { term: 'Klient', desc: 'Osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, która dokonuje zakupów w Sklepie' },
        { term: 'Towar', desc: 'Produkt prezentowany w Sklepie internetowym' },
        { term: 'Zamówienie', desc: 'Oświadczenie woli Klienta zmierzające do zawarcia Umowy sprzedaży' }
      ]
    },
    {
      title: '§3 Warunki zawarcia umowy',
      items: [
        'Zawarcie Umowy sprzedaży następuje po złożeniu Zamówienia przez Klienta i jego przyjęciu przez Sprzedawcę.',
        'Warunkiem złożenia Zamówienia jest rejestracja w Sklepie lub podanie danych niezbędnych do realizacji Zamówienia.',
        'Ceny podane w Sklepie są cenami brutto (zawierają podatek VAT).',
        'Klient zobowiązany jest do podania prawdziwych danych osobowych.'
      ]
    },
    {
      title: '§4 Realizacja zamówienia',
      items: [
        'Zamówienia są realizowane w dni robocze od poniedziałku do piątku w godzinach 8:00-16:00.',
        'Czas realizacji Zamówienia wynosi od 1 do 7 dni roboczych, w zależności od dostępności Towaru.',
        'Sprzedawca zastrzega sobie prawo do przedłużenia czasu realizacji w przypadku braku Towaru.',
        'O wydłużeniu czasu realizacji Klient zostanie poinformowany drogą mailową lub telefoniczną.'
      ]
    },
    {
      title: '§5 Płatności',
      items: [
        'Klient może dokonać płatności za Zamówienie przelewem bankowym, kartą płatniczą, BLIK, Przelewy24, płatnością przy odbiorze lub płatnością odroczoną (dla firm).',
        'Zamówienie jest realizowane po zaksięgowaniu płatności na koncie Sprzedawcy.',
        'Faktura VAT jest wystawiana automatycznie do każdego zamówienia.'
      ]
    },
    {
      title: '§6 Dostawa',
      items: [
        'Dostawa Towaru odbywa się na terenie Polski oraz wybranych krajów UE.',
        'Koszty dostawy są określone w zakładce "Dostawa i płatność".',
        'Dostawa jest darmowa dla zamówień powyżej 500 PLN.',
        'Czas dostawy wynosi od 1 do 3 dni roboczych od momentu wysłania przesyłki.'
      ]
    },
    {
      title: '§7 Prawo odstąpienia od umowy',
      items: [
        'Klient będący konsumentem ma prawo odstąpić od Umowy w terminie 14 dni bez podania przyczyny.',
        'Termin do odstąpienia od Umowy wygasa po upływie 14 dni od dnia objęcia Towaru w posiadanie.',
        'Aby skorzystać z prawa odstąpienia, Klient musi poinformować Sprzedawcę o swojej decyzji.',
        'Zwracany Towar nie może nosić śladów użytkowania i musi być w oryginalnym opakowaniu.'
      ]
    },
    {
      title: '§8 Reklamacje',
      items: [
        'Sprzedawca odpowiada za wady fizyczne i prawne Towaru.',
        'Reklamację należy zgłosić na adres: omexplus@gmail.com lub telefonicznie: +48 500 169 060.',
        'Sprzedawca ustosunkuje się do reklamacji w terminie 14 dni.',
        'Szczegółowe informacje o reklamacjach znajdują się w zakładce "Zwroty i reklamacje".'
      ]
    },
    {
      title: '§9 Ochrona danych osobowych',
      items: [
        'Administratorem danych osobowych jest OMEX z siedzibą we Wrześni.',
        'Dane osobowe są przetwarzane zgodnie z RODO.',
        'Szczegółowe informacje znajdują się w Polityce Prywatności.'
      ]
    },
    {
      title: '§10 Postanowienia końcowe',
      items: [
        'Sprzedawca zastrzega sobie prawo do zmiany Regulaminu.',
        'W sprawach nieuregulowanych w Regulaminie mają zastosowanie przepisy prawa polskiego.',
        'Ewentualne spory będą rozstrzygane przez sąd właściwy dla siedziby Sprzedawcy.'
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
          <span>Regulamin</span>
        </div>

        {/* Hero */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Dokumenty</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading">
            Regulamin <span className="text-primary-500">Sklepu</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            Zapoznaj się z regulaminem sklepu internetowego OMEX. Dokument określa zasady korzystania ze sklepu oraz prawa i obowiązki stron.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-8 lg:p-12 shadow-sm mb-12">
          <div className="flex gap-1 mb-6">
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
          </div>

          <div className="space-y-10">
            {sections.map((section, idx) => (
              <section key={idx}>
                <h2 className="text-xl lg:text-2xl font-bold text-secondary-700 mb-4">{section.title}</h2>
                
                {section.items && (
                  <ol className="list-decimal list-inside space-y-3 text-secondary-600 leading-relaxed">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ol>
                )}

                {section.definitions && (
                  <dl className="space-y-4 text-secondary-600">
                    {section.definitions.map((def, defIdx) => (
                      <div key={defIdx} className="flex flex-col sm:flex-row sm:gap-4">
                        <dt className="font-bold text-secondary-700 sm:w-32 flex-shrink-0">{def.term}</dt>
                        <dd className="sm:border-l sm:border-neutral-200 sm:pl-4">{def.desc}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>
            ))}
          </div>

          {/* Date info */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex flex-wrap gap-6 text-sm text-secondary-500">
              <p><strong className="text-secondary-700">Data wejścia w życie:</strong> 01.01.2024</p>
              <p><strong className="text-secondary-700">Ostatnia aktualizacja:</strong> 01.12.2024</p>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href={`/${locale}/zwroty`} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary-500 group">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            </div>
            <h3 className="font-bold text-secondary-700 mb-2 group-hover:text-primary-500 transition-colors">Zwroty i reklamacje</h3>
            <p className="text-secondary-500 text-sm">Informacje o procedurze zwrotów</p>
          </Link>

          <Link href={`/${locale}/dostawa`} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary-500 group">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </div>
            <h3 className="font-bold text-secondary-700 mb-2 group-hover:text-primary-500 transition-colors">Dostawa i płatności</h3>
            <p className="text-secondary-500 text-sm">Opcje dostawy i formy płatności</p>
          </Link>

          <Link href={`/${locale}/kontakt`} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary-500 group">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="font-bold text-secondary-700 mb-2 group-hover:text-primary-500 transition-colors">Kontakt</h3>
            <p className="text-secondary-500 text-sm">Masz pytania? Napisz do nas</p>
          </Link>
        </div>

        {/* CTA */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <h2 className="text-2xl font-bold mb-4">Masz pytania dotyczące regulaminu?</h2>
          <p className="text-neutral-300 mb-6">Nasz zespół chętnie odpowie na wszystkie Twoje pytania</p>
          <Link href={`/${locale}/kontakt`} className="inline-block px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
            Skontaktuj się z nami
          </Link>
        </div>
      </div>
    </div>
  )
}
