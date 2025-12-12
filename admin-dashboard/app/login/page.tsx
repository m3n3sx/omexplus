"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { login } from "@/lib/auth"

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
      setError(err.message || "Invalid email or password. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            OMEX Panel Administracyjny
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaloguj się do panelu administratora
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
              placeholder="admin@example.com"
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
              <p className="text-sm text-red-800">Nieprawidłowy email lub hasło</p>
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
      </div>
    </div>
  )
}
