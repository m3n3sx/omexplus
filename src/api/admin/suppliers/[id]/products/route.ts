import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /admin/suppliers/:id/products - Lista produktów dostawcy
 * POST /admin/suppliers/:id/products - Dodaj produkt do dostawcy
 */

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params
    const { is_active, limit = 50, offset = 0 } = req.query

    // Verify supplier exists
    const supplier = await knex("supplier").where("id", id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    let query = knex("supplier_product")
      .where("supplier_id", id)

    if (is_active !== undefined) {
      query = query.where("is_active", is_active === "true")
    }

    const countResult = await query.clone().count("id as count").first()
    const count = parseInt(countResult?.count || "0")

    const products = await query
      .orderBy("created_at", "desc")
      .limit(Number(limit))
      .offset(Number(offset))

    // Get product details from Medusa
    const productIds = products.map((p: any) => p.product_id)
    let medusaProducts: any[] = []

    if (productIds.length > 0) {
      medusaProducts = await knex("product")
        .whereIn("id", productIds)
        .select("id", "title", "handle", "thumbnail", "status")
    }

    // Merge data
    const enrichedProducts = products.map((sp: any) => {
      const medusaProduct = medusaProducts.find(p => p.id === sp.product_id)
      return {
        ...sp,
        product: medusaProduct || null,
        selling_price: calculateSellingPrice(sp.supplier_price, sp.markup_type, sp.markup_value),
      }
    })

    res.json({
      products: enrichedProducts,
      count,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    console.error("Error listing supplier products:", error)
    res.status(500).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params
    const data = req.body as any

    // Verify supplier exists
    const supplier = await knex("supplier").where("id", id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    if (!data.product_id || !data.supplier_sku || data.supplier_price === undefined) {
      return res.status(400).json({ 
        message: "product_id, supplier_sku, and supplier_price are required" 
      })
    }

    // Check if SKU already exists for this supplier
    const existing = await knex("supplier_product")
      .where("supplier_id", id)
      .where("supplier_sku", data.supplier_sku)
      .first()

    if (existing) {
      return res.status(400).json({ 
        message: `Product with SKU "${data.supplier_sku}" already exists for this supplier` 
      })
    }

    // Verify product exists in Medusa
    const product = await knex("product").where("id", data.product_id).first()
    if (!product) {
      return res.status(400).json({ message: "Product not found in Medusa" })
    }

    const spId = `sp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    const supplierProduct = {
      id: spId,
      supplier_id: id,
      product_id: data.product_id,
      supplier_sku: data.supplier_sku,
      supplier_price: Math.round(data.supplier_price * 100), // Convert to cents
      supplier_currency: data.supplier_currency || "PLN",
      supplier_stock: data.supplier_stock || 0,
      markup_type: data.markup_type || "percentage",
      markup_value: data.markup_value || 20,
      is_active: true,
      sync_status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    }

    await knex("supplier_product").insert(supplierProduct)

    // Update supplier products count
    await knex("supplier")
      .where("id", id)
      .increment("products_count", 1)

    res.status(201).json({ 
      supplier_product: {
        ...supplierProduct,
        product,
        selling_price: calculateSellingPrice(
          supplierProduct.supplier_price, 
          supplierProduct.markup_type, 
          supplierProduct.markup_value
        ),
      }
    })
  } catch (error: any) {
    console.error("Error adding supplier product:", error)
    res.status(500).json({ message: error.message })
  }
}

function calculateSellingPrice(
  supplierPrice: number, 
  markupType: string, 
  markupValue: number
): number {
  if (markupType === "percentage") {
    return Math.round(supplierPrice * (1 + markupValue / 100))
  } else {
    return supplierPrice + Math.round(markupValue * 100)
  }
}
