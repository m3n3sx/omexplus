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
  category_ids?: string[]
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
  constructor(container: any, config?: any) {
    super(container, config)
  }

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

    try {
      // Support both single category_id and multiple category_ids
      const categoryIds = filters.category_ids || (filters.category_id ? [filters.category_id] : [])

      // Build base query
      let whereConditions: any = {
        deleted_at: null,
        status: "published"
      }

      // If category filtering is requested, we need to join with product_category_product
      if (categoryIds.length > 0) {
        // Get products that belong to any of the specified categories
        const categoryProductsResult = await this.query.graph({
          entity: "product_category_product",
          fields: ["product_id"],
          filters: {
            product_category_id: categoryIds
          }
        })

        const productIds = categoryProductsResult.data.map((cp: any) => cp.product_id)
        
        if (productIds.length === 0) {
          return {
            products: [],
            count: 0,
            limit,
            offset,
          }
        }

        whereConditions.id = productIds
      }

      // Get total count
      const countResult = await this.query.graph({
        entity: "product",
        fields: ["id"],
        filters: whereConditions
      })
      const totalCount = countResult.data.length

      // Get products with pagination
      const productsResult = await this.query.graph({
        entity: "product",
        fields: [
          "id",
          "title",
          "description",
          "handle",
          "status",
          "thumbnail",
          "created_at",
          "updated_at"
        ],
        filters: whereConditions,
        pagination: {
          skip: offset,
          take: limit
        }
      })

      // Get variants and prices for each product
      const productsWithVariants = await Promise.all(
        productsResult.data.map(async (product: any) => {
          const variantsResult = await this.query.graph({
            entity: "product_variant",
            fields: ["id", "title", "sku", "inventory_quantity"],
            filters: {
              product_id: product.id,
              deleted_at: null
            }
          })

          const variants = await Promise.all(
            variantsResult.data.map(async (variant: any) => {
              const pricesResult = await this.query.graph({
                entity: "price",
                fields: ["amount", "currency_code"],
                filters: {
                  price_set_id: variant.id
                }
              })

              return {
                ...variant,
                prices: pricesResult.data || []
              }
            })
          )

          return {
            ...product,
            variants
          }
        })
      )

      return {
        products: productsWithVariants,
        count: totalCount,
        limit,
        offset,
      }
    } catch (error: any) {
      console.error("Error listing products:", error)
      return {
        products: [],
        count: 0,
        limit,
        offset,
      }
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
