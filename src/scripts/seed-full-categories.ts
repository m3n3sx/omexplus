/**
 * Seed script for full category hierarchy
 * Run: npm run seed:full-categories
 */

import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { FULL_CATEGORY_HIERARCHY } from "../seeds/full-categories-hierarchy"

export default async function seedFullCategories(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productCategoryService = container.resolve("productCategoryService")

  logger.info("🌱 Starting full category hierarchy seed...")

  try {
    // Create a map to store created categories by their ID
    const createdCategories = new Map<string, any>()

    // First pass: Create all top-level categories (no parent)
    const topLevelCategories = FULL_CATEGORY_HIERARCHY.filter(cat => !cat.parent_id)
    
    logger.info(`📦 Creating ${topLevelCategories.length} top-level categories...`)
    
    for (const category of topLevelCategories) {
      try {
        const created = await productCategoryService.create({
          name: category.name,
          handle: category.slug,
          is_active: true,
          is_internal: false,
          metadata: {
            name_en: category.name_en,
            icon: category.icon,
            description: category.description,
            priority: category.priority,
            ...category.metadata,
          },
        })
        
        createdCategories.set(category.id, created)
        logger.info(`  ✓ Created: ${category.name} (${category.icon})`)
      } catch (error) {
        logger.error(`  ✗ Failed to create ${category.name}:`, error.message)
      }
    }

    // Second pass: Create subcategories
    const subcategories = FULL_CATEGORY_HIERARCHY.filter(cat => cat.parent_id)
    
    logger.info(`📦 Creating ${subcategories.length} subcategories...`)
    
    for (const category of subcategories) {
      try {
        const parentCategory = createdCategories.get(category.parent_id!)
        
        if (!parentCategory) {
          logger.warn(`  ⚠ Parent not found for ${category.name}, skipping...`)
          continue
        }

        const created = await productCategoryService.create({
          name: category.name,
          handle: category.slug,
          parent_category_id: parentCategory.id,
          is_active: true,
          is_internal: false,
          metadata: {
            name_en: category.name_en,
            icon: category.icon,
            description: category.description,
            priority: category.priority,
            ...category.metadata,
          },
        })
        
        createdCategories.set(category.id, created)
        logger.info(`  ✓ Created: ${category.name} (${category.icon}) under ${parentCategory.name}`)
      } catch (error) {
        logger.error(`  ✗ Failed to create ${category.name}:`, error.message)
      }
    }

    logger.info(`✅ Successfully seeded ${createdCategories.size} categories!`)
    
    // Summary
    logger.info("\n📊 SUMMARY:")
    logger.info(`  Total categories: ${FULL_CATEGORY_HIERARCHY.length}`)
    logger.info(`  Created: ${createdCategories.size}`)
    logger.info(`  Top-level: ${topLevelCategories.length}`)
    logger.info(`  Subcategories: ${subcategories.length}`)
    
    // Top priority categories
    const topPriority = FULL_CATEGORY_HIERARCHY.filter(cat => cat.metadata?.topPriority)
    logger.info(`\n⭐ TOP PRIORITY CATEGORIES:`)
    topPriority.forEach(cat => {
      logger.info(`  ${cat.icon} ${cat.name} - ${cat.metadata?.salesPercentage}% sprzedaży`)
    })

  } catch (error) {
    logger.error("❌ Error seeding categories:", error)
    throw error
  }
}

// If running directly
if (require.main === module) {
  const { container } = require("@medusajs/framework")
  seedFullCategories(container)
    .then(() => {
      console.log("✅ Seed completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Seed failed:", error)
      process.exit(1)
    })
}
