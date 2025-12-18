import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ManufacturerService from "../../../../modules/omex-manufacturer/service"

// GET /admin/manufacturers/:id
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const manufacturerService = req.scope.resolve("manufacturerService") as ManufacturerService
  const { id } = req.params

  try {
    const manufacturer = await manufacturerService.getManufacturer(id)

    if (!manufacturer) {
      return res.status(404).json({
        error: "Manufacturer not found",
      })
    }

    return res.json({ manufacturer })
  } catch (error) {
    console.error("Get manufacturer error:", error)
    return res.status(500).json({
      error: "Failed to get manufacturer",
      message: error.message,
    })
  }
}

// PUT /admin/manufacturers/:id
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const manufacturerService = req.scope.resolve("manufacturerService") as ManufacturerService
  const { id } = req.params

  try {
    const manufacturer = await manufacturerService.updateManufacturer(id, req.body)

    return res.json({ manufacturer })
  } catch (error) {
    console.error("Update manufacturer error:", error)
    return res.status(500).json({
      error: "Failed to update manufacturer",
      message: error.message,
    })
  }
}

// DELETE /admin/manufacturers/:id
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const manufacturerService = req.scope.resolve("manufacturerService") as ManufacturerService
  const { id } = req.params

  try {
    await manufacturerService.deleteManufacturer(id)

    return res.status(204).send()
  } catch (error) {
    console.error("Delete manufacturer error:", error)
    return res.status(500).json({
      error: "Failed to delete manufacturer",
      message: error.message,
    })
  }
}
