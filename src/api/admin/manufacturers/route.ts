import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ManufacturerService from "../../../modules/omex-manufacturer/service"

// GET /admin/manufacturers - List all manufacturers
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const manufacturerService = req.scope.resolve("manufacturerService") as ManufacturerService

  try {
    const { page = 1, limit = 20, is_active } = req.query

    const manufacturers = await manufacturerService.listManufacturers({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      is_active: is_active === "true" ? true : is_active === "false" ? false : undefined,
    })

    return res.json(manufacturers)
  } catch (error) {
    console.error("List manufacturers error:", error)
    return res.status(500).json({
      error: "Failed to list manufacturers",
      message: error.message,
    })
  }
}

// POST /admin/manufacturers - Create manufacturer
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const manufacturerService = req.scope.resolve("manufacturerService") as ManufacturerService

  try {
    const manufacturer = await manufacturerService.createManufacturer(req.body)

    return res.status(201).json({
      manufacturer,
    })
  } catch (error) {
    console.error("Create manufacturer error:", error)
    return res.status(500).json({
      error: "Failed to create manufacturer",
      message: error.message,
    })
  }
}
