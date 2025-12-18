import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../../modules/cms"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const faq = await cmsService.updateFaq(req.params.id, req.body)
  
  res.json({ faq })
}
