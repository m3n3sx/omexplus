'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const { register } = useAuth()

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
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne')
      return
    }

    if (!acceptTerms || !acceptGdpr) {
      setError('Musisz zaakceptować regulamin i politykę prywatności')
      return
    }

    setLoading(true)

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      })
      router.push(`/${locale}`)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Nie udało się utworzyć konta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-[60px]">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📝</div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              Utwórz konto
            </h1>
            <p className="text-[14px] text-neutral-600">
              Dołącz do nas i zacznij zamawiać części
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-xl p-6 md:p-8 border border-neutral-200 shadow-sm">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px]">
                {error}
              </div>
            )}
            {/* Account Type Selector */}
            <div className="mb-8">
              <label className="block text-[13px] font-semibold mb-3 text-neutral-900">
                Typ konta
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAccountType('retail')}
                  className={`p-5 rounded-lg border-2 transition-all ${
                    accountType === 'retail'
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="text-3xl mb-2">👤</div>
                  <div className={`text-[14px] font-semibold mb-1 ${
                    accountType === 'retail' ? 'text-neutral-900' : 'text-neutral-700'
                  }`}>
                    Konto osobiste
                  </div>
                  <div className="text-[12px] text-neutral-600">
                    Dla klientów indywidualnych
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('b2b')}
                  className={`p-5 rounded-lg border-2 transition-all ${
                    accountType === 'b2b'
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🏢</div>
                  <div className={`text-[14px] font-semibold mb-1 ${
                    accountType === 'b2b' ? 'text-neutral-900' : 'text-neutral-700'
                  }`}>
                    Konto firmowe (B2B)
                  </div>
                  <div className="text-[12px] text-neutral-600">
                    Dla firm i przedsiębiorstw
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                    Imię *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Jan"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                    Nazwisko *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Kowalski"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="jan.kowalski@example.com"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+48 123 456 789"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {/* B2B Fields */}
              {accountType === 'b2b' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      Nazwa firmy *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="OMEX Sp. z o.o."
                      required={accountType === 'b2b'}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                      NIP *
                    </label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => handleChange('taxId', e.target.value)}
                      placeholder="PL1234567890"
                      required={accountType === 'b2b'}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                    Hasło *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <div className="text-[12px] text-neutral-500 mt-1">
                    Min. 8 znaków
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                    Potwierdź hasło *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                  />
                  <span className="text-[13px] text-neutral-700 leading-relaxed">
                    Akceptuję{' '}
                    <Link href={`/${locale}/warunki-sprzedazy`} className="text-neutral-900 font-medium hover:text-neutral-700 underline">
                      regulamin
                    </Link>
                    {' '}i{' '}
                    <Link href={`/${locale}/polityka-prywatnosci`} className="text-neutral-900 font-medium hover:text-neutral-700 underline">
                      warunki sprzedaży
                    </Link>
                    {' *'}
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptGdpr}
                    onChange={(e) => setAcceptGdpr(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                  />
                  <span className="text-[13px] text-neutral-700 leading-relaxed">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
                    <Link href={`/${locale}/polityka-prywatnosci`} className="text-neutral-900 font-medium hover:text-neutral-700 underline">
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
                className="w-full px-6 py-3 bg-neutral-900 text-white rounded-lg text-[14px] font-semibold hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors mt-6"
              >
                {loading ? 'Tworzenie konta...' : 'Utwórz konto'}
              </button>

              {/* Login Link */}
              <div className="text-center text-[13px] text-neutral-600 pt-4">
                Masz już konto?{' '}
                <Link
                  href={`/${locale}/logowanie`}
                  className="text-neutral-900 font-semibold hover:text-neutral-700 transition-colors"
                >
                  Zaloguj się
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
