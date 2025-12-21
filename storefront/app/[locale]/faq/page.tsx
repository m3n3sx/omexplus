'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'

type FAQItem = {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', label: 'Wszystkie', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
    { id: 'shipping', label: 'Dostawa', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
    { id: 'payment', label: 'Płatności', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
    { id: 'returns', label: 'Zwroty', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg> },
    { id: 'products', label: 'Produkty', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { id: 'account', label: 'Konto', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
  ]

  const faqs: FAQItem[] = [
    {
      category: 'shipping',
      question: 'Jak długo trwa dostawa?',
      answer: 'Standardowa dostawa trwa 1-3 dni robocze. Dla zamówień złożonych przed godziną 14:00, wysyłka następuje tego samego dnia. Oferujemy również ekspresową dostawę 24h.'
    },
    {
      category: 'shipping',
      question: 'Jakie są koszty dostawy?',
      answer: 'Koszt dostawy zależy od wagi i rozmiaru przesyłki. Standardowa dostawa kurierem kosztuje od 15 PLN. Dla zamówień powyżej 500 PLN dostawa jest darmowa.'
    },
    {
      category: 'shipping',
      question: 'Czy mogę śledzić moją przesyłkę?',
      answer: 'Tak! Po wysłaniu zamówienia otrzymasz email z numerem śledzenia przesyłki. Możesz również śledzić status zamówienia w swoim koncie w sekcji "Moje zamówienia".'
    },
    {
      category: 'payment',
      question: 'Jakie formy płatności akceptujecie?',
      answer: 'Akceptujemy płatności kartą kredytową/debetową (Visa, Mastercard), przelewy bankowe, BLIK, oraz płatności odroczone dla klientów B2B.'
    },
    {
      category: 'payment',
      question: 'Czy mogę otrzymać fakturę VAT?',
      answer: 'Tak, każde zamówienie jest automatycznie fakturowane. Faktura VAT jest wysyłana na email podany przy zamówieniu.'
    },
    {
      category: 'returns',
      question: 'Jaka jest polityka zwrotów?',
      answer: 'Masz 14 dni na zwrot produktu bez podania przyczyny. Produkt musi być w oryginalnym opakowaniu i nieużywany.'
    },
    {
      category: 'returns',
      question: 'Kiedy otrzymam zwrot pieniędzy?',
      answer: 'Zwrot pieniędzy następuje w ciągu 14 dni od otrzymania zwróconego produktu. Pieniądze zostaną zwrócone na konto, z którego dokonano płatności.'
    },
    {
      category: 'products',
      question: 'Czy części są oryginalne?',
      answer: 'Oferujemy zarówno części oryginalne, jak i dobrej klasy zamienniki. Każdy produkt jest dokładnie opisany - zawsze wiesz co kupujesz.'
    },
    {
      category: 'products',
      question: 'Jak mogę sprawdzić kompatybilność części?',
      answer: 'Każdy produkt ma szczegółowy opis z listą kompatybilnych modeli maszyn. Możesz również skorzystać z naszej wyszukiwarki po modelu maszyny lub skontaktować się z naszym działem technicznym.'
    },
    {
      category: 'products',
      question: 'Co jeśli nie ma części na magazynie?',
      answer: 'Jeśli części nie ma na magazynie, możesz złożyć zamówienie z opcją "Powiadom mnie". Skontaktujemy się z Tobą, gdy produkt będzie dostępny. Zazwyczaj sprowadzamy części w ciągu 3-7 dni.'
    },
    {
      category: 'account',
      question: 'Jak założyć konto?',
      answer: 'Kliknij "Zarejestruj się" w prawym górnym rogu strony. Wypełnij formularz rejestracyjny i potwierdź swój email.'
    },
    {
      category: 'account',
      question: 'Czy mogę zamówić bez rejestracji?',
      answer: 'Tak, możesz złożyć zamówienie jako gość. Jednak zalecamy założenie konta, aby móc śledzić zamówienia i korzystać z historii zakupów.'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>FAQ</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Pomoc</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-700 mt-4 mb-4 font-heading">
            Często Zadawane <span className="text-primary-500">Pytania</span>
          </h1>
          <p className="text-secondary-500 text-lg">Znajdź odpowiedzi na najczęściej zadawane pytania</p>
          <div className="flex justify-center gap-1 mt-4">
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj w FAQ..."
              className="w-full px-12 py-4 border-2 border-neutral-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 transition-all ${
                activeCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-600 border border-neutral-200 hover:border-primary-500'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <p className="text-secondary-500">Nie znaleziono pytań pasujących do Twojego wyszukiwania</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="font-semibold text-secondary-700 pr-4">{faq.question}</span>
                    <span className={`text-primary-500 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {expandedIndex === index && (
                    <div className="px-6 pb-5 text-secondary-500 leading-relaxed border-t border-neutral-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-secondary-700 rounded-lg p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Nie znalazłeś odpowiedzi?</h2>
          <p className="text-neutral-300 mb-8">Nasz zespół jest gotowy, aby Ci pomóc</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href={`/${locale}/kontakt`} className="px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
              Skontaktuj się z nami
            </Link>
            <button className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-full font-bold hover:bg-white hover:text-secondary-700 transition-colors">
              Rozpocznij live chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
