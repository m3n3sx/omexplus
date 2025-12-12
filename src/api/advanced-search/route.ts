import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * Advanced Search API Routes
 * Handles autocomplete, query analysis, part suggestions, validation, and recommendations
 */

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { action } = req.query

  try {
    switch (action) {
      case "autocomplete":
        return await handleAutocomplete(req, res)
      case "validate-part":
        return await handleValidatePart(req, res)
      case "recommendations":
        return await handleRecommendations(req, res)
      default:
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid action parameter"
        )
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error"
    })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { action } = req.body

  try {
    switch (action) {
      case "analyze-query":
        return await handleAnalyzeQuery(req, res)
      case "suggest-parts":
        return await handleSuggestParts(req, res)
      case "save-search":
        return await handleSaveSearch(req, res)
      case "track-analytics":
        return await handleTrackAnalytics(req, res)
      default:
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid action parameter"
        )
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error"
    })
  }
}

/**
 * GET /api/advanced-search?action=autocomplete&query=STRING&step=NUMBER
 * Returns suggestions for current step
 */
async function handleAutocomplete(req: MedusaRequest, res: MedusaResponse) {
  const { query, step } = req.query
  const manager = req.scope.resolve("manager")

  if (!query || !step) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Query and step parameters are required"
    )
  }

  const searchQuery = String(query).toLowerCase()
  const stepNumber = parseInt(String(step))

  let results = []

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
      results = await manager.query(`
        SELECT id, name, popularity_score, region
        FROM manufacturers
        WHERE (LOWER(name) LIKE $1)
        ${machineTypeId ? 'AND machine_type_id = $2' : ''}
        ORDER BY popularity_score DESC
        LIMIT 10
      `, machineTypeId ? [`%${searchQuery}%`, machineTypeId] : [`%${searchQuery}%`])
      break

    case 3: // Model
      const { manufacturerId } = req.query
      results = await manager.query(`
        SELECT id, name, year_from, year_to, power_hp, weight_kg, specs, popularity_score
        FROM machine_models
        WHERE (LOWER(name) LIKE $1)
        ${manufacturerId ? 'AND manufacturer_id = $2' : ''}
        ORDER BY popularity_score DESC
        LIMIT 10
      `, manufacturerId ? [`%${searchQuery}%`, manufacturerId] : [`%${searchQuery}%`])
      break

    case 4: // Symptom
      results = await manager.query(`
        SELECT id, symptom_text, symptom_text_pl, category, subcategory, confidence_score
        FROM symptom_mappings
        WHERE LOWER(symptom_text) LIKE $1 
           OR LOWER(symptom_text_pl) LIKE $1
           OR $2 = ANY(keywords)
        ORDER BY confidence_score DESC
        LIMIT 10
      `, [`%${searchQuery}%`, searchQuery])
      break

    default:
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid step number"
      )
  }

  return res.json({
    success: true,
    results,
    count: results.length
  })
}

/**
 * POST /api/advanced-search (action: analyze-query)
 * Analyzes natural language query using AI
 */
async function handleAnalyzeQuery(req: MedusaRequest, res: MedusaResponse) {
  const { query } = req.body

  if (!query) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Query is required"
    )
  }

  // AI Integration - analyze natural language
  const aiService = req.scope.resolve("aiService")
  const analysis = await aiService.analyzeSearchQuery(query)

  return res.json({
    success: true,
    analysis: {
      machineType: analysis.machineType,
      manufacturer: analysis.manufacturer,
      model: analysis.model,
      issue: analysis.issue,
      confidence: analysis.confidence,
      suggestedCategory: analysis.suggestedCategory
    }
  })
}

/**
 * POST /api/advanced-search (action: suggest-parts)
 * Suggests parts based on machine and issue
 */
async function handleSuggestParts(req: MedusaRequest, res: MedusaResponse) {
  const { machineModelId, symptomId, categoryId } = req.body
  const manager = req.scope.resolve("manager")

  if (!machineModelId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Machine model ID is required"
    )
  }

  // Get compatible parts
  const parts = await manager.query(`
    SELECT 
      p.id,
      p.title,
      p.description,
      p.thumbnail,
      pv.calculated_price as price,
      cm.compatibility_level,
      cm.confidence_score,
      cm.is_original,
      CASE WHEN inv.quantity > 0 THEN true ELSE false END as in_stock,
      inv.quantity
    FROM product p
    INNER JOIN compatibility_matrix cm ON p.id = cm.product_id
    LEFT JOIN product_variant pv ON p.id = pv.product_id
    LEFT JOIN inventory_item inv ON pv.id = inv.variant_id
    WHERE cm.machine_model_id = $1
    ${categoryId ? 'AND p.category_id = $2' : ''}
    AND cm.compatibility_level IN ('perfect', 'compatible')
    ORDER BY cm.confidence_score DESC, cm.is_original DESC
    LIMIT 50
  `, categoryId ? [machineModelId, categoryId] : [machineModelId])

  return res.json({
    success: true,
    parts,
    count: parts.length
  })
}

/**
 * GET /api/advanced-search?action=validate-part&machineId=X&partId=Y
 * Validates part compatibility
 */
async function handleValidatePart(req: MedusaRequest, res: MedusaResponse) {
  const { machineId, partId } = req.query
  const manager = req.scope.resolve("manager")

  if (!machineId || !partId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Machine ID and Part ID are required"
    )
  }

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
}

/**
 * GET /api/advanced-search?action=recommendations&machineId=X&partId=Y
 * Gets frequently bought together recommendations
 */
async function handleRecommendations(req: MedusaRequest, res: MedusaResponse) {
  const { machineId, partId } = req.query
  const manager = req.scope.resolve("manager")

  if (!machineId && !partId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Machine ID or Part ID is required"
    )
  }

  const recommendations = await manager.query(`
    SELECT 
      p.id,
      p.title,
      p.thumbnail,
      pv.calculated_price as price,
      fbt.frequency_score,
      CASE WHEN inv.quantity > 0 THEN true ELSE false END as in_stock
    FROM frequently_bought_together fbt
    INNER JOIN product p ON fbt.related_product_id = p.id
    LEFT JOIN product_variant pv ON p.id = pv.product_id
    LEFT JOIN inventory_item inv ON pv.id = inv.variant_id
    WHERE ${partId ? 'fbt.product_id = $1' : 'fbt.machine_model_id = $1'}
    ORDER BY fbt.frequency_score DESC
    LIMIT 10
  `, [partId || machineId])

  return res.json({
    success: true,
    recommendations: recommendations.map(r => ({
      ...r,
      reason: `${Math.round(r.frequency_score)}% of customers also buy this`
    })),
    count: recommendations.length
  })
}

/**
 * POST /api/advanced-search (action: save-search)
 * Saves customer search for later
 */
async function handleSaveSearch(req: MedusaRequest, res: MedusaResponse) {
  const { customerId, searchQuery, searchName } = req.body
  const manager = req.scope.resolve("manager")

  if (!customerId || !searchQuery) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Customer ID and search query are required"
    )
  }

  const id = `search_${Date.now()}`
  
  await manager.query(`
    INSERT INTO saved_searches (id, customer_id, search_query, search_name, created_at)
    VALUES ($1, $2, $3, $4, NOW())
  `, [id, customerId, JSON.stringify(searchQuery), searchName || 'Unnamed Search'])

  return res.json({
    success: true,
    searchId: id
  })
}

/**
 * POST /api/advanced-search (action: track-analytics)
 * Tracks search analytics
 */
async function handleTrackAnalytics(req: MedusaRequest, res: MedusaResponse) {
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
  } = req.body
  const manager = req.scope.resolve("manager")

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
