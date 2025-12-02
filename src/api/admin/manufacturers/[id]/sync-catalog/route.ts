import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * POST /admin/manufacturers/:id/sync-catalog
 * Sync manufacturer catalog
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      error: "Manufacturer ID is required",
    })
  }

  try {
    const manufacturerService = req.scope.resolve("omexManufacturer")

    const result = await manufacturerService.syncCatalog(id)

    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to sync catalog",
    })
  }
}
