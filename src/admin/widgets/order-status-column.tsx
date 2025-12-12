import type { OrderDTO } from "@medusajs/framework/types"
import { Badge } from "@medusajs/ui"

// Komponent wyświetlający status zamówienia
export const OrderStatusBadge = ({ order }: { order: OrderDTO }) => {
  // Mapowanie statusów na polskie nazwy i kolory
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; color: "orange" | "green" | "red" | "grey" }> = {
      pending: { label: "Oczekujące", color: "orange" },
      completed: { label: "Zrealizowane", color: "green" },
      canceled: { label: "Anulowane", color: "red" },
      draft: { label: "Wersja robocza", color: "grey" },
      archived: { label: "Zarchiwizowane", color: "grey" },
      requires_action: { label: "Wymaga działania", color: "orange" },
    }

    return statusMap[status] || { label: status, color: "grey" as const }
  }

  const statusDisplay = getStatusDisplay(order.status)

  return (
    <Badge color={statusDisplay.color}>
      {statusDisplay.label}
    </Badge>
  )
}

export default OrderStatusBadge
