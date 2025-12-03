'use client'

import { NewHeader } from '@/components/layout/NewHeader'
import { Hero } from '@/components/layout/Hero'
import { NewFooter } from '@/components/layout/NewFooter'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterSidebar } from '@/components/filters/FilterSidebar'

// Mock data
const mockProducts = [
  {
    id: '1',
    title: 'Pompa hydrauliczna Rexroth A2FO 23/61R-PBB05',
    handle: 'pompa-hydrauliczna-rexroth-a2fo',
    thumbnail: '/placeholder.svg',
    sku: 'HYD-001',
    inventory_quantity: 15,
    rating: 4.5,
    reviewCount: 23,
    metadata: {
      manufacturer_sku: 'REXROTH-2A2E-3456'
    },
    variants: [{
      prices: [{
        amount: 91958,
        currency_code: 'eur'
      }]
    }]
  },
  {
    id: '2',
    title: 'Filtr hydrauliczny Parker 926837Q',
    handle: 'filtr-hydrauliczny-parker',
    thumbnail: '/placeholder.svg',
    sku: 'FIL-045',
    inventory_quantity: 5,
    rating: 4.8,
    reviewCount: 45,
    metadata: {
      manufacturer_sku: 'PARKER-926837Q'
    },
    variants: [{
      prices: [{
        amount: 24500,
        currency_code: 'eur'
      }]
    }]
  },
  {
    id: '3',
    title: 'Łożysko kulkowe SKF 6205-2RS1',
    handle: 'lozysko-kulkowe-skf',
    thumbnail: '/placeholder.svg',
    sku: 'LOZ-089',
    inventory_quantity: 0,
    rating: 4.7,
    reviewCount: 67,
    metadata: {
      manufacturer_sku: 'SKF-6205-2RS1'
    },
    variants: [{
      prices: [{
        amount: 12340,
        currency_code: 'eur'
      }]
    }]
  },
  {
    id: '4',
    title: 'Silnik hydrauliczny Danfoss OMR 80',
    handle: 'silnik-hydrauliczny-danfoss',
    thumbnail: '/placeholder.svg',
    sku: 'SIL-034',
    inventory_quantity: 25,
    rating: 4.9,
    reviewCount: 89,
    metadata: {
      manufacturer_sku: 'DANFOSS-OMR80'
    },
    variants: [{
      prices: [{
        amount: 156700,
        currency_code: 'eur'
      }]
    }]
  },
  {
    id: '5',
    title: 'Przewód hydrauliczny 2SN DN12',
    handle: 'przewod-hydrauliczny',
    thumbnail: '/placeholder.svg',
    sku: 'PRZ-156',
    inventory_quantity: 120,
    rating: 4.3,
    reviewCount: 34,
    metadata: {
      manufacturer_sku: 'HYD-2SN-DN12'
    },
    variants: [{
      prices: [{
        amount: 4500,
        currency_code: 'eur'
      }]
    }]
  },
  {
    id: '6',
    title: 'Zawór hydrauliczny Bosch 0811404603',
    handle: 'zawor-hydrauliczny-bosch',
    thumbnail: '/placeholder.svg',
    sku: 'ZAW-078',
    inventory_quantity: 8,
    rating: 4.6,
    reviewCount: 56,
    metadata: {
      manufacturer_sku: 'BOSCH-0811404603'
    },
    variants: [{
      prices: [{
        amount: 89000,
        currency_code: 'eur'
      }]
    }]
  },
  {
    id: '7',
    title: 'Cylinder hydrauliczny 50/28/300',
    handle: 'cylinder-hydrauliczny',
    thumbnail: '/placeholder.svg',
    sku: 'CYL-234',
    inventory_quantity: 12,
    rating: 4.4,
    reviewCount: 28,
    metadata: {
      manufacturer_sku: 'CYL-50-28-300'
    },
    variants: [{
      prices: [{
        amount: 67800,
        currency_code: 'eur'
      }]
    }]
  },
  {
    id: '8',
    title: 'Uszczelnienie hydrauliczne 50x60x8',
    handle: 'uszczelnienie-hydrauliczne',
    thumbnail: '/placeholder.svg',
    sku: 'USZ-445',
    inventory_quantity: 234,
    rating: 4.2,
    reviewCount: 12,
    metadata: {
      manufacturer_sku: 'SEAL-50-60-8'
    },
    variants: [{
      prices: [{
        amount: 890,
        currency_code: 'eur'
      }]
    }]
  },
]

const mockCategories = [
  { id: '1', name: 'Hydraulika', count: 234 },
  { id: '2', name: 'Filtry', count: 156 },
  { id: '3', name: 'Osprzęt', count: 89 },
  { id: '4', name: 'Łożyska', count: 67 },
  { id: '5', name: 'Silniki', count: 45 },
]

const mockManufacturers = [
  { id: '1', name: 'Rexroth', count: 89 },
  { id: '2', name: 'Parker', count: 67 },
  { id: '3', name: 'Hydac', count: 45 },
  { id: '4', name: 'Bosch', count: 34 },
  { id: '5', name: 'Danfoss', count: 28 },
]

export default function DesignDemoPage() {
  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters)
  }

  const handleAddToCart = async (productId: string) => {
    console.log('Adding to cart:', productId)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NewHeader />
      <Hero />
      
      <main className="flex-1 container mx-auto">
        <div className="flex gap-6">
          <FilterSidebar 
            categories={mockCategories}
            manufacturers={mockManufacturers}
            onFilterChange={handleFilterChange}
          />
          
          <div className="flex-1">
            <div className="p-4 lg:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Wszystkie produkty
                  <span className="text-gray-600 text-lg ml-2">({mockProducts.length})</span>
                </h2>
                <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>Sortuj: Relevance</option>
                  <option>Cena: rosnąco</option>
                  <option>Cena: malejąco</option>
                  <option>Nazwa: A-Z</option>
                </select>
              </div>
              
              <ProductGrid 
                products={mockProducts}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </main>
      
      <NewFooter />
    </div>
  )
}
