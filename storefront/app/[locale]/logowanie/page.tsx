'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const locale = useLocale()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement actual login
    setTimeout(() => {
      setLoading(false)
      router.push(`/${locale}/konto`)
    }, 1000)
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
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-neutral-300 rounded-lg text-[13px] font-semibold hover:bg-neutral-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-neutral-300 rounded-lg text-[13px] font-semibold hover:bg-neutral-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#00A4EF" d="M0 0h11.377v11.372H0z"/>
                  <path fill="#FFB900" d="M12.623 0H24v11.372H12.623z"/>
                  <path fill="#05A6F0" d="M0 12.628h11.377V24H0z"/>
                  <path fill="#FFBB00" d="M12.623 12.628H24V24H12.623z"/>
                </svg>
                Microsoft
              </button>
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
