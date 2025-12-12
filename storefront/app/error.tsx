'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Coś poszło nie tak
        </h2>
        <p className="text-neutral-600 mb-6">
          Przepraszamy, wystąpił nieoczekiwany błąd.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Spróbuj ponownie
        </button>
      </div>
    </div>
  )
}
