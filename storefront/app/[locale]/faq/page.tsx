'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

type FAQItem = {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const t = useTranslations()
  const locale = useLocale()

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', label: 'Wszystkie', icon: '📋' },
    { id: 'shipping', label: 'Dostawa', icon: '🚚' },
    { id: 'payment', label: 'Płatności', icon: '💳' },
    { id: 'returns', label: 'Zwroty', icon: '↩️' },
    { id: 'products', label: 'Produkty', icon: '📦' },
    { id: 'account', label: 'Konto', icon: '👤' }
  ]

  const faqs: FAQItem[] = [
    {
      category: 'shipping',
      question: 'Jak długo trwa dostawa?',
      answer: 'Standardowa dostawa trwa 1-3 dni robocze. Dla zamówień złożonych przed godziną 14:00, wysyłka następuje tego samego dnia. Oferujemy również ekspresową dostawę 24h za dodatkową opłatą.'
    },
    {
      category: 'shipping',
      question: 'Jakie są koszty dostawy?',
      answer: 'Koszt dostawy zależy od wagi i rozmiaru przesyłki. Standardowa dostawa kurierem kosztuje od 15 PLN. Dla zamówień powyżej 500 PLN dostawa jest darmowa. Szczegółowe informacje o kosztach dostawy znajdziesz w koszyku przed finalizacją zamówienia.'
    },
    {
      category: 'shipping',
      question: 'Czy mogę śledzić moją przesyłkę?',
      answer: 'Tak! Po wysłaniu zamówienia otrzymasz email z numerem śledzenia przesyłki. Możesz również śledzić status zamówienia w swoim koncie w sekcji "Moje zamówienia".'
    },
    {
      category: 'payment',
      question: 'Jakie formy płatności akceptujecie?',
      answer: 'Akceptujemy płatności kartą kredytową/debetową (Visa, Mastercard), przelewy bankowe, BLIK, oraz płatności odroczone dla klientów B2B. Wszystkie płatności są zabezpieczone i szyfrowane.'
    },
    {
      category: 'payment',
      question: 'Czy mogę otrzymać fakturę VAT?',
      answer: 'Tak, każde zamówienie jest automatycznie fakturowane. Faktura VAT jest wysyłana na email podany przy zamówieniu. Możesz również pobrać fakturę ze swojego konta w sekcji "Moje zamówienia".'
    },
    {
      category: 'payment',
      question: 'Czy oferujecie płatność odroczoną?',
      answer: 'Tak, dla zweryfikowanych klientów B2B oferujemy płatność odroczoną z terminem 14, 30 lub 60 dni. Skontaktuj się z naszym działem sprzedaży, aby uzyskać więcej informacji.'
    },
    {
      category: 'returns',
      question: 'Jaka jest polityka zwrotów?',
      answer: 'Masz 14 dni na zwrot produktu bez podania przyczyny. Produkt musi być w oryginalnym opakowaniu i nieużywany. Koszt zwrotu pokrywa klient, chyba że zwrot wynika z naszego błędu.'
    },
    {
      category: 'returns',
      question: 'Jak mogę zwrócić produkt?',
      answer: 'Aby zwrócić produkt, zaloguj się na swoje konto, przejdź do "Moje zamówienia", wybierz zamówienie i kliknij "Zwróć produkt". Wypełnij formularz zwrotu, a my wyślemy Ci instrukcje dalszego postępowania.'
    },
    {
      category: 'returns',
      question: 'Kiedy otrzymam zwrot pieniędzy?',
      answer: 'Zwrot pieniędzy następuje w ciągu 14 dni od otrzymania zwróconego produktu. Pieniądze zostaną zwrócone na konto, z którego dokonano płatności.'
    },
    {
      category: 'products',
      question: 'Czy części są oryginalne?',
      answer: 'Tak, wszystkie nasze części są oryginalne lub certyfikowane zamienniki od renomowanych producentów. Każdy produkt posiada certyfikat jakości i gwarancję producenta.'
    },
    {
      category: 'products',
      question: 'Jak mogę sprawdzić kompatybilność części?',
      answer: 'Każdy produkt ma szczegółowy opis z listą kompatybilnych modeli maszyn. Możesz również skorzystać z naszej wyszukiwarki po modelu maszyny lub skontaktować się z naszym działem technicznym.'
    },
    {
      category: 'products',
      question: 'Czy oferujecie gwarancję na produkty?',
      answer: 'Tak, wszystkie produkty objęte są gwarancją producenta, zazwyczaj 12 lub 24 miesiące. Szczegóły gwarancji znajdziesz w opisie każdego produktu.'
    },
    {
      category: 'products',
      question: 'Co jeśli nie ma części na magazynie?',
      answer: 'Jeśli części nie ma na magazynie, możesz złożyć zamówienie z opcją "Powiadom mnie". Skontaktujemy się z Tobą, gdy produkt będzie dostępny. Zazwyczaj sprowadzamy części w ciągu 3-7 dni.'
    },
    {
      category: 'account',
      question: 'Jak założyć konto?',
      answer: 'Kliknij "Zarejestruj się" w prawym górnym rogu strony. Wypełnij formularz rejestracyjny i potwierdź swój email. Dla kont B2B wymagana jest dodatkowa weryfikacja.'
    },
    {
      category: 'account',
      question: 'Czy mogę zamówić bez rejestracji?',
      answer: 'Tak, możesz złożyć zamówienie jako gość. Jednak zalecamy założenie konta, aby móc śledzić zamówienia, zapisywać adresy i korzystać z historii zakupów.'
    },
    {
      category: 'account',
      question: 'Jak zmienić hasło do konta?',
      answer: 'Zaloguj się na swoje konto, przejdź do "Ustawienia" i wybierz "Zmień hasło". Jeśli zapomniałeś hasła, kliknij "Zapomniałeś hasła?" na stronie logowania.'
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
            {t('common.home')}
          </Link>
          {' / '}
          <span>FAQ</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❓</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Często Zadawane Pytania
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Znajdź odpowiedzi na najczęściej zadawane pytania
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj w FAQ..."
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            <span style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.25rem'
            }}>
              🔍
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '3rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: activeCategory === category.id ? '#3b82f6' : 'white',
                color: activeCategory === category.id ? 'white' : '#374151',
                border: activeCategory === category.id ? 'none' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {filteredFAQs.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
                Nie znaleziono pytań pasujących do Twojego wyszukiwania
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    style={{
                      width: '100%',
                      padding: '1.5rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', flex: 1 }}>
                      {faq.question}
                    </span>
                    <span style={{
                      fontSize: '1.5rem',
                      color: '#6b7280',
                      transition: 'transform 0.2s',
                      transform: expandedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ▼
                    </span>
                  </button>

                  {expandedIndex === index && (
                    <div style={{
                      padding: '0 1.5rem 1.5rem',
                      fontSize: '1rem',
                      color: '#6b7280',
                      lineHeight: '1.6',
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '1.5rem'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div style={{
          marginTop: '4rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
          border: '2px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Nie znalazłeś odpowiedzi?
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            Nasz zespół jest gotowy, aby Ci pomóc
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              href={`/${locale}/kontakt`}
              style={{
                display: 'inline-block',
                padding: '0.875rem 2rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Skontaktuj się z nami
            </Link>
            <button
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Rozpocznij live chat
            </button>
          </div>
        </div>
      </div>
</div>
  )
}
