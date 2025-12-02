'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const t = useTranslations()
  const locale = useLocale()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement actual form submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <Link href={`/${locale}`} style={{ color: '#3b82f6' }}>
            {t('common.home')}
          </Link>
          {' / '}
          <span>Kontakt</span>
        </div>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Skontaktuj się z nami
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Jesteśmy tutaj, aby pomóc. Skontaktuj się z nami w dowolny sposób.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
          {/* Contact Form */}
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Wyślij wiadomość
            </h2>

            {submitted && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#d1fae5',
                color: '#065f46',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>✓</span>
                <span>Dziękujemy! Twoja wiadomość została wysłana. Odpowiemy wkrótce.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Jan Kowalski"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="jan@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+48 123 456 789"
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Temat *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Wybierz temat</option>
                  <option value="general">Pytanie ogólne</option>
                  <option value="order">Pytanie o zamówienie</option>
                  <option value="product">Pytanie o produkt</option>
                  <option value="technical">Wsparcie techniczne</option>
                  <option value="partnership">Współpraca B2B</option>
                  <option value="other">Inne</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Wiadomość *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Opisz swoją sprawę..."
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij wiadomość'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            {/* Company Info */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Informacje kontaktowe
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#3b82f6' }}>📍</div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Adres
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                      OMEX Sp. z o.o.<br />
                      ul. Przemysłowa 15<br />
                      00-001 Warszawa, Polska
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#3b82f6' }}>📞</div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Telefon
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                      +48 22 123 45 67<br />
                      +48 600 123 456
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#3b82f6' }}>✉️</div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Email
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                      kontakt@omex.pl<br />
                      sprzedaz@omex.pl
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#3b82f6' }}>🕐</div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Godziny otwarcia
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                      Pon - Pt: 8:00 - 18:00<br />
                      Sob: 9:00 - 14:00<br />
                      Niedz: Zamknięte
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div style={{
              backgroundColor: '#e5e7eb',
              borderRadius: '1rem',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{ textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗺️</div>
                <div style={{ fontSize: '1rem' }}>Mapa Google</div>
                <div style={{ fontSize: '0.875rem' }}>ul. Przemysłowa 15, Warszawa</div>
              </div>
            </div>

            {/* Social Media */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Śledź nas
              </h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { icon: '📘', name: 'Facebook', color: '#1877f2' },
                  { icon: '📷', name: 'Instagram', color: '#e4405f' },
                  { icon: '🔗', name: 'LinkedIn', color: '#0a66c2' },
                  { icon: '▶️', name: 'YouTube', color: '#ff0000' }
                ].map((social) => (
                  <button
                    key={social.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#f3f4f6',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    title={social.name}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            border: '2px solid #e5e7eb',
            transition: 'border-color 0.2s'
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Live Chat
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Porozmawiaj z nami na żywo
            </p>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Rozpocznij chat
            </button>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            border: '2px solid #e5e7eb',
            transition: 'border-color 0.2s'
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❓</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              FAQ
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Znajdź odpowiedzi na pytania
            </p>
            <Link
              href={`/${locale}/faq`}
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Zobacz FAQ
            </Link>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            border: '2px solid #e5e7eb',
            transition: 'border-color 0.2s'
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Współpraca B2B
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Oferta dla firm
            </p>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Dowiedz się więcej
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
