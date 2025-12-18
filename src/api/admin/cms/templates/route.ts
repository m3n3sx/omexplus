import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Szablony stron
  const templates = [
    {
      id: "landing-page",
      name: "Landing Page",
      description: "Strona docelowa z hero i sekcjami",
      preview: "/templates/landing.jpg",
      blocks: [
        { type: "hero", content: {} },
        { type: "features", content: {} },
        { type: "cta", content: {} },
      ]
    },
    {
      id: "about-us",
      name: "O nas",
      description: "Strona o firmie",
      preview: "/templates/about.jpg",
      blocks: [
        { type: "heading", content: {} },
        { type: "paragraph", content: {} },
        { type: "team", content: {} },
      ]
    },
    {
      id: "contact",
      name: "Kontakt",
      description: "Strona kontaktowa z formularzem",
      preview: "/templates/contact.jpg",
      blocks: [
        { type: "heading", content: {} },
        { type: "contact-form", content: {} },
        { type: "map", content: {} },
      ]
    }
  ]
  
  res.json({ templates })
}
