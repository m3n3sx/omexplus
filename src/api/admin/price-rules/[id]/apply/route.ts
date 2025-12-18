/**
 * Apply Price Rule API
 * 
 * Zastosuj regułę cenową do produktów
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * POST /admin/price-rules/:id/apply
 * 
 * Apply price rule to matching products
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params
  const { dryRun = false } = req.body

  try {
    const query = req.scope.resolve("query")
    const productModuleService = req.scope.resolve("productModuleService")
    const pricingModuleService = req.scope.resolve("pricingModuleService")

    // Get price rule
    const { data: rules } = await query.graph({
      entity: "price_rule",
      fields: ["*"],
      filters: { id },
    })

    if (!rules || rules.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Price rule with id ${id} not found`
      )
    }

    const rule = rules[0]

    if (!rule.active) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot apply inactive price rule"
      )
    }

    // Build product filters
    const filters: any = {}
    
    if (rule.collection_ids) {
      const collectionIds = JSON.parse(rule.collection_ids)
      if (collectionIds.length > 0) {
        filters.collection_id = collectionIds
      }
    }

    if (rule.category_ids) {
      const categoryIds = JSON.parse(rule.category_ids)
      if (categoryIds.length > 0) {
        filters.category_id = categoryIds
      }
    }

    if (rule.product_ids) {
      const productIds = JSON.parse(rule.product_ids)
      if (productIds.length > 0) {
        filters.id = productIds
      }
    }

    // Get matching products
    const products = await productModuleService.listProducts(filters, {
      relations: ['variants', 'variants.prices'],
    })

    const results = []
    let affectedCount = 0

    for (const product of products) {
      for (const variant of product.variants || []) {
        try {
          // Get current price
          const currentPrice = variant.prices?.[0]
          if (!currentPrice) continue

          const currentAmount = currentPrice.amount
          let newAmount = currentAmount

          // Calculate new price based on rule type
          switch (rule.type) {
            case 'percentage_margin':
              if (rule.margin_percentage) {
                // Assume we have cost price in metadata
                const costPrice = variant.metadata?.cost_price || currentAmount
                newAmount = Math.round(costPrice * (1 + rule.margin_percentage / 100))
              }
              break

            case 'fixed_margin':
              if (rule.margin_fixed) {
                const costPrice = variant.metadata?.cost_price || currentAmount
                newAmount = costPrice + rule.margin_fixed
              }
              break

            case 'percentage_discount':
              if (rule.discount_percentage) {
                newAmount = Math.round(currentAmount * (1 - rule.discount_percentage / 100))
              }
              break

            case 'fixed_price':
              if (rule.fixed_price) {
                newAmount = rule.fixed_price
              }
              break
          }

          // Apply rounding
          if (rule.round_to) {
            switch (rule.round_type) {
              case 'up':
                newAmount = Math.ceil(newAmount / rule.round_to) * rule.round_to
                break
              case 'down':
                newAmount = Math.floor(newAmount / rule.round_to) * rule.round_to
                break
              case 'nearest':
                newAmount = Math.round(newAmount / rule.round_to) * rule.round_to
                break
            }
          }

          // Skip if price didn't change
          if (newAmount === currentAmount) {
            results.push({
              product_id: product.id,
              variant_id: variant.id,
              sku: variant.sku,
              old_price: currentAmount,
              new_price: newAmount,
              changed: false,
            })
            continue
          }

          // Apply price change (if not dry run)
          if (!dryRun) {
            await pricingModuleService.updatePrices({
              id: variant.id,
              prices: [{
                amount: newAmount,
                currency_code: currentPrice.currency_code,
              }]
            })
            affectedCount++
          }

          results.push({
            product_id: product.id,
            variant_id: variant.id,
            sku: variant.sku,
            title: product.title,
            old_price: currentAmount,
            new_price: newAmount,
            changed: true,
            change_amount: newAmount - currentAmount,
            change_percentage: ((newAmount - currentAmount) / currentAmount * 100).toFixed(2),
          })
        } catch (error) {
          results.push({
            product_id: product.id,
            variant_id: variant.id,
            error: error.message,
          })
        }
      }
    }

    // Update rule metadata (if not dry run)
    if (!dryRun && affectedCount > 0) {
      await query.graph({
        entity: "price_rule",
        filters: { id },
        data: {
          last_applied_at: new Date(),
          products_affected: affectedCount,
        },
      })

      // Trigger storefront revalidation
      if (typeof fetch !== 'undefined') {
        const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'
        const revalidateSecret = process.env.REVALIDATE_SECRET
        
        fetch(`${storefrontUrl}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tags: ['products', 'pricing'],
            secret: revalidateSecret,
          }),
        }).catch(() => {})
      }
    }

    res.json({
      success: true,
      dry_run: dryRun,
      total_products: products.length,
      affected: affectedCount,
      results,
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to apply price rule: ${error.message}`
    )
  }
}
