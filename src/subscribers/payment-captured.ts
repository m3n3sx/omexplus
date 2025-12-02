import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function paymentCapturedHandler({ event, container }: SubscriberArgs<any>) {
  console.log("Payment captured:", event.data)
  
  // Potwierdzenie płatności
  // Rozpoczęcie procesu realizacji zamówienia
  // Wysłanie faktury
}

export const config: SubscriberConfig = {
  event: "payment.captured",
}
