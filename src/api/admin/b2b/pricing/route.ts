import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Przykładowe dane cenników hurtowych
const mockPricingTiers = [
  {
    id: "pricing_001",
    sku: "HYD-001",
    product_name: "Pompa hydrauliczna 100L",
    retail_price: 125000, // 1250 PLN
    tiers: [
      { qty_min: 5, qty_max: 9, price: 112500, discount_percentage: 10 },
      { qty_min: 10, qty_max: 19, price: 106250, discount_percentage: 15 },
      { qty_min: 20, qty_max: null, price: 100000, discount_percentage: 20 }
    ]
  },
  {
    id: "pricing_002",
    sku: "HYD-002",
    product_name: "Cylinder hydrauliczny 50mm",
    retail_price: 85000, // 850 PLN
    tiers: [
      { qty_min: 10, qty_max: 24, price: 76500, discount_percentage: 10 },
      { qty_min: 25, qty_max: 49, price: 72250, discount_percentage: 15 },
      { qty_min: 50, qty_max: null, price: 68000, discount_percentage: 20 }
    ]
  },
  {
    id: "pricing_003",
    sku: "HYD-003",
    product_name: "Zawór hydrauliczny 3/4",
    retail_price: 45000, // 450 PLN
    tiers: [
      { qty_min: 20, qty_max: 49, price: 40500, discount_percentage: 10 },
      { qty_min: 50, qty_max: 99, price: 38250, discount_percentage: 15 },
      { qty_min: 100, qty_max: null, price: 36000, discount_percentage: 20 }
    ]
  },
  {
    id: "pricing_004",
    sku: "HYD-004",
    product_name: "Filtr oleju hydraulicznego",
    retail_price: 28000, // 280 PLN
    tiers: [
      { qty_min: 50, qty_max: 99, price: 25200, discount_percentage: 10 },
      { qty_min: 100, qty_max: 199, price: 23800, discount_percentage: 15 },
      { qty_min: 200, qty_max: null, price: 22400, discount_percentage: 20 }
    ]
  },
  {
    id: "pricing_005",
    sku: "HYD-005",
    product_name: "Wąż hydrauliczny 1/2 - 10m",
    retail_price: 15000, // 150 PLN
    tiers: [
      { qty_min: 100, qty_max: 249, price: 13500, discount_percentage: 10 },
      { qty_min: 250, qty_max: 499, price: 12750, discount_percentage: 15 },
      { qty_min: 500, qty_max: null, price: 12000, discount_percentage: 20 }
    ]
  }
];

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // W produkcji pobierz z bazy danych
    res.json({
      pricing_tiers: mockPricingTiers,
      count: mockPricingTiers.length
    })
  } catch (error: any) {
    console.error("Error fetching pricing tiers:", error)
    res.status(500).json({
      error: error.message || "Failed to fetch pricing tiers"
    })
  }
}
