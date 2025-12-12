/**
 * Session Storage Utilities
 * Handles client-side session data persistence
 */

import { Customer } from '@/types'

const SESSION_KEY = 'omex_session'
const SESSION_EXPIRY_KEY = 'omex_session_expiry'
const REMEMBER_ME_KEY = 'omex_remember_me'

export interface StoredSession {
  customer: Customer
  timestamp: number
}

/**
 * Save session data to localStorage
 */
export function saveSession(customer: Customer, rememberMe: boolean = false): void {
  if (typeof window === 'undefined') return

  try {
    const session: StoredSession = {
      customer,
      timestamp: Date.now(),
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString())

    // Set expiry time (7 days if remember me, 24 hours otherwise)
    const expiryTime = Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
    localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString())
  } catch (error) {
    console.error('Failed to save session:', error)
  }
}

/**
 * Get session data from localStorage
 */
export function getSession(): StoredSession | null {
  if (typeof window === 'undefined') return null

  try {
    const sessionData = localStorage.getItem(SESSION_KEY)
    const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY)

    if (!sessionData || !expiryTime) {
      return null
    }

    // Check if session has expired
    if (Date.now() > parseInt(expiryTime)) {
      clearSession()
      return null
    }

    return JSON.parse(sessionData)
  } catch (error) {
    console.error('Failed to get session:', error)
    return null
  }
}

/**
 * Clear session data from localStorage
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(SESSION_EXPIRY_KEY)
    localStorage.removeItem(REMEMBER_ME_KEY)
  } catch (error) {
    console.error('Failed to clear session:', error)
  }
}

/**
 * Check if session exists and is valid
 */
export function hasValidSession(): boolean {
  if (typeof window === 'undefined') return false

  const session = getSession()
  return session !== null
}

/**
 * Get remember me preference
 */
export function getRememberMe(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY)
    return rememberMe === 'true'
  } catch (error) {
    return false
  }
}

/**
 * Update session timestamp (for activity tracking)
 */
export function updateSessionActivity(): void {
  if (typeof window === 'undefined') return

  try {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) return

    const session: StoredSession = JSON.parse(sessionData)
    session.timestamp = Date.now()
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch (error) {
    console.error('Failed to update session activity:', error)
  }
}
