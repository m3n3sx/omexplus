/**
 * AI Search Service
 * Handles natural language query analysis, symptom mapping, and compatibility validation
 */

interface QueryAnalysis {
  machineType: string | null
  manufacturer: string | null
  model: string | null
  issue: string | null
  confidence: number
  suggestedCategory: string | null
}

export class AISearchService {
  private manager: any

  constructor(manager: any) {
    this.manager = manager
  }

  /**
   * Analyzes natural language search query
   * Example: "Hydraulic pump for my CAT 320D" -> extracts machine and issue
   */
  async analyzeSearchQuery(query: string): Promise<QueryAnalysis> {
    const lowerQuery = query.toLowerCase()
    
    // Extract machine type
    const machineType = await this.extractMachineType(lowerQuery)
    
    // Extract manufacturer
    const manufacturer = await this.extractManufacturer(lowerQuery)
    
    // Extract model
    const model = await this.extractModel(lowerQuery, manufacturer)
    
    // Extract issue/symptom
    const { issue, category } = await this.extractIssue(lowerQuery)
    
    // Calculate confidence based on matches
    const confidence = this.calculateConfidence({
      machineType,
      manufacturer,
      model,
      issue
    })

    return {
      machineType,
      manufacturer,
      model,
      issue,
      confidence,
      suggestedCategory: category
    }
  }

  /**
   * Maps symptom text to part category using AI-like keyword matching
   */
  async mapSymptomToCategory(symptomText: string): Promise<Array<{
    category: string
    subcategory: string
    confidence: number
  }>> {
    const results = await this.manager.query(`
      SELECT 
        category,
        subcategory,
        confidence_score,
        symptom_text
      FROM symptom_mappings
      WHERE 
        LOWER(symptom_text) LIKE $1
        OR LOWER(symptom_text_pl) LIKE $1
        OR EXISTS (
          SELECT 1 FROM unnest(keywords) AS keyword
          WHERE LOWER($2) LIKE '%' || keyword || '%'
        )
      ORDER BY confidence_score DESC
      LIMIT 5
    `, [`%${symptomText.toLowerCase()}%`, symptomText.toLowerCase()])

    return results.map((r: any) => ({
      category: r.category,
      subcategory: r.subcategory,
      confidence: parseFloat(r.confidence_score)
    }))
  }

  /**
   * Validates part compatibility with machine
   */
  async validateCompatibility(machineModelId: string, productId: string): Promise<{
    compatible: boolean
    confidence: number
    level: string
    reason: string
  }> {
    const result = await this.manager.query(`
      SELECT 
        compatibility_level,
        confidence_score,
        is_original,
        notes
      FROM compatibility_matrix
      WHERE machine_model_id = $1 AND product_id = $2
      LIMIT 1
    `, [machineModelId, productId])

    if (result.length === 0) {
      return {
        compatible: false,
        confidence: 0,
        level: 'not_compatible',
        reason: 'No compatibility data available'
      }
    }

    const data = result[0]
    const compatible = ['perfect', 'compatible'].includes(data.compatibility_level)

    return {
      compatible,
      confidence: parseFloat(data.confidence_score),
      level: data.compatibility_level,
      reason: this.getCompatibilityReason(data.compatibility_level, data.confidence_score, data.is_original)
    }
  }

  /**
   * Generates smart recommendations based on purchase history
   */
  async getSmartRecommendations(machineModelId: string, currentProductId?: string): Promise<Array<{
    productId: string
    reason: string
    frequency: number
  }>> {
    // Get frequently bought together
    const query = currentProductId
      ? `
        SELECT 
          related_product_id as product_id,
          frequency_score
        FROM frequently_bought_together
        WHERE product_id = $1
        ORDER BY frequency_score DESC
        LIMIT 5
      `
      : `
        SELECT 
          product_id,
          COUNT(*) as frequency
        FROM purchase_history
        WHERE machine_model_id = $1
        GROUP BY product_id
        ORDER BY frequency DESC
        LIMIT 5
      `

    const results = await this.manager.query(
      query,
      currentProductId ? [currentProductId] : [machineModelId]
    )

    return results.map((r: any) => ({
      productId: r.product_id,
      reason: `${Math.round(r.frequency_score || (r.frequency * 10))}% of customers also buy this`,
      frequency: r.frequency_score || r.frequency
    }))
  }

  // Private helper methods

  private async extractMachineType(query: string): Promise<string | null> {
    const results = await this.manager.query(`
      SELECT id, name, name_pl
      FROM machine_types
      WHERE LOWER($1) LIKE '%' || LOWER(name) || '%'
         OR LOWER($1) LIKE '%' || LOWER(name_pl) || '%'
      ORDER BY popularity_score DESC
      LIMIT 1
    `, [query])

    return results.length > 0 ? results[0].id : null
  }

  private async extractManufacturer(query: string): Promise<string | null> {
    const results = await this.manager.query(`
      SELECT id, name
      FROM manufacturers
      WHERE LOWER($1) LIKE '%' || LOWER(name) || '%'
      ORDER BY popularity_score DESC
      LIMIT 1
    `, [query])

    return results.length > 0 ? results[0].id : null
  }

  private async extractModel(query: string, manufacturerId: string | null): Promise<string | null> {
    const whereClause = manufacturerId 
      ? 'WHERE LOWER($1) LIKE \'%\' || LOWER(name) || \'%\' AND manufacturer_id = $2'
      : 'WHERE LOWER($1) LIKE \'%\' || LOWER(name) || \'%\''

    const params = manufacturerId ? [query, manufacturerId] : [query]

    const results = await this.manager.query(`
      SELECT id, name
      FROM machine_models
      ${whereClause}
      ORDER BY popularity_score DESC
      LIMIT 1
    `, params)

    return results.length > 0 ? results[0].id : null
  }

  private async extractIssue(query: string): Promise<{ issue: string | null, category: string | null }> {
    const results = await this.manager.query(`
      SELECT symptom_text, category
      FROM symptom_mappings
      WHERE 
        LOWER($1) LIKE '%' || LOWER(symptom_text) || '%'
        OR LOWER($1) LIKE '%' || LOWER(symptom_text_pl) || '%'
        OR EXISTS (
          SELECT 1 FROM unnest(keywords) AS keyword
          WHERE LOWER($1) LIKE '%' || keyword || '%'
        )
      ORDER BY confidence_score DESC
      LIMIT 1
    `, [query])

    if (results.length > 0) {
      return {
        issue: results[0].symptom_text,
        category: results[0].category
      }
    }

    return { issue: null, category: null }
  }

  private calculateConfidence(data: {
    machineType: string | null
    manufacturer: string | null
    model: string | null
    issue: string | null
  }): number {
    let confidence = 0
    if (data.machineType) confidence += 25
    if (data.manufacturer) confidence += 25
    if (data.model) confidence += 30
    if (data.issue) confidence += 20
    return confidence
  }

  private getCompatibilityReason(level: string, confidence: number, isOriginal: boolean): string {
    if (isOriginal) {
      return `✅ Original part - ${confidence}% perfect match`
    }

    switch (level) {
      case 'perfect':
        return `✅ Perfect match - ${confidence}% compatible`
      case 'compatible':
        return `⚠️ Compatible - ${confidence}% match (may require minor adjustments)`
      case 'check_specs':
        return `⚠️ Possibly compatible - ${confidence}% match (verify specifications)`
      case 'not_compatible':
        return `❌ Not compatible - This part does not fit your machine`
      default:
        return 'Unknown compatibility'
    }
  }
}
