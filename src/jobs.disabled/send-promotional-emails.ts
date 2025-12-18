import { MedusaContainer } from "@medusajs/framework/types"

export default async function sendPromotionalEmails(container: MedusaContainer) {
  console.log("Sending promotional emails...")
  
  // Wysyłanie emaili promocyjnych
  // Segmentacja klientów
  // Personalizacja ofert
}

export const config = {
  name: "send-promotional-emails",
  schedule: "0 10 * * 1", // Każdy poniedziałek o 10:00
}
