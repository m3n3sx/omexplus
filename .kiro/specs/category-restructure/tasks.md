# Implementation Plan: Category & Subcategory Restructure

## Overview

This implementation plan converts the feature design into a series of incremental coding tasks. Each task builds on previous ones, with no orphaned code. The plan focuses on backend implementation first, followed by frontend integration, and concludes with testing and validation.

---

## Phase 1: Database & Backend Infrastructure

- [x] 1. Create database migration for categories table
  - Create migration file: `src/migrations/[timestamp]-create-categories-table.ts`
  - Define categories table schema with id, name, slug, parent_id, metadata, timestamps
  - Add indexes on slug, parent_id, priority columns
  - Create category_translations table for i18n support
  - _Requirements: 4.1, 4.5_

- [x] 2. Create Category entity and repository
  - Define Category TypeORM entity in `src/models/category.ts`
  - Implement CategoryRepository interface with CRUD operations
  - Add query methods: findBySlug, findByParentId, findAll
  - Implement tree-building logic in repository
  - _Requirements: 1.1, 1.3, 4.2_

- [ ]* 2.1 Write property test for category repository
  - **Feature: category-restructure, Property 2: Unique Slugs**
  - **Validates: Requirements 1.2**

- [x] 3. Implement Category Service with caching
  - Create CategoryService in `src/modules/omex-category/service.ts`
  - Implement getAllCategories, getCategoryBySlug, getSubcategories methods
  - Add getCategoryTree method for hierarchical retrieval
  - Implement getBreadcrumb method for navigation paths
  - Add cache manager integration
  - _Requirements: 1.1, 1.4, 1.5, 10.1_

- [ ]* 3.1 Write property test for category service
  - **Feature: category-restructure, Property 3: Parent-Child Relationships Preserved**
  - **Validates: Requirements 1.3**

- [ ]* 3.2 Write property test for tree structure integrity
  - **Feature: category-restructure, Property 4: Tree Structure Integrity**
  - **Validates: Requirements 1.4**

- [x] 4. Implement Category Cache Manager
  - Create CacheManager in `src/modules/omex-category/cache.ts`
  - Implement in-memory cache with get, set, invalidate methods
  - Add cache rebuild logic for application startup
  - Implement TTL-based expiration (1 hour default)
  - _Requirements: 10.1, 10.2, 10.3, 10.5_

- [ ]* 4.1 Write property test for cache invalidation
  - **Feature: category-restructure, Property 23: Cache Invalidation on Update**
  - **Validates: Requirements 10.2**

- [ ]* 4.2 Write property test for cache hit behavior
  - **Feature: category-restructure, Property 24: Cache Hit for Repeated Requests**
  - **Validates: Requirements 10.4**

---

## Phase 2: API Endpoints

- [x] 5. Create GET /api/categories endpoint
  - Create route handler in `src/api/store/categories/route.ts`
  - Return all top-level categories (parent_id is null)
  - Include metadata and subcategory count
  - Add response caching headers
  - _Requirements: 5.1_

- [ ]* 5.1 Write property test for top-level categories endpoint
  - **Feature: category-restructure, Property 14: API Endpoint Returns Top-Level Categories**
  - **Validates: Requirements 5.1**

- [x] 6. Create GET /api/categories/:slug endpoint
  - Create route handler for dynamic slug parameter
  - Return category with all direct subcategories
  - Include breadcrumb information
  - Handle 404 for non-existent categories
  - _Requirements: 5.2, 1.5_

- [ ]* 6.1 Write property test for category with subcategories endpoint
  - **Feature: category-restructure, Property 15: API Endpoint Returns Category with Subcategories**
  - **Validates: Requirements 5.2**

- [x] 7. Create GET /api/categories/:slug/subcategories endpoint
  - Return only direct subcategories (not grandchildren)
  - Support pagination for large result sets
  - Include priority ordering
  - _Requirements: 5.3_

- [ ]* 7.1 Write property test for direct subcategories endpoint
  - **Feature: category-restructure, Property 16: API Endpoint Returns Only Direct Subcategories**
  - **Validates: Requirements 5.3**

- [x] 8. Create GET /api/categories/tree endpoint
  - Return complete category hierarchy as nested tree structure
  - Include all levels of nesting
  - Ensure no missing relationships
  - _Requirements: 5.4_

- [ ]* 8.1 Write property test for tree endpoint
  - **Feature: category-restructure, Property 17: API Tree Endpoint Returns Nested Structure**
  - **Validates: Requirements 5.4**

- [x] 9. Create GET /api/categories/:slug/breadcrumb endpoint
  - Return full path from root to specified category
  - Include all parent categories in order
  - Format for breadcrumb navigation display
  - _Requirements: 5.5_

- [ ]* 9.1 Write property test for breadcrumb endpoint
  - **Feature: category-restructure, Property 18: API Breadcrumb Endpoint Returns Correct Path**
  - **Validates: Requirements 5.5**

- [x] 10. Create POST /api/admin/categories endpoint
  - Accept category creation data (name, slug, parent_id, description)
  - Validate slug format (kebab-case)
  - Prevent circular references
  - Invalidate cache on creation
  - _Requirements: 4.2, 1.2_

- [ ]* 10.1 Write property test for category creation
  - **Feature: category-restructure, Property 12: Database Persistence Round Trip**
  - **Validates: Requirements 4.2**

- [x] 11. Create PUT /api/admin/categories/:id endpoint
  - Allow updating category fields (name, slug, description, parent_id)
  - Validate slug uniqueness
  - Prevent circular references
  - Invalidate cache on update
  - _Requirements: 4.3_

- [ ]* 11.1 Write property test for category update
  - **Feature: category-restructure, Property 13: Category Update Persistence**
  - **Validates: Requirements 4.3**

- [x] 12. Create DELETE /api/admin/categories/:id endpoint
  - Remove category from database
  - Handle orphaned subcategories (set parent_id to null)
  - Invalidate cache on deletion
  - _Requirements: 4.4_

---

## Phase 3: Database Seeding

- [x] 13. Create comprehensive category seed script
  - Create seed file: `src/seeds/categories-complete-seed.ts`
  - Define all 13 main categories with metadata
  - Define all subcategories with parent relationships
  - Define all sub-subcategories with multi-level nesting
  - Implement seed execution logic
  - _Requirements: 8.1, 8.2, 8.3_

- [ ]* 13.1 Write property test for seed script
  - **Feature: category-restructure, Property 21: Seed Script Creates All Main Categories**
  - **Validates: Requirements 8.1**

- [ ]* 13.2 Write property test for seed idempotence
  - **Feature: category-restructure, Property 22: Seed Script Idempotence**
  - **Validates: Requirements 8.5**

- [x] 14. Create seed execution command
  - Add npm script: `npm run seed:categories`
  - Implement seed runner in `src/scripts/seed-categories.ts`
  - Add error handling and logging
  - Verify data integrity after seeding
  - _Requirements: 8.4_

- [ ] 15. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 4: Frontend Components

- [x] 16. Create CategoryNavigation component
  - Create component: `storefront/components/layout/CategoryNavigation.tsx`
  - Fetch top-level categories from API on mount
  - Display categories in header navigation
  - Implement mega-menu on hover showing subcategories
  - Add loading and error states
  - _Requirements: 6.1, 6.2_

- [ ]* 16.1 Write property test for category navigation
  - **Feature: category-restructure, Property 19: Header Component Fetches Categories**
  - **Validates: Requirements 6.1**

- [x] 17. Create CategoryBreadcrumb component
  - Create component: `storefront/components/navigation/CategoryBreadcrumb.tsx`
  - Fetch breadcrumb data from API based on current slug
  - Display breadcrumb path with clickable links
  - Handle navigation on breadcrumb click
  - _Requirements: 6.4_

- [x] 18. Create CategoryFilter component
  - Create component: `storefront/components/filters/CategoryFilter.tsx`
  - Display category hierarchy as filter options
  - Support single and multi-select modes
  - Update URL parameters on filter change
  - Emit filter change events to parent
  - _Requirements: 7.2, 7.4_

- [ ]* 18.1 Write property test for category filter
  - **Feature: category-restructure, Property 20: Category Filter Updates Product List**
  - **Validates: Requirements 7.1-7.2**

- [x] 19. Update Header component to use CategoryNavigation
  - Import CategoryNavigation component
  - Replace hardcoded categories with dynamic component
  - Maintain existing styling and layout
  - Test mega-menu functionality
  - _Requirements: 6.1, 6.2_

- [x] 20. Create CategoryPage component
  - Create page: `storefront/app/[locale]/categories/[slug]/page.tsx`
  - Fetch category data from API using slug
  - Display category name, description, and breadcrumb
  - Show subcategories as grid or list
  - Display products filtered by category
  - _Requirements: 6.3, 6.5, 7.1_

- [x] 21. Update product listing to support category filtering
  - Modify product query to accept category filter
  - Implement category-based product filtering
  - Support multi-category filtering (OR logic)
  - Update URL parameters on filter change
  - _Requirements: 7.1, 7.2, 7.3_

- [ ]* 21.1 Write property test for product filtering
  - **Feature: category-restructure, Property 20: Category Filter Updates Product List**
  - **Validates: Requirements 7.1-7.2**

- [ ] 22. Checkpoint - Ensure all frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 5: Admin Interface

- [x] 23. Create admin category management page
  - Create page: `storefront/app/admin/categories/page.tsx`
  - Display all categories in hierarchical tree view
  - Show category count and metadata
  - Add loading and error states
  - _Requirements: 9.1_

- [x] 24. Create category form component
  - Create component: `storefront/components/admin/CategoryForm.tsx`
  - Implement form fields: name, slug, description, parent category
  - Add slug auto-generation from name
  - Validate slug format (kebab-case)
  - Implement parent category dropdown with hierarchy
  - _Requirements: 9.2, 9.3_

- [x] 25. Implement add category functionality
  - Create modal/page for adding new category
  - Use CategoryForm component
  - Call POST /api/admin/categories endpoint
  - Show success/error messages
  - Refresh category list on success
  - _Requirements: 9.2_

- [x] 26. Implement edit category functionality
  - Create modal/page for editing category
  - Pre-populate form with existing data
  - Call PUT /api/admin/categories/:id endpoint
  - Prevent circular reference selection
  - Show success/error messages
  - _Requirements: 9.3, 9.5_

- [x] 27. Implement delete category functionality
  - Add delete button to category tree
  - Show confirmation dialog before deletion
  - Call DELETE /api/admin/categories/:id endpoint
  - Handle orphaned subcategories
  - Show success/error messages
  - _Requirements: 9.4, 9.5_

- [ ] 28. Checkpoint - Ensure all admin tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 6: Integration & Validation

- [x] 29. Update Header component to use new CategoryNavigation
  - Replace hardcoded categories array with dynamic component
  - Test mega-menu with real category data
  - Verify all links work correctly
  - Test responsive behavior on mobile
  - _Requirements: 6.1, 6.2_

- [ ] 30. Test category navigation end-to-end
  - Navigate through categories in header
  - Click on subcategories and verify page loads
  - Verify breadcrumb displays correctly
  - Test on multiple devices/screen sizes
  - _Requirements: 6.3, 6.4, 6.5_

- [ ] 31. Test product filtering by category
  - Visit category page
  - Apply category filters
  - Verify product list updates
  - Test multi-category filtering
  - Verify URL parameters update
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 32. Test admin category management
  - Create new category via admin interface
  - Edit existing category
  - Delete category and verify orphaned handling
  - Verify cache invalidation works
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 33. Verify database integrity
  - Run seed script and verify all categories created
  - Check for duplicate categories
  - Verify all parent-child relationships
  - Check for orphaned records
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 34. Performance testing
  - Measure API response times for category endpoints
  - Verify cache hit rates
  - Test with large category hierarchies
  - Monitor database query performance
  - _Requirements: 10.1, 10.4_

- [ ] 35. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- All API endpoints should include proper error handling and validation
- All frontend components should support i18n (next-intl)
- All database operations should use transactions where appropriate
- Cache should be invalidated on any category mutation
- Tests should run with minimum 100 iterations for property-based tests
- Code should follow existing project conventions and patterns

