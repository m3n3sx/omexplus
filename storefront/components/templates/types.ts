/**
 * Template System - Type Definitions
 * 
 * Shared types for all component templates
 */

// Product Types
export interface ProductCardProps {
  product: {
    id: string
    title: string
    handle: string
    thumbnail?: string
    description?: string
    variants?: Array<{
      id?: string
      prices?: Array<{
        amount: number
        currency_code: string
      }>
    }>
    metadata?: Record<string, any>
  }
  className?: string
  onClick?: () => void
}

// Category Types
export interface CategoryCardProps {
  category: {
    id: string
    name: string
    slug: string
    description?: string
    product_count?: number
    parent_category_id?: string | null
  }
  className?: string
  onClick?: () => void
}

// Button Types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

// Empty State Types
export interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

// Error Message Types
export interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

// Loading Skeleton Types
export interface LoadingSkeletonProps {
  variant?: 'product' | 'category' | 'text' | 'image'
  count?: number
  className?: string
}

// Search Types
export interface SearchHubProps {
  onSearch: (query: string, method: string, params?: any) => void
  locale?: string
  initialQuery?: string
}

// Breadcrumb Types
export interface BreadcrumbItem {
  id: string
  name: string
  slug: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}
