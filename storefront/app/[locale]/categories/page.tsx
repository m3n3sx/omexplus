'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function CategoriesPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [availability, setAvailability] = useState<string[]>(['in-stock'])
  const [sortBy, setSortBy] = useState('name')

  const categories = [
    { id: 'kola', name: 'Koła', count: 150 },
    { id: 'walki', name: 'Wałki', count: 120 },
    { id: 'hydraulika', name: 'Hydraulika', count: 300 },
    { id: 'uszczelnienia', name: 'Uszczelnienia', count: 200 },
    { id: 'lozyska', name: 'Łożyska', count: 180 },
  ]

  const brands = [
    { id: 'cat', name: 'CAT', count: 450 },
    { id: 'komatsu', name: 'Komatsu', count: 380 },
    { id: 'jcb', name: 'JCB', count: 320 },
    { id: 'volvo', name: 'Volvo', count: 290 },
    { id: 'case', name: 'Case', count: 250 },
    { id: 'hitachi', name: 'Hitachi', count: 220 },
  ]

  const products = [
    { id: 1, name: 'Pompa hydrauliczna CAT 320', sku: 'CAT-HYD-001', price: 2500, stock: 12, status: 'in-stock' },
    { id: 2, name: 'Koło gąsienicowe Komatsu', sku: 'KOM-WHE-002', price: 1800, stock: 8, status: 'in-stock' },
    { id: 3, name: 'Filtr oleju Volvo', sku: 'VOL-FIL-003', price: 1200, stock: 0, status: 'order' },
    { id: 4, name: 'Wałek obrotu JCB', sku: 'JCB-SHA-004', price: 3200, stock: 15, status: 'in-stock' },
  ]

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const toggleBrand = (id: string) => {
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          fontSize: '0.875rem',
          color: '#6b7280',
        }}>
          <Link href="/" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Home</Link>
          {' > '}
          <span>Katalog</span>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        display: 'flex',
        gap: '2rem',
      }}>
        {/* Sidebar - 25% */}
        <aside style={{
          width: '300px',
          flexShrink: 0,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
            }}>
              Filtry
            </h2>

            {/* Categories */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151',
              }}>
                Kategorie
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                {categories.map(cat => (
                  <label
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.875rem', flex: 1 }}>{cat.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>({cat.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151',
              }}>
                Marki
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                {brands.map(brand => (
                  <label
                    key={brand.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => toggleBrand(brand.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.875rem', flex: 1 }}>{brand.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>({brand.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151',
              }}>
                Zakres cen
              </h3>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '0.5rem',
              }}>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  placeholder="Min"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                  }}
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  placeholder="Max"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                PLN {priceRange.min} - {priceRange.max}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151',
              }}>
                Dostępność
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.875rem' }}>Na magazynie</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.875rem' }}>Zamówienie</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.875rem' }}>Brak</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - 75% */}
        <main style={{ flex: 1 }}>
          {/* Search & Sort */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}>
            <input
              type="text"
              placeholder="Szukaj w kategorii..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.875rem',
              }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              <option value="name">Nazwa A-Z</option>
              <option value="price-asc">Cena rosnąco</option>
              <option value="price-desc">Cena malejąco</option>
              <option value="newest">Najnowsze</option>
            </select>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {products.map(product => (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  fontSize: '4rem',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  backgroundColor: '#f3f4f6',
                  padding: '2rem',
                  borderRadius: '8px',
                }}>
                  📦
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#374151',
                }}>
                  {product.name}
                </h3>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                }}>
                  SKU: {product.sku}
                </p>
                <div style={{
                  fontSize: '0.75rem',
                  marginBottom: '1rem',
                  color: product.stock > 0 ? '#10b981' : '#f59e0b',
                }}>
                  {product.stock > 0 ? `✓ ${product.stock}x na magazynie` : '⏳ Zamówienie'}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#0ea5e9',
                  }}>
                    {product.price} PLN
                  </span>
                  <button style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: product.stock > 0 ? '#0ea5e9' : '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}>
                    {product.stock > 0 ? 'Dodaj' : 'Zamów'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            {[1, 2, 3].map(page => (
              <button
                key={page}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: page === 1 ? '#0ea5e9' : 'white',
                  color: page === 1 ? 'white' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
