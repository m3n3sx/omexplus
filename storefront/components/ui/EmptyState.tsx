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
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-neutral-800 border border-neutral-700 rounded-lg">
      <div className="w-24 h-24 bg-neutral-900 border-2 border-neutral-700 rounded-lg flex items-center justify-center mb-6">
        <span className="text-6xl opacity-50" aria-hidden="true">
          {icon}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-neutral-100 mb-3 uppercase tracking-wide">
        {title}
      </h2>
      <div className="h-1 w-16 bg-secondary-500 mb-4"></div>
      <p className="text-neutral-400 mb-6 max-w-md">
        {description}
      </p>
      {action && (
        <Link 
          href={action.href}
          className="px-6 py-3 bg-secondary-500 text-neutral-900 rounded-lg font-bold hover:bg-secondary-400 hover:shadow-lg hover:shadow-secondary-500/30 transition-all duration-300 uppercase tracking-wide text-sm"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
