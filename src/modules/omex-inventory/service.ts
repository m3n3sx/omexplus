import { MedusaService } from "@medusajs/framework/utils"

interface StockLevel {
  product_id: string
  warehouse_id: string
  quantity: number
  reserved: number
  available: number
}

interface Reservation {
  id: string
  product_id: string
  warehouse_id: string
  quantity: number
  created_at: Date
}

interface LowStockAlert {
  product_id: string
  warehouse_id: string
  current_quantity: number
  threshold: number
}

class OmexInventoryService extends MedusaService({}) {
  private readonly LOW_STOCK_THRESHOLD = 10

  async getStock(productId: string, warehouseId?: string): Promise<StockLevel | StockLevel[]> {
    if (!productId) {
      throw new Error("Product ID is required")
    }

    if (warehouseId) {
      // Get stock for specific warehouse
      return this.getStockForWarehouse(productId, warehouseId)
    }

    // Get stock for all warehouses
    return this.getAllStockForProduct(productId)
  }

  async updateStock(productId: string, warehouseId: string, quantity: number) {
    if (!productId || !warehouseId) {
      throw new Error("Product ID and warehouse ID are required")
    }

    if (quantity < 0) {
      throw new Error("Quantity cannot be negative")
    }

    return {
      product_id: productId,
      warehouse_id: warehouseId,
      quantity,
      updated_at: new Date(),
    }
  }

  async transferStock(
    productId: string,
    fromWarehouse: string,
    toWarehouse: string,
    quantity: number
  ) {
    if (!productId || !fromWarehouse || !toWarehouse) {
      throw new Error("Product ID, source warehouse, and destination warehouse are required")
    }

    if (quantity <= 0) {
      throw new Error("Transfer quantity must be greater than 0")
    }

    if (fromWarehouse === toWarehouse) {
      throw new Error("Source and destination warehouses must be different")
    }

    // Check if source warehouse has enough stock
    const sourceStock = await this.getStockForWarehouse(productId, fromWarehouse)
    
    if (sourceStock.available < quantity) {
      throw new Error(
        `Insufficient stock in warehouse ${fromWarehouse}. ` +
        `Available: ${sourceStock.available}, Requested: ${quantity}`
      )
    }

    // Perform transfer (in transaction)
    // 1. Decrease stock in source warehouse
    await this.updateStock(productId, fromWarehouse, sourceStock.quantity - quantity)
    
    // 2. Increase stock in destination warehouse
    const destStock = await this.getStockForWarehouse(productId, toWarehouse)
    await this.updateStock(productId, toWarehouse, destStock.quantity + quantity)

    return {
      product_id: productId,
      from_warehouse: fromWarehouse,
      to_warehouse: toWarehouse,
      quantity,
      transferred_at: new Date(),
    }
  }

  async reserveStock(productId: string, quantity: number, warehouseId?: string): Promise<Reservation> {
    if (!productId || quantity <= 0) {
      throw new Error("Product ID and positive quantity are required")
    }

    // Find warehouse with available stock
    const warehouse = warehouseId || await this.findWarehouseWithStock(productId, quantity)

    if (!warehouse) {
      throw new Error(`No warehouse has ${quantity} units of product ${productId} available`)
    }

    const stock = await this.getStockForWarehouse(productId, warehouse)

    if (stock.available < quantity) {
      throw new Error(
        `Insufficient stock in warehouse ${warehouse}. ` +
        `Available: ${stock.available}, Requested: ${quantity}`
      )
    }

    // Create reservation
    const reservation: Reservation = {
      id: `res_${Date.now()}`,
      product_id: productId,
      warehouse_id: warehouse,
      quantity,
      created_at: new Date(),
    }

    // Update reserved quantity
    // In real implementation, update inventory table: reserved += quantity

    return reservation
  }

  async releaseReservation(reservationId: string) {
    if (!reservationId) {
      throw new Error("Reservation ID is required")
    }

    // In real implementation:
    // 1. Fetch reservation
    // 2. Update inventory: reserved -= reservation.quantity
    // 3. Delete reservation

    return { released: true, id: reservationId }
  }

  async getLowStockAlerts(threshold?: number): Promise<LowStockAlert[]> {
    const alertThreshold = threshold || this.LOW_STOCK_THRESHOLD

    // In real implementation, query inventory table:
    // WHERE quantity < threshold
    // ORDER BY quantity ASC

    return []
  }

  async getTotalStock(productId: string): Promise<number> {
    if (!productId) {
      throw new Error("Product ID is required")
    }

    const allStock = await this.getAllStockForProduct(productId)
    
    return allStock.reduce((total, stock) => total + stock.available, 0)
  }

  private async getStockForWarehouse(productId: string, warehouseId: string): Promise<StockLevel> {
    // In real implementation, fetch from inventory table
    // WHERE product_id = productId AND warehouse_id = warehouseId

    return {
      product_id: productId,
      warehouse_id: warehouseId,
      quantity: 0,
      reserved: 0,
      available: 0,
    }
  }

  private async getAllStockForProduct(productId: string): Promise<StockLevel[]> {
    // In real implementation, fetch from inventory table
    // WHERE product_id = productId

    return []
  }

  private async findWarehouseWithStock(productId: string, quantity: number): Promise<string | null> {
    const allStock = await this.getAllStockForProduct(productId)

    for (const stock of allStock) {
      if (stock.available >= quantity) {
        return stock.warehouse_id
      }
    }

    return null
  }
}

export default OmexInventoryService
