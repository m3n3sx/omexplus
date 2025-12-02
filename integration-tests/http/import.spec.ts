import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createReadStream } from "fs"
import { join } from "path"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer, api }) => {
    describe("Bulk Product Import", () => {
      let container: any

      beforeAll(() => {
        container = getContainer()
      })

      describe("POST /admin/products/import/validate", () => {
        it("should validate CSV successfully", async () => {
          const csvContent = `SKU,name_pl,name_en,name_de,desc_pl,desc_en,desc_de,price,cost,category_id,equipment_type,min_order_qty,technical_specs_json
HYD-001,Pompa hydrauliczna,Hydraulic pump,Hydraulische Pumpe,Opis,Description,Beschreibung,599.99,299.99,cat-hydraulika,Hydraulika,1,"{""power"": ""5kW""}"`

          const response = await api.post(
            "/admin/products/import/validate",
            {
              file: Buffer.from(csvContent),
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )

          expect(response.status).toBe(200)
          expect(response.data).toHaveProperty("valid")
          expect(response.data).toHaveProperty("total_rows")
          expect(response.data).toHaveProperty("validation_errors")
        })

        it("should detect invalid SKU format", async () => {
          const csvContent = `SKU,name_pl,name_en,name_de,desc_pl,desc_en,desc_de,price,cost,category_id,equipment_type,min_order_qty,technical_specs_json
INVALID,Pompa,Pump,Pumpe,Opis,Description,Beschreibung,599.99,299.99,cat-hydraulika,Hydraulika,1,"{}"`

          const response = await api.post(
            "/admin/products/import/validate",
            {
              file: Buffer.from(csvContent),
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.valid).toBe(false)
          expect(response.data.validation_errors.length).toBeGreaterThan(0)
          expect(response.data.validation_errors[0].field).toBe("sku")
        })

        it("should detect missing required fields", async () => {
          const csvContent = `SKU,name_pl,name_en,name_de,desc_pl,desc_en,desc_de,price,cost,category_id,equipment_type,min_order_qty,technical_specs_json
HYD-001,,Pump,Pumpe,Opis,Description,Beschreibung,599.99,299.99,cat-hydraulika,Hydraulika,1,"{}"`

          const response = await api.post(
            "/admin/products/import/validate",
            {
              file: Buffer.from(csvContent),
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.valid).toBe(false)
          expect(
            response.data.validation_errors.some(
              (e: any) => e.field === "name_pl"
            )
          ).toBe(true)
        })

        it("should detect invalid price", async () => {
          const csvContent = `SKU,name_pl,name_en,name_de,desc_pl,desc_en,desc_de,price,cost,category_id,equipment_type,min_order_qty,technical_specs_json
HYD-001,Pompa,Pump,Pumpe,Opis,Description,Beschreibung,-599.99,299.99,cat-hydraulika,Hydraulika,1,"{}"`

          const response = await api.post(
            "/admin/products/import/validate",
            {
              file: Buffer.from(csvContent),
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.valid).toBe(false)
          expect(
            response.data.validation_errors.some((e: any) => e.field === "price")
          ).toBe(true)
        })

        it("should detect invalid JSON in technical specs", async () => {
          const csvContent = `SKU,name_pl,name_en,name_de,desc_pl,desc_en,desc_de,price,cost,category_id,equipment_type,min_order_qty,technical_specs_json
HYD-001,Pompa,Pump,Pumpe,Opis,Description,Beschreibung,599.99,299.99,cat-hydraulika,Hydraulika,1,"{invalid json}"`

          const response = await api.post(
            "/admin/products/import/validate",
            {
              file: Buffer.from(csvContent),
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.valid).toBe(false)
          expect(
            response.data.validation_errors.some(
              (e: any) => e.field === "technical_specs_json"
            )
          ).toBe(true)
        })
      })

      describe("PUT /admin/products/import", () => {
        it("should import valid products", async () => {
          const csvContent = `SKU,name_pl,name_en,name_de,desc_pl,desc_en,desc_de,price,cost,category_id,equipment_type,min_order_qty,technical_specs_json
HYD-001,Pompa hydrauliczna,Hydraulic pump,Hydraulische Pumpe,Opis,Description,Beschreibung,599.99,299.99,cat-hydraulika,Hydraulika,1,"{""power"": ""5kW""}"
HYD-002,Zawór,Valve,Ventil,Opis,Description,Beschreibung,899.99,449.99,cat-hydraulika,Hydraulika,1,"{""flow"": ""80L/min""}"`

          const response = await api.put(
            "/admin/products/import",
            {
              file: Buffer.from(csvContent),
            }
          )

          expect(response.status).toBe(200)
          expect(response.data).toHaveProperty("status")
          expect(response.data).toHaveProperty("total")
          expect(response.data).toHaveProperty("successful")
          expect(response.data).toHaveProperty("failed")
          expect(response.data.total).toBe(2)
        })

        it("should reject non-CSV files", async () => {
          const response = await api.put(
            "/admin/products/import",
            {
              file: Buffer.from("not a csv"),
            },
            {
              headers: {
                "Content-Type": "text/plain",
              },
            }
          )

          expect(response.status).toBe(400)
          expect(response.data.error.code).toBe("INVALID_FILE_TYPE")
        })

        it("should reject request without file", async () => {
          const response = await api.put("/admin/products/import", {})

          expect(response.status).toBe(400)
          expect(response.data.error.code).toBe("NO_FILE")
        })
      })

      describe("GET /admin/products/import/template", () => {
        it("should download basic template", async () => {
          const response = await api.get(
            "/admin/products/import/template?type=basic"
          )

          expect(response.status).toBe(200)
          expect(response.headers["content-type"]).toContain("text/csv")
          expect(response.data).toContain("SKU,name_pl")
        })

        it("should download template with sample data", async () => {
          const response = await api.get(
            "/admin/products/import/template?type=sample"
          )

          expect(response.status).toBe(200)
          expect(response.data).toContain("HYD-001")
        })
      })

      describe("GET /admin/products/import/stats", () => {
        it("should return import statistics", async () => {
          const response = await api.get("/admin/products/import/stats")

          expect(response.status).toBe(200)
          expect(response.data).toHaveProperty("total_imports")
          expect(response.data).toHaveProperty("successful_products")
          expect(response.data).toHaveProperty("failed_products")
          expect(response.data).toHaveProperty("success_rate")
        })
      })

      describe("GET /admin/products/import/history", () => {
        it("should list import history", async () => {
          const response = await api.get("/admin/products/import/history")

          expect(response.status).toBe(200)
          expect(response.data).toHaveProperty("imports")
          expect(response.data).toHaveProperty("count")
          expect(response.data).toHaveProperty("limit")
          expect(response.data).toHaveProperty("offset")
        })

        it("should support pagination", async () => {
          const response = await api.get(
            "/admin/products/import/history?limit=5&offset=10"
          )

          expect(response.status).toBe(200)
          expect(response.data.limit).toBe(5)
          expect(response.data.offset).toBe(10)
        })

        it("should filter by status", async () => {
          const response = await api.get(
            "/admin/products/import/history?status=completed"
          )

          expect(response.status).toBe(200)
        })
      })
    })
  },
})
