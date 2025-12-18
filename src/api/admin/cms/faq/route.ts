import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../modules/cms"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const faqs = await cmsService.listFaqs(req.query)
  
  res.json({ faqs })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const faq = await cmsService.createFaq(req.body)
  
  res.json({ faq })
}
