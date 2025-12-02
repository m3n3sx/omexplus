import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../../modules/cms"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const page = await cmsService.getPage(req.params.id)
  
  res.json({ page })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const page = await cmsService.updatePage(req.params.id, req.body)
  
  res.json({ page })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  await cmsService.deletePage(req.params.id)
  
  res.json({ success: true })
}
