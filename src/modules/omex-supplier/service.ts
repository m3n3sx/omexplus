import { MedusaService } from "@medusajs/framework/utils"
import { 
  Supplier, 
  SupplierProduct, 
  SupplierOrder,
  CreateSupplierDTO, 
  UpdateSupplierDTO,
  CreateSupplierProductDTO,
  SupplierFilters 
} from "../../models/supplier"

class SupplierService extends MedusaService({}) {
  private db: any

  constructor(container: any) {
    super(container)
    // DB will be injected via container
  }

  // ==================== SUPPLIER CRUD ====================

  async createSupplier(data: CreateSupplierDTO): Promise<Supplier> {
    if (!data.name || !data.code) {
      throw new Error("Name and code are required")
    }

    const id = `sup_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    
    const supplier: Supplier = {
      id,
      name: data.name,
      code: data.code.toUpperCase(),
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2,
      city: data.city,
      postal_code: data.postal_code,
      country_code: data.country_code,
      api_url: data.api_url,
      api_key: data.api_key,
      api_format: data.api_format || 'json',
      sync_enabled: data.sync_enabled || false,
      sync_frequency: data.sync_frequency || 'manual',
      commission_rate: data.commission_rate,
      min_order_value: data.min_order_value,
      lead_time_days: data.lead_time_days || 3,
      shipping_method: data.shipping_method,
      is_active: true,
      is_dropship: data.is_dropship !== false,
      products_count: 0,
      orders_count: 0,
      total_revenue: 0,
      notes: data.notes,
      metadata: data.metadata || {},
      created_at: new Date(),
      updated_at: new Date(),
    }

    return supplier
  }

  async updateSupplier(id: string, data: UpdateSupplierDTO): Promise<Supplier> {
    if (!id) {
      throw new Error("Supplier ID is required")
    }

    const updateData = {
      ...data,
      updated_at: new Date(),
    }

    // Return updated supplier (in real impl, fetch from DB)
    return {
      id,
      ...updateData,
    } as Supplier
  }

  async retrieveSupplier(id: string): Promise<Supplier | null> {
    if (!id) {
      throw new Error("Supplier ID is required")
    }

    // In real implementation, fetch from database
    return null
  }

  async retrieveSupplierByCode(code: string): Promise<Supplier | null> {
    if (!code) {
      return null
    }

    // In real implementation, query database
    return null
  }

  async listSuppliers(
    filters: SupplierFilters = {}, 
    pagination = { limit: 50, offset: 0 }
  ): Promise<{ suppliers: Supplier[]; count: number }> {
    // In real implementation, query database with filters
    return {
      suppliers: [],
      count: 0,
    }
  }

  async deleteSupplier(id: string): Promise<{ deleted: boolean; id: string }> {
    if (!id) {
      throw new Error("Supplier ID is required")
    }

    // Check if supplier has active products or orders
    // In real impl, check database

    return { deleted: true, id }
  }

  // ==================== SUPPLIER PRODUCTS ====================

  async addSupplierProduct(data: CreateSupplierProductDTO): Promise<SupplierProduct> {
    if (!data.supplier_id || !data.product_id || !data.supplier_sku) {
      throw new Error("Supplier ID, Product ID, and Supplier SKU are required")
    }

    const id = `sp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    const supplierProduct: SupplierProduct = {
      id,
      supplier_id: data.supplier_id,
      product_id: data.product_id,
      supplier_sku: data.supplier_sku,
      supplier_price: data.supplier_price,
      supplier_currency: data.supplier_currency || 'PLN',
      supplier_stock: data.supplier_stock || 0,
      markup_type: data.markup_type || 'percentage',
      markup_value: data.markup_value || 20,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }

    return supplierProduct
  }

  async updateSupplierProduct(
    id: string, 
    data: Partial<SupplierProduct>
  ): Promise<SupplierProduct> {
    if (!id) {
      throw new Error("Supplier Product ID is required")
    }

    return {
      id,
      ...data,
      updated_at: new Date(),
    } as SupplierProduct
  }

  async listSupplierProducts(
    supplierId: string,
    pagination = { limit: 50, offset: 0 }
  ): Promise<{ products: SupplierProduct[]; count: number }> {
    if (!supplierId) {
      throw new Error("Supplier ID is required")
    }

    // In real implementation, query database
    return {
      products: [],
      count: 0,
    }
  }

  async findProductBySupplierSku(
    supplierId: string, 
    supplierSku: string
  ): Promise<SupplierProduct | null> {
    // In real implementation, query database
    return null
  }

  async getProductSuppliers(productId: string): Promise<SupplierProduct[]> {
    if (!productId) {
      throw new Error("Product ID is required")
    }

    // In real implementation, query database
    // Returns all suppliers that have this product
    return []
  }

  // ==================== SUPPLIER ORDERS ====================

  async createSupplierOrder(data: {
    supplier_id: string
    order_id: string
    supplier_total: number
    your_margin?: number
    notes?: string
  }): Promise<SupplierOrder> {
    if (!data.supplier_id || !data.order_id) {
      throw new Error("Supplier ID and Order ID are required")
    }

    const id = `so_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    const supplierOrder: SupplierOrder = {
      id,
      supplier_id: data.supplier_id,
      order_id: data.order_id,
      status: 'pending',
      supplier_total: data.supplier_total,
      your_margin: data.your_margin || 0,
      notes: data.notes,
      created_at: new Date(),
      updated_at: new Date(),
    }

    return supplierOrder
  }

  async updateSupplierOrderStatus(
    id: string, 
    status: SupplierOrder['status'],
    data?: {
      supplier_order_id?: string
      tracking_number?: string
      tracking_url?: string
    }
  ): Promise<SupplierOrder> {
    if (!id) {
      throw new Error("Supplier Order ID is required")
    }

    const updateData: Partial<SupplierOrder> = {
      status,
      updated_at: new Date(),
    }

    // Set timestamp based on status
    switch (status) {
      case 'sent':
        updateData.sent_at = new Date()
        break
      case 'confirmed':
        updateData.confirmed_at = new Date()
        break
      case 'shipped':
        updateData.shipped_at = new Date()
        if (data?.tracking_number) updateData.tracking_number = data.tracking_number
        if (data?.tracking_url) updateData.tracking_url = data.tracking_url
        break
      case 'delivered':
        updateData.delivered_at = new Date()
        break
    }

    if (data?.supplier_order_id) {
      updateData.supplier_order_id = data.supplier_order_id
    }

    return {
      id,
      ...updateData,
    } as SupplierOrder
  }

  async listSupplierOrders(
    supplierId?: string,
    filters?: { status?: string; order_id?: string },
    pagination = { limit: 50, offset: 0 }
  ): Promise<{ orders: SupplierOrder[]; count: number }> {
    // In real implementation, query database
    return {
      orders: [],
      count: 0,
    }
  }

  // ==================== SYNC & INTEGRATION ====================

  async syncSupplierCatalog(supplierId: string): Promise<{
    synced_at: Date
    products_synced: number
    products_created: number
    products_updated: number
    errors: number
  }> {
    if (!supplierId) {
      throw new Error("Supplier ID is required")
    }

    const supplier = await this.retrieveSupplier(supplierId)
    
    if (!supplier) {
      throw new Error(`Supplier ${supplierId} not found`)
    }

    if (!supplier.api_url) {
      throw new Error("Supplier has no API URL configured")
    }

    console.log(`🔄 Syncing catalog from ${supplier.name}...`)

    try {
      // Fetch catalog from supplier API
      const response = await fetch(supplier.api_url, {
        headers: {
          'Authorization': supplier.api_key ? `Bearer ${supplier.api_key}` : '',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Supplier API returned ${response.status}`)
      }

      const catalog = await response.json()
      const products = catalog.products || catalog.items || []

      let created = 0
      let updated = 0
      let errors = 0

      for (const item of products) {
        try {
          const existing = await this.findProductBySupplierSku(supplierId, item.sku)

          if (existing) {
            await this.updateSupplierProduct(existing.id, {
              supplier_price: Math.round(item.price * 100),
              supplier_stock: item.stock || 0,
              last_sync_at: new Date(),
              sync_status: 'synced',
            })
            updated++
          } else {
            // Would need to create product in Medusa first
            // Then link it via addSupplierProduct
            created++
          }
        } catch (error) {
          console.error(`Error syncing ${item.sku}:`, error)
          errors++
        }
      }

      // Update supplier last_sync_at
      await this.updateSupplier(supplierId, {
        last_sync_at: new Date(),
      } as any)

      console.log(`✅ Sync completed: ${created} created, ${updated} updated, ${errors} errors`)

      return {
        synced_at: new Date(),
        products_synced: created + updated,
        products_created: created,
        products_updated: updated,
        errors,
      }
    } catch (error) {
      console.error(`❌ Sync failed:`, error)
      throw error
    }
  }

  async sendOrderToSupplier(supplierOrderId: string): Promise<{
    success: boolean
    supplier_order_id?: string
    error?: string
  }> {
    // In real implementation:
    // 1. Get supplier order details
    // 2. Get supplier API config
    // 3. Send order to supplier API
    // 4. Update supplier order with response

    return {
      success: true,
      supplier_order_id: `EXT_${Date.now()}`,
    }
  }

  // ==================== PRICING HELPERS ====================

  calculateSellingPrice(
    supplierPrice: number, 
    markupType: 'percentage' | 'fixed',
    markupValue: number
  ): number {
    if (markupType === 'percentage') {
      return Math.round(supplierPrice * (1 + markupValue / 100))
    } else {
      return supplierPrice + Math.round(markupValue * 100)
    }
  }

  calculateMargin(
    sellingPrice: number,
    supplierPrice: number
  ): { amount: number; percentage: number } {
    const amount = sellingPrice - supplierPrice
    const percentage = supplierPrice > 0 
      ? Math.round((amount / supplierPrice) * 100 * 100) / 100 
      : 0

    return { amount, percentage }
  }

  // ==================== STATISTICS ====================

  async getSupplierStats(supplierId: string): Promise<{
    products_count: number
    orders_count: number
    pending_orders: number
    total_revenue: number
    total_margin: number
    avg_lead_time: number
  }> {
    if (!supplierId) {
      throw new Error("Supplier ID is required")
    }

    // In real implementation, aggregate from database
    return {
      products_count: 0,
      orders_count: 0,
      pending_orders: 0,
      total_revenue: 0,
      total_margin: 0,
      avg_lead_time: 0,
    }
  }

  async getDashboardStats(): Promise<{
    total_suppliers: number
    active_suppliers: number
    dropship_suppliers: number
    total_dropship_products: number
    pending_supplier_orders: number
    monthly_dropship_revenue: number
  }> {
    // In real implementation, aggregate from database
    return {
      total_suppliers: 0,
      active_suppliers: 0,
      dropship_suppliers: 0,
      total_dropship_products: 0,
      pending_supplier_orders: 0,
      monthly_dropship_revenue: 0,
    }
  }
}

export default SupplierService
