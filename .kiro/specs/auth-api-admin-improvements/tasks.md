# Implementation Plan - Auth, API Integration & Admin Dashboard

## Phase 1: Authentication System

- [x] 1. Set up authentication infrastructure
  - Create AuthContext provider in storefront/contexts/AuthContext.tsx
  - Implement auth API client in storefront/lib/auth-api.ts
  - Add session storage utilities
  - **IMPROVED**: Enhanced auth-api.ts with direct fetch for better cookie handling
  - **IMPROVED**: Fixed AuthContext session loading with better error handling
  - **IMPROVED**: Updated api-client.ts to not retry on 401/403 errors
  - _Requirements: 1.1, 1.2, 1.5, 8.1_

- [ ]* 1.1 Write property test for registration
  - **Property 1: Registration creates account**
  - **Validates: Requirements 1.1**

- [x] 1.2 Implement login/register pages
  - Create storefront/app/[locale]/login/page.tsx
  - Create storefront/app/[locale]/register/page.tsx
  - Add form validation with react-hook-form
  - Implement error handling UI
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 1.3 Write property test for login
  - **Property 2: Login creates session**
  - **Validates: Requirements 1.2**

- [ ]* 1.4 Write property test for invalid credentials
  - **Property 3: Invalid credentials return errors**
  - **Validates: Requirements 1.3**

- [x] 1.5 Implement session persistence
  - Add session restoration on app load
  - Implement token refresh logic
  - Add session expiration handling
  - _Requirements: 1.4, 8.2, 8.3_

- [ ]* 1.6 Write property test for session persistence
  - **Property 4: Session persistence (round-trip)**
  - **Validates: Requirements 1.4**

- [x] 1.7 Implement logout functionality
  - Add logout button to header
  - Clear session data on logout
  - Redirect to home page
  - _Requirements: 1.5, 8.4_

- [ ]* 1.8 Write property test for logout
  - **Property 5: Logout clears session**
  - **Validates: Requirements 1.5, 8.4**

- [x] 1.9 Checkpoint - Ensure all authentication tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: API Integration

- [x] 2. Enhance API client
  - Update storefront/lib/api-client.ts with all endpoints
  - Add request/response interceptors
  - Implement retry logic with exponential backoff
  - Add TypeScript types for all API responses
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2.1 Integrate products API
  - Update product listing page to use real API
  - Update product detail page to use real API
  - Add loading states with skeletons
  - Implement error boundaries
  - _Requirements: 2.1, 2.3, 2.4_

- [x] 2.2 Integrate cart API
  - Update cart context to use real API
  - Implement add to cart functionality
  - Implement update cart item quantity
  - Implement remove from cart
  - _Requirements: 2.2_

- [ ]* 2.3 Write property test for cart operations
  - **Property 6: Cart operations persist**
  - **Validates: Requirements 2.2**

- [ ]* 2.4 Write property test for loading states
  - **Property 7: Loading states during API calls**
  - **Validates: Requirements 2.3, 7.1**

- [x] 2.5 Integrate customer profile API
  - Create profile page at storefront/app/[locale]/profile/page.tsx
  - Fetch and display customer data
  - Implement profile update functionality
  - Add address management
  - _Requirements: 2.5_

- [ ]* 2.6 Write property test for API error handling
  - **Property 8: API errors show messages**
  - **Validates: Requirements 2.4, 7.2**

- [ ]* 2.7 Write property test for form validation
  - **Property 9: Form validation highlights errors**
  - **Validates: Requirements 7.4**

- [x] 2.8 Checkpoint - Ensure all API integration tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - **STATUS**: ✅ COMPLETE - All API integrations working
  - **FIXED**: OpenTelemetry bundling issue resolved
  - **FIXED**: Auth API refactored to use fetch-based client
  - **VERIFIED**: Backend running on port 9000, Storefront on port 3000
  - **NEXT**: Property-based tests (2.3, 2.4, 2.6, 2.7)

## Phase 3: Multi-Currency Support

- [ ] 3. Set up currency infrastructure
  - Create currency table migration
  - Add currency management API endpoints in src/api/admin/currencies/
  - Create currency context provider
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3.1 Implement currency selector
  - Add currency selector to header
  - Store selected currency in localStorage
  - Update all price displays based on selection
  - _Requirements: 3.3_

- [ ]* 3.2 Write property test for currency display
  - **Property 12: Currency selection affects display**
  - **Validates: Requirements 3.3**

- [ ] 3.3 Create admin price manager component
  - Build PriceManager component in admin-dashboard/components/
  - Display prices for all currencies
  - Allow editing prices per currency
  - Add currency conversion helper
  - _Requirements: 3.1, 3.2_

- [ ]* 3.4 Write property test for all currencies displayed
  - **Property 10: All currency prices displayed**
  - **Validates: Requirements 3.1**

- [ ]* 3.5 Write property test for price updates
  - **Property 11: Price update round-trip**
  - **Validates: Requirements 3.2**

- [ ] 3.6 Checkpoint - Ensure all currency tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Image Gallery Management

- [ ] 4. Set up image infrastructure
  - Add image ordering columns to database
  - Create image upload API endpoint in src/api/admin/products/images/
  - Set up image storage (local or S3)
  - Implement image optimization
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 4.1 Create image gallery component
  - Build ImageGallery component in admin-dashboard/components/
  - Display all product images with previews
  - Add drag-and-drop for reordering
  - Implement delete functionality
  - Add set primary image button
  - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [ ]* 4.2 Write property test for image upload
  - **Property 13: Image upload associates with product**
  - **Validates: Requirements 4.1**

- [ ]* 4.3 Write property test for gallery display
  - **Property 14: All images displayed in gallery**
  - **Validates: Requirements 4.2**

- [ ] 4.4 Implement image upload UI
  - Add file input with drag-and-drop
  - Show upload progress
  - Validate file type and size
  - Display upload errors
  - _Requirements: 4.1_

- [ ]* 4.5 Write property test for image reordering
  - **Property 15: Image reordering persists**
  - **Validates: Requirements 4.3**

- [ ]* 4.6 Write property test for image deletion
  - **Property 16: Image deletion removes from product**
  - **Validates: Requirements 4.4**

- [ ]* 4.7 Write property test for primary image
  - **Property 17: Primary image becomes thumbnail**
  - **Validates: Requirements 4.5**

- [ ] 4.8 Checkpoint - Ensure all image gallery tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Product Variants Management

- [ ] 5. Review Medusa variant structure
  - Study Medusa.js variant data model
  - Understand variant options (size, color, etc.)
  - Review existing variant API endpoints
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 5.1 Create variant manager component
  - Build VariantManager component in admin-dashboard/components/
  - Display all product variants in table
  - Add create variant form
  - Implement edit variant functionality
  - Add delete variant with confirmation
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [ ]* 5.2 Write property test for variant creation
  - **Property 18: Variant creation stores options**
  - **Validates: Requirements 5.1**

- [ ]* 5.3 Write property test for variant pricing
  - **Property 19: Variant-specific pricing**
  - **Validates: Requirements 5.2**

- [ ] 5.4 Implement variant inventory management
  - Add inventory quantity input per variant
  - Implement stock level tracking
  - Add low stock warnings
  - _Requirements: 5.3_

- [ ]* 5.5 Write property test for inventory tracking
  - **Property 20: Inventory tracking per variant**
  - **Validates: Requirements 5.3**

- [ ] 5.6 Implement customer variant selection
  - Update product page with variant selector
  - Show price changes on variant selection
  - Display availability per variant
  - Disable out-of-stock variants
  - _Requirements: 5.4_

- [ ]* 5.7 Write property test for variant selection
  - **Property 21: Variant selection shows correct data**
  - **Validates: Requirements 5.4**

- [ ]* 5.8 Write property test for disabled variants
  - **Property 22: Disabled variants hidden from customers**
  - **Validates: Requirements 5.5**

- [ ] 5.9 Checkpoint - Ensure all variant tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: Sales Statistics Dashboard

- [ ] 6. Create statistics API
  - Build statistics endpoints in src/api/admin/statistics/
  - Implement revenue calculation queries
  - Add order aggregation queries
  - Create top products query
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]* 6.1 Write property test for revenue calculation
  - **Property 23: Revenue calculation accuracy**
  - **Validates: Requirements 6.1**

- [ ]* 6.2 Write property test for statistics calculations
  - **Property 24: Statistics calculations correct**
  - **Validates: Requirements 6.2**

- [ ] 6.3 Create statistics dashboard component
  - Build StatisticsDashboard in admin-dashboard/components/
  - Display key metrics (revenue, orders, AOV)
  - Add date range picker
  - Show top products list
  - _Requirements: 6.1, 6.2, 6.4_

- [ ]* 6.4 Write property test for date filtering
  - **Property 25: Date filtering updates statistics**
  - **Validates: Requirements 6.3**

- [ ]* 6.5 Write property test for top products
  - **Property 26: Top products correctly identified**
  - **Validates: Requirements 6.4**

- [ ] 6.6 Add charts and visualizations
  - Integrate chart library (recharts or chart.js)
  - Create revenue over time chart
  - Create orders by status pie chart
  - Add export to CSV functionality
  - _Requirements: 6.5_

- [ ] 6.7 Checkpoint - Ensure all statistics tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: Error Handling & Polish

- [ ] 7. Implement comprehensive error handling
  - Add error boundaries to all major sections
  - Implement toast notifications for success/error
  - Add retry buttons for failed requests
  - Implement offline detection
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ] 7.1 Add loading states everywhere
  - Audit all components for loading states
  - Add skeleton loaders for content
  - Implement progress indicators for uploads
  - _Requirements: 2.3, 7.1_

- [ ] 7.2 Implement success confirmations
  - Add success toasts for all mutations
  - Implement optimistic updates where appropriate
  - Add undo functionality for deletions
  - _Requirements: 7.5_

- [ ] 7.3 Final checkpoint - Full system test
  - Test complete user journey (register → login → browse → cart → checkout)
  - Test complete admin journey (login → manage products → view stats)
  - Verify all error cases are handled
  - Ensure all tests pass, ask the user if questions arise.

## Phase 8: Database Migrations & Deployment

- [ ] 8. Prepare database migrations
  - Create migration for currency support
  - Create migration for image ordering
  - Create migration for variant enhancements
  - Test migrations on development database
  - _Requirements: All_

- [ ] 8.1 Update environment configuration
  - Add new environment variables
  - Update .env.example
  - Document configuration changes
  - _Requirements: All_

- [ ] 8.2 Deployment preparation
  - Run all tests
  - Build production bundle
  - Test production build locally
  - Create deployment checklist
  - _Requirements: All_
