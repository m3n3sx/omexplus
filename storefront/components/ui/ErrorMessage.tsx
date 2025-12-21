interface ErrorMessageProps {
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function ErrorMessage({ 
  title = 'Wystąpił błąd', 
  message, 
  action 
}: ErrorMessageProps) {
  return (
    <div 
      className="flex gap-4 p-6 bg-neutral-800 border-2 border-danger rounded-lg my-6"
      role="alert"
    >
      <div className="w-12 h-12 bg-danger/20 border border-danger rounded flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-danger mb-2 uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-sm text-neutral-300 mb-3">
          {message}
        </p>
        {action && (
          <button 
            className="px-4 py-2 bg-danger text-white rounded-lg font-bold hover:bg-red-600 transition-all duration-300 uppercase tracking-wide text-xs"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
