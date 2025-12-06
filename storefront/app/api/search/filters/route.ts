import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'medusa-my-medusa-store',
  user: 'postgres',
  password: 'supersecret',
})

export async function GET() {
  try {
    // Get unique machine brands from product metadata
    const brandsQuery = `
      SELECT DISTINCT 
        jsonb_array_elements_text(metadata->'compatible_machines') as brand
      FROM product
      WHERE metadata ? 'compatible_machines'
        AND deleted_at IS NULL
      ORDER BY brand
      LIMIT 20
    `
    
    const brandsResult = await pool.query(brandsQuery)
    const machineBrands = brandsResult.rows.map(row => row.brand).filter(Boolean)

    // Get unique manufacturers from product metadata
    const manufacturersQuery = `
      SELECT DISTINCT 
        metadata->>'manufacturer' as manufacturer
      FROM product
      WHERE metadata ? 'manufacturer'
        AND deleted_at IS NULL
      ORDER BY manufacturer
      LIMIT 20
    `
    
    const manufacturersResult = await pool.query(manufacturersQuery)
    const manufacturers = manufacturersResult.rows.map(row => row.manufacturer).filter(Boolean)

    return NextResponse.json({
      machineBrands: {
        options: machineBrands.length > 0 ? machineBrands : [
          'Caterpillar', 'Komatsu', 'Volvo', 'JCB', 'Hitachi', 
          'Liebherr', 'Doosan', 'Hyundai', 'Case', 'New Holland'
        ]
      },
      availability: {
        options: [
          { value: 'in-stock', label: 'Na stanie' },
          { value: 'low-stock', label: 'Niski stan' },
          { value: 'pre-order', label: 'Przedsprzedaż' },
          { value: 'out-of-stock', label: 'Brak w magazynie' }
        ]
      },
      partTypes: {
        options: [
          { value: 'oem', label: 'Oryginalne (OEM)' },
          { value: 'aftermarket', label: 'Zamienniki' },
          { value: 'refurbished', label: 'Regenerowane' },
          { value: 'used', label: 'Używane' }
        ]
      },
      manufacturers: {
        options: manufacturers.length > 0 ? manufacturers : [
          'Caterpillar', 'Komatsu', 'Volvo', 'JCB', 'Hitachi',
          'Parker', 'Bosch Rexroth', 'Eaton', 'Danfoss', 'Hydac'
        ]
      },
      sortBy: {
        options: [
          { value: 'best-selling', label: 'Najlepiej sprzedające się' },
          { value: 'price-asc', label: 'Cena: od najniższej' },
          { value: 'price-desc', label: 'Cena: od najwyższej' },
          { value: 'newest', label: 'Najnowsze' },
          { value: 'rating', label: 'Najwyżej oceniane' },
          { value: 'name-asc', label: 'Nazwa: A-Z' },
          { value: 'name-desc', label: 'Nazwa: Z-A' }
        ]
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    
    // Return default options even on error
    return NextResponse.json({
      machineBrands: {
        options: ['Caterpillar', 'Komatsu', 'Volvo', 'JCB', 'Hitachi', 'Liebherr', 'Doosan', 'Hyundai', 'Case', 'New Holland']
      },
      availability: {
        options: [
          { value: 'in-stock', label: 'Na stanie' },
          { value: 'low-stock', label: 'Niski stan' },
          { value: 'pre-order', label: 'Przedsprzedaż' },
          { value: 'out-of-stock', label: 'Brak w magazynie' }
        ]
      },
      partTypes: {
        options: [
          { value: 'oem', label: 'Oryginalne (OEM)' },
          { value: 'aftermarket', label: 'Zamienniki' },
          { value: 'refurbished', label: 'Regenerowane' },
          { value: 'used', label: 'Używane' }
        ]
      },
      manufacturers: {
        options: ['Caterpillar', 'Komatsu', 'Volvo', 'JCB', 'Hitachi', 'Parker', 'Bosch Rexroth', 'Eaton', 'Danfoss', 'Hydac']
      },
      sortBy: {
        options: [
          { value: 'best-selling', label: 'Najlepiej sprzedające się' },
          { value: 'price-asc', label: 'Cena: od najniższej' },
          { value: 'price-desc', label: 'Cena: od najwyższej' },
          { value: 'newest', label: 'Najnowsze' },
          { value: 'rating', label: 'Najwyżej oceniane' },
          { value: 'name-asc', label: 'Nazwa: A-Z' },
          { value: 'name-desc', label: 'Nazwa: Z-A' }
        ]
      }
    })
  }
}
