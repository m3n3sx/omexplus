import { MedusaContainer } from "@medusajs/framework/types"

export default async function cleanupAbandonedCarts(container: MedusaContainer) {
  console.log("Cleaning up abandoned carts...")
  
  // Usuwanie starych koszyków
  // Wysyłanie przypomnień o porzuconych koszykach
}

export const config = {
  name: "cleanup-abandoned-carts",
  schedule: "0 2 * * *", // Codziennie o 2:00
}
