import { MedusaService } from "@medusajs/framework/utils"

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

interface CreateOrderDTO {
  customer_id: string
  cart_id: string
  purchase_order_number?: string
  delivery_date?: Date
  payment_terms?: string
  warehouse_id?: string
}

interface OrderStatusHistory {
  status: OrderStatus
  changed_at: Date
  changed_by: string
  note?: string
}

class OmexOrderService extends MedusaService({}) {
  async createOrderFromCart(data: CreateOrderDTO) {
    if (!data.customer_id || !data.cart_id) {
      throw new Error("Customer ID and Cart ID are required")
    }

    // In real implementation:
    // 1. Fetch cart with items
    // 2. Validate stock availability
    // 3. Reserve stock
    // 4. Create order
    // 5. Create order items
    // 6. Clear cart

    const order = {
      id: `order_${Date.now()}`,
      order_number: this.generateOrderNumber(),
      customer_id: data.customer_id,
      purchase_order_number: data.purchase_order_number,
      delivery_date: data.delivery_date,
      payment_terms: data.payment_terms || 'immediate',
      warehouse_id: data.warehouse_id,
      status: 'pending' as OrderStatus,
      payment_status: 'pending' as PaymentStatus,
      created_at: new Date(),
      status_history: [
        {
          status: 'pending',
          changed_at: new Date(),
          changed_by: 'system',
        }
      ],
    }

    return order
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus, changedBy: string, note?: string) {
    if (!orderId || !newStatus) {
      throw new Error("Order ID and new status are required")
    }

    const validStatuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
    }

    // In real implementation:
    // 1. Fetch current order
    // 2. Validate status transition
    // 3. Update order status
    // 4. Add to status history
    // 5. Trigger webhooks/notifications

    const historyEntry: OrderStatusHistory = {
      status: newStatus,
      changed_at: new Date(),
      changed_by: changedBy,
      note,
    }

    return {
      order_id: orderId,
      status: newStatus,
      history_entry: historyEntry,
      updated_at: new Date(),
    }
  }

  async getStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
    if (!orderId) {
      throw new Error("Order ID is required")
    }

    // In real implementation, fetch from order_status_history table
    // ORDER BY changed_at ASC

    return []
  }

  async cancelOrder(orderId: string, reason: string, cancelledBy: string) {
    if (!orderId) {
      throw new Error("Order ID is required")
    }

    // In real implementation:
    // 1. Fetch order with items
    // 2. Check if order can be cancelled (not shipped/delivered)
    // 3. Release stock reservations
    // 4. Return stock to warehouse
    // 5. Update order status to cancelled
    // 6. Process refund if payment was made
    // 7. Send cancellation email

    const order = await this.getOrder(orderId)

    if (order.status === 'shipped' || order.status === 'delivered') {
      throw new Error(`Cannot cancel order in status: ${order.status}`)
    }

    // Return stock
    await this.returnStockToWarehouse(orderId)

    // Update status
    await this.updateOrderStatus(orderId, 'cancelled', cancelledBy, reason)

    return {
      order_id: orderId,
      cancelled: true,
      reason,
      cancelled_at: new Date(),
    }
  }

  async generateInvoice(orderId: string): Promise<{ pdf_url: string }> {
    if (!orderId) {
      throw new Error("Order ID is required")
    }

    // In real implementation:
    // 1. Fetch order with all details
    // 2. Generate PDF using template
    // 3. Store PDF in file storage
    // 4. Return URL

    return {
      pdf_url: `/invoices/order_${orderId}.pdf`,
    }
  }

  async listOrders(filters: {
    customer_id?: string
    status?: OrderStatus
    payment_status?: PaymentStatus
    date_from?: Date
    date_to?: Date
  } = {}, pagination: { limit?: number; offset?: number } = {}) {
    const limit = pagination.limit || 20
    const offset = pagination.offset || 0

    // In real implementation, build query with filters
    // Apply pagination
    // Include customer and items

    return {
      orders: [],
      count: 0,
      limit,
      offset,
    }
  }

  async getOrder(orderId: string) {
    if (!orderId) {
      throw new Error("Order ID is required")
    }

    // In real implementation, fetch order with:
    // - Customer details
    // - Order items with products
    // - Shipping address
    // - Billing address
    // - Status history
    // - Fulfillments

    return {
      id: orderId,
      status: 'pending' as OrderStatus,
      payment_status: 'pending' as PaymentStatus,
    }
  }

  private generateOrderNumber(): string {
    // Generate unique order number
    // Format: ORD-YYYYMMDD-XXXX
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `ORD-${dateStr}-${random}`
  }

  private async returnStockToWarehouse(orderId: string) {
    // In real implementation:
    // 1. Fetch order items
    // 2. For each item, increase warehouse stock
    // 3. Release reservations

    return { returned: true }
  }
}

export default OmexOrderService
