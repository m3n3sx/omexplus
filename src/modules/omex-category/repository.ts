/**
 * Category Repository Interface
 * Defines all data access operations for categories
 */

export interface CategoryFilters {
  parent_id?: string | null
  slug?: string
  q?: string // search query
}

export interface CreateCategoryInput {
  name: string
  name_en?: string
  slug: string
  description?: string
  icon?: string
  priority?: number
  parent_id?: string | null
  metadata?: Record<string, any>
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export interface Category {
  id: string
  name: string
  name_en?: string
  slug: string
  description?: string
  icon?: string
  priority: number
  parent_id?: string | null
  metadata?: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface CategoryTree extends Category {
  children?: CategoryTree[]
}

export interface CategoryRepository {
  /**
   * Find all categories matching filters
   */
  find(filters?: CategoryFilters, pagination?: { limit: number; offset: number }): Promise<{ categories: Category[]; count: number }>

  /**
   * Find category by ID
   */
  findById(id: string): Promise<Category | null>

  /**
   * Find category by slug
   */
  findBySlug(slug: string): Promise<Category | null>

  /**
   * Find all direct children of a parent category
   */
  findByParentId(parentId: string | null): Promise<Category[]>

  /**
   * Find all categories (no filters)
   */
  findAll(): Promise<Category[]>

  /**
   * Create a new category
   */
  create(data: CreateCategoryInput): Promise<Category>

  /**
   * Update an existing category
   */
  update(id: string, data: UpdateCategoryInput): Promise<Category>

  /**
   * Delete a category
   */
  delete(id: string): Promise<void>

  /**
   * Build complete category tree structure
   */
  buildTree(categories?: Category[]): Promise<CategoryTree[]>

  /**
   * Get breadcrumb path for a category
   */
  getBreadcrumb(categoryId: string): Promise<Category[]>

  /**
   * Get all descendants of a category (recursive)
   */
  getDescendants(categoryId: string): Promise<Category[]>

  /**
   * Check if slug is unique
   */
  isSlugUnique(slug: string, excludeId?: string): Promise<boolean>

  /**
   * Check if parent_id would create a circular reference
   */
  wouldCreateCircularReference(categoryId: string, newParentId: string | null): Promise<boolean>
}
