import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import * as fs from "fs"
import * as path from "path"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const storefrontPath = path.join(process.cwd(), "../storefront/app/[locale]")
    
    // Lista stron do skanowania
    const staticPages = ["kontakt", "o-nas", "faq"]
    
    const pages = staticPages.map(slug => {
      const pagePath = path.join(storefrontPath, slug, "page.tsx")
      const exists = fs.existsSync(pagePath)
      
      let title = slug.charAt(0).toUpperCase() + slug.slice(1)
      if (slug === "o-nas") title = "O nas"
      if (slug === "kontakt") title = "Kontakt"
      if (slug === "faq") title = "FAQ"
      
      return {
        id: slug,
        slug: slug,
        title: title,
        file_path: pagePath,
        exists: exists,
        is_published: exists,
        status: exists ? "published" : "draft",
        locale: "pl",
        created_at: exists ? fs.statSync(pagePath).birthtime : new Date(),
        updated_at: exists ? fs.statSync(pagePath).mtime : new Date()
      }
    }).filter(page => page.exists)
    
    res.json({ pages })
  } catch (error) {
    console.error("Error scanning pages:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
