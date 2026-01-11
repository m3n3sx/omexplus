'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'

// SVG Icons
const CalendarIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const BuildingIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const BoxIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const TruckIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CurrencyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const BoltIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const WrenchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export default function AboutPage() {
  const locale = useLocale()

  const stats = [
    { icon: <CalendarIcon />, value: '17+', label: 'Lat doświadczenia', sublabel: 'Od 2007 roku' },
    { icon: <BuildingIcon />, value: '500+', label: 'Zadowolonych klientów', sublabel: 'Firmy z całej Polski' },
    { icon: <BoxIcon />, value: '2000+', label: 'Sprzedanych części', sublabel: 'I wciąż rośnie' },
    { icon: <TruckIcon />, value: '24h', label: 'Szybka dostawa', sublabel: 'Ekspresowa realizacja' },
  ]

  const values = [
    { icon: <CheckIcon />, title: 'Najwyższa jakość', description: 'Oferujemy części oryginalne oraz dobrej klasy zamienniki. Współpracujemy ze sprawdzonymi markami i dostawcami.' },
    { icon: <CurrencyIcon />, title: 'Konkurencyjne ceny', description: 'Dzięki bezpośredniej współpracy z producentami gwarantujemy najlepsze ceny na rynku.' },
    { icon: <BoltIcon />, title: 'Szybka realizacja', description: 'Stawiamy na szybką dostawę oraz profesjonalną obsługę. Większość zamówień realizujemy w ciągu 24 godzin.' },
    { icon: <WrenchIcon />, title: 'Wsparcie techniczne', description: 'Nasi specjaliści służą fachowym doradztwem w doborze odpowiednich części do Państwa maszyn.' },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>O nas</span>
        </div>

        {/* Hero Section */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <div className="relative z-10">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Kim jesteśmy</span>
            <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading text-white">
              O <span className="text-primary-500">OMEX</span>
            </h1>
            <p className="text-neutral-300 text-lg max-w-3xl leading-relaxed">
              Jesteśmy firmą zajmującą się sprzedażą części zamiennych, filtrów, olejów. 
              Nasza oferta to głównie części do maszyn budowlanych - wieńce obrotu i wałki obrotu, 
              ale również wiele innych komponentów niezbędnych do sprawnego funkcjonowania sprzętu.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center text-white">
                {stat.icon}
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-primary-500 mb-2 font-heading">{stat.value}</div>
              <div className="text-secondary-700 font-bold text-sm uppercase tracking-wide">{stat.label}</div>
              <div className="text-secondary-400 text-xs mt-1">{stat.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Founder Section */}
        <div className="bg-white rounded-lg p-8 lg:p-12 mb-12 shadow-sm">
          <div className="flex gap-1 mb-6">
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mb-6 font-heading">
            Omex – <span className="text-primary-500">Nasz Zespół</span>
          </h2>
          <div className="text-secondary-600 leading-relaxed space-y-4">
            <p>
              <strong className="text-secondary-700">Marek Kołodziejczyk</strong> to założyciel i serce firmy OMEX. Jego pasja do maszyn budowlanych 
              oraz determinacja w dostarczaniu wysokiej jakości części zamiennych sprawiły, że firma 
              OMEX jest obecnie jednym z wiodących dostawców na rynku.
            </p>
            <p>
              Marek jest inspirującym liderem, który motywuje nasz zespół do ciągłego doskonalenia 
              i podnoszenia standardów. Jego wizja rozwoju firmy opiera się na innowacyjności, 
              nieustannym rozszerzaniu naszej oferty oraz doskonaleniu naszych procesów.
            </p>
            <p>
              Z <strong className="text-primary-500">ponad 20-letnim doświadczeniem</strong> w branży, Marek posiada niezwykle szeroką wiedzę 
              techniczną, która jest nieoceniona dla wszystkich klientów.
            </p>
          </div>
        </div>

        {/* Company Story */}
        <div className="bg-white rounded-lg p-8 lg:p-12 mb-12 shadow-sm">
          <div className="flex gap-1 mb-6">
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mb-6 font-heading">
            Omex – <span className="text-primary-500">Wiedza i Doświadczenie</span>
          </h2>
          <div className="text-secondary-600 leading-relaxed space-y-4">
            <p>
              Jesteśmy firmą, która istnieje na rynku <strong className="text-secondary-700">od 2007 roku</strong> i specjalizuje się w sprzedaży 
              wysokiej jakości części do maszyn budowlanych. Nasza firma zyskała solidną reputację 
              jako zaufany dostawca branżowych części oryginalnych oraz zamiennych.
            </p>
            <p>
              Nasze doświadczenie oraz wiedza techniczna pozwalają zapewnić naszym klientom części 
              o najwyższej jakości, spełniające surowe standardy i wymagania.
            </p>
            <p>
              Stawiamy na szybką dostawę oraz profesjonalną obsługę. <strong className="text-primary-500">Dołącz do grona naszych zadowolonych klientów</strong> 
              i zaufaj nam jako swojemu niezawodnemu partnerowi.
            </p>
          </div>
        </div>

        {/* Team Values */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Dlaczego my</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mt-4 font-heading">
              Nasze <span className="text-primary-500">Wartości</span>
            </h2>
            <div className="flex justify-center gap-1 mt-4">
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary-700 mb-2">{value.title}</h3>
                  <p className="text-secondary-500 text-sm leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 font-heading">Dołącz do naszych zadowolonych klientów</h2>
          <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
            Przekonaj się sam, dlaczego setki firm wybiera OMEX jako swojego partnera w dostawie części zamiennych.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href={`/${locale}/kontakt`} className="px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
              Skontaktuj się z nami
            </Link>
            <Link href={`/${locale}/products`} className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-full font-bold hover:bg-white hover:text-secondary-700 transition-colors">
              Przeglądaj katalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
