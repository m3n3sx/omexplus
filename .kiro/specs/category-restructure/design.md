# Design Document: Category & Subcategory Restructure

## Overview

This design document outlines the implementation of a comprehensive category restructuring system for the OMEX e-commerce platform. The system will support a 13-category hierarchy with up to 15 subcategories each, and multi-level nesting for complex product areas. The implementation spans both backend (Medusa.js) and frontend (Next.js) components, with a focus on performance, maintainability, and user experience.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│  • Header Navigation Component                              │
│  • Category Page Component                                  │
│  • Product Filter Component                                 │
│  • Admin Category Management UI                             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────────┐
│                  API Layer (Medusa.js)                       │
├─────────────────────────────────────────────────────────────┤
│  • GET /api/categories                                      │
│  • GET /api/categories/:slug                                │
│  • GET /api/categories/:slug/subcategories                  │
│  • GET /api/categories/tree                                 │
│  • GET /api/categories/:slug/breadcrumb                     │
│  • POST/PUT/DELETE /api/admin/categories                    │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL
┌────────────────────▼────────────────────────────────────────┐
│              Database Layer (PostgreSQL)                     │
├─────────────────────────────────────────────────────────────┤
│  • categories table (id, name, slug, parent_id, metadata)   │
│  • category_translations table (for i18n)                   │
│  • Indexes on slug, parent_id for performance               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Initialization**: Application loads categories from database into memory cache
2. **Frontend Request**: User navigates to category or searches
3. **API Call**: Frontend calls `/api/categories/:slug` endpoint
4. **Cache Lookup**: Backend checks in-memory cache first
5. **Database Query**: If not cached, query database with parent-child relationships
6. **Response**: Return category with subcategories as JSON
7. **Frontend Render**: Display categories in navigation, filters, or breadcrumbs

## Components and Interfaces

### Backend Components

#### 1. Category Service (`src/modules/omex-category/service.ts`)

```typescript
interface CategoryService {
  // Query operations
  getAllCategories(): Promise<Category[]>
  getCategoryBySlug(slug: string): Promise<Category | null>
  getSubcategories(parentId: string): Promise<Category[]>
  getCategoryTree(): Promise<CategoryTree>
  getBreadcrumb(categoryId: string): Promise<Category[]>
  
  // Mutation operations
  createCategory(data: CreateCategoryInput): Promise<Category>
  updateCategory(id: string, data: UpdateCategoryInput): Promise<Category>
  deleteCategory(id: string): Promise<void>
  
  // Cache operations
  invalidateCache(): Promise<void>
  rebuildCache(): Promise<void>
}
```

#### 2. Category Repository

```typescript
interface CategoryRepository {
  find(filters?: CategoryFilters): Promise<Category[]>
  findById(id: string): Promise<Category | null>
  findBySlug(slug: string): Promise<Category | null>
  findByParentId(parentId: string): Promise<Category[]>
  create(data: CreateCategoryInput): Promise<Category>
  update(id: string, data: UpdateCategoryInput): Promise<Category>
  delete(id: string): Promise<void>
}
```

#### 3. Category Cache Manager

```typescript
interface CategoryCacheManager {
  get(key: string): Category[] | null
  set(key: string, value: Category[]): void
  invalidate(key: string): void
  invalidateAll(): void
  rebuild(): Promise<void>
}
```

### Frontend Components

#### 1. CategoryNavigation Component

```typescript
interface CategoryNavigationProps {
  categories: Category[]
  onCategorySelect: (category: Category) => void
  isLoading?: boolean
}

export function CategoryNavigation(props: CategoryNavigationProps) {
  // Displays top-level categories with mega-menu on hover
  // Shows subcategories in dropdown
}
```

#### 2. CategoryBreadcrumb Component

```typescript
interface CategoryBreadcrumbProps {
  categorySlug: string
  onNavigate: (slug: string) => void
}

export function CategoryBreadcrumb(props: CategoryBreadcrumbProps) {
  // Displays breadcrumb path from root to current category
}
```

#### 3. CategoryFilter Component

```typescript
interface CategoryFilterProps {
  categories: Category[]
  selectedCategories: string[]
  onFilterChange: (categories: string[]) => void
  multiSelect?: boolean
}

export function CategoryFilter(props: CategoryFilterProps) {
  // Displays category filter with checkboxes or radio buttons
}
```

### API Endpoints

#### GET /api/categories
Returns all top-level categories with metadata.

**Response:**
```json
{
  "categories": [
    {
      "id": "cat-filtry",
      "name": "Filtry",
      "slug": "filtry",
      "description": "Wszystkie typy filtrów",
      "priority": 1,
      "subcategoryCount": 7
    }
  ]
}
```

#### GET /api/categories/:slug
Returns a specific category with all its subcategories.

**Response:**
```json
{
  "id": "cat-filtry",
  "name": "Filtry",
  "slug": "filtry",
  "description": "Wszystkie typy filtrów",
  "priority": 1,
  "subcategories": [
    {
      "id": "cat-filtry-powietrza",
      "name": "Filtry powietrza",
      "slug": "filtry/filtry-powietrza",
      "priority": 1
    }
  ]
}
```

#### GET /api/categories/:slug/subcategories
Returns only direct subcategories of a category.

#### GET /api/categories/tree
Returns complete category hierarchy as nested tree structure.

#### GET /api/categories/:slug/breadcrumb
Returns breadcrumb path from root to specified category.

## Data Models

### Category Entity

```typescript
interface Category {
  id: string
  name: string
  name_en?: string
  slug: string
  description?: string
  icon?: string
  priority: number
  parentId?: string
  metadata?: {
    productCount?: number
    salesPercentage?: number
    topPriority?: boolean
  }
  createdAt: Date
  updatedAt: Date
}
```

### Category Hierarchy

```typescript
interface CategoryTree {
  id: string
  name: string
  slug: string
  children: CategoryTree[]
}
```

### Database Schema

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  priority INTEGER DEFAULT 0,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_priority ON categories(priority);
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Exactly 13 Main Categories
*For any* initialized system, the count of categories with no parent should equal exactly 13.
**Validates: Requirements 1.1**

### Property 2: Unique Slugs
*For any* set of categories, all slugs should be unique and no two categories should share the same slug.
**Validates: Requirements 1.2**

### Property 3: Parent-Child Relationships Preserved
*For any* subcategory, querying the system should return the parent category when following the parent_id reference.
**Validates: Requirements 1.3**

### Property 4: Tree Structure Integrity
*For any* category tree, there should be no cycles (a category should never be its own ancestor) and all parent references should be valid.
**Validates: Requirements 1.4**

### Property 5: Complete Subcategory Retrieval
*For any* category retrieved by slug, all direct subcategories should be included in the response.
**Validates: Requirements 1.5**

### Property 6: Filtry Category Subcategories
*For any* system with seeded data, the Filtry category should have exactly 7 subcategories with the correct names.
**Validates: Requirements 2.1**

### Property 7: Silnik Części Category Subcategories
*For any* system with seeded data, the Silnik Części & Osprzęt Silnika category should have at least 20 subcategories.
**Validates: Requirements 2.2**

### Property 8: Układ Hamulcowy Category Subcategories
*For any* system with seeded data, the Układ Hamulcowy category should have exactly 8 subcategories.
**Validates: Requirements 2.3**

### Property 9: Podwozia Category Subcategories
*For any* system with seeded data, the Podwozia do Maszyn Budowlanych category should have exactly 14 subcategories.
**Validates: Requirements 2.4**

### Property 10: Układ Hydrauliczny Category Subcategories
*For any* system with seeded data, the Układ Hydrauliczny category should have exactly 14 subcategories.
**Validates: Requirements 2.5**

### Property 11: Multi-Level Hierarchy Preservation
*For any* sub-subcategory, the full path from root to that category should be retrievable and correct.
**Validates: Requirements 3.1-3.11**

### Property 12: Database Persistence Round Trip
*For any* category created via API, querying the database should return the same category with all fields intact.
**Validates: Requirements 4.2**

### Property 13: Category Update Persistence
*For any* category updated via API, subsequent queries should return the updated values.
**Validates: Requirements 4.3**

### Property 14: API Endpoint Returns Top-Level Categories
*For any* GET request to /api/categories, the response should contain only categories with no parent.
**Validates: Requirements 5.1**

### Property 15: API Endpoint Returns Category with Subcategories
*For any* GET request to /api/categories/:slug with a valid slug, the response should include all direct subcategories.
**Validates: Requirements 5.2**

### Property 16: API Endpoint Returns Only Direct Subcategories
*For any* GET request to /api/categories/:slug/subcategories, the response should contain only direct children, not grandchildren.
**Validates: Requirements 5.3**

### Property 17: API Tree Endpoint Returns Nested Structure
*For any* GET request to /api/categories/tree, the response should be a properly nested tree with no missing relationships.
**Validates: Requirements 5.4**

### Property 18: API Breadcrumb Endpoint Returns Correct Path
*For any* GET request to /api/categories/:slug/breadcrumb, the response should contain the complete path from root to the category.
**Validates: Requirements 5.5**

### Property 19: Header Component Fetches Categories
*For any* rendered header component, it should make an API call to fetch top-level categories on mount.
**Validates: Requirements 6.1**

### Property 20: Category Filter Updates Product List
*For any* category filter selection, the product list should update to show only products in selected categories.
**Validates: Requirements 7.1-7.2**

### Property 21: Seed Script Creates All Main Categories
*For any* execution of the seed script, exactly 13 main categories should be created in the database.
**Validates: Requirements 8.1**

### Property 22: Seed Script Idempotence
*For any* seed script run, running it multiple times should not create duplicate categories.
**Validates: Requirements 8.5**

### Property 23: Cache Invalidation on Update
*For any* category update, the cache should be invalidated so subsequent queries return fresh data.
**Validates: Requirements 10.2**

### Property 24: Cache Hit for Repeated Requests
*For any* repeated requests for the same category, the second request should be served from cache without a database query.
**Validates: Requirements 10.4**

## Error Handling

### Category Not Found
- **Scenario**: User requests a category that doesn't exist
- **Response**: Return 404 with message "Category not found"
- **Frontend**: Display "Category not found" message and link to home

### Invalid Slug Format
- **Scenario**: Admin creates category with invalid slug
- **Response**: Return 400 with message "Slug must be in kebab-case format"
- **Frontend**: Show validation error in form

### Circular Reference
- **Scenario**: Admin tries to set a category as its own parent
- **Response**: Return 400 with message "Cannot set category as its own parent"
- **Frontend**: Prevent selection in dropdown

### Orphaned Categories
- **Scenario**: Parent category is deleted
- **Response**: Set parent_id to NULL for child categories
- **Frontend**: Display orphaned categories at root level

### Database Connection Error
- **Scenario**: Database is unavailable
- **Response**: Return 503 with message "Service temporarily unavailable"
- **Frontend**: Show error message and retry button

## Testing Strategy

### Unit Testing

Unit tests verify specific examples and edge cases:

- Test category creation with valid data
- Test category creation with invalid slug format
- Test category retrieval by slug
- Test subcategory retrieval
- Test category update with partial data
- Test category deletion
- Test circular reference prevention
- Test cache invalidation

### Property-Based Testing

Property-based tests verify universal properties that should hold across all inputs:

- **Property 1**: Exactly 13 main categories after initialization
- **Property 2**: All slugs are unique
- **Property 3**: Parent-child relationships are preserved
- **Property 4**: Tree structure has no cycles
- **Property 5**: Complete subcategory retrieval
- **Property 6-10**: Specific category subcategory counts
- **Property 11**: Multi-level hierarchy preservation
- **Property 12-18**: API endpoint correctness
- **Property 19-24**: Frontend and caching behavior

### Testing Framework

- **Backend**: Jest with TypeORM test utilities
- **Frontend**: Vitest with React Testing Library
- **Property-Based Testing**: fast-check for JavaScript/TypeScript
- **Minimum iterations**: 100 per property test

### Test Configuration

```typescript
// Example property test structure
import fc from 'fast-check'

describe('Category Properties', () => {
  test('Property 1: Exactly 13 main categories', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(undefined),
        async () => {
          const categories = await categoryService.getAllCategories()
          const mainCategories = categories.filter(c => !c.parentId)
          expect(mainCategories).toHaveLength(13)
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

## Performance Considerations

### Caching Strategy
- In-memory cache for category tree (rebuilt on startup)
- Cache invalidation on category mutations
- TTL-based cache expiration (1 hour default)

### Database Optimization
- Indexes on `slug`, `parent_id`, `priority`
- Eager loading of subcategories to reduce N+1 queries
- Pagination for large result sets

### Frontend Optimization
- Lazy load subcategories in mega-menu
- Memoize category components to prevent re-renders
- Use React Query for client-side caching

## Deployment Considerations

### Database Migrations
- Create categories table with proper indexes
- Add category_translations table for i18n
- Seed initial category data

### Backward Compatibility
- Maintain existing category API endpoints
- Gradual migration from old to new structure
- Feature flags for new category UI

### Monitoring
- Track API response times for category endpoints
- Monitor cache hit rates
- Alert on database query performance degradation

