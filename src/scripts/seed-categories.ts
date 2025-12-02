/**
 * Script to seed categories into the database
 * Run with: npm run seed:categories
 */

import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { CATEGORIES_SEED, flattenCategories, CATEGORY_STATS } from "../seeds/categories-seed"

async function seedCategories(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("🌱 Starting category seeding...")
  logger.info(`📊 Stats: ${CATEGORY_STATS.mainCategories} main categories, ${CATEGORY_STATS.totalCategories} total`)

  try {
    // Flatten the hierarchical structure
    const flatCategories = flattenCategories(CATEGORIES_SEED)
    
    logger.info(`📦 Flattened ${flatCategories.length} categories`)

    // Create a map to store created category IDs
    const categoryIdMap = new Map<string, string>()

    // First pass: Create all categories without parent relationships
    for (const category of flatCategories) {
      const { parent_id, ...categoryData } = category
      
      // Check if category already exists
      const existing = await query.graph({
        entity: "product_category",
        fields: ["id", "handle"],
        filters: { handle: categoryData.slug },
      })

      if (existing && existing.data && existing.data.length > 0) {
        logger.info(`⏭️  Category "${categoryData.name}" already exists, skipping...`)
        categoryIdMap.set(categoryData.slug, existing.data[0].id)
        continue
      }

      // Create category
      const result = await query.graph({
        entity: "product_category",
        fields: ["id", "name", "handle"],
        data: {
          name: categoryData.name,
          handle: categoryData.slug,
          description: categoryData.description || "",
          is_active: true,
          is_internal: false,
          metadata: {
            icon: categoryData.icon || null,
          },
        },
      }, "create")

      if (result && result.data) {
        const createdId = Array.isArray(result.data) ? result.data[0].id : result.data.id
        categoryIdMap.set(categoryData.slug, createdId)
        logger.info(`✅ Created category: ${categoryData.name} (${createdId})`)
      }
    }

    // Second pass: Update parent relationships
    logger.info("🔗 Setting up parent relationships...")
    
    for (const category of flatCategories) {
      if (category.parent_id) {
        const categoryId = categoryIdMap.get(category.slug)
        const parentId = categoryIdMap.get(category.parent_id)

        if (categoryId && parentId) {
          await query.graph({
            entity: "product_category",
            fields: ["id"],
            filters: { id: categoryId },
            data: {
              parent_category_id: parentId,
            },
          }, "update")

          logger.info(`🔗 Linked "${category.name}" to parent`)
        }
      }
    }

    logger.info("✅ Category seeding completed successfully!")
    logger.info(`📊 Created ${categoryIdMap.size} categories`)

  } catch (error) {
    logger.error("❌ Error seeding categories:", error)
    throw error
  }
}

export default seedCategories

// If running directly
if (require.main === module) {
  const { medusaIntegrationTestRunner } = require("@medusajs/test-utils")
  
  medusaIntegrationTestRunner({
    testSuite: async ({ getContainer }) => {
      const container = getContainer()
      await seedCategories(container)
    },
  })
}
