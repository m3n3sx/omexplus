import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../../modules/cms"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const post = await cmsService.updateBlogPost(req.params.id, req.body)
  
  res.json({ post })
}
