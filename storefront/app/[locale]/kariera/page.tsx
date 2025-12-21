'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function KarieraPage() {
  const locale = useLocale()

  const benefits = [
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Atrakcyjne wynagrodzenie', desc: 'Konkurencyjne stawki plus system premiowy' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, title: 'Rozwój zawodowy', desc: 'Szkolenia, kursy i możliwość awansu' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>, title: 'Pakiet medyczny', desc: 'Prywatna opieka zdrowotna dla pracowników' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, title: 'Stabilność', desc: 'Praca w dynamicznie rozwijającej się firmie' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, title: 'Przyjazna atmosfera', desc: 'Świetny zespół i kultura organizacyjna' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>, title: 'Dodatkowe benefity', desc: 'Karta sportowa, dofinansowanie do urlopu' }
  ]

  const jobs = [
    {
      title: 'Specjalista ds. Sprzedaży B2B',
      location: 'Września',
      type: 'Pełny etat',
      description: 'Poszukujemy doświadczonego specjalisty ds. sprzedaży części do maszyn budowlanych. Wymagana znajomość branży i umiejętność budowania relacji z klientami.'
    },
    {
      title: 'Magazynier',
      location: 'Września',
      type: 'Pełny etat',
      description: 'Osoba odpowiedzialna za przyjmowanie, kompletowanie i wydawanie towarów. Mile widziane doświadczenie w pracy z częściami technicznymi.'
    },
    {
      title: 'Specjalista ds. Obsługi Klienta',
      location: 'Września / Zdalnie',
      type: 'Pełny etat',
      description: 'Obsługa klientów B2B, doradztwo techniczne, wsparcie sprzedaży. Wymagana komunikatywność i chęć nauki.'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>Kariera</span>
        </div>

        {/* Hero */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Dołącz do nas</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading">
            Kariera w <span className="text-primary-500">OMEX</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            Dołącz do naszego zespołu i rozwijaj się razem z nami! Szukamy osób z pasją do branży maszyn budowlanych.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Benefity</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mt-4 font-heading">
              Dlaczego warto <span className="text-primary-500">pracować w OMEX?</span>
            </h2>
            <div className="flex justify-center gap-1 mt-4">
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary-500">
                <div className="w-14 h-14 bg-primary-500 rounded-lg flex items-center justify-center text-white mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-secondary-700 mb-2">{benefit.title}</h3>
                <p className="text-secondary-500 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Offers */}
        <div className="mb-16">
          <div className="mb-8">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Oferty pracy</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mt-4 font-heading">
              Aktualne <span className="text-primary-500">stanowiska</span>
            </h2>
            <div className="flex gap-1 mt-4">
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            </div>
          </div>
          <div className="space-y-6">
            {jobs.map((job, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-secondary-700">{job.title}</h3>
                  <div className="flex gap-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-secondary-700 rounded-full text-sm font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.type}
                    </span>
                  </div>
                </div>
                <p className="text-secondary-600 mb-6">{job.description}</p>
                <a
                  href={`mailto:omexplus@gmail.com?subject=Aplikacja: ${job.title}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors"
                >
                  Aplikuj teraz
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Spontaneous Application */}
        <div className="bg-primary-500 rounded-lg p-8 lg:p-12 text-white mb-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 font-heading">Nie znalazłeś odpowiedniej oferty?</h2>
            <p className="text-white/90 mb-6">
              Wyślij nam swoją aplikację spontaniczną. Zawsze poszukujemy utalentowanych osób do naszego zespołu!
            </p>
            <a
              href="mailto:omexplus@gmail.com?subject=Aplikacja spontaniczna"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-500 rounded-full font-bold hover:bg-secondary-700 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Wyślij CV
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <h2 className="text-2xl font-bold mb-4">Masz pytania dotyczące pracy w OMEX?</h2>
          <p className="text-neutral-300 mb-6">Skontaktuj się z nami - chętnie odpowiemy na wszystkie pytania</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="tel:+48500169060" className="px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
              Zadzwoń: +48 500 169 060
            </a>
            <Link href={`/${locale}/kontakt`} className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-full font-bold hover:bg-white hover:text-secondary-700 transition-colors">
              Napisz do nas
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
