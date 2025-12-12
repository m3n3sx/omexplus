'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Coś poszło nie tak
              </h2>
              <p className="text-neutral-600">
                Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
              </p>
            </div>
            
            {error.message && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg">
                <p className="text-sm text-danger font-mono">
                  {error.message}
                </p>
              </div>
            )}
            
            <button
              onClick={() => reset()}
              className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
