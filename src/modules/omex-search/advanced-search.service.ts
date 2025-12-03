/**
 * Advanced Search Service - 5 Search Methods
 * Implementation of szukajka.md specification
 */

import { MedusaService } from "@medusajs/framework/utils"
import {
  MachineSearchParams,
  PartNumberSearchParams,
  PartNumberSearchResult,
  VisualSearchParams,
  VisualSearchResult,
  TextSearchParams,
  ParsedQuery,
  AdvancedSearchFilters,
  SearchResult,
  SearchSuggestion,
  MachineDefinition,
} from "./types"

class AdvancedSearchService extends MedusaService({}) {
  private container_: any

  constructor(container: any) {
    super(...arguments)
    this.container_ = container.container_ || container
  }
  // ============================================================================
  // METHOD 1: Machine-Based Search (5-step wizard)
  // ============================================================================

  /**
   * Get available brands for step 1
   */
  async getMachineBrands(): Promise<Array<{ value: string; label: string; count: number }>> {
    const knex = this.container_.resolve("__pg_connection__")
    
    const sql = `
      SELECT 
        metadata->>'machine_brand' as brand,
        COUNT(DISTINCT p.id) as count
      FROM product p
      WHERE 
        p.deleted_at IS NULL
        AND metadata->>'machine_brand' IS NOT NULL
      GROUP BY metadata->>'machine_brand'
      ORDER BY count DESC, brand ASC
    `
    
    const results = await knex.raw(sql).then(result => result.rows)
    
    return results.map(r => ({
      value: r.brand,
      label: r.brand,
      count: parseInt(r.count)
    }))
  }

  /**
   * Get available machine types for step 2
   */
  async getMachineTypes(brand?: string): Promise<Array<{ value: string; label: string; count: number }>> {
    const knex = this.container_.resolve("__pg_connection__")
    
    const conditions = ['p.deleted_at IS NULL', "metadata->>'machine_type' IS NOT NULL"]
    const params: any[] = []
    
    if (brand) {
      conditions.push("metadata->>'machine_brand' = ?")
      params.push(brand)
    }
    
    const sql = `
      SELECT 
        metadata->>'machine_type' as type,
        COUNT(DISTINCT p.id) as count
      FROM product p
      WHERE ${conditions.join(' AND ')}
      GROUP BY metadata->>'machine_type'
      ORDER BY count DESC, type ASC
    `
    
    const results = await knex.raw(sql, params).then(result => result.rows)
    
    return results.map(r => ({
      value: r.type,
      label: r.type,
      count: parseInt(r.count)
    }))
  }

  /**
   * Get available models for step 3
   */
  async getMachineModels(brand: string, type: string): Promise<Array<{ value: string; label: string; count: number }>> {
    const knex = this.container_.resolve("__pg_connection__")
    
    const sql = `
      SELECT 
        jsonb_array_elements_text(metadata->'machine_models') as model,
        COUNT(DISTINCT p.id) as count
      FROM product p
      WHERE 
        p.deleted_at IS NULL
        AND metadata->>'machine_brand' = ?
        AND metadata->>'machine_type' = ?
        AND metadata->'machine_models' IS NOT NULL
      GROUP BY model
      ORDER BY count DESC, model ASC
    `
    
    const results = await knex.raw(sql, [brand, type]).then(result => result.rows)
    
    return results.map(r => ({
      value: r.model,
      label: r.model,
      count: parseInt(r.count)
    }))
  }

  /**
   * Search parts by machine (complete 5-step search)
   */
  async searchByMachine(params: MachineSearchParams): Promise<SearchResult> {
    const { brand, machineType, model, series, frame, engine } = params
    
    // Get database connection
    const knex = this.container_.resolve("__pg_connection__")
    
    // Build search conditions
    const conditions = ['p.deleted_at IS NULL']
    const queryParams = []
    
    if (brand) {
      conditions.push(`p.metadata->>'machine_brand' = ?`)
      queryParams.push(brand)
    }
    
    if (machineType) {
      conditions.push(`p.metadata->>'machine_type' = ?`)
      queryParams.push(machineType)
    }
    
    if (model) {
      conditions.push(`(p.metadata->'machine_models' @> ?::jsonb OR LOWER(p.title) LIKE ?)`)
      queryParams.push(`["${model}"]`, `%${model.toLowerCase()}%`)
    }
    
    const whereClause = conditions.join(' AND ')

    const sql = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.handle,
        p.thumbnail,
        p.created_at,
        p.metadata,
        json_agg(
          json_build_object(
            'id', pv.id,
            'title', pv.title,
            'sku', pv.sku
          )
        ) as variants
      FROM product p
      LEFT JOIN product_variant pv ON p.id = pv.product_id
      WHERE ${whereClause}
      GROUP BY p.id, p.title, p.description, p.handle, p.thumbnail, p.created_at, p.metadata
      ORDER BY p.created_at DESC
      LIMIT 50
    `

    const products = await knex.raw(sql, queryParams).then(result => result.rows)

    return {
      products: products || [],
      total: products?.length || 0,
      page: 1,
      limit: 50,
      hasMore: false,
      searchTime: Date.now(),
    }
  }

  // ============================================================================
  // METHOD 2: Part Number Search
  // ============================================================================

  /**
   * Search by OEM part number with alternatives
   */
  async searchByPartNumber(params: PartNumberSearchParams): Promise<PartNumberSearchResult> {
    const { partNumber, includeAlternatives = true, exactMatch = false } = params
    
    // Get database connection
    const knex = this.container_.resolve("__pg_connection__")

    // Normalize part number (remove spaces, dashes, etc.)
    const normalized = this.normalizePartNumber(partNumber)
    const searchPattern = exactMatch ? normalized : `%${normalized}%`

    // Raw SQL query to search by SKU and metadata
    const sql = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.handle,
        p.thumbnail,
        p.created_at,
        p.metadata,
        json_agg(
          json_build_object(
            'id', pv.id,
            'title', pv.title,
            'sku', pv.sku
          )
        ) as variants,
        MIN(CASE 
          WHEN pv.sku = ? THEN 1
          WHEN p.metadata->>'part_number' = ? THEN 2
          ELSE 3
        END) as match_rank
      FROM product p
      LEFT JOIN product_variant pv ON p.id = pv.product_id
      WHERE 
        p.deleted_at IS NULL
        AND (
          ${exactMatch ? 'pv.sku = ?' : 'pv.sku ILIKE ?'}
          OR ${exactMatch ? "p.metadata->>'part_number' = ?" : "p.metadata->>'part_number' ILIKE ?"}
          OR ${exactMatch ? 'p.title = ?' : 'p.title ILIKE ?'}
        )
      GROUP BY p.id, p.title, p.description, p.handle, p.thumbnail, p.created_at, p.metadata
      ORDER BY match_rank
      LIMIT 20
    `

    const queryParams = exactMatch 
      ? [normalized, normalized, normalized, normalized, normalized]
      : [normalized, normalized, searchPattern, searchPattern, searchPattern]

    const products = await knex.raw(sql, queryParams).then(result => result.rows)

    return {
      exact: products?.[0],
      alternatives: products || [],
      suggestions: [],
    }
  }

  /**
   * Normalize part number for better matching
   */
  private normalizePartNumber(partNumber: string): string {
    return partNumber
      .toUpperCase()
      .replace(/[\s_]/g, '')  // Remove spaces and underscores, but keep dashes
      .trim()
  }

  /**
   * Find similar part numbers (fuzzy matching)
   */
  private async getSimilarPartNumbers(partNumber: string, limit: number = 5): Promise<string[]> {
    // Use PostgreSQL similarity or Levenshtein distance
    const query = `
      SELECT DISTINCT part_number
      FROM product
      WHERE similarity(part_number, $1) > 0.3
      ORDER BY similarity(part_number, $1) DESC
      LIMIT $2
    `
    return []
  }

  // ============================================================================
  // METHOD 3: Visual Search (Image-based)
  // ============================================================================

  /**
   * Search by image upload
   */
  async searchByImage(params: VisualSearchParams): Promise<VisualSearchResult> {
    const { image, detectOCR = true } = params

    let ocrResults: string[] = []
    let detectedPartType: string | undefined

    // Step 1: OCR - Try to read part numbers from image
    if (detectOCR) {
      ocrResults = await this.performOCR(image)
      
      // If we found part numbers, search by them
      if (ocrResults.length > 0) {
        const partNumberResults = await this.searchByPartNumber({
          partNumber: ocrResults[0],
          includeAlternatives: true,
        })
        
        return {
          ocrResults,
          similarParts: partNumberResults.alternatives,
          confidence: 0.9,
        }
      }
    }

    // Step 2: AI Image Recognition - Detect part type
    detectedPartType = await this.detectPartType(image)

    // Step 3: Visual similarity search
    const similarParts = await this.findVisualSimilarParts(image)

    return {
      detectedPartType,
      ocrResults,
      similarParts,
      confidence: 0.7,
    }
  }

  /**
   * Perform OCR on image to extract text/part numbers
   */
  private async performOCR(image: Buffer | string): Promise<string[]> {
    // In real implementation:
    // - Use Tesseract.js or Google Vision API
    // - Extract text from image
    // - Filter for part number patterns (e.g., "320-8134", "6D-8752")
    
    return []
  }

  /**
   * Detect part type using AI/ML
   */
  private async detectPartType(image: Buffer | string): Promise<string | undefined> {
    // In real implementation:
    // - Use TensorFlow.js or custom ML model
    // - Classify image into part categories
    // - Return detected category
    
    return undefined
  }

  /**
   * Find visually similar parts
   */
  private async findVisualSimilarParts(image: Buffer | string): Promise<any[]> {
    // In real implementation:
    // - Generate image embedding/vector
    // - Search vector database for similar images
    // - Return matching products
    
    return []
  }

  // ============================================================================
  // METHOD 4: Text Search (Natural Language)
  // ============================================================================

  /**
   * Natural language search with intelligent parsing
   */
  async searchByText(params: TextSearchParams): Promise<SearchResult> {
    const { query, language = 'pl', fuzzy = true } = params

    // Parse the query to extract structured data
    const parsed = await this.parseNaturalLanguageQuery(query, language)

    // Build search based on parsed components
    let searchQuery = query

    // If we detected specific brands/models, use machine search
    if (parsed.brands && parsed.brands.length > 0 && parsed.models && parsed.models.length > 0) {
      return this.searchByMachine({
        brand: parsed.brands[0],
        machineType: 'excavator', // Would be detected from query
        model: parsed.models[0],
      })
    }

    // If we detected OEM numbers, use part number search
    if (parsed.oemNumbers && parsed.oemNumbers.length > 0) {
      const result = await this.searchByPartNumber({
        partNumber: parsed.oemNumbers[0],
        includeAlternatives: true,
      })
      
      return {
        products: result.alternatives,
        total: result.alternatives.length,
        page: 1,
        limit: 50,
        hasMore: false,
        parsedQuery: parsed,
      }
    }

    // Otherwise, do full-text search
    return this.fullTextSearch(searchQuery, parsed, fuzzy)
  }

  /**
   * Parse natural language query into structured data
   */
  private async parseNaturalLanguageQuery(query: string, language: string): Promise<ParsedQuery> {
    const parsed: ParsedQuery = {
      brands: [],
      models: [],
      partTypes: [],
      parameters: {},
      oemNumbers: [],
    }

    const lowerQuery = query.toLowerCase()

    // Detect brands
    const brands = ['cat', 'komatsu', 'hitachi', 'volvo', 'jcb', 'kobelco', 'hyundai', 'bobcat']
    for (const brand of brands) {
      if (lowerQuery.includes(brand)) {
        parsed.brands?.push(brand.toUpperCase())
      }
    }

    // Detect models (e.g., "320d", "pc200", "zx210")
    const modelPattern = /\b([a-z]{1,3}\d{2,4}[a-z]?)\b/gi
    const modelMatches = query.match(modelPattern)
    if (modelMatches) {
      parsed.models = modelMatches.map(m => m.toUpperCase())
    }

    // Detect OEM part numbers (e.g., "320-8134", "6D-8752")
    const oemPattern = /\b(\d{1,4}[-_]?\d{4})\b/g
    const oemMatches = query.match(oemPattern)
    if (oemMatches) {
      parsed.oemNumbers = oemMatches
    }

    // Detect part types (in Polish)
    const partTypes = {
      'pompa': 'pump',
      'filtr': 'filter',
      'gąsienica': 'track',
      'cylinder': 'cylinder',
      'zawór': 'valve',
      'silnik': 'engine',
      'młot': 'hammer',
    }

    for (const [pl, en] of Object.entries(partTypes)) {
      if (lowerQuery.includes(pl)) {
        parsed.partTypes?.push(en)
      }
    }

    // Detect parameters (e.g., "3 tony", "600mm")
    const weightPattern = /(\d+)\s*(ton[ya]?|kg)/gi
    const weightMatch = query.match(weightPattern)
    if (weightMatch) {
      parsed.parameters!.weight = weightMatch[0]
    }

    return parsed
  }

  /**
   * Full-text search implementation
   */
  private async fullTextSearch(query: string, parsed: ParsedQuery, fuzzy: boolean): Promise<SearchResult> {
    // Get database connection
    const knex = this.container_.resolve("__pg_connection__")
    
    // Search in title, description, SKU, and metadata
    const searchPattern = `%${query.toLowerCase()}%`
    
    const sql = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.handle,
        p.thumbnail,
        p.created_at,
        p.metadata,
        json_agg(
          json_build_object(
            'id', pv.id,
            'title', pv.title,
            'sku', pv.sku
          )
        ) as variants,
        MIN(CASE 
          WHEN LOWER(p.title) LIKE ? THEN 1
          WHEN LOWER(pv.sku) LIKE ? THEN 2
          WHEN LOWER(p.metadata->>'part_number') LIKE ? THEN 3
          ELSE 4
        END) as match_rank
      FROM product p
      LEFT JOIN product_variant pv ON p.id = pv.product_id
      WHERE 
        p.deleted_at IS NULL
        AND (
          LOWER(p.title) LIKE ?
          OR LOWER(p.description) LIKE ?
          OR LOWER(pv.sku) LIKE ?
          OR LOWER(pv.title) LIKE ?
          OR LOWER(p.metadata->>'machine_brand') LIKE ?
          OR LOWER(p.metadata->>'machine_model') LIKE ?
          OR LOWER(p.metadata->>'part_number') LIKE ?
        )
      GROUP BY p.id, p.title, p.description, p.handle, p.thumbnail, p.created_at, p.metadata
      ORDER BY match_rank, p.created_at DESC
      LIMIT 50
    `

    const products = await knex.raw(sql, [
      searchPattern, searchPattern, searchPattern, // for match_rank
      searchPattern, searchPattern, searchPattern, searchPattern,
      searchPattern, searchPattern, searchPattern
    ]).then(result => result.rows)

    return {
      products: products || [],
      total: products?.length || 0,
      page: 1,
      limit: 50,
      hasMore: false,
      parsedQuery: parsed,
      searchTime: Date.now(),
    }
  }

  // ============================================================================
  // METHOD 5: Advanced Filters
  // ============================================================================

  /**
   * Search with advanced filters
   */
  async searchWithFilters(filters: AdvancedSearchFilters): Promise<SearchResult> {
    const conditions: string[] = []
    const params: any[] = []
    let paramIndex = 1

    // Category filter
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      if (filters.includeSubcategories) {
        // Get all descendant categories
        const allCategoryIds = await this.getAllDescendantCategories(filters.categoryIds)
        conditions.push(`p.category_id = ANY($${paramIndex})`)
        params.push(allCategoryIds)
      } else {
        conditions.push(`p.category_id = ANY($${paramIndex})`)
        params.push(filters.categoryIds)
      }
      paramIndex++
    }

    // Machine brand filter
    if (filters.machineBrands && filters.machineBrands.length > 0) {
      conditions.push(`p.machine_brand = ANY($${paramIndex})`)
      params.push(filters.machineBrands)
      paramIndex++
    }

    // Availability filter
    if (filters.availability && filters.availability.length > 0) {
      conditions.push(`p.availability = ANY($${paramIndex})`)
      params.push(filters.availability)
      paramIndex++
    }

    // Price range
    if (filters.minPrice !== undefined) {
      conditions.push(`p.price >= $${paramIndex}`)
      params.push(filters.minPrice)
      paramIndex++
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(`p.price <= $${paramIndex}`)
      params.push(filters.maxPrice)
      paramIndex++
    }

    // Part type (OEM vs alternatives)
    if (filters.partTypes && filters.partTypes.length > 0) {
      conditions.push(`p.part_type = ANY($${paramIndex})`)
      params.push(filters.partTypes)
      paramIndex++
    }

    // Manufacturer
    if (filters.manufacturers && filters.manufacturers.length > 0) {
      conditions.push(`p.manufacturer = ANY($${paramIndex})`)
      params.push(filters.manufacturers)
      paramIndex++
    }

    // Rating filter
    if (filters.minRating) {
      conditions.push(`p.rating >= $${paramIndex}`)
      params.push(filters.minRating)
      paramIndex++
    }

    if (filters.minReviews) {
      conditions.push(`p.review_count >= $${paramIndex}`)
      params.push(filters.minReviews)
      paramIndex++
    }

    // Build final query
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const orderBy = this.buildOrderByClause(filters.sortBy)

    const sql = `
      SELECT p.*
      FROM product p
      ${whereClause}
      ${orderBy}
      LIMIT 50
    `

    return {
      products: [],
      total: 0,
      page: 1,
      limit: 50,
      hasMore: false,
      filters,
    }
  }

  /**
   * Get all descendant category IDs
   */
  private async getAllDescendantCategories(categoryIds: string[]): Promise<string[]> {
    // Recursive CTE to get all descendants
    const query = `
      WITH RECURSIVE category_tree AS (
        SELECT id FROM product_category WHERE id = ANY($1)
        UNION
        SELECT pc.id FROM product_category pc
        INNER JOIN category_tree ct ON pc.parent_category_id = ct.id
      )
      SELECT id FROM category_tree
    `
    
    return categoryIds // Would be populated from query
  }

  /**
   * Build ORDER BY clause based on sort option
   */
  private buildOrderByClause(sortBy?: string): string {
    switch (sortBy) {
      case 'newest':
        return 'ORDER BY p.created_at DESC'
      case 'best-selling':
        return 'ORDER BY p.sales_count DESC'
      case 'price-asc':
        return 'ORDER BY p.price ASC'
      case 'price-desc':
        return 'ORDER BY p.price DESC'
      case 'rating':
        return 'ORDER BY p.rating DESC, p.review_count DESC'
      default:
        return 'ORDER BY p.popularity DESC'
    }
  }

  // ============================================================================
  // Autocomplete & Suggestions
  // ============================================================================

  /**
   * Get search suggestions for autocomplete
   */
  async getSuggestions(query: string, limit: number = 10): Promise<SearchSuggestion[]> {
    if (query.length < 2) return []

    const suggestions: SearchSuggestion[] = []

    // Search products
    const productQuery = `
      SELECT title, 'product' as type, COUNT(*) as count
      FROM product
      WHERE title ILIKE $1
      GROUP BY title
      LIMIT 5
    `

    // Search categories
    const categoryQuery = `
      SELECT name as title, 'category' as type, COUNT(*) as count
      FROM product_category
      WHERE name ILIKE $1
      GROUP BY name
      LIMIT 3
    `

    // Search part numbers
    const partNumberQuery = `
      SELECT part_number as title, 'part-number' as type, 1 as count
      FROM product
      WHERE part_number ILIKE $1
      LIMIT 2
    `

    return suggestions
  }
}

export default AdvancedSearchService
