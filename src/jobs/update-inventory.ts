import { MedusaContainer } from "@medusajs/framework/types"

export default async function updateInventory(container: MedusaContainer) {
  console.log("Updating inventory...")
  
  // Synchronizacja stanów magazynowych
  // Powiadomienia o niskich stanach
}

export const config = {
  name: "update-inventory",
  schedule: "*/30 * * * *", // Co 30 minut
}
