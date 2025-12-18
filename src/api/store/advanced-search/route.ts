import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * Advanced Search API Routes
 * Handles autocomplete, query analysis, part suggestions, validation, and recommendations
 */

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { action } = req.query as { action?: string; query?: string; step?: string; machineTypeId?: string; manufacturerId?: string; machineId?: string; partId?: string }
  const manager = req.scope.resolve("manager")

  try {
    switch (action) {
      case "autocomplete":
        return await handleAutocomplete(req, res, manager)
      case "validate-part":
        return await handleValidatePart(req, res, manager)
      case "recommendations":
        return await handleRecommendations(req, res, manager)
      default:
        return res.status(400).json({
          error: "Invalid action parameter. Use: autocomplete, validate-part, or recommendations"
        })
    }
  } catch (error) {
    console.error("Advanced search error:", error)
    return res.status(500).json({
      error: error.message || "Internal server error"
    })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { action } = req.body as { 
    action?: string
    query?: string
    machineModelId?: string
    symptomId?: string
    categoryId?: string
    customerId?: string
    searchQuery?: any
    searchName?: string
    queryText?: string
    machineTypeId?: string
    manufacturerId?: string
    symptom?: string
    resultsCount?: number
    clickedProductId?: string
    converted?: boolean
    sessionId?: string
  }
  const manager = req.scope.resolve("manager")

  try {
    switch (action) {
      case "analyze-query":
        return await handleAnalyzeQuery(req, res, manager)
      case "suggest-parts":
        return await handleSuggestParts(req, res, manager)
      case "save-search":
        return await handleSaveSearch(req, res, manager)
      case "track-analytics":
        return await handleTrackAnalytics(req, res, manager)
      default:
        return res.status(400).json({
          error: "Invalid action parameter"
        })
    }
  } catch (error) {
    console.error("Advanced search error:", error)
    return res.status(500).json({
      error: error.message || "Internal server error"
    })
  }
}

/**
 * GET /store/advanced-search?action=autocomplete&query=STRING&step=NUMBER
 * Returns suggestions for current step
 */
async function handleAutocomplete(req: MedusaRequest, res: MedusaResponse, manager: any) {
  const { query, step } = req.query as { query?: string; step?: string; machineTypeId?: string; manufacturerId?: string }

  if (!step) {
    return res.status(400).json({
      error: "Step parameter is required"
    })
  }

  const searchQuery = String(query || '').toLowerCase()
  const stepNumber = parseInt(String(step))

  let results = []

  try {
    switch (stepNumber) {
      case 1: // Machine Type
        results = await manager.query(`
          SELECT id, name, name_pl, emoji, popularity_score
          FROM machine_types
          WHERE LOWER(name) LIKE $1 OR LOWER(name_pl) LIKE $1
          ORDER BY popularity_score DESC
          LIMIT 10
        `, [`%${searchQuery}%`])
        break

      case 2: // Manufacturer
        const { machineTypeId } = req.query
        const manufacturerQuery = machineTypeId
          ? `SELECT id, name, popularity_score, region
             FROM manufacturers
             WHERE (LOWER(name) LIKE $1) AND machine_type_id = $2
             ORDER BY popularity_score DESC
             LIMIT 10`
          : `SELECT id, name, popularity_score, region
             FROM manufacturers
             WHERE LOWER(name) LIKE $1
             ORDER BY popularity_score DESC
             LIMIT 10`
        
        results = await manager.query(
          manufacturerQuery,
          machineTypeId ? [`%${searchQuery}%`, machineTypeId] : [`%${searchQuery}%`]
        )
        break

      case 3: // Model
        const { manufacturerId } = req.query
        const modelQuery = manufacturerId
          ? `SELECT id, name, year_from, year_to, power_hp, weight_kg, specs, popularity_score
             FROM machine_models
             WHERE (LOWER(name) LIKE $1) AND manufacturer_id = $2
             ORDER BY popularity_score DESC
             LIMIT 10`
          : `SELECT id, name, year_from, year_to, power_hp, weight_kg, specs, popularity_score
             FROM machine_models
             WHERE LOWER(name) LIKE $1
             ORDER BY popularity_score DESC
             LIMIT 10`
        
        results = await manager.query(
          modelQuery,
          manufacturerId ? [`%${searchQuery}%`, manufacturerId] : [`%${searchQuery}%`]
        )
        break

      case 4: // Symptom
        results = await manager.query(`
          SELECT id, symptom_text, symptom_text_pl, category, subcategory, confidence_score
          FROM symptom_mappings
          WHERE LOWER(symptom_text) LIKE $1 
             OR LOWER(symptom_text_pl) LIKE $1
          ORDER BY confidence_score DESC
          LIMIT 10
        `, [`%${searchQuery}%`])
        break

      case 5: // Category
        results = await manager.query(`
          SELECT id, name, name_pl, parent_id, icon
          FROM part_categories
          WHERE parent_id IS NULL
             AND (LOWER(name) LIKE $1 OR LOWER(name_pl) LIKE $1)
          ORDER BY name
          LIMIT 10
        `, [`%${searchQuery}%`])
        break

      default:
        return res.status(400).json({
          error: "Invalid step number. Must be 1-5"
        })
    }

    return res.json({
      success: true,
      results,
      count: results.length
    })
  } catch (error) {
    console.error("Autocomplete error:", error)
    return res.status(500).json({
      error: "Database query failed",
      message: error.message
    })
  }
}

/**
 * POST /store/advanced-search (action: analyze-query)
 * Analyzes natural language query using AI
 */
async function handleAnalyzeQuery(req: MedusaRequest, res: MedusaResponse, manager: any) {
  const { query } = req.body as { query?: string }

  if (!query) {
    return res.status(400).json({
      error: "Query is required"
    })
  }

  try {
    const lowerQuery = query.toLowerCase()
    
    // Extract machine type
    const machineTypes = await manager.query(`
      SELECT id, name, name_pl
      FROM machine_types
      WHERE LOWER($1) LIKE '%' || LOWER(name) || '%'
         OR LOWER($1) LIKE '%' || LOWER(name_pl) || '%'
      ORDER BY popularity_score DESC
      LIMIT 1
    `, [lowerQuery])

    // Extract manufacturer
    const manufacturers = await manager.query(`
      SELECT id, name
      FROM manufacturers
      WHERE LOWER($1) LIKE '%' || LOWER(name) || '%'
      ORDER BY popularity_score DESC
      LIMIT 1
    `, [lowerQuery])

    // Extract symptom
    const symptoms = await manager.query(`
      SELECT symptom_text, category, subcategory
      FROM symptom_mappings
      WHERE LOWER($1) LIKE '%' || LOWER(symptom_text) || '%'
         OR LOWER($1) LIKE '%' || LOWER(symptom_text_pl) || '%'
      ORDER BY confidence_score DESC
      LIMIT 1
    `, [lowerQuery])

    const analysis = {
      machineType: machineTypes[0]?.id || null,
      manufacturer: manufacturers[0]?.id || null,
      model: null,
      issue: symptoms[0]?.symptom_text || null,
      confidence: (machineTypes.length * 25 + manufacturers.length * 25 + symptoms.length * 30),
      suggestedCategory: symptoms[0]?.category || null
    }

    return res.json({
      success: true,
      analysis
    })
  } catch (error) {
    console.error("Query analysis error:", error)
    return res.status(500).json({
      error: "Analysis failed",
      message: error.message
    })
  }
}

/**
 * POST /store/advanced-search (action: suggest-parts)
 * Suggests parts based on machine and issue
 */
async function handleSuggestParts(req: MedusaRequest, res: MedusaResponse, manager: any) {
  const { machineModelId, categoryId } = req.body as { machineModelId?: string; categoryId?: string }

  if (!machineModelId) {
    return res.status(400).json({
      error: "Machine model ID is required"
    })
  }

  try {
    // Get compatible parts
    const parts = await manager.query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.thumbnail,
        cm.compatibility_level,
        cm.confidence_score,
        cm.is_original
      FROM product p
      INNER JOIN compatibility_matrix cm ON p.id = cm.product_id
      WHERE cm.machine_model_id = $1
      ${categoryId ? 'AND p.collection_id = $2' : ''}
      AND cm.compatibility_level IN ('perfect', 'compatible')
      ORDER BY cm.confidence_score DESC, cm.is_original DESC
      LIMIT 50
    `, categoryId ? [machineModelId, categoryId] : [machineModelId])

    return res.json({
      success: true,
      parts,
      count: parts.length
    })
  } catch (error) {
    console.error("Part suggestion error:", error)
    return res.status(500).json({
      error: "Failed to suggest parts",
      message: error.message
    })
  }
}

/**
 * GET /store/advanced-search?action=validate-part&machineId=X&partId=Y
 * Validates part compatibility
 */
async function handleValidatePart(req: MedusaRequest, res: MedusaResponse, manager: any) {
  const { machineId, partId } = req.query as { machineId?: string; partId?: string }

  if (!machineId || !partId) {
    return res.status(400).json({
      error: "Machine ID and Part ID are required"
    })
  }

  try {
    const compatibility = await manager.query(`
      SELECT 
        cm.compatibility_level,
        cm.confidence_score,
        cm.is_original,
        cm.notes,
        mm.name as machine_name,
        mm.year_from,
        mm.year_to,
        p.title as part_name
      FROM compatibility_matrix cm
      INNER JOIN machine_models mm ON cm.machine_model_id = mm.id
      INNER JOIN product p ON cm.product_id = p.id
      WHERE cm.machine_model_id = $1 AND cm.product_id = $2
      LIMIT 1
    `, [machineId, partId])

    if (compatibility.length === 0) {
      return res.json({
        success: true,
        compatible: false,
        confidence: 0,
        level: 'not_compatible',
        reason: 'No compatibility data found for this combination'
      })
    }

    const result = compatibility[0]

    return res.json({
      success: true,
      compatible: ['perfect', 'compatible'].includes(result.compatibility_level),
      confidence: parseFloat(result.confidence_score),
      level: result.compatibility_level,
      isOriginal: result.is_original,
      machineName: result.machine_name,
      yearRange: `${result.year_from}-${result.year_to}`,
      notes: result.notes,
      reason: getCompatibilityReason(result.compatibility_level, result.confidence_score)
    })
  } catch (error) {
    console.error("Validation error:", error)
    return res.status(500).json({
      error: "Validation failed",
      message: error.message
    })
  }
}

/**
 * GET /store/advanced-search?action=recommendations&machineId=X&partId=Y
 * Gets frequently bought together recommendations
 */
async function handleRecommendations(req: MedusaRequest, res: MedusaResponse, manager: any) {
  const { machineId, partId } = req.query as { machineId?: string; partId?: string }

  if (!machineId && !partId) {
    return res.status(400).json({
      error: "Machine ID or Part ID is required"
    })
  }

  try {
    const recommendations = await manager.query(`
      SELECT 
        p.id,
        p.title,
        p.thumbnail,
        fbt.frequency_score
      FROM frequently_bought_together fbt
      INNER JOIN product p ON fbt.related_product_id = p.id
      WHERE ${partId ? 'fbt.product_id = $1' : 'fbt.machine_model_id = $1'}
      ORDER BY fbt.frequency_score DESC
      LIMIT 10
    `, [partId || machineId])

    return res.json({
      success: true,
      recommendations: recommendations.map((r: any) => ({
        ...r,
        reason: `${Math.round(r.frequency_score)}% of customers also buy this`
      })),
      count: recommendations.length
    })
  } catch (error) {
    console.error("Recommendations error:", error)
    return res.status(500).json({
      error: "Failed to get recommendations",
      message: error.message
    })
  }
}

/**
 * POST /store/advanced-search (action: save-search)
 * Saves customer search for later
 */
async function handleSaveSearch(req: MedusaRequest, res: MedusaResponse, manager: any) {
  const { customerId, searchQuery, searchName } = req.body as { customerId?: string; searchQuery?: any; searchName?: string }

  if (!customerId || !searchQuery) {
    return res.status(400).json({
      error: "Customer ID and search query are required"
    })
  }

  try {
    const id = `search_${Date.now()}`
    
    await manager.query(`
      INSERT INTO saved_searches (id, customer_id, search_query, search_name, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [id, customerId, JSON.stringify(searchQuery), searchName || 'Unnamed Search'])

    return res.json({
      success: true,
      searchId: id
    })
  } catch (error) {
    console.error("Save search error:", error)
    return res.status(500).json({
      error: "Failed to save search",
      message: error.message
    })
  }
}

/**
 * POST /store/advanced-search (action: track-analytics)
 * Tracks search analytics
 */
async function handleTrackAnalytics(req: MedusaRequest, res: MedusaResponse, manager: any) {
  const { 
    customerId, 
    queryText, 
    machineTypeId, 
    manufacturerId, 
    machineModelId,
    symptom,
    resultsCount,
    clickedProductId,
    converted,
    sessionId
  } = req.body as {
    customerId?: string
    queryText?: string
    machineTypeId?: string
    manufacturerId?: string
    machineModelId?: string
    symptom?: string
    resultsCount?: number
    clickedProductId?: string
    converted?: boolean
    sessionId?: string
  }

  try {
    const id = `analytics_${Date.now()}`
    
    await manager.query(`
      INSERT INTO search_analytics (
        id, customer_id, query_text, machine_type_id, manufacturer_id, 
        machine_model_id, symptom, results_count, clicked_product_id, 
        converted, session_id, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    `, [
      id, customerId, queryText, machineTypeId, manufacturerId,
      machineModelId, symptom, resultsCount, clickedProductId,
      converted, sessionId
    ])

    return res.json({
      success: true,
      analyticsId: id
    })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return res.status(500).json({
      error: "Failed to track analytics",
      message: error.message
    })
  }
}

function getCompatibilityReason(level: string, confidence: number): string {
  switch (level) {
    case 'perfect':
      return `Perfect match - ${confidence}% compatible. Original or exact replacement.`
    case 'compatible':
      return `Compatible - ${confidence}% match. May require minor adjustments.`
    case 'check_specs':
      return `Possibly compatible - ${confidence}% match. Please verify specifications.`
    case 'not_compatible':
      return `Not compatible - This part does not fit your machine.`
    default:
      return 'Unknown compatibility level'
  }
}
