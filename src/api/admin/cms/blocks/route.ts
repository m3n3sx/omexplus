import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../modules/cms"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const blocks = await cmsService.listBlocks(req.query)
  
  res.json({ blocks })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const block = await cmsService.createBlock(req.body)
  
  res.json({ block })
}
