'use client'

import { useState, useEffect } from 'react'

export default function ApiStatusPage() {
  const [status, setStatus] = useState<any>({
    backend: 'checking...',
    publishableKey: 'checking...',
    searchApi: 'checking...',
    database: 'checking...'
  })

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9000'
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

    // Check publishable key
    setStatus((prev: any) => ({
      ...prev,
      publishableKey: publishableKey ? '✅ Set' : '❌ Missing'
    }))

    // Check backend
    try {
      const response = await fetch(`${backendUrl}/health`, {
        headers: {
          'x-publishable-api-key': publishableKey
        }
      })
      setStatus((prev: any) => ({
        ...prev,
        backend: response.ok ? '✅ Running' : `⚠️ Status ${response.status}`
      }))
    } catch (error) {
      setStatus((prev: any) => ({
        ...prev,
        backend: '❌ Not reachable'
      }))
    }

    // Check search API
    try {
      const response = await fetch(
        `${backendUrl}/store/advanced-search?action=autocomplete&query=&step=1`,
        {
          headers: {
            'x-publishable-api-key': publishableKey
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setStatus((prev: any) => ({
          ...prev,
          searchApi: `✅ Working (${data.count || 0} results)`,
          database: data.count > 0 ? '✅ Has data' : '⚠️ Empty'
        }))
      } else {
        const error = await response.json().catch(() => ({}))
        setStatus((prev: any) => ({
          ...prev,
          searchApi: `❌ Error ${response.status}`,
          database: '❓ Unknown'
        }))
        console.error('Search API Error:', error)
      }
    } catch (error) {
      setStatus((prev: any) => ({
        ...prev,
        searchApi: '❌ Failed to connect',
        database: '❓ Unknown'
      }))
      console.error('Search API Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            🔍 API Status Check
          </h1>

          <div className="space-y-4">
            <StatusItem
              label="Backend Server"
              status={status.backend}
              description="Medusa backend on port 9000"
            />
            
            <StatusItem
              label="Publishable API Key"
              status={status.publishableKey}
              description="Required for store API access"
            />
            
            <StatusItem
              label="Search API Endpoint"
              status={status.searchApi}
              description="/store/advanced-search"
            />
            
            <StatusItem
              label="Database Data"
              status={status.database}
              description="Machine types, manufacturers, models"
            />
          </div>

          <div className="mt-8 p-4 bg-neutral-100 rounded-lg">
            <div className="text-sm font-semibold mb-2">Configuration:</div>
            <div className="text-xs font-mono space-y-1">
              <div>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9000'}</div>
              <div>API Key: {process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY?.substring(0, 20)}...</div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={checkStatus}
              className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              🔄 Recheck Status
            </button>
            <a
              href="/pl/test-search"
              className="flex-1 py-3 bg-success text-white font-semibold rounded-lg hover:bg-success/90 transition-colors text-center"
            >
              🧪 Test Search
            </a>
          </div>

          <div className="mt-6 p-4 bg-yellow/10 border border-yellow/30 rounded-lg">
            <div className="text-sm font-semibold text-neutral-900 mb-2">
              ⚠️ If Search API shows error:
            </div>
            <ol className="text-sm text-neutral-700 space-y-1 list-decimal list-inside">
              <li>Backend must be restarted to load new route</li>
              <li>Stop backend (Ctrl+C) and run: npm run dev</li>
              <li>Wait for "Server is ready" message</li>
              <li>Refresh this page to recheck</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusItem({ 
  label, 
  status, 
  description 
}: { 
  label: string
  status: string
  description: string
}) {
  return (
    <div className="p-4 border border-neutral-200 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <div className="font-semibold text-neutral-900">{label}</div>
        <div className="text-lg">{status}</div>
      </div>
      <div className="text-sm text-neutral-600">{description}</div>
    </div>
  )
}
