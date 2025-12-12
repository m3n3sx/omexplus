import { defineRouteConfig } from "@medusajs/admin-sdk"

// Ta strona jest placeholder - domyślna tabela zamówień Medusa
// już pokazuje wszystkie dane. Kolumna Status jest widoczna domyślnie.

const OrdersPage = () => {
  // Zwracamy null - Medusa użyje domyślnej strony zamówień
  return null
}

export const config = defineRouteConfig({
  label: "Zamówienia",
})

export default OrdersPage
