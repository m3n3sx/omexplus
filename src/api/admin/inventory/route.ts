import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Pobierz warianty produktów z informacjami o stanach
    const productModuleService = req.scope.resolve("productModuleService")
    
    const { data: variants } = await productModuleService.listProductVariants(
      {},
      {
        relations: ["product"],
        take: 1000,
      }
    )

    // Przekształć dane do formatu dla dashboardu
    const inventory = variants.map((variant: any) => {
      return {
        id: variant.id,
        sku: variant.sku || variant.id,
        title: variant.title || variant.product?.title || "Bez nazwy",
        quantity: variant.manage_inventory ? (variant.inventory_quantity || 0) : 999,
        reserved_quantity: 0,
        incoming_quantity: 0,
        available: variant.manage_inventory ? (variant.inventory_quantity || 0) : 999,
        manage_inventory: variant.manage_inventory || false,
      }
    })

    // Sortuj po SKU
    inventory.sort((a: any, b: any) => {
      if (!a.sku) return 1
      if (!b.sku) return -1
      return a.sku.localeCompare(b.sku)
    })

    res.json({
      inventory,
      count: inventory.length,
    })
  } catch (error: any) {
    console.error("Error fetching inventory:", error)
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Nie udało się pobrać stanów magazynowych: ${error.message}`
    )
  }
}
