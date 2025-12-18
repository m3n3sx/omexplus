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
  // Induxter style - rounded buttons with orange accent
  const baseStyles = 'font-bold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide font-heading inline-flex items-center justify-center'
  
  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-secondary-700 hover:shadow-lg focus:ring-primary-500',
    secondary: 'bg-secondary-700 text-white hover:bg-primary-500 focus:ring-secondary-700',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500',
    ghost: 'bg-transparent text-secondary-700 hover:bg-neutral-100 hover:text-primary-500 focus:ring-neutral-300',
  }
  
  const sizeStyles = {
    sm: 'px-5 py-2 text-xs',
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-base',
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
