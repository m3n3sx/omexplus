import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function customerCreatedHandler({ event, container }: SubscriberArgs<any>) {
  console.log("Customer created:", event.data)
  
  // Wysyłanie email powitalnego
  // Dodawanie bonusowych punktów
  // Subskrypcja do newslettera
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
