import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({ 
  icon = '📦', 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <span className="text-6xl mb-6 opacity-50" aria-hidden="true">
        {icon}
      </span>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        {title}
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      {action && (
        <Link 
          href={action.href}
          className="px-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
