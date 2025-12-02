import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function productUpdatedHandler({ event, container }: SubscriberArgs<any>) {
  console.log("Product updated:", event.data)
  
  // Aktualizacja cache
  // Powiadomienie o dostępności produktu
  // Indeksowanie w wyszukiwarce
}

export const config: SubscriberConfig = {
  event: "product.updated",
}
