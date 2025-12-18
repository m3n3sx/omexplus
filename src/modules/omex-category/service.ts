import {
  CategoryRepository,
  Category,
  CategoryTree,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilters,
} from "./repository"
import CategoryCacheManager from "./cache"

/**
 * OmexCategoryService
 * Implements the CategoryRepository interface for managing product categories
 * Provides CRUD operations, tree building, and hierarchy management with caching
 */
class OmexCategoryService implements CategoryRepository {
  private cacheManager: CategoryCacheManager

  constructor() {
    // Initialize cache manager with default 60-minute TTL
    this.cacheManager = new CategoryCacheManager(60)
  }

  /**
   * Find all categories matching filters
   */
  async find(
    filters?: CategoryFilters,
    pagination?: { limit: number; offset: number }
  ): Promise<{ categories: Category[]; count: number }> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Find category by ID
   */
  async findById(id: string): Promise<Category | null> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Find category by slug
   */
  async findBySlug(slug: string): Promise<Category | null> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Find all direct children of a parent category
   */
  async findByParentId(parentId: string | null): Promise<Category[]> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Find all categories (no filters)
   */
  async findAll(): Promise<Category[]> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Validate slug format (kebab-case)
   */
  private validateSlugFormat(slug: string): boolean {
    // Kebab-case: lowercase letters, numbers, and hyphens only
    // Must start and end with a letter or number
    const kebabCaseRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return kebabCaseRegex.test(slug)
  }

  /**
   * Create a new category
   */
  async create(data: CreateCategoryInput): Promise<Category> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Update an existing category
   */
  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Delete a category
   */
  async delete(id: string): Promise<void> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Build complete category tree structure
   */
  async buildTree(categories?: Category[]): Promise<CategoryTree[]> {
    const cats = categories || (await this.findAll())
    return this.buildTreeRecursive(cats, null)
  }

  /**
   * Get breadcrumb path for a category
   */
  async getBreadcrumb(categoryId: string): Promise<Category[]> {
    if (!categoryId) {
      throw new Error("Category ID is required")
    }

    const breadcrumb: Category[] = []
    let currentId: string | null = categoryId

    // Traverse up to root (max 20 levels to prevent infinite loop)
    for (let i = 0; i < 20; i++) {
      if (!currentId) break

      const category = await this.findById(currentId)
      if (!category) break

      breadcrumb.unshift(category)
      currentId = category.parent_id || null
    }

    return breadcrumb
  }

  /**
   * Get all descendants of a category (recursive)
   */
  async getDescendants(categoryId: string): Promise<Category[]> {
    if (!categoryId) {
      throw new Error("Category ID is required")
    }

    const descendants: Category[] = []
    const children = await this.findByParentId(categoryId)

    for (const child of children) {
      descendants.push(child)
      const childDescendants = await this.getDescendants(child.id)
      descendants.push(...childDescendants)
    }

    return descendants
  }

  /**
   * Check if slug is unique
   */
  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Check if parent_id would create a circular reference
   */
  async wouldCreateCircularReference(categoryId: string, newParentId: string | null): Promise<boolean> {
    if (!newParentId) {
      return false
    }

    // Check if newParentId is a descendant of categoryId
    // If it is, setting it as parent would create a cycle
    let currentId: string | null = newParentId

    // Traverse up from newParentId to root
    for (let i = 0; i < 20; i++) {
      if (!currentId) break

      if (currentId === categoryId) {
        return true // Found a cycle
      }

      const category = await this.findById(currentId)
      if (!category) break

      currentId = category.parent_id || null
    }

    return false
  }

  /**
   * Private helper to recursively build tree structure
   */
  private async buildTreeRecursive(categories: Category[], parentId: string | null): Promise<CategoryTree[]> {
    const tree: CategoryTree[] = []

    for (const category of categories) {
      if (category.parent_id === parentId) {
        const children = await this.buildTreeRecursive(categories, category.id)
        const treeNode: CategoryTree = {
          ...category,
          children: children.length > 0 ? children : undefined,
        }
        tree.push(treeNode)
      }
    }

    return tree
  }

  /**
   * Get all categories (with caching)
   * Requirement 1.1: Retrieve all categories from the system
   */
  async getAllCategories(): Promise<Category[]> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Get category by slug (with caching)
   * Requirement 1.5: Retrieve category with all subcategories by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Get subcategories of a category (with caching)
   * Requirement 1.3: Retrieve direct subcategories
   */
  async getSubcategories(parentId: string): Promise<Category[]> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Get complete category tree (with caching)
   * Requirement 1.4: Retrieve hierarchical tree structure
   */
  async getCategoryTree(): Promise<CategoryTree[]> {
    throw new Error("Use /store/categories-direct endpoint instead")
  }

  /**
   * Get breadcrumb path for a category (with caching)
   * Requirement 1.5: Retrieve breadcrumb navigation path
   */
  async getBreadcrumbPath(categoryId: string): Promise<Category[]> {
    if (!categoryId) {
      throw new Error("Category ID is required")
    }

    const cacheKey = `breadcrumb_${categoryId}`

    // Check cache first
    const cached = this.cacheManager.get<Category[]>(cacheKey)
    if (cached) {
      return cached
    }

    // Get breadcrumb from storage
    const breadcrumb = await this.getBreadcrumb(categoryId)

    // Cache the result
    this.cacheManager.set(cacheKey, breadcrumb)

    return breadcrumb
  }

  /**
   * Invalidate all category caches
   * Requirement 10.2: Invalidate cache on mutations
   */
  async invalidateCache(): Promise<void> {
    this.cacheManager.invalidateAll()
  }

  /**
   * Invalidate specific cache keys related to a category
   * Requirement 10.2: Invalidate relevant cache entries
   */
  private invalidateCategoryCache(categoryId: string, slug?: string): void {
    // Invalidate all-categories cache
    this.cacheManager.invalidate("all_categories")

    // Invalidate tree cache
    this.cacheManager.invalidate("category_tree")

    // Invalidate category-specific caches
    this.cacheManager.invalidate(`category_id_${categoryId}`)
    if (slug) {
      this.cacheManager.invalidate(`category_slug_${slug}`)
    }

    // Invalidate breadcrumb cache
    this.cacheManager.invalidate(`breadcrumb_${categoryId}`)

    // Invalidate parent's subcategories cache if parent exists
    // This will be handled by the caller if needed
  }

  /**
   * Rebuild cache from storage
   * Requirement 10.1: Rebuild cache on startup
   */
  async rebuildCache(): Promise<void> {
    this.cacheManager.invalidateAll()
  }

  /**
   * Get cache manager for testing/monitoring
   */
  getCacheManager(): CategoryCacheManager {
    return this.cacheManager
  }
}

export default OmexCategoryService
