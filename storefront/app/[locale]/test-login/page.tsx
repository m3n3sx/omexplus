'use client'

import { useState } from 'react'

export default function TestLoginPage() {
  const [email, setEmail] = useState('test@ooxo.pl')
  const [password, setPassword] = useState('Test123!')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('http://localhost:9000/auth/customer/emailpass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      setResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (response.ok) {
        // Try to get customer data
        const customerResponse = await fetch('http://localhost:9000/store/customers/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0',
          },
          credentials: 'include',
        })

        const customerData = await customerResponse.json()
        
        setResult((prev: any) => ({
          ...prev,
          customerCheck: {
            success: customerResponse.ok,
            status: customerResponse.status,
            data: customerData
          }
        }))
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            🔐 Test Logowania
          </h1>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hasło:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>

            <button
              onClick={testLogin}
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Logowanie...' : 'Testuj Logowanie'}
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
              <div className="text-sm font-semibold mb-2">Wynik:</div>
              
              {result.success ? (
                <div className="space-y-3">
                  <div className="p-3 bg-success/10 border border-success/30 rounded">
                    <div className="font-semibold text-success">✅ Logowanie udane!</div>
                    <div className="text-sm mt-1">Status: {result.status}</div>
                  </div>

                  {result.data?.token && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="font-semibold text-sm mb-1">Token:</div>
                      <div className="text-xs font-mono break-all">{result.data.token.substring(0, 50)}...</div>
                    </div>
                  )}

                  {result.customerCheck && (
                    <div className={`p-3 border rounded ${
                      result.customerCheck.success 
                        ? 'bg-success/10 border-success/30' 
                        : 'bg-danger/10 border-danger/30'
                    }`}>
                      <div className="font-semibold text-sm mb-1">
                        {result.customerCheck.success ? '✅' : '❌'} Sprawdzenie danych klienta:
                      </div>
                      <div className="text-xs">Status: {result.customerCheck.status}</div>
                      {result.customerCheck.data?.customer && (
                        <div className="text-xs mt-1">
                          Email: {result.customerCheck.data.customer.email}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-danger/10 border border-danger/30 rounded">
                  <div className="font-semibold text-danger">❌ Logowanie nieudane</div>
                  <div className="text-sm mt-1">Status: {result.status}</div>
                  {result.data?.message && (
                    <div className="text-sm mt-1">Błąd: {result.data.message}</div>
                  )}
                  {result.error && (
                    <div className="text-sm mt-1">Błąd: {result.error}</div>
                  )}
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold">Szczegóły techniczne</summary>
                <pre className="mt-2 text-xs bg-neutral-900 text-neutral-100 p-3 rounded overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-semibold mb-2">📝 Dane testowe:</div>
            <div className="text-sm space-y-1">
              <div><strong>Email:</strong> test@ooxo.pl</div>
              <div><strong>Hasło:</strong> Test123!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
