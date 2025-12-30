"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { login, loginWithGoogle } from "@/lib/auth"
import { ROLE_LABELS, ROLE_COLORS, ROLE_DESCRIPTIONS, Role } from "@/lib/roles"
import { Shield, Info } from "lucide-react"
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton"

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  { email: 'admin@medusa-test.com', role: 'super_admin' as Role, password: 'supersecret' },
  { email: 'manager@omex.pl', role: 'manager' as Role },
  { email: 'sprzedaz@omex.pl', role: 'sales' as Role },
  { email: 'magazyn@omex.pl', role: 'warehouse' as Role },
  { email: 'content@omex.pl', role: 'content' as Role },
  { email: 'support@omex.pl', role: 'support' as Role },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showDemoInfo, setShowDemoInfo] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("Attempting login with:", email)
      await login(email, password)
      console.log("Login successful, redirecting...")
      router.push("/")
    } catch (err: any) {
      console.error("Login failed:", err)
      setError(err.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (user: any, token: string) => {
    try {
      // Zapisz dane logowania
      if (loginWithGoogle) {
        await loginWithGoogle(token, user)
      } else {
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_user', JSON.stringify(user))
      }
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Błąd logowania przez Google")
    }
  }

  const handleGoogleError = (errorMsg: string) => {
    setError(errorMsg)
  }

  const quickLogin = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email)
    setPassword(account.password || 'supersecret')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            OMEX Panel Administracyjny
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Panel dla pracowników sklepu
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Adres email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="twoj.email@omex.pl"
            />
            
            <Input
              label="Hasło"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </Button>
        </form>

        {/* Google Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">lub</span>
            </div>
          </div>
          
          <div className="mt-4">
            <GoogleLoginButton 
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </div>

        {/* Demo Accounts Info */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowDemoInfo(!showDemoInfo)}
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <Info className="w-4 h-4" />
            {showDemoInfo ? 'Ukryj konta demo' : 'Pokaż konta demo'}
          </button>
          
          {showDemoInfo && (
            <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Konta testowe (różne role)
              </h3>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => quickLogin(account)}
                    className="w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">{account.email}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${ROLE_COLORS[account.role]}`}>
                        {ROLE_LABELS[account.role]}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-0.5">
                      {ROLE_DESCRIPTIONS[account.role]}
                    </p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-3">
                Hasło dla wszystkich kont: <code className="bg-blue-100 px-1 rounded">supersecret</code>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-8">
          <p>Panel dla pracowników • Wersja 1.0</p>
          <p className="mt-1">
            Super Admin? Użyj{' '}
            <a href="https://ooxo.pl/app" className="text-blue-500 hover:underline">
              wbudowanego panelu Medusa
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
