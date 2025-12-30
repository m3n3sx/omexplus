'use client'

import { useEffect, useCallback, useState } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

interface GoogleLoginButtonProps {
  onSuccess: (user: any, token: string) => void
  onError?: (error: string) => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
          prompt: () => void
        }
      }
    }
  }
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [clientId, setClientId] = useState<string>('')
  
  const handleCredentialResponse = useCallback(async (response: any) => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          credential: response.credential,
          type: 'admin'
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Logowanie nie powiodło się')
      }
      
      onSuccess(data.user, data.token)
    } catch (error: any) {
      console.error('Google login error:', error)
      onError?.(error.message || 'Logowanie przez Google nie powiodło się')
    } finally {
      setLoading(false)
    }
  }, [onSuccess, onError])

  useEffect(() => {
    // Get client ID from env (client-side)
    const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
    setClientId(id)
    
    if (!id) {
      console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set')
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      setSdkLoaded(true)
      if (window.google && id) {
        window.google.accounts.id.initialize({
          client_id: id,
          callback: handleCredentialResponse,
          auto_select: false,
        })

        const buttonDiv = document.getElementById('admin-google-signin')
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            type: 'standard',
            theme: 'filled_blue',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 300
          })
        }
      }
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [handleCredentialResponse])

  const handleManualClick = () => {
    if (!clientId) {
      onError?.('Logowanie przez Google nie jest skonfigurowane')
      return
    }
    if (window.google) {
      window.google.accounts.id.prompt()
    } else {
      onError?.('Google SDK nie zostało załadowane. Spróbuj odświeżyć stronę.')
    }
  }

  return (
    <div className="w-full">
      {/* Google rendered button container */}
      <div id="admin-google-signin" className="flex justify-center" />
      
      {/* Custom fallback button */}
      {(!sdkLoaded || !clientId) && (
        <button
          type="button"
          onClick={handleManualClick}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Logowanie...' : 'Zaloguj przez Google'}
        </button>
      )}
      
      {loading && sdkLoaded && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Logowanie...
        </div>
      )}
    </div>
  )
}

export default GoogleLoginButton
