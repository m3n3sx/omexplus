import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /admin/products/import/template
 * Download CSV template for product import
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { type = 'basic' } = req.query

  try {
    let csv = 'SKU,name_pl,name_en,name_de,desc_pl,desc_en,desc_de,price,cost,category_id,equipment_type,min_order_qty,technical_specs_json\n'

    if (type === 'sample') {
      // Include sample data
      csv += 'HYD-001,Pompa hydrauliczna,Hydraulic pump,Hydraulische Pumpe,Pompa tłokowa osiowa,Variable displacement pump,Axialkolbenpumpe,2499.99,1249.99,cat-hydraulika,Hydraulika,1,"{""displacement"": ""28cc"", ""pressure"": ""280bar""}"\n'
      csv += 'FLT-001,Filtr oleju,Oil filter,Ölfilter,Filtr oleju silnikowego,Engine oil filter,Motorölfilter,49.99,24.99,cat-filtry,Filtry,2,"{""filtration"": ""25μm"", ""flow"": ""150L/min""}"\n'
      csv += 'SPW-001,Przewód hydrauliczny,Hydraulic hose,Hydraulikschlauch,Przewód hydrauliczny dwuoplotowy,Two-wire braided hose,Zweifach geflochtener Schlauch,15.99,7.99,cat-osprzet,Osprzęt,5,"{""pressure"": ""400bar"", ""diameter"": ""12mm""}"\n'
    }

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="product-import-template.csv"`)
    res.send(csv)

  } catch (error: any) {
    console.error('Failed to generate template:', error)
    res.status(500).json({
      error: {
        code: 'TEMPLATE_GENERATION_FAILED',
        message: error.message,
      },
    })
  }
}
