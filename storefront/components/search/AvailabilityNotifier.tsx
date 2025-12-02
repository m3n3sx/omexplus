'use client'

/**
 * AvailabilityNotifier Component - Notify when part becomes available
 * FUNKCJA 3: ŚLEDZENIE DOSTĘPNOŚCI
 */

import { useState } from 'react'

interface AvailabilityNotifierProps {
  partId: string
  partName: string
  partNumber: string
  currentAvailability: string
  onSubscribe?: (data: NotificationSubscription) => void
}

interface NotificationSubscription {
  partId: string
  email?: string
  phone?: string
  pushEnabled: boolean
  emailEnabled: boolean
  smsEnabled: boolean
}

export default function AvailabilityNotifier({
  partId,
  partName,
  partNumber,
  currentAvailability,
  onSubscribe,
}: AvailabilityNotifierProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  // Don't show if already in stock
  if (currentAvailability === 'in-stock') {
    return null
  }

  const handleSubscribe = async () => {
    if (!emailEnabled && !pushEnabled && !smsEnabled) {
      alert('Wybierz przynajmniej jeden sposób powiadomienia')
      return
    }

    if (emailEnabled && !email) {
      alert('Podaj adres email')
      return
    }

    if (smsEnabled && !phone) {
      alert('Podaj numer telefonu')
      return
    }

    setLoading(true)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const response = await fetch(`${backendUrl}/store/omex-search/notify-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partId,
          email: emailEnabled ? email : undefined,
          phone: smsEnabled ? phone : undefined,
          pushEnabled,
          emailEnabled,
          smsEnabled,
        }),
      })

      if (response.ok) {
        setIsSubscribed(true)
        if (onSubscribe) {
          onSubscribe({
            partId,
            email: emailEnabled ? email : undefined,
            phone: smsEnabled ? phone : undefined,
            pushEnabled,
            emailEnabled,
            smsEnabled,
          })
        }
      } else {
        alert('Nie udało się zapisać powiadomienia. Spróbuj ponownie.')
      }
    } catch (error) {
      console.error('Failed to subscribe:', error)
      alert('Wystąpił błąd. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#dcfce7',
        border: '2px solid #86efac',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{ fontSize: '1.5rem' }}>✅</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#16a34a', marginBottom: '0.25rem' }}>
            Powiadomienie aktywne
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
            Powiadomimy Cię gdy część będzie dostępna
          </div>
        </div>
        <button
          onClick={() => setIsSubscribed(false)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #16a34a',
            borderRadius: '6px',
            backgroundColor: 'white',
            color: '#16a34a',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '600',
          }}
        >
          Anuluj
        </button>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          backgroundColor: 'white',
          color: '#3b82f6',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        🔔 Powiadom mnie o dostępności
      </button>
    )
  }

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '1rem',
      }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Powiadomienie o dostępności
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {partName} ({partNumber})
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: '#6b7280',
          }}
        >
          ✕
        </button>
      </div>

      {/* Current Status */}
      <div style={{
        padding: '0.75rem',
        backgroundColor: '#fef3c7',
        borderRadius: '6px',
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
      }}>
        <strong>Status:</strong>{' '}
        {currentAvailability === 'order-2-5-days' && 'Dostępne na zamówienie (2-5 dni)'}
        {currentAvailability === 'order-2-4-weeks' && 'Dostępne na zamówienie (2-4 tygodnie)'}
        {currentAvailability === 'discontinued' && 'Wycofane z produkcji'}
      </div>

      {/* Notification Methods */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          Wybierz sposób powiadomienia:
        </div>

        {/* Push Notifications */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          marginBottom: '0.5rem',
          cursor: 'pointer',
          backgroundColor: pushEnabled ? '#eff6ff' : 'white',
        }}>
          <input
            type="checkbox"
            checked={pushEnabled}
            onChange={(e) => setPushEnabled(e.target.checked)}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              🔔 Powiadomienia push
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Natychmiastowe powiadomienie w przeglądarce
            </div>
          </div>
        </label>

        {/* Email */}
        <label style={{
          display: 'flex',
          alignItems: 'start',
          gap: '0.75rem',
          padding: '0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          marginBottom: '0.5rem',
          cursor: 'pointer',
          backgroundColor: emailEnabled ? '#eff6ff' : 'white',
        }}>
          <input
            type="checkbox"
            checked={emailEnabled}
            onChange={(e) => setEmailEnabled(e.target.checked)}
            style={{ marginTop: '0.25rem' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              📧 Email
            </div>
            {emailEnabled && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.pl"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                }}
              />
            )}
          </div>
        </label>

        {/* SMS */}
        <label style={{
          display: 'flex',
          alignItems: 'start',
          gap: '0.75rem',
          padding: '0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          cursor: 'pointer',
          backgroundColor: smsEnabled ? '#eff6ff' : 'white',
        }}>
          <input
            type="checkbox"
            checked={smsEnabled}
            onChange={(e) => setSmsEnabled(e.target.checked)}
            style={{ marginTop: '0.25rem' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
              📱 SMS
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Opcjonalnie - dodatkowa opłata może być naliczona
            </div>
            {smsEnabled && (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+48 123 456 789"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                }}
              />
            )}
          </div>
        </label>
      </div>

      {/* Subscribe Button */}
      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: loading ? '#e5e7eb' : '#3b82f6',
          color: 'white',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '0.75rem',
        }}
      >
        {loading ? 'Zapisywanie...' : '✓ Zapisz powiadomienie'}
      </button>

      {/* Info */}
      <div style={{
        padding: '0.75rem',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#6b7280',
        lineHeight: '1.5',
      }}>
        💡 Powiadomimy Cię natychmiast gdy część będzie dostępna na magazynie. 
        Możesz anulować powiadomienie w każdej chwili.
      </div>
    </div>
  )
}
