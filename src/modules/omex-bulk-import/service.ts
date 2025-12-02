import { MedusaService } from "@medusajs/framework/utils"
import { Readable } from "stream"
import { parse } from "csv-parse"
import {
  ProductImportRow,
  ImportError,
  ImportProgress,
  ValidationResult,
  ProcessedProduct,
} from "./types"

class OmexBulkImportService extends MedusaService({}) {
  private readonly CHUNK_SIZE = 1000
  private readonly REQUIRED_FIELDS = ['sku', 'name_pl', 'price', 'category_id']
  
  // Service dependencies (injected by Medusa)
  private productService: any
  private translationService: any
  private categoryService: any
  
  async importFromCSV(
    fileBuffer: Buffer,
    onProgress?: (progress: ImportProgress) => void
  ): Promise<ImportProgress> {
    const startTime = Date.now()
    const progress: ImportProgress = {
      status: 'processing',
      total: 0,
      successful: 0,
      failed: 0,
      errors: [],
      current_line: 0,
    }

    try {
      const stream = Readable.from(fileBuffer)
      const parser = stream.pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      )

      let chunk: ProcessedProduct[] = []
      let lineNumber = 1 // Header is line 0

      for await (const row of parser) {
        lineNumber++
        progress.current_line = lineNumber
        progress.total++

        // Validate row
        const validation = this.validateRow(row as ProductImportRow, lineNumber)
        
        if (!validation.valid) {
          progress.failed++
          progress.errors.push(...validation.errors)
          
          if (onProgress) {
            onProgress({ ...progress })
          }
          continue
        }

        // Process row
        try {
          const product = this.processRow(row as ProductImportRow)
          chunk.push(product)

          // Process chunk when it reaches CHUNK_SIZE
          if (chunk.length >= this.CHUNK_SIZE) {
            await this.processChunk(chunk)
            progress.successful += chunk.length
            chunk = []
            
            if (onProgress) {
              onProgress({ ...progress })
            }
          }
        } catch (error: any) {
          progress.failed++
          progress.errors.push({
            line: lineNumber,
            field: 'processing',
            reason: error.message,
          })
          
          if (onProgress) {
            onProgress({ ...progress })
          }
        }
      }

      // Process remaining chunk
      if (chunk.length > 0) {
        await this.processChunk(chunk)
        progress.successful += chunk.length
      }

      progress.status = 'completed'
      progress.duration_ms = Date.now() - startTime

      if (onProgress) {
        onProgress({ ...progress })
      }

      return progress
    } catch (error: any) {
      progress.status = 'failed'
      progress.duration_ms = Date.now() - startTime
      progress.errors.push({
        line: 0,
        field: 'file',
        reason: `File processing error: ${error.message}`,
      })

      if (onProgress) {
        onProgress({ ...progress })
      }

      return progress
    }
  }

  private validateRow(row: ProductImportRow, lineNumber: number): ValidationResult {
    const errors: ImportError[] = []

    // Check required fields
    for (const field of this.REQUIRED_FIELDS) {
      if (!row[field as keyof ProductImportRow] || row[field as keyof ProductImportRow].trim() === '') {
        errors.push({
          line: lineNumber,
          field,
          reason: `Required field is missing or empty`,
          value: row[field as keyof ProductImportRow],
        })
      }
    }

    // Validate SKU format
    if (row.sku && !/^[A-Z]{3}-\d{3}$/.test(row.sku)) {
      errors.push({
        line: lineNumber,
        field: 'sku',
        reason: 'SKU must match format XXX-000 (e.g., HYD-001)',
        value: row.sku,
      })
    }

    // Validate price
    if (row.price) {
      const price = parseFloat(row.price)
      if (isNaN(price) || price < 0) {
        errors.push({
          line: lineNumber,
          field: 'price',
          reason: 'Price must be a positive number',
          value: row.price,
        })
      }
    }

    // Validate cost
    if (row.cost) {
      const cost = parseFloat(row.cost)
      if (isNaN(cost) || cost < 0) {
        errors.push({
          line: lineNumber,
          field: 'cost',
          reason: 'Cost must be a positive number',
          value: row.cost,
        })
      }
    }

    // Validate min_order_qty
    if (row.min_order_qty) {
      const qty = parseInt(row.min_order_qty)
      if (isNaN(qty) || qty < 1) {
        errors.push({
          line: lineNumber,
          field: 'min_order_qty',
          reason: 'Minimum order quantity must be a positive integer',
          value: row.min_order_qty,
        })
      }
    }

    // Validate technical_specs_json
    if (row.technical_specs_json && row.technical_specs_json.trim() !== '') {
      try {
        JSON.parse(row.technical_specs_json)
      } catch {
        errors.push({
          line: lineNumber,
          field: 'technical_specs_json',
          reason: 'Technical specs must be valid JSON',
          value: row.technical_specs_json,
        })
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  private processRow(row: ProductImportRow): ProcessedProduct {
    const technicalSpecs = row.technical_specs_json && row.technical_specs_json.trim() !== ''
      ? JSON.parse(row.technical_specs_json)
      : {}

    return {
      sku: row.sku.trim(),
      title: row.name_pl.trim(),
      description: row.desc_pl?.trim() || '',
      price: parseFloat(row.price),
      cost: row.cost ? parseFloat(row.cost) : 0,
      category_id: row.category_id.trim(),
      equipment_type: row.equipment_type?.trim() || '',
      min_order_qty: row.min_order_qty ? parseInt(row.min_order_qty) : 1,
      technical_specs: technicalSpecs,
      translations: {
        pl: {
          title: row.name_pl.trim(),
          description: row.desc_pl?.trim() || '',
        },
        en: {
          title: row.name_en?.trim() || row.name_pl.trim(),
          description: row.desc_en?.trim() || row.desc_pl?.trim() || '',
        },
        de: {
          title: row.name_de?.trim() || row.name_pl.trim(),
          description: row.desc_de?.trim() || row.desc_pl?.trim() || '',
        },
      },
    }
  }

  private async processChunk(products: ProcessedProduct[]): Promise<void> {
    console.log(`Processing chunk of ${products.length} products`)
    
    // Extract SKUs for duplicate checking
    const skus = products.map(p => p.sku)
    const duplicates = await this.checkDuplicateSKUs(skus)
    
    if (duplicates.length > 0) {
      throw new Error(`Duplicate SKUs found in database: ${duplicates.join(', ')}`)
    }
    
    // Extract category IDs for validation
    const categoryIds = [...new Set(products.map(p => p.category_id))]
    const invalidCategories = await this.validateCategories(categoryIds)
    
    if (invalidCategories.length > 0) {
      throw new Error(`Invalid category IDs: ${invalidCategories.join(', ')}`)
    }
    
    // Process each product in the chunk
    for (const product of products) {
      try {
        // Create product using omex-product service
        const createdProduct = await this.createProductWithTranslations(product)
        console.log(`✓ Created product: ${product.sku}`)
      } catch (error: any) {
        console.error(`✗ Failed to create product ${product.sku}:`, error.message)
        throw error
      }
    }
  }
  
  private async createProductWithTranslations(product: ProcessedProduct): Promise<any> {
    // This will be implemented when we integrate with actual Medusa services
    // For now, return a mock response
    return {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sku: product.sku,
      title: product.title,
      price: product.price,
      created_at: new Date(),
    }
  }

  async checkDuplicateSKUs(skus: string[]): Promise<string[]> {
    // In production, query database for existing SKUs
    // Return array of duplicate SKUs
    return []
  }

  async validateCategories(categoryIds: string[]): Promise<string[]> {
    // In production, query database for existing categories
    // Return array of invalid category IDs
    return []
  }

  generateErrorReport(errors: ImportError[]): string {
    let report = 'Import Error Report\n'
    report += '===================\n\n'
    report += `Total Errors: ${errors.length}\n\n`
    
    // Group errors by type
    const errorsByField = new Map<string, ImportError[]>()
    errors.forEach(error => {
      const existing = errorsByField.get(error.field) || []
      existing.push(error)
      errorsByField.set(error.field, existing)
    })
    
    // Summary by field
    report += 'Errors by Field:\n'
    errorsByField.forEach((fieldErrors, field) => {
      report += `  ${field}: ${fieldErrors.length} errors\n`
    })
    report += '\n'
    
    // Detailed errors
    report += 'Detailed Errors:\n'
    report += '================\n\n'
    errors.forEach(error => {
      report += `Line ${error.line}: ${error.field}\n`
      report += `  Reason: ${error.reason}\n`
      if (error.value !== undefined) {
        report += `  Value: ${error.value}\n`
      }
      report += '\n'
    })
    
    return report
  }
  
  async validateCSV(fileBuffer: Buffer): Promise<{
    total: number
    errors: ImportError[]
    warnings: string[]
    duplicate_skus: string[]
    invalid_categories: string[]
    missing_translations: number
  }> {
    const errors: ImportError[] = []
    const warnings: string[] = []
    const skus = new Set<string>()
    const duplicateSkus: string[] = []
    const categories = new Set<string>()
    let missingTranslations = 0
    let total = 0

    try {
      const stream = Readable.from(fileBuffer)
      const parser = stream.pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      )

      let lineNumber = 1

      for await (const row of parser) {
        lineNumber++
        total++

        // Validate row
        const validation = this.validateRow(row as ProductImportRow, lineNumber)
        errors.push(...validation.errors)

        // Check for duplicate SKUs within file
        if (row.sku) {
          if (skus.has(row.sku)) {
            duplicateSkus.push(row.sku)
            errors.push({
              line: lineNumber,
              field: 'sku',
              reason: 'Duplicate SKU within file',
              value: row.sku,
            })
          }
          skus.add(row.sku)
        }

        // Track categories
        if (row.category_id) {
          categories.add(row.category_id)
        }

        // Check for missing translations
        if (!row.name_en || !row.name_de) {
          missingTranslations++
        }
      }

      // Check for duplicate SKUs in database
      const dbDuplicates = await this.checkDuplicateSKUs(Array.from(skus))
      
      // Validate categories exist
      const invalidCategories = await this.validateCategories(Array.from(categories))

      return {
        total,
        errors,
        warnings,
        duplicate_skus: [...duplicateSkus, ...dbDuplicates],
        invalid_categories: invalidCategories,
        missing_translations: missingTranslations,
      }
    } catch (error: any) {
      throw new Error(`CSV validation failed: ${error.message}`)
    }
  }

  async getImportStatistics(): Promise<{
    total_imports: number
    successful_products: number
    failed_products: number
    last_import_date: Date | null
  }> {
    // In production, query import_history table
    return {
      total_imports: 0,
      successful_products: 0,
      failed_products: 0,
      last_import_date: null,
    }
  }
  
  async saveImportHistory(progress: ImportProgress, filename: string, userId?: string): Promise<void> {
    // In production, save to import_history table
    console.log('Import completed:', {
      filename,
      userId,
      status: progress.status,
      total: progress.total,
      successful: progress.successful,
      failed: progress.failed,
      duration_ms: progress.duration_ms,
    })
  }
}

export default OmexBulkImportService
