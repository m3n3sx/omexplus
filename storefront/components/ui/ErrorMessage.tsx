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
      className="flex gap-4 p-5 bg-red-50 border border-danger rounded-lg my-6"
      role="alert"
    >
      <span className="text-3xl flex-shrink-0" aria-hidden="true">⚠️</span>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-danger mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          {message}
        </p>
        {action && (
          <button 
            className="px-4 py-2 bg-danger text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
