import { MedusaContainer } from "@medusajs/framework/types"

export default async function generateSitemap(container: MedusaContainer) {
  console.log("Generating sitemap...")
  
  // Pobierz wszystkie strony, produkty, posty
  // Wygeneruj sitemap.xml
  // Zapisz w public/sitemap.xml
}

export const config = {
  name: "generate-sitemap",
  schedule: "0 3 * * *", // Codziennie o 3:00
}
