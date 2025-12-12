import Link from 'next/link'

interface InfoCardProps {
  icon?: string | React.ReactNode
  title: string
  description: string
  link?: {
    href: string
    label: string
  }
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  className?: string
}

export function InfoCardTemplate({
  icon,
  title,
  description,
  link,
  variant = 'default',
  className = '',
}: InfoCardProps) {
  const variantStyles = {
    default: 'bg-white border-neutral-200 hover:border-neutral-300',
    primary: 'bg-primary-50 border-primary-200 hover:border-primary-300',
    secondary: 'bg-secondary-50 border-secondary-200 hover:border-secondary-300',
    success: 'bg-green-50 border-green-200 hover:border-green-300',
    warning: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300',
    danger: 'bg-red-50 border-red-200 hover:border-red-300',
  }

  const iconColorStyles = {
    default: 'text-neutral-600',
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  }

  const linkColorStyles = {
    default: 'text-neutral-900 hover:text-primary-600',
    primary: 'text-primary-700 hover:text-primary-800',
    secondary: 'text-secondary-700 hover:text-secondary-800',
    success: 'text-green-700 hover:text-green-800',
    warning: 'text-yellow-700 hover:text-yellow-800',
    danger: 'text-red-700 hover:text-red-800',
  }

  return (
    <div
      className={`
        p-6 rounded-lg border-2 transition-all duration-300
        ${variantStyles[variant]}
        ${link ? 'hover:shadow-md' : ''}
        ${className}
      `}
    >
      {/* Icon */}
      {icon && (
        <div className={`text-4xl mb-4 ${iconColorStyles[variant]}`}>
          {typeof icon === 'string' ? icon : icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-neutral-600 mb-4 leading-relaxed">{description}</p>

      {/* Link */}
      {link && (
        <Link
          href={link.href}
          className={`
            inline-flex items-center gap-2 text-sm font-bold transition-colors
            ${linkColorStyles[variant]}
          `}
        >
          {link.label}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}

// Feature Card Template (for features section)
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCardTemplate({
  icon,
  title,
  description,
  className = '',
}: FeatureCardProps) {
  return (
    <div
      className={`
        text-center p-6 rounded-lg bg-white border border-neutral-200
        hover:border-primary-300 hover:shadow-md transition-all duration-300
        ${className}
      `}
    >
      {/* Icon */}
      <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
    </div>
  )
}

// Stat Card Template (for statistics)
interface StatCardProps {
  value: string | number
  label: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCardTemplate({
  value,
  label,
  icon,
  trend,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`
        p-6 rounded-lg bg-white border-2 border-neutral-200
        hover:border-primary-300 hover:shadow-md transition-all duration-300
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Value */}
        <div className="text-4xl font-bold text-primary-600">{value}</div>

        {/* Icon */}
        {icon && (
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
            {icon}
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-sm font-bold text-neutral-700 uppercase tracking-wide mb-2">
        {label}
      </div>

      {/* Trend */}
      {trend && (
        <div
          className={`
            text-sm font-medium flex items-center gap-1
            ${trend.isPositive ? 'text-green-600' : 'text-red-600'}
          `}
        >
          {trend.isPositive ? '↑' : '↓'}
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  )
}
