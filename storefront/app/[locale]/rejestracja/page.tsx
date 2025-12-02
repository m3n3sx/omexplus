'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function RegisterPage() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    taxId: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState<'retail' | 'b2b'>('retail')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptGdpr, setAcceptGdpr] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Hasła nie są identyczne')
      return
    }

    if (!acceptTerms || !acceptGdpr) {
      alert('Musisz zaakceptować regulamin i politykę prywatności')
      return
    }

    setLoading(true)

    // TODO: Implement actual registration
    setTimeout(() => {
      setLoading(false)
      router.push(`/${locale}/logowanie`)
    }, 1500)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '4rem 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Utwórz konto
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Dołącz do nas i zacznij zamawiać części
          </p>
        </div>

        {/* Registration Form */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          {/* Account Type Selector */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>
              Typ konta
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setAccountType('retail')}
                style={{
                  padding: '1rem',
                  backgroundColor: accountType === 'retail' ? '#eff6ff' : 'white',
                  border: accountType === 'retail' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: accountType === 'retail' ? '#3b82f6' : '#374151' }}>
                  Konto osobiste
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Dla klientów indywidualnych
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('b2b')}
                style={{
                  padding: '1rem',
                  backgroundColor: accountType === 'b2b' ? '#eff6ff' : 'white',
                  border: accountType === 'b2b' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: accountType === 'b2b' ? '#3b82f6' : '#374151' }}>
                  Konto firmowe (B2B)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Dla firm i przedsiębiorstw
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister}>
            {/* Personal Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Imię *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Jan"
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
                  Nazwisko *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Kowalski"
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
            </div>

            {/* Contact Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="jan.kowalski@example.com"
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
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+48 123 456 789"
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
            </div>

            {/* B2B Fields */}
            {accountType === 'b2b' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                    Nazwa firmy *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="OMEX Sp. z o.o."
                    required={accountType === 'b2b'}
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
                    NIP *
                  </label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleChange('taxId', e.target.value)}
                    placeholder="PL1234567890"
                    required={accountType === 'b2b'}
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
            )}

            {/* Password */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Hasło *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      paddingRight: '3rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.25rem'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Min. 8 znaków
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Potwierdź hasło *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
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
            </div>

            {/* Checkboxes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                  style={{ marginTop: '0.25rem', width: '1rem', height: '1rem', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>
                  Akceptuję{' '}
                  <Link href={`/${locale}/warunki-sprzedazy`} style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    regulamin
                  </Link>
                  {' '}i{' '}
                  <Link href={`/${locale}/polityka-prywatnosci`} style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    warunki sprzedaży
                  </Link>
                  {' *'}
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={acceptGdpr}
                  onChange={(e) => setAcceptGdpr(e.target.checked)}
                  required
                  style={{ marginTop: '0.25rem', width: '1rem', height: '1rem', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>
                  Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
                  <Link href={`/${locale}/polityka-prywatnosci`} style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    polityką prywatności
                  </Link>
                  {' (RODO) *'}
                </span>
              </label>
            </div>

            {/* Register Button */}
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
                transition: 'background-color 0.2s',
                marginBottom: '1rem'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#2563eb'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#3b82f6'
              }}
            >
              {loading ? 'Tworzenie konta...' : 'Utwórz konto'}
            </button>

            {/* Login Link */}
            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
              Masz już konto?{' '}
              <Link
                href={`/${locale}/logowanie`}
                style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}
              >
                Zaloguj się
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
