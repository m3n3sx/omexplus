'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'

export default function LoginPage() {
  const locale = useLocale()
  const router = useRouter()
  const { login, loginWithToken } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(email, password)
      router.push(`/${locale}`)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Nieprawidłowy email lub hasło')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (user: any, token: string) => {
    try {
      // Zapisz token i dane użytkownika
      if (loginWithToken) {
        await loginWithToken(token, user)
      } else {
        // Fallback - zapisz w localStorage
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
      }
      router.push(`/${locale}`)
    } catch (err: any) {
      setError('Błąd podczas logowania przez Google')
    }
  }

  const handleGoogleError = (errorMsg: string) => {
    setError(errorMsg)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-[#E8F4FE] to-[#D4EBFC] py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-[60px]">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              Zaloguj się
            </h1>
            <p className="text-[14px] text-neutral-600">
              Witaj ponownie! Zaloguj się do swojego konta
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#D4EBFC] shadow-2xl">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px]">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jan.kowalski@example.com"
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-semibold mb-2 text-neutral-900">
                  Hasło
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg text-[14px] focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                  />
                  <span className="text-[13px] text-neutral-700">
                    Zapamiętaj mnie
                  </span>
                </label>

                <Link
                  href={`/${locale}/reset-haslo`}
                  className="text-[13px] text-neutral-900 hover:text-neutral-700 font-medium transition-colors"
                >
                  Zapomniałeś hasła?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-[#1675F2] text-white rounded-2xl text-[14px] font-bold hover:bg-[#0554F2] disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1675F2]/30"
              >
                {loading ? 'Logowanie...' : 'Zaloguj się'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="px-4 text-[13px] text-neutral-500">
                lub
              </span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <GoogleLoginButton 
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="Zaloguj przez Google"
                className="w-full"
              />
            </div>

            {/* Register Link */}
            <div className="text-center text-[13px] text-neutral-600">
              Nie masz konta?{' '}
              <Link
                href={`/${locale}/rejestracja`}
                className="text-neutral-900 font-semibold hover:text-neutral-700 transition-colors"
              >
                Zarejestruj się
              </Link>
            </div>
          </div>

          {/* Guest Checkout */}
          <div className="mt-6 text-center p-6 bg-white rounded-xl border border-neutral-200">
            <p className="text-[13px] text-neutral-600 mb-4">
              Chcesz złożyć zamówienie bez rejestracji?
            </p>
            <Link
              href={`/${locale}/checkout`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-neutral-900 border border-neutral-300 rounded-lg text-[13px] font-semibold hover:bg-neutral-50 transition-colors"
            >
              Kontynuuj jako gość
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
