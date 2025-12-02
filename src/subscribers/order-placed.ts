import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function orderPlacedHandler({ event, container }: SubscriberArgs<any>) {
  console.log("Order placed:", event.data)
  
  // Wysyłanie powiadomienia email
  // Aktualizacja stanów magazynowych
  // Dodawanie punktów lojalnościowych
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
