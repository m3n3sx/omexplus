import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function shipmentCreatedHandler({ event, container }: SubscriberArgs<any>) {
  console.log("Shipment created:", event.data)
  
  // Wysłanie powiadomienia o wysyłce
  // Aktualizacja statusu zamówienia
  // Generowanie etykiety wysyłkowej
}

export const config: SubscriberConfig = {
  event: "shipment.created",
}
