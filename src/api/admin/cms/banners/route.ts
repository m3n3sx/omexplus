import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../modules/cms"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const banners = await cmsService.listBanners(req.query)
  
  res.json({ banners })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const banner = await cmsService.createBanner(req.body)
  
  res.json({ banner })
}
