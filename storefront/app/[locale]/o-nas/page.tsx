'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function AboutPage() {
  const t = useTranslations()
  const locale = useLocale()

  const stats = [
    { icon: '📅', value: '18+', label: 'Lat doświadczenia' },
    { icon: '🏢', value: '500+', label: 'Zadowolonych klientów' },
    { icon: '📦', value: '10,000+', label: 'Części w magazynie' },
    { icon: '🚚', value: '24h', label: 'Szybka dostawa' }
  ]

  const values = [
    {
      icon: '✓',
      title: 'Jakość',
      description: 'Oferujemy tylko oryginalne i certyfikowane części zamienne najwyższej jakości.'
    },
    {
      icon: '💰',
      title: 'Konkurencyjne ceny',
      description: 'Gwarantujemy najlepsze ceny na rynku dzięki bezpośredniej współpracy z producentami.'
    },
    {
      icon: '⚡',
      title: 'Szybka realizacja',
      description: 'Większość zamówień realizujemy w ciągu 24 godzin. Dostawa na czas to nasz priorytet.'
    },
    {
      icon: '🎯',
      title: 'Wsparcie techniczne',
      description: 'Nasz zespół ekspertów pomoże Ci wybrać odpowiednie części i doradzi w kwestiach technicznych.'
    }
  ]

  const team = [
    { name: 'Jan Kowalski', role: 'CEO & Założyciel', icon: '👨‍💼' },
    { name: 'Anna Nowak', role: 'Dyrektor Sprzedaży', icon: '👩‍💼' },
    { name: 'Piotr Wiśniewski', role: 'Kierownik Techniczny', icon: '👨‍🔧' },
    { name: 'Maria Lewandowska', role: 'Obsługa Klienta', icon: '👩‍💻' }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
<div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
            {t('common.home')}
          </Link>
          {' / '}
          <span>O nas</span>
        </div>

        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '1.5rem',
          padding: '4rem 3rem',
          marginBottom: '4rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            O OMEX
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
            Od 18 lat jesteśmy liderem w dostarczaniu wysokiej jakości części zamiennych 
            do maszyn budowlanych. Nasza misja to wspieranie Twojego biznesu poprzez 
            niezawodne produkty i profesjonalną obsługę.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '1rem', color: '#6b7280' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '3rem', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
            Nasza Historia
          </h2>
          <div style={{ maxWidth: '900px', margin: '0 auto', fontSize: '1.125rem', lineHeight: '1.8', color: '#374151' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              OMEX powstał w 2006 roku z pasji do maszyn budowlanych i chęci zapewnienia 
              polskim firmom dostępu do najwyższej jakości części zamiennych. Zaczynaliśmy 
              jako mały sklep w Warszawie, a dziś jesteśmy jednym z największych dostawców 
              części do maszyn budowlanych w Polsce.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              Przez lata zbudowaliśmy silne relacje z wiodącymi producentami takimi jak 
              Caterpillar, Komatsu, JCB, Volvo i wieloma innymi. Dzięki temu możemy 
              oferować oryginalne części w konkurencyjnych cenach z gwarancją jakości.
            </p>
            <p>
              Dziś obsługujemy ponad 500 firm w całej Polsce, od małych przedsiębiorstw 
              po duże korporacje. Nasz magazyn mieści ponad 10,000 różnych części, 
              a większość zamówień realizujemy w ciągu 24 godzin.
            </p>
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            Nasze Wartości
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {values.map((value, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  display: 'flex',
                  gap: '1.5rem'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: '#3b82f6',
                  flexShrink: 0
                }}>
                  {value.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {value.title}
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.6' }}>
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            Nasz Zespół
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {team.map((member, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  textAlign: 'center',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  margin: '0 auto 1rem'
                }}>
                  {member.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {member.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '3rem', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            Certyfikaty i Nagrody
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
            {[
              { icon: '🏆', label: 'ISO 9001:2015' },
              { icon: '⭐', label: 'Najlepszy Dostawca 2023' },
              { icon: '✓', label: 'Certyfikat CAT' },
              { icon: '🎖️', label: 'Partner Komatsu' }
            ].map((cert, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  margin: '0 auto 1rem'
                }}>
                  {cert.icon}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  {cert.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '1.5rem',
          padding: '3rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Dołącz do naszych zadowolonych klientów
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Przekonaj się sam, dlaczego setki firm wybiera OMEX jako swojego partnera 
            w dostawie części zamiennych.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              href={`/${locale}/kontakt`}
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#667eea',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Skontaktuj się z nami
            </Link>
            <Link
              href={`/${locale}/products`}
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Przeglądaj katalog
            </Link>
          </div>
        </div>
      </div>
</div>
  )
}
