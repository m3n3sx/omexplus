import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../../modules/cms"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const post = await cmsService.getBlogPost(req.params.slug)
  
  res.json({ post })
}
