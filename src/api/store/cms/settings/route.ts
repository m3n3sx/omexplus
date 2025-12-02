import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../modules/cms"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve(CMS_MODULE)
  const settings = await cmsService.getSettings()
  
  // Zwróć tylko publiczne ustawienia
  const publicSettings = {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    logo: settings.logo,
    socialMedia: settings.socialMedia,
    contactInfo: settings.contactInfo,
  }
  
  res.json({ settings: publicSettings })
}
