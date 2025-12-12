import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  isLoading?: boolean
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  isLoading = false,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide'
  
  const variantStyles = {
    primary: 'bg-secondary-500 text-neutral-900 hover:bg-secondary-400 hover:shadow-lg hover:shadow-secondary-500/30 focus:ring-secondary-500',
    secondary: 'bg-neutral-800 text-neutral-100 border border-neutral-700 hover:border-secondary-500 hover:bg-neutral-750 focus:ring-neutral-700',
    outline: 'bg-transparent border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-neutral-900 focus:ring-secondary-500',
    ghost: 'bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 focus:ring-neutral-700',
  }
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="inline-block animate-spin">⟳</span>
          Ładowanie...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
