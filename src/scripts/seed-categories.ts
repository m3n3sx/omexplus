import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import OmexCategoryService from "../modules/omex-category/service"
import {
  CATEGORIES_COMPLETE_SEED,
  flattenCategories,
  verifyCategoryStructure,
  CATEGORY_STATS,
} from "../seeds/categories-complete-seed"

/**
 * Seed Categories Script
 * Populates the database with the complete OMEX category structure
 * 
 * Usage: npm run seed:categories
 * 
 * This script:
 * 1. Verifies the seed data structure for integrity
 * 2. Creates all categories with proper parent-child relationships
 * 3. Handles duplicate prevention (idempotent)
 * 4. Validates data integrity after seeding
 * 5. Rebuilds cache for optimal performance
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
export default async function seedCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("=".repeat(80))
  logger.info("Starting Category Seed Process")
  logger.info("=".repeat(80))

  try {
    // Initialize category service
    const categoryService = new OmexCategoryService()
    logger.info("✓ Category service initialized")

    // Step 1: Verify seed data structure
    logger.info("\n[Step 1/5] Verifying seed data structure...")
    const verification = verifyCategoryStructure(CATEGORIES_COMPLETE_SEED)

    if (!verification.valid) {
      logger.error("✗ Seed data verification failed!")
      logger.error("Errors:")
      verification.errors.forEach((error) => logger.error(`  - ${error}`))
      throw new Error("Seed data structure is invalid")
    }

    if (verification.warnings.length > 0) {
      logger.warn("Warnings during verification:")
      verification.warnings.forEach((warning) => logger.warn(`  - ${warning}`))
    }

    logger.info("✓ Seed data structure verified successfully")
    logger.info(`  - Main categories: ${CATEGORY_STATS.mainCategories}`)
    logger.info(`  - Total categories: ${CATEGORY_STATS.totalCategories}`)
    logger.info(`  - Maximum nesting depth: ${CATEGORY_STATS.maxDepth}`)

    // Step 2: Flatten category hierarchy for insertion
    logger.info("\n[Step 2/5] Preparing category data...")
    const flatCategories = flattenCategories(CATEGORIES_COMPLETE_SEED)
    logger.info(`✓ Flattened ${flatCategories.length} categories for insertion`)

    // Step 3: Create categories with duplicate prevention
    logger.info("\n[Step 3/5] Creating categories in database...")
    let created = 0
    let skipped = 0
    const errors: string[] = []

    for (const categoryData of flatCategories) {
      try {
        // Check if category already exists (idempotent)
        const existing = await categoryService.findBySlug(categoryData.slug)
        if (existing) {
          logger.debug(`  ⊘ Category already exists: ${categoryData.slug}`)
          skipped++
          continue
        }

        // Create the category
        const category = await categoryService.create({
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          priority: categoryData.priority || 0,
          parent_id: categoryData.parent_id,
        })

        created++
        logger.debug(`  ✓ Created: ${category.name} (${category.slug})`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        errors.push(`Failed to create category "${categoryData.slug}": ${errorMessage}`)
        logger.error(`  ✗ Error creating ${categoryData.slug}: ${errorMessage}`)
      }
    }

    logger.info(`✓ Category creation completed`)
    logger.info(`  - Created: ${created}`)
    logger.info(`  - Skipped (already exist): ${skipped}`)
    if (errors.length > 0) {
      logger.error(`  - Errors: ${errors.length}`)
      errors.forEach((error) => logger.error(`    • ${error}`))
    }

    // Step 4: Verify data integrity
    logger.info("\n[Step 4/5] Verifying data integrity...")
    const allCategories = await categoryService.findAll()
    const mainCategories = allCategories.filter((c) => !c.parent_id)
    const totalCount = allCategories.length

    logger.info(`✓ Data integrity check:`)
    logger.info(`  - Total categories in database: ${totalCount}`)
    logger.info(`  - Main categories (no parent): ${mainCategories.length}`)

    // Verify main categories count
    if (mainCategories.length !== CATEGORY_STATS.mainCategories) {
      logger.warn(
        `⚠ Expected ${CATEGORY_STATS.mainCategories} main categories, found ${mainCategories.length}`
      )
    }

    // Check for orphaned records (categories with non-existent parents)
    let orphanedCount = 0
    for (const category of allCategories) {
      if (category.parent_id) {
        const parent = await categoryService.findById(category.parent_id)
        if (!parent) {
          orphanedCount++
          logger.warn(`⚠ Orphaned category found: ${category.slug} (parent_id: ${category.parent_id})`)
        }
      }
    }

    if (orphanedCount === 0) {
      logger.info(`  - Orphaned records: 0 ✓`)
    } else {
      logger.warn(`  - Orphaned records: ${orphanedCount}`)
    }

    // Verify no duplicate slugs
    const slugs = new Set<string>()
    let duplicateCount = 0
    for (const category of allCategories) {
      if (slugs.has(category.slug)) {
        duplicateCount++
        logger.error(`✗ Duplicate slug found: ${category.slug}`)
      }
      slugs.add(category.slug)
    }

    if (duplicateCount === 0) {
      logger.info(`  - Duplicate slugs: 0 ✓`)
    } else {
      logger.error(`  - Duplicate slugs: ${duplicateCount}`)
    }

    // Step 5: Rebuild cache
    logger.info("\n[Step 5/5] Rebuilding cache...")
    try {
      await categoryService.rebuildCache()
      logger.info("✓ Cache rebuilt successfully")

      // Verify cache is working
      const cachedTree = await categoryService.getCategoryTree()
      logger.info(`  - Category tree cached: ${cachedTree.length} root categories`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error(`✗ Failed to rebuild cache: ${errorMessage}`)
      throw error
    }

    // Final summary
    logger.info("\n" + "=".repeat(80))
    logger.info("Category Seed Process Completed Successfully!")
    logger.info("=".repeat(80))
    logger.info(`Summary:`)
    logger.info(`  - Categories created: ${created}`)
    logger.info(`  - Categories skipped: ${skipped}`)
    logger.info(`  - Total categories in database: ${totalCount}`)
    logger.info(`  - Main categories: ${mainCategories.length}`)
    logger.info(`  - Orphaned records: ${orphanedCount}`)
    logger.info(`  - Duplicate slugs: ${duplicateCount}`)
    logger.info(`  - Errors: ${errors.length}`)

    if (errors.length === 0 && orphanedCount === 0 && duplicateCount === 0) {
      logger.info("\n✓ All checks passed! Database is ready for use.")
    } else {
      logger.warn("\n⚠ Some issues were detected. Please review the output above.")
    }

    logger.info("=".repeat(80))

    return {
      success: errors.length === 0 && orphanedCount === 0 && duplicateCount === 0,
      created,
      skipped,
      total: totalCount,
      errors,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error("\n" + "=".repeat(80))
    logger.error("Category Seed Process Failed!")
    logger.error("=".repeat(80))
    logger.error(`Error: ${errorMessage}`)
    logger.error("=".repeat(80))

    throw error
  }
}
