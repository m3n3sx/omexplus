import { MedusaContainer } from "@medusajs/framework/types"

export default async function generateReports(container: MedusaContainer) {
  console.log("Generating daily reports...")
  
  // Generowanie raportów sprzedaży
  // Analiza produktów
  // Statystyki klientów
}

export const config = {
  name: "generate-reports",
  schedule: "0 0 * * *", // Codziennie o północy
}
