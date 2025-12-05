---
inclusion: always
---

# Design System Rules for Figma Integration

This document defines the design system structure and integration guidelines for converting Figma designs to code in this Medusa e-commerce project.

## Project Overview

- **Backend**: Medusa.js (TypeScript, Node.js)
- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Internationalization**: next-intl
- **Payment**: Stripe

## Design Token Definitions

### Colors
Defined in `storefront/tailwind.config.ts`:

```typescript
colors: {
  // Primary (Blue tones)
  primary: { 50-900 scale }
  
  // Secondary (Orange tones)
  secondary: { 50-700 scale }
  
  // Neutral (Grayscale)
  neutral: { 50-900 scale }
  
  // Status colors
  success: '#27ae60'
  warning: '#F2B90C'
  danger: '#A62B0F'
  info: '#3498db'
  
  // Accent colors
  yellow: '#F2B90C'  // For promotions, highlights, special offers
  red: '#A62B0F'     // For alerts, warnings, important notices
}
```

### Spacing
Custom spacing scale: `xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px`

### Typography
- Font sizes: xs (12px) to 4xl (48px)
- Font weights: normal (400), medium (500), semibold (600), bold (700)
- Line heights optimized per size

### Shadows
- sm, md, lg, xl variants with consistent opacity

### Border Radius
- sm: 4px, md: 8px, lg: 12px

### Transitions
- Timing: ease-standard cubic-bezier(0.16, 1, 0.3, 1)
- Durations: 150ms, 250ms, 350ms

## Component Library Structure

### Location
`storefront/components/` organized by feature:
- `ui/` - Base UI components (Button, EmptyState, ErrorMessage, TrustBadges)
- `product/` - Product-related (ProductCard, ProductGrid, AddToCartButton, ProductSkeleton)
- `search/` - Search functionality
- `layout/` - Layout components (Header, Footer, Hero, MobileNav)
- `filters/` - Filter components
- `cms/` - CMS dynamic components
- `admin/` - Admin components
- `providers/` - Context providers

### Component Architecture
- **Pattern**: Functional components with TypeScript
- **Props**: Strongly typed interfaces
- **Composition**: Props spreading with `...props`
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

### Example Component Pattern
```typescript
interface ComponentProps extends HTMLAttributes<HTMLElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Component({ variant = 'primary', className = '', ...props }: ComponentProps) {
  const baseStyles = 'transition-all duration-200'
  const variantStyles = { primary: '...', secondary: '...' }
  
  return (
    <element className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </element>
  )
}
```

## Styling Approach

### CSS Methodology
- **Primary**: Tailwind utility classes
- **Global styles**: `storefront/app/globals.css` with @layer directives
- **Component styles**: Inline className with template literals
- **Responsive**: Mobile-first with Tailwind breakpoints

### Utility Classes
```css
.container - Max-width 1400px, centered, px-4
.btn - Base button styles
.btn-primary, .btn-secondary, .btn-outline - Button variants
.card - Card component base
```

### Hover States
- Use `hover:` prefix for interactive elements
- Common pattern: `hover:-translate-y-1 hover:shadow-lg`
- Transitions: `transition-all duration-300`

## Asset Management

### Images
- **Storage**: `storefront/public/` directory
- **Component**: Next.js `<Image>` component
- **Optimization**: Automatic via Next.js
- **Sizes prop**: Responsive image loading
- **Placeholder**: `/placeholder.svg` for missing images

### Icons
- Currently using Unicode/emoji (⭐, ✓, ✗, ⚠)
- Consider icon library integration for production

## Figma Integration Guidelines

### When Converting Figma Designs:

1. **Replace Tailwind with Design Tokens**
   - Use `primary-*`, `secondary-*`, `neutral-*` color scales
   - Use custom spacing: `space-xs`, `space-sm`, etc.
   - Use defined shadows: `shadow-sm`, `shadow-md`, etc.

2. **Reuse Existing Components**
   - Check `components/ui/` for base components
   - Extend existing components rather than creating new ones
   - Use `Button` component for all button needs
   - Use `ProductCard` pattern for product displays

3. **Maintain Accessibility**
   - Add ARIA labels for screen readers
   - Use semantic HTML elements
   - Ensure keyboard navigation
   - Minimum touch target: 44px (mobile)

4. **Follow Naming Conventions**
   - Components: PascalCase (e.g., `ProductCard`)
   - Props: camelCase (e.g., `isLoading`)
   - CSS classes: kebab-case or Tailwind utilities
   - Files: PascalCase.tsx for components

5. **Responsive Design**
   - Mobile-first approach
   - Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
   - Test on mobile (375px), tablet (768px), desktop (1024px+)

6. **State Management**
   - Local state: `useState` for component state
   - Global state: Context API (see `contexts/`)
   - Server state: Next.js Server Components where possible

7. **Internationalization**
   - All text must support i18n via `next-intl`
   - Use translation keys, not hardcoded text
   - Messages stored in `storefront/messages/`

8. **Visual Parity**
   - Aim for 1:1 match with Figma design
   - Use Figma screenshot for validation
   - Adjust spacing minimally to match design system tokens

## Project Structure

```
storefront/
├── app/              # Next.js App Router pages
├── components/       # React components (organized by feature)
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions, API clients
├── messages/         # i18n translation files
├── public/           # Static assets
└── types/            # TypeScript type definitions
```

## Code Quality Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint (ignored during builds for flexibility)
- **Formatting**: Consistent indentation and spacing
- **Comments**: JSDoc for complex functions
- **Error Handling**: Try-catch blocks for async operations
- **Loading States**: Show loading indicators for async actions
- **Error States**: Display user-friendly error messages

## Integration Workflow

1. **Receive Figma URL** with node ID and file key
2. **Extract design context** using Figma MCP tools
3. **Identify reusable components** from existing codebase
4. **Map Figma styles** to design system tokens
5. **Generate component code** following patterns above
6. **Add TypeScript types** for props and data
7. **Implement accessibility** features
8. **Add i18n support** for all text
9. **Test responsive behavior** across breakpoints
10. **Validate against Figma** screenshot for accuracy
