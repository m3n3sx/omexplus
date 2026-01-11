import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { position } = req.query
  const query = req.scope.resolve("query")
  
  try {
    const filters: any = { is_active: true }
    
    if (position) {
      filters.position = position
    }
    
    const { data: banners } = await query.graph({
      entity: "banner",
      fields: ["*"],
      filters
    })
    
    const sortedBanners = (banners || []).sort((a, b) => a.priority - b.priority)
    
    res.json({ banners: sortedBanners })
  } catch (error) {
    console.error("Error fetching banners:", error)
    res.json({ banners: [] })
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.status(204).end()
}

// POST /public/banners - Bulk update endpoint (reusing banners path)
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  const body = req.body as { 
    type: "products" | "prices" | "order"
    productIds?: string[]
    updates?: any
    orderId?: string
    email?: string
    metadata?: Record<string, any>
    status?: string
    shipping_address?: any
    items?: any[]
    payment_status?: string
    paid_amount?: number
  }

  console.log("=== BULK UPDATE via /public/banners ===")
  console.log("Type:", body.type)
  console.log("Body:", JSON.stringify(body, null, 2))

  try {
    const knex = req.scope.resolve("__pg_connection__")

    if (body.type === "products") {
      const { productIds, updates } = body
      
      if (!productIds || productIds.length === 0) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "productIds jest wymagany")
      }

      const setClauses: string[] = []
      const values: any[] = []

      if (updates?.status) {
        setClauses.push("status = ?")
        values.push(updates.status)
      }

      if (updates?.collection_id) {
        setClauses.push("collection_id = ?")
        values.push(updates.collection_id)
      }

      if (setClauses.length === 0) {
        return res.json({ success: false, message: "Brak danych do aktualizacji" })
      }

      setClauses.push("updated_at = NOW()")
      const idPlaceholders = productIds.map(() => "?").join(", ")
      values.push(...productIds)

      const updateQuery = 
        "UPDATE product SET " + setClauses.join(", ") + 
        " WHERE id IN (" + idPlaceholders + ") RETURNING id, title, status"

      console.log("SQL:", updateQuery)
      console.log("Values:", values)

      const result = await knex.raw(updateQuery, values)
      
      return res.json({
        success: true,
        updated: result.rows?.length || 0,
        products: result.rows
      })
    }

    if (body.type === "prices") {
      const priceUpdates = body.updates as Array<{ variantId: string; amount: number; currencyCode: string }>
      
      if (!priceUpdates || priceUpdates.length === 0) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "updates jest wymagany")
      }

      let updatedCount = 0

      for (const update of priceUpdates) {
        const { variantId, amount, currencyCode } = update
        
        const result = await knex.raw(`
          UPDATE price p
          SET amount = ?, updated_at = NOW()
          FROM price_set_money_amount psma
          JOIN product_variant_price_set pvps ON pvps.price_set_id = psma.price_set_id
          WHERE p.id = psma.price_id
          AND pvps.variant_id = ?
          AND p.currency_code = ?
        `, [amount, variantId, currencyCode])

        if (result.rowCount > 0) {
          updatedCount++
        }
      }

      return res.json({ success: true, updated: updatedCount })
    }

    if (body.type === "order_debug") {
      // Debug: get order structure
      const orderId = body.orderId
      const results: any = {}
      
      // Get order items
      const orderItems = await knex.raw(`
        SELECT * FROM order_item WHERE order_id = ? AND deleted_at IS NULL
      `, [orderId])
      results.order_items = orderItems.rows
      
      // Get payment collections
      const payments = await knex.raw(`
        SELECT pc.*, opc.order_id 
        FROM payment_collection pc
        JOIN order_payment_collection opc ON opc.payment_collection_id = pc.id
        WHERE opc.order_id = ?
      `, [orderId])
      results.payment_collections = payments.rows
      
      return res.json(results)
    }

    if (body.type === "schema") {
      // Debug: check table structure
      const tables = ['order', 'order_item', 'order_line_item', 'line_item', 'payment', 'payment_collection', 'order_payment_collection']
      const results: any = {}
      
      for (const table of tables) {
        try {
          const cols = await knex.raw(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = ? 
            ORDER BY ordinal_position
          `, [table])
          results[table] = cols.rows
        } catch (e) {
          results[table] = 'not found'
        }
      }
      
      return res.json({ tables: results })
    }

    if (body.type === "payment_debug") {
      const orderId = body.orderId
      const results: any = {}
      
      // Check order table for payment fields
      const orderData = await knex.raw(`
        SELECT * FROM "order" WHERE id = ?
      `, [orderId])
      results.order = orderData.rows[0]
      
      // Check order_payment_collection join
      const opcData = await knex.raw(`
        SELECT * FROM order_payment_collection WHERE order_id = ?
      `, [orderId])
      results.order_payment_collection = opcData.rows
      
      // Check all payment collections
      const allPc = await knex.raw(`
        SELECT * FROM payment_collection LIMIT 5
      `)
      results.sample_payment_collections = allPc.rows
      
      return res.json(results)
    }

    if (body.type === "order") {
      const { orderId, email, metadata, status, shipping_address, items, payment_status } = body
      
      if (!orderId) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "orderId jest wymagany")
      }

      // Update order basic fields (NOT including payment - that's done last)
      const setClauses: string[] = []
      const values: any[] = []

      if (email !== undefined) {
        setClauses.push("email = ?")
        values.push(email)
      }
      
      // Update metadata (without payment fields - they are handled separately)
      if (metadata !== undefined) {
        // Remove payment fields from metadata if present (they'll be added at the end)
        const cleanMetadata = { ...metadata }
        delete cleanMetadata.payment_status
        delete cleanMetadata.paid_amount
        setClauses.push("metadata = COALESCE(metadata, '{}'::jsonb) || ?::jsonb")
        values.push(JSON.stringify(cleanMetadata))
      }

      if (status !== undefined) {
        const allowedStatuses = ["pending", "completed", "canceled", "archived", "requires_action"]
        if (allowedStatuses.includes(status)) {
          setClauses.push("status = ?")
          values.push(status)
        }
      }

      // Update main order first if there are changes
      if (setClauses.length > 0) {
        setClauses.push("updated_at = NOW()")
        values.push(orderId)

        const updateQuery = 
          'UPDATE "order" SET ' + setClauses.join(", ") + " WHERE id = ?"

        console.log("SQL:", updateQuery)
        await knex.raw(updateQuery, values)
      }

      // Update shipping address if provided
      if (shipping_address) {
        const addr = shipping_address
        try {
          await knex.raw(`
            UPDATE order_address 
            SET first_name = ?, last_name = ?, address_1 = ?, address_2 = ?, 
                city = ?, postal_code = ?, phone = ?, company = ?, updated_at = NOW()
            WHERE id = (SELECT shipping_address_id FROM "order" WHERE id = ?)
          `, [
            addr.first_name || '', addr.last_name || '', addr.address_1 || '', addr.address_2 || '',
            addr.city || '', addr.postal_code || '', addr.phone || '', addr.company || '', orderId
          ])
          console.log("Address updated for order:", orderId)
        } catch (addrError: any) {
          console.error("Address update error:", addrError.message)
        }
      }

      // Update order items if provided
      if (items && Array.isArray(items)) {
        console.log("=== PROCESSING ITEMS ===")
        console.log("Items to process:", JSON.stringify(items, null, 2))
        
        for (const item of items) {
          console.log("Processing item:", JSON.stringify(item))
          
          if (item.action === 'update' && item.id) {
            // First try to find order_item by item_id (which references order_line_item)
            const findResult = await knex.raw(`
              SELECT oi.id as order_item_id, oi.item_id as line_item_id, oi.quantity, oi.unit_price
              FROM order_item oi
              WHERE oi.order_id = ? AND (oi.id = ? OR oi.item_id = ?)
              AND oi.deleted_at IS NULL
            `, [orderId, item.id, item.id])
            
            console.log("Find result:", JSON.stringify(findResult.rows))
            
            if (findResult.rows?.length > 0) {
              const orderItemId = findResult.rows[0].order_item_id
              const lineItemId = findResult.rows[0].line_item_id
              const oldQty = findResult.rows[0].quantity
              const oldPrice = findResult.rows[0].unit_price
              
              console.log("Found order_item:", orderItemId, "line_item:", lineItemId)
              console.log("Old values: qty=", oldQty, "price=", oldPrice)
              console.log("New values: qty=", item.quantity, "price=", item.unit_price)
              
              // Update order_item
              const updateResult = await knex.raw(`
                UPDATE order_item 
                SET quantity = ?, unit_price = ?, 
                    raw_quantity = jsonb_build_object('value', ?::text, 'precision', 20),
                    raw_unit_price = jsonb_build_object('value', ?::text, 'precision', 20),
                    updated_at = NOW()
                WHERE id = ?
                RETURNING id, quantity, unit_price
              `, [item.quantity, item.unit_price, item.quantity.toString(), item.unit_price.toString(), orderItemId])
              
              console.log("Update order_item result:", JSON.stringify(updateResult.rows))
              
              // Also update order_line_item
              if (lineItemId) {
                const lineUpdateResult = await knex.raw(`
                  UPDATE order_line_item 
                  SET unit_price = ?,
                      raw_unit_price = jsonb_build_object('value', ?::text, 'precision', 20),
                      updated_at = NOW()
                  WHERE id = ?
                  RETURNING id, unit_price
                `, [item.unit_price, item.unit_price.toString(), lineItemId])
                
                console.log("Update order_line_item result:", JSON.stringify(lineUpdateResult.rows))
              }
              
              console.log("Updated item successfully")
            } else {
              console.log("Item not found:", item.id)
            }
          } else if (item.action === 'delete' && item.id) {
            // Soft delete
            const deleteResult = await knex.raw(`
              UPDATE order_item SET deleted_at = NOW() 
              WHERE order_id = ? AND (id = ? OR item_id = ?)
              RETURNING id
            `, [orderId, item.id, item.id])
            console.log("Delete result:", JSON.stringify(deleteResult.rows))
          } else if (item.action === 'add') {
            // Add new item to order
            console.log("Adding new item:", item)
            
            // Generate unique IDs
            const timestamp = Date.now()
            const randomSuffix = Math.random().toString(36).substr(2, 9)
            const lineItemId = `oli_${timestamp}_${randomSuffix}`
            const orderItemId = `oi_${timestamp}_${randomSuffix}`
            
            // First create order_line_item
            await knex.raw(`
              INSERT INTO order_line_item (
                id, title, unit_price, raw_unit_price, 
                variant_id, product_id, quantity,
                requires_shipping, is_discountable, is_tax_inclusive,
                created_at, updated_at
              ) VALUES (
                ?, ?, ?, jsonb_build_object('value', ?::text, 'precision', 20),
                ?, ?, ?,
                true, true, false,
                NOW(), NOW()
              )
            `, [
              lineItemId, item.title, item.unit_price, item.unit_price.toString(),
              item.variant_id || null, item.product_id || null, item.quantity
            ])
            
            // Then create order_item linking to order_line_item
            await knex.raw(`
              INSERT INTO order_item (
                id, order_id, item_id, version,
                quantity, raw_quantity,
                unit_price, raw_unit_price,
                fulfilled_quantity, raw_fulfilled_quantity,
                shipped_quantity, raw_shipped_quantity,
                return_requested_quantity, raw_return_requested_quantity,
                return_received_quantity, raw_return_received_quantity,
                return_dismissed_quantity, raw_return_dismissed_quantity,
                written_off_quantity, raw_written_off_quantity,
                delivered_quantity, raw_delivered_quantity,
                created_at, updated_at
              ) VALUES (
                ?, ?, ?, 1,
                ?, jsonb_build_object('value', ?::text, 'precision', 20),
                ?, jsonb_build_object('value', ?::text, 'precision', 20),
                0, jsonb_build_object('value', '0', 'precision', 20),
                0, jsonb_build_object('value', '0', 'precision', 20),
                0, jsonb_build_object('value', '0', 'precision', 20),
                0, jsonb_build_object('value', '0', 'precision', 20),
                0, jsonb_build_object('value', '0', 'precision', 20),
                0, jsonb_build_object('value', '0', 'precision', 20),
                0, jsonb_build_object('value', '0', 'precision', 20),
                NOW(), NOW()
              )
            `, [
              orderItemId, orderId, lineItemId,
              item.quantity, item.quantity.toString(),
              item.unit_price, item.unit_price.toString()
            ])
            
            console.log("Added new item:", orderItemId, "->", lineItemId)
          }
        }
        console.log("=== ITEMS PROCESSING DONE ===")
      }

      // Update payment status if provided - store in metadata since payment_collection may not exist
      if (payment_status || body.paid_amount !== undefined) {
        console.log("=== UPDATING PAYMENT INFO ===")
        console.log("New payment_status:", payment_status)
        console.log("New paid_amount:", body.paid_amount)
        
        try {
          // First try to update payment_collection if it exists
          if (payment_status) {
            const pcResult = await knex.raw(`
              SELECT pc.id FROM payment_collection pc
              JOIN order_payment_collection opc ON opc.payment_collection_id = pc.id
              WHERE opc.order_id = ?
            `, [orderId])
            
            if (pcResult.rows?.length > 0) {
              const pcId = pcResult.rows[0].id
              await knex.raw(`
                UPDATE payment_collection SET status = ?, updated_at = NOW() WHERE id = ?
              `, [payment_status, pcId])
              console.log("Updated payment_collection:", pcId)
            } else {
              console.log("No payment_collection found, storing in metadata")
            }
          }
          
          // Build metadata update
          const paymentMetadata: any = {}
          if (payment_status) {
            paymentMetadata.payment_status = payment_status
          }
          if (body.paid_amount !== undefined) {
            paymentMetadata.paid_amount = body.paid_amount
          }
          
          // Always store in metadata as backup (this is done LAST to override any previous metadata updates)
          await knex.raw(`
            UPDATE "order" 
            SET metadata = COALESCE(metadata, '{}'::jsonb) || ?::jsonb,
                updated_at = NOW()
            WHERE id = ?
          `, [JSON.stringify(paymentMetadata), orderId])
          console.log("Payment info saved to metadata:", paymentMetadata)
          
        } catch (payErr: any) {
          console.error("Payment update error:", payErr.message)
        }
      }

      // Fetch updated order
      const orderResult = await knex.raw(`
        SELECT id, display_id, status, email, metadata, created_at, updated_at
        FROM "order" WHERE id = ?
      `, [orderId])
      
      if (!orderResult.rows || orderResult.rows.length === 0) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Zamówienie nie znalezione")
      }

      return res.json({ success: true, order: orderResult.rows[0] })
    }

    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Nieznany typ: " + body.type)

  } catch (error: any) {
    console.error("Error:", error)
    if (error instanceof MedusaError) throw error
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.message)
  }
}
