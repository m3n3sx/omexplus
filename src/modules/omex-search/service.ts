import { MedusaService } from "@medusajs/framework/utils"

interface SearchFilters {
  category_id?: string
  min_price?: number
  max_price?: number
  brand?: string[]
  equipment_type?: string[]
  in_stock?: boolean
}

interface SortOptions {
  field: 'price' | 'created_at' | 'popularity' | 'name'
  order: 'asc' | 'desc'
}

interface SearchResult {
  products: any[]
  total: number
  page: number
  limit: number
  filters_applied: SearchFilters
}

class OmexSearchService extends MedusaService({}) {
  private readonly DEFAULT_LIMIT = 12
  private readonly MAX_LIMIT = 100

  async search(
    query: string,
    filters: SearchFilters = {},
    sort: SortOptions = { field: 'popularity', order: 'desc' },
    pagination: { page?: number; limit?: number } = {}
  ): Promise<SearchResult> {
    
    if (!query || query.trim().length === 0) {
      throw new Error("Search query is required")
    }

    const page = pagination.page || 1
    const limit = Math.min(pagination.limit || this.DEFAULT_LIMIT, this.MAX_LIMIT)
    const offset = (page - 1) * limit

    // In real implementation:
    // 1. Build full-text search query across:
    //    - product.title
    //    - product.description
    //    - product.sku
    //    - product.part_number
    //    - product_translation.title
    //    - product_translation.description
    // 2. Apply filters
    // 3. Apply sorting
    // 4. Apply pagination
    // 5. Include product relations (categories, images, etc.)

    const searchQuery = this.buildSearchQuery(query, filters, sort)

    return {
      products: [],
      total: 0,
      page,
      limit,
      filters_applied: filters,
    }
  }

  async filterProducts(filters: SearchFilters, pagination: { page?: number; limit?: number } = {}) {
    const page = pagination.page || 1
    const limit = Math.min(pagination.limit || this.DEFAULT_LIMIT, this.MAX_LIMIT)
    const offset = (page - 1) * limit

    // Build filter query
    const conditions: string[] = []

    if (filters.category_id) {
      // Include products from category and all subcategories
      conditions.push(`category_id IN (${await this.getCategoryAndDescendants(filters.category_id)})`)
    }

    if (filters.min_price !== undefined) {
      conditions.push(`price >= ${filters.min_price}`)
    }

    if (filters.max_price !== undefined) {
      conditions.push(`price <= ${filters.max_price}`)
    }

    if (filters.brand && filters.brand.length > 0) {
      conditions.push(`brand IN (${filters.brand.map(b => `'${b}'`).join(',')})`)
    }

    if (filters.equipment_type && filters.equipment_type.length > 0) {
      conditions.push(`equipment_type IN (${filters.equipment_type.map(e => `'${e}'`).join(',')})`)
    }

    if (filters.in_stock) {
      // Check inventory table for available stock
      conditions.push(`EXISTS (SELECT 1 FROM inventory WHERE product_id = product.id AND (quantity - reserved) > 0)`)
    }

    return {
      products: [],
      total: 0,
      page,
      limit,
      filters_applied: filters,
    }
  }

  async sortProducts(products: any[], sort: SortOptions) {
    const { field, order } = sort

    return products.sort((a, b) => {
      let comparison = 0

      switch (field) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'popularity':
          // In real implementation, use sales count or view count
          comparison = (a.sales_count || 0) - (b.sales_count || 0)
          break
        case 'name':
          comparison = a.title.localeCompare(b.title)
          break
      }

      return order === 'asc' ? comparison : -comparison
    })
  }

  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query || query.trim().length < 2) {
      return []
    }

    // In real implementation:
    // 1. Search for products matching query
    // 2. Extract unique titles/names
    // 3. Return top N suggestions

    return []
  }

  async getPopularSearches(limit: number = 10): Promise<string[]> {
    // In real implementation:
    // 1. Track search queries in database
    // 2. Return most frequent searches

    return []
  }

  async trackSearch(query: string, resultsCount: number, userId?: string) {
    // Track search for analytics
    return {
      query,
      results_count: resultsCount,
      user_id: userId,
      searched_at: new Date(),
    }
  }

  private buildSearchQuery(query: string, filters: SearchFilters, sort: SortOptions): string {
    // Build PostgreSQL full-text search query
    // Using ts_vector and ts_query for better performance

    const searchTerms = query.trim().split(/\s+/).join(' & ')
    
    let sql = `
      SELECT DISTINCT p.*,
        ts_rank(
          to_tsvector('english', 
            COALESCE(p.title, '') || ' ' || 
            COALESCE(p.description, '') || ' ' ||
            COALESCE(p.sku, '') || ' ' ||
            COALESCE(p.part_number, '')
          ),
          to_tsquery('english', '${searchTerms}')
        ) as rank
      FROM product p
      WHERE to_tsvector('english', 
        COALESCE(p.title, '') || ' ' || 
        COALESCE(p.description, '') || ' ' ||
        COALESCE(p.sku, '') || ' ' ||
        COALESCE(p.part_number, '')
      ) @@ to_tsquery('english', '${searchTerms}')
    `

    // Add filters
    if (filters.category_id) {
      sql += ` AND p.category_id = '${filters.category_id}'`
    }

    if (filters.min_price !== undefined) {
      sql += ` AND p.price >= ${filters.min_price}`
    }

    if (filters.max_price !== undefined) {
      sql += ` AND p.price <= ${filters.max_price}`
    }

    // Add sorting
    sql += ` ORDER BY ${sort.field === 'popularity' ? 'rank' : sort.field} ${sort.order}`

    return sql
  }

  private async getCategoryAndDescendants(categoryId: string): Promise<string> {
    // In real implementation, recursively get all descendant category IDs
    // Return as comma-separated string for SQL IN clause
    return `'${categoryId}'`
  }
}

export default OmexSearchService
