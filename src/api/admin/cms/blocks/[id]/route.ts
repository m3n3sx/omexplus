import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../../modules/cms"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const block = await cmsService.getBlock(req.params.id)
  
  res.json({ block })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const block = await cmsService.updateBlock(req.params.id, req.body)
  
  res.json({ block })
}
