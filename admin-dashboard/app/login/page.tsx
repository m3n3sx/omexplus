"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { login, loginWithGoogle } from "@/lib/auth"
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-theme-primary">
            OMEX Panel Administracyjny
          </h2>
          <p className="mt-2 text-center text-sm text-theme-secondary">
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
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
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
              <div className="w-full border-t border-theme" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-theme-primary text-theme-muted">lub</span>
            </div>
          </div>
          
          <div className="mt-4">
            <GoogleLoginButton 
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-theme-muted mt-8">
          <p>Panel dla pracowników • Wersja 1.0</p>
        </div>
      </div>
    </div>
  )
}
