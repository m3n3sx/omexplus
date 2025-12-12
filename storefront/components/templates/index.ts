/**
 * Template System - Central Export
 * 
 * This file exports all component templates used throughout the application.
 * Import templates from here to ensure consistency across the frontend.
 * 
 * @example
 * import { ProductCardTemplate, Button, InputField } from '@/components/templates'
 */

// ============================================================================
// PRODUCT TEMPLATES
// ============================================================================
export { ProductCardTemplate } from '../product/ProductCardTemplate'
export { ProductGrid } from '../product/ProductGrid'
export { ProductSkeleton } from '../product/ProductSkeleton'

// ============================================================================
// CATEGORY TEMPLATES
// ============================================================================
export { MainCategoryCard } from '../layout/MainCategoryCard'
export { CategoryHierarchy } from '../filters/CategoryHierarchy'

// ============================================================================
// LAYOUT TEMPLATES
// ============================================================================
export { FeaturedProductCard } from '../layout/FeaturedProductCard'

// ============================================================================
// SEARCH TEMPLATES
// ============================================================================
export { default as UnifiedSearchHub } from '../search/UnifiedSearchHub'
export { default as EnhancedSearchBar } from '../search/EnhancedSearchBar'

// ============================================================================
// UI TEMPLATES
// ============================================================================
export { Button } from '../ui/Button'
export { EmptyState } from '../ui/EmptyState'
export { ErrorMessage } from '../ui/ErrorMessage'
export { LoadingSkeleton } from '../ui/LoadingSkeleton'
export { TrustBadges } from '../ui/TrustBadges'

// ============================================================================
// FORM TEMPLATES
// ============================================================================
export { InputField, TextareaField, SelectField, CheckboxField } from './FormTemplate'

// ============================================================================
// CART TEMPLATES
// ============================================================================
export { CartItemTemplate } from './CartItemTemplate'

// ============================================================================
// INFO CARD TEMPLATES
// ============================================================================
export { InfoCardTemplate, FeatureCardTemplate, StatCardTemplate } from './InfoCardTemplate'

// ============================================================================
// MODAL TEMPLATES
// ============================================================================
export { ModalTemplate, ConfirmModalTemplate } from './ModalTemplate'

// ============================================================================
// NOTIFICATION TEMPLATES
// ============================================================================
export { NotificationTemplate, NotificationProvider, useNotification } from './NotificationTemplate'

// ============================================================================
// NAVIGATION TEMPLATES
// ============================================================================
export { CategoryBreadcrumb } from '../navigation/CategoryBreadcrumb'

// ============================================================================
// TYPES
// ============================================================================
export type {
  ProductCardProps,
  CategoryCardProps,
  ButtonProps,
  EmptyStateProps,
  ErrorMessageProps,
  LoadingSkeletonProps,
  SearchHubProps,
  BreadcrumbItem,
  BreadcrumbProps,
} from './types'
