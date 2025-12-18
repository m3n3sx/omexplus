import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Przykładowe dane zamówień zakupowych
const mockPurchaseOrders = [
  {
    id: "po_001",
    po_number: "PO-2024-123",
    company_name: "AutoParts Dystrybucja",
    customer_id: "cus_b2b_004",
    status: "processing",
    total_amount: 7850000, // 78 500 PLN
    payment_terms: "NET60",
    delivery_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    items: []
  },
  {
    id: "po_002",
    po_number: "PO-2024-124",
    company_name: "Maszyny Budowlane Sp. j.",
    customer_id: "cus_b2b_005",
    status: "confirmed",
    total_amount: 12500000, // 125 000 PLN
    payment_terms: "NET45",
    delivery_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: []
  },
  {
    id: "po_003",
    po_number: "PO-2024-125",
    company_name: "Przemysł-Tech S.A.",
    customer_id: "cus_b2b_006",
    status: "delivered",
    total_amount: 9800000, // 98 000 PLN
    payment_terms: "NET60",
    delivery_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    items: []
  },
  {
    id: "po_004",
    po_number: "PO-2024-126",
    company_name: "Logistyka Maszyn S.A.",
    customer_id: "cus_b2b_009",
    status: "pending",
    total_amount: 15600000, // 156 000 PLN
    payment_terms: "NET60",
    delivery_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: []
  }
];

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // W produkcji pobierz z bazy danych
    res.json({
      purchase_orders: mockPurchaseOrders,
      count: mockPurchaseOrders.length
    })
  } catch (error: any) {
    console.error("Error fetching purchase orders:", error)
    res.status(500).json({
      error: error.message || "Failed to fetch purchase orders"
    })
  }
}
