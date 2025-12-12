# Implementation Plan

- [x] 1. Create FeaturedProductCard component
  - Create new component at `storefront/components/layout/FeaturedProductCard.tsx`
  - Implement props interface with product data (name, slug, category, description)
  - Add text-only styling with 2-line description truncation using CSS line-clamp
  - Add click handler for navigation to product detail page
  - _Requirements: 3.1, 3.3_

- [ ]* 1.1 Write property test for FeaturedProductCard
  - **Property 5: Featured product completeness**
  - **Validates: Requirements 3.1**

- [ ]* 1.2 Write property test for description truncation
  - **Property 6: Description line limit**
  - **Validates: Requirements 3.3**

- [x] 2. Add featured products API endpoint
  - Create API route at `src/api/store/featured-products/route.ts`
  - Implement query to fetch products where `isFeatured = true`
  - Sort by priority field
  - Return product data with name, slug, category, and description
  - _Requirements: 3.1_

- [x] 3. Modify CategoryNavigation component for two-column layout
  - Update mega menu panel to use two-column grid (60/40 split)
  - Move existing category rendering to left column
  - Add right column container for featured products
  - Maintain existing hover behavior and Level 3 flyouts
  - _Requirements: 1.1, 1.2, 1.3_
  - ✅ Completed: Two-column grid implemented with 3/5 cols for categories, 2/5 cols for featured products

- [ ]* 3.1 Write property test for two-column layout
  - **Property 1: Two-column layout structure**
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [ ]* 3.2 Write property test for text-only design
  - **Property 2: Text-only design constraint**
  - **Validates: Requirements 1.4**

- [x] 4. Integrate featured products into mega menu
  - Add state for featured products in CategoryNavigation
  - Fetch featured products on component mount
  - Render FeaturedProductCard components in right column
  - Implement "View All Products" CTA fallback when no featured products
  - Add error handling for API failures
  - _Requirements: 3.1, 3.4_

- [x] 5. Style category hierarchy for enterprise design
  - Update Level 1 categories to bold headings without underline borders
  - Style Level 2 subcategories as clean text links
  - Ensure product counts display for all categories
  - Remove icons and maintain text-only design
  - _Requirements: 2.1, 2.2, 2.4, 1.4_

- [ ]* 5.1 Write property test for category hierarchy
  - **Property 3: Category hierarchy rendering**
  - **Validates: Requirements 2.2**

- [ ]* 5.2 Write property test for product count display
  - **Property 4: Product count display**
  - **Validates: Requirements 2.4**

- [x] 6. Add internationalization support
  - Add translation keys for featured products section
  - Add translation key for "View All Products" CTA
  - Ensure featured product descriptions support i18n
  - _Requirements: 3.1, 3.4_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
