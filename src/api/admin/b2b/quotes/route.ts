import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Przykładowe dane ofert (w produkcji byłyby w bazie)
const mockQuotes = [
  {
    id: "quote_001",
    quote_number: "Q-2024-001",
    company_name: "BudMech Sp. z o.o.",
    customer_id: "cus_b2b_001",
    status: "sent",
    total_amount: 4500000, // 45 000 PLN
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: []
  },
  {
    id: "quote_002",
    quote_number: "Q-2024-002",
    company_name: "TechMaszyny S.A.",
    customer_id: "cus_b2b_002",
    status: "accepted",
    total_amount: 7850000, // 78 500 PLN
    valid_until: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    items: []
  },
  {
    id: "quote_003",
    quote_number: "Q-2024-003",
    company_name: "Hydraulika Plus Sp. z o.o.",
    customer_id: "cus_b2b_003",
    status: "draft",
    total_amount: 3200000, // 32 000 PLN
    valid_until: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
      quotes: mockQuotes,
      count: mockQuotes.length
    })
  } catch (error: any) {
    console.error("Error fetching quotes:", error)
    res.status(500).json({
      error: error.message || "Failed to fetch quotes"
    })
  }
}
