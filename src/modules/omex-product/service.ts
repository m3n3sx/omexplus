import { MedusaService } from "@medusajs/framework/utils"

interface CreateProductDTO {
  title: string
  description?: string
  sku: string
  part_number?: string
  equipment_type?: string
  price: number
  cost?: number
  min_order_qty?: number
  technical_specs?: any
  categories?: string[]
}

interface UpdateProductDTO extends Partial<CreateProductDTO> {}

interface ProductFilters {
  category_id?: string
  equipment_type?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  q?: string
}

interface Pagination {
  limit?: number
  offset?: number
}

class OmexProductService extends MedusaService({}) {
  async createProduct(data: CreateProductDTO) {
    // Validate required fields
    if (!data.title || !data.sku) {
      throw new Error("Title and SKU are required")
    }

    // Set defaults
    const productData = {
      ...data,
      min_order_qty: data.min_order_qty || 1,
      created_at: new Date(),
      updated_at: new Date(),
    }

    // In real implementation, this would use Medusa's product service
    // For now, return the data structure
    return {
      id: `prod_${Date.now()}`,
      ...productData,
    }
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    if (!id) {
      throw new Error("Product ID is required")
    }

    return {
      id,
      ...data,
      updated_at: new Date(),
    }
  }

  async retrieveProduct(id: string, locale?: string) {
    if (!id) {
      throw new Error("Product ID is required")
    }

    // In real implementation, fetch from database with translations
    return {
      id,
      locale: locale || 'pl',
    }
  }

  async listProducts(filters: ProductFilters = {}, pagination: Pagination = {}) {
    const limit = pagination.limit || 12
    const offset = pagination.offset || 0

    // In real implementation, build query with filters
    return {
      products: [],
      count: 0,
      limit,
      offset,
    }
  }

  async searchProducts(query: string, filters: ProductFilters = {}) {
    if (!query || query.trim().length === 0) {
      return []
    }

    // In real implementation, full-text search across:
    // - title
    // - description
    // - sku
    // - part_number
    return []
  }

  async deleteProduct(id: string) {
    if (!id) {
      throw new Error("Product ID is required")
    }

    // Soft delete
    return { deleted: true, id }
  }

  async addTranslation(productId: string, locale: string, translation: { title: string; description?: string }) {
    if (!productId || !locale || !translation.title) {
      throw new Error("Product ID, locale, and title are required")
    }

    const validLocales = ['pl', 'en', 'de']
    if (!validLocales.includes(locale)) {
      throw new Error(`Invalid locale. Must be one of: ${validLocales.join(', ')}`)
    }

    return {
      id: `trans_${Date.now()}`,
      product_id: productId,
      locale,
      ...translation,
      created_at: new Date(),
    }
  }

  async setTechnicalSpecs(productId: string, specs: any) {
    if (!productId) {
      throw new Error("Product ID is required")
    }

    if (typeof specs !== 'object') {
      throw new Error("Technical specs must be a valid JSON object")
    }

    return {
      product_id: productId,
      technical_specs: specs,
      updated_at: new Date(),
    }
  }

  async assignCategories(productId: string, categoryIds: string[]) {
    if (!productId || !categoryIds || categoryIds.length === 0) {
      throw new Error("Product ID and at least one category are required")
    }

    return {
      product_id: productId,
      categories: categoryIds,
      updated_at: new Date(),
    }
  }
}

export default OmexProductService
