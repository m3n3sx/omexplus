import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function cmsPagePublishedHandler({ event, container }: SubscriberArgs<any>) {
  console.log("CMS page published:", event.data)
  
  // Czyszczenie cache
  // Aktualizacja sitemap
  // Powiadomienie zespołu
}

export const config: SubscriberConfig = {
  event: "cms.page.published",
}
