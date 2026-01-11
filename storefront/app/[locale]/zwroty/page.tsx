'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function ReturnsPage() {
  const locale = useLocale()

  const steps = [
    { num: '1', title: 'Zgłoś zwrot', desc: 'Skontaktuj się z nami lub wypełnij formularz zwrotu w ciągu 14 dni od otrzymania przesyłki' },
    { num: '2', title: 'Otrzymaj instrukcje', desc: 'Wyślemy Ci potwierdzenie i instrukcje dotyczące odesłania produktu' },
    { num: '3', title: 'Wyślij produkt', desc: 'Zapakuj produkt w oryginalne opakowanie i wyślij na wskazany adres' },
    { num: '4', title: 'Otrzymaj zwrot', desc: 'Po otrzymaniu i sprawdzeniu produktu, zwrócimy pieniądze w ciągu 14 dni' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>Zwroty i reklamacje</span>
        </div>

        {/* Hero */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Obsługa klienta</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading text-white">
            Zwroty i <span className="text-primary-500">Reklamacje</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            Twoja satysfakcja jest dla nas najważniejsza. Jeśli produkt nie spełnia Twoich oczekiwań, możesz go zwrócić.
          </p>
        </div>

        {/* Return Policy */}
        <div className="bg-white rounded-lg p-8 lg:p-12 mb-12 shadow-sm">
          <div className="flex gap-1 mb-6">
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mb-6 font-heading">
            Polityka <span className="text-primary-500">zwrotów</span>
          </h2>
          <div className="text-secondary-600 leading-relaxed space-y-4">
            <p>
              Zgodnie z obowiązującymi przepisami, masz <strong className="text-secondary-700">14 dni</strong> na zwrot produktu 
              bez podania przyczyny, licząc od dnia otrzymania przesyłki.
            </p>
            <p>
              Aby zwrot został przyjęty, produkt musi być:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Nieużywany i w stanie nienaruszonym</li>
              <li>W oryginalnym opakowaniu</li>
              <li>Kompletny (z wszystkimi akcesoriami i dokumentacją)</li>
            </ul>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Proces</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary-700 mt-4 font-heading">
              Jak <span className="text-primary-500">zwrócić</span> produkt?
            </h2>
            <div className="flex justify-center gap-1 mt-4">
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
              <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-sm text-center relative">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-secondary-700 mb-2">{step.title}</h3>
                <p className="text-secondary-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Complaints */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-secondary-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Reklamacje
            </h3>
            <div className="text-secondary-600 text-sm space-y-3">
              <p>Jeśli otrzymany produkt jest wadliwy lub niezgodny z zamówieniem, przysługuje Ci prawo do reklamacji.</p>
              <p><strong>Reklamację możesz złożyć:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Przez formularz kontaktowy</li>
                <li>Mailowo: omexplus@gmail.com</li>
                <li>Telefonicznie: +48 500 169 060</li>
              </ul>
              <p>Reklamację rozpatrzymy w ciągu <strong>14 dni roboczych</strong>.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-secondary-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Zwrot pieniędzy
            </h3>
            <div className="text-secondary-600 text-sm space-y-3">
              <p>Zwrot pieniędzy następuje w ciągu <strong>14 dni</strong> od otrzymania zwróconego produktu.</p>
              <p>Pieniądze zostaną zwrócone tą samą metodą, którą dokonano płatności:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Karta płatnicza - na kartę</li>
                <li>Przelew - na konto bankowe</li>
                <li>BLIK/Przelewy24 - na konto</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-neutral-100 rounded-lg p-6 mb-12">
          <h3 className="font-bold text-secondary-700 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Ważne informacje
          </h3>
          <ul className="text-secondary-600 text-sm space-y-2">
            <li>• Koszt odesłania produktu przy zwrocie bez podania przyczyny ponosi Kupujący</li>
            <li>• W przypadku reklamacji uznanej, koszty przesyłki pokrywa OMEX</li>
            <li>• Produkty wykonane na specjalne zamówienie nie podlegają zwrotowi</li>
            <li>• Zachowaj dowód nadania przesyłki zwrotnej</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <h2 className="text-2xl font-bold mb-4">Potrzebujesz pomocy?</h2>
          <p className="text-neutral-300 mb-6">Nasz zespół obsługi klienta jest do Twojej dyspozycji</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href={`/${locale}/kontakt`} className="px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
              Skontaktuj się
            </Link>
            <Link href={`/${locale}/faq`} className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-full font-bold hover:bg-white hover:text-secondary-700 transition-colors">
              Zobacz FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
