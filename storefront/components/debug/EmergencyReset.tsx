'use client'

import { useEffect, useState } from 'react'

export function EmergencyReset() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show reset button after 3 seconds if page seems frozen
    const timer = setTimeout(() => {
      setShow(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleReset = () => {
    // Clear all localStorage
    localStorage.clear()
    
    // Clear all sessionStorage
    sessionStorage.clear()
    
    // Remove all event listeners
    const newBody = document.body.cloneNode(true)
    document.body.parentNode?.replaceChild(newBody, document.body)
    
    // Reload page
    window.location.reload()
  }

  if (!show) return null

  return (
    <button
      onClick={handleReset}
      className="fixed bottom-4 right-4 z-[9999] px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-2xl hover:bg-red-700 transition-colors animate-pulse"
      style={{ pointerEvents: 'all' }}
    >
      🚨 Reset & Reload
    </button>
  )
}
