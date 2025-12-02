import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { locale } = req.body
  
  // Ustaw cookie z wybranym językiem
  res.cookie("locale", locale, {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 rok
    httpOnly: true,
    sameSite: "lax",
  })
  
  res.json({ success: true, locale })
}
