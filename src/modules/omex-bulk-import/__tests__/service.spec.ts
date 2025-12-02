import OmexBulkImportService from "../service"
import { ProductImportRow } from "../types"

describe("OmexBulkImportService", () => {
  let service: OmexBulkImportService

  beforeEach(() => {
    service = new OmexBulkImportService({} as any)
  })

  describe("validateRow", () => {
    it("should validate a correct row", () => {
      const row: ProductImportRow = {
        sku: "HYD-001",
        name_pl: "Pompa hydrauliczna",
        name_en: "Hydraulic pump",
        name_de: "Hydraulische Pumpe",
        desc_pl: "Opis",
        desc_en: "Description",
        desc_de: "Beschreibung",
        price: "599.99",
        cost: "299.99",
        category_id: "cat-hydraulika",
        equipment_type: "Hydraulika",
        min_order_qty: "1",
        technical_specs_json: '{"power": "5kW"}',
      }

      const result = (service as any).validateRow(row, 2)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should detect missing required fields", () => {
      const row: ProductImportRow = {
        sku: "",
        name_pl: "",
        name_en: "",
        name_de: "",
        desc_pl: "",
        desc_en: "",
        desc_de: "",
        price: "",
        cost: "",
        category_id: "",
        equipment_type: "",
        min_order_qty: "",
        technical_specs_json: "",
      }

      const result = (service as any).validateRow(row, 2)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some((e: any) => e.field === "sku")).toBe(true)
      expect(result.errors.some((e: any) => e.field === "name_pl")).toBe(true)
      expect(result.errors.some((e: any) => e.field === "price")).toBe(true)
      expect(result.errors.some((e: any) => e.field === "category_id")).toBe(
        true
      )
    })

    it("should detect invalid SKU format", () => {
      const row: ProductImportRow = {
        sku: "INVALID-SKU",
        name_pl: "Pompa",
        name_en: "Pump",
        name_de: "Pumpe",
        desc_pl: "",
        desc_en: "",
        desc_de: "",
        price: "599.99",
        cost: "",
        category_id: "cat-hydraulika",
        equipment_type: "",
        min_order_qty: "",
        technical_specs_json: "",
      }

      const result = (service as any).validateRow(row, 2)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e: any) => e.field === "sku")).toBe(true)
      expect(
        result.errors.find((e: any) => e.field === "sku").reason
      ).toContain("format")
    })

    it("should detect invalid price", () => {
      const row: ProductImportRow = {
        sku: "HYD-001",
        name_pl: "Pompa",
        name_en: "Pump",
        name_de: "Pumpe",
        desc_pl: "",
        desc_en: "",
        desc_de: "",
        price: "-599.99",
        cost: "",
        category_id: "cat-hydraulika",
        equipment_type: "",
        min_order_qty: "",
        technical_specs_json: "",
      }

      const result = (service as any).validateRow(row, 2)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e: any) => e.field === "price")).toBe(true)
    })

    it("should detect invalid cost", () => {
      const row: ProductImportRow = {
        sku: "HYD-001",
        name_pl: "Pompa",
        name_en: "Pump",
        name_de: "Pumpe",
        desc_pl: "",
        desc_en: "",
        desc_de: "",
        price: "599.99",
        cost: "invalid",
        category_id: "cat-hydraulika",
        equipment_type: "",
        min_order_qty: "",
        technical_specs_json: "",
      }

      const result = (service as any).validateRow(row, 2)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e: any) => e.field === "cost")).toBe(true)
    })

    it("should detect invalid min_order_qty", () => {
      const row: ProductImportRow = {
        sku: "HYD-001",
        name_pl: "Pompa",
        name_en: "Pump",
        name_de: "Pumpe",
        desc_pl: "",
        desc_en: "",
        desc_de: "",
        price: "599.99",
        cost: "",
        category_id: "cat-hydraulika",
        equipment_type: "",
        min_order_qty: "0",
        technical_specs_json: "",
      }

      const result = (service as any).validateRow(row, 2)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e: any) => e.field === "min_order_qty")).toBe(
        true
      )
    })

    it("should detect invalid JSON in technical specs", () => {
      const row: ProductImportRow = {
        sku: "HYD-001",
        name_pl: "Pompa",
        name_en: "Pump",
        name_de: "Pumpe",
        desc_pl: "",
        desc_en: "",
        desc_de: "",
        price: "599.99",
        cost: "",
        category_id: "cat-hydraulika",
        equipment_type: "",
        min_order_qty: "",
        technical_specs_json: "{invalid json}",
      }

      const result = (service as any).validateRow(row, 2)

      expect(result.valid).toBe(false)
      expect(
        result.errors.some((e: any) => e.field === "technical_specs_json")
      ).toBe(true)
    })
  })

  describe("processRow", () => {
    it("should process a valid row", () => {
      const row: ProductImportRow = {
        sku: "HYD-001",
        name_pl: "Pompa hydrauliczna",
        name_en: "Hydraulic pump",
        name_de: "Hydraulische Pumpe",
        desc_pl: "Opis PL",
        desc_en: "Description EN",
        desc_de: "Beschreibung DE",
        price: "599.99",
        cost: "299.99",
        category_id: "cat-hydraulika",
        equipment_type: "Hydraulika",
        min_order_qty: "2",
        technical_specs_json: '{"power": "5kW", "pressure": "250bar"}',
      }

      const result = (service as any).processRow(row)

      expect(result.sku).toBe("HYD-001")
      expect(result.title).toBe("Pompa hydrauliczna")
      expect(result.price).toBe(599.99)
      expect(result.cost).toBe(299.99)
      expect(result.min_order_qty).toBe(2)
      expect(result.technical_specs).toEqual({
        power: "5kW",
        pressure: "250bar",
      })
      expect(result.translations.pl.title).toBe("Pompa hydrauliczna")
      expect(result.translations.en.title).toBe("Hydraulic pump")
      expect(result.translations.de.title).toBe("Hydraulische Pumpe")
    })

    it("should use defaults for missing optional fields", () => {
      const row: ProductImportRow = {
        sku: "HYD-001",
        name_pl: "Pompa",
        name_en: "",
        name_de: "",
        desc_pl: "",
        desc_en: "",
        desc_de: "",
        price: "599.99",
        cost: "",
        category_id: "cat-hydraulika",
        equipment_type: "",
        min_order_qty: "",
        technical_specs_json: "",
      }

      const result = (service as any).processRow(row)

      expect(result.cost).toBe(0)
      expect(result.min_order_qty).toBe(1)
      expect(result.technical_specs).toEqual({})
      expect(result.translations.en.title).toBe("Pompa") // Fallback to PL
      expect(result.translations.de.title).toBe("Pompa") // Fallback to PL
    })

    it("should fallback translations to Polish", () => {
      const row: ProductImportRow = {
        sku: "HYD-001",
        name_pl: "Pompa hydrauliczna",
        name_en: "",
        name_de: "",
        desc_pl: "Opis polski",
        desc_en: "",
        desc_de: "",
        price: "599.99",
        cost: "",
        category_id: "cat-hydraulika",
        equipment_type: "",
        min_order_qty: "",
        technical_specs_json: "",
      }

      const result = (service as any).processRow(row)

      expect(result.translations.en.title).toBe("Pompa hydrauliczna")
      expect(result.translations.de.title).toBe("Pompa hydrauliczna")
      expect(result.translations.en.description).toBe("Opis polski")
      expect(result.translations.de.description).toBe("Opis polski")
    })
  })

  describe("generateErrorReport", () => {
    it("should generate a formatted error report", () => {
      const errors = [
        {
          line: 15,
          field: "price",
          reason: "Price must be a positive number",
          value: "invalid",
        },
        {
          line: 42,
          field: "sku",
          reason: "SKU must match format XXX-000",
          value: "INVALID-SKU",
        },
        {
          line: 67,
          field: "price",
          reason: "Price must be a positive number",
          value: "-100",
        },
      ]

      const report = service.generateErrorReport(errors)

      expect(report).toContain("Import Error Report")
      expect(report).toContain("Total Errors: 3")
      expect(report).toContain("Errors by Field:")
      expect(report).toContain("price: 2 errors")
      expect(report).toContain("sku: 1 errors")
      expect(report).toContain("Line 15: price")
      expect(report).toContain("Line 42: sku")
      expect(report).toContain("Line 67: price")
    })

    it("should handle empty error list", () => {
      const report = service.generateErrorReport([])

      expect(report).toContain("Total Errors: 0")
    })
  })
})
