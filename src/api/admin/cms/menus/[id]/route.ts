import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../../modules/cms"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const menu = await cmsService.getMenu(req.params.id)
  
  res.json({ menu })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const menu = await cmsService.updateMenu(req.params.id, req.body)
  
  res.json({ menu })
}
