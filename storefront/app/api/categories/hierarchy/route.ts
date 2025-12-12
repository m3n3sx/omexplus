import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  priority: number
  productCount: number
  subcategories?: Category[]
}

export async function GET() {
  try {
    // Fetch categories from backend API
    const response = await fetch(`${BACKEND_URL}/store/categories-direct`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }

    const data = await response.json()
    
    // Transform backend response to match frontend format
    const transformCategory = (cat: any): Category => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      priority: cat.priority || 0,
      productCount: 0, // Backend doesn't provide this yet
      subcategories: cat.children ? cat.children.map(transformCategory) : []
    })
    
    const categories = data.tree.map(transformCategory)
    
    return NextResponse.json({
      categories,
      count: categories.length
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    
    // Return empty array instead of error to prevent UI breaking
    return NextResponse.json({
      categories: [],
      count: 0
    })
  }
}
