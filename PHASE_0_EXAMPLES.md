# 💡 Phase 0 - Usage Examples

## 🔍 Search Examples

### Example 1: Basic Product Search
```typescript
// Frontend code
const searchProducts = async (query: string) => {
  const response = await fetch(
    `${API_URL}/store/search?q=${encodeURIComponent(query)}`
  )
  const data = await response.json()
  
  console.log(`Found ${data.total} products`)
  return data.products
}

// Usage
const products = await searchProducts("pompa hydrauliczna")
```

### Example 2: Advanced Search with Filters
```typescript
const advancedSearch = async (params: {
  query: string
  minPrice?: number
  maxPrice?: number
  category?: string
  inStock?: boolean
}) => {
  const queryParams = new URLSearchParams({
    q: params.query,
    ...(params.minPrice && { min_price: params.minPrice.toString() }),
    ...(params.maxPrice && { max_price: params.maxPrice.toString() }),
    ...(params.category && { category_id: params.category }),
    ...(params.inStock && { in_stock: 'true' }),
  })

  const response = await fetch(`${API_URL}/store/search?${queryParams}`)
  return response.json()
}

// Usage
const results = await advancedSearch({
  query: "pompa",
  minPrice: 500,
  maxPrice: 1500,
  inStock: true
})
```

### Example 3: Autocomplete Search
```typescript
const getAutocomplete = async (prefix: string) => {
  const response = await fetch(
    `${API_URL}/store/search/autocomplete?q=${prefix}&limit=5`
  )
  const data = await response.json()
  return data.suggestions
}

// Usage in React
const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (query.length >= 2) {
      getAutocomplete(query).then(setSuggestions)
    }
  }, [query])

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj produktów..."
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map(s => <li key={s}>{s}</li>)}
        </ul>
      )}
    </div>
  )
}
```

### Example 4: Search by Manufacturer SKU
```typescript
const findByManufacturerSKU = async (sku: string) => {
  const response = await fetch(
    `${API_URL}/store/search/manufacturer-sku?sku=${sku}`
  )
  const data = await response.json()
  
  if (data.count === 0) {
    console.log("Product not found")
    return null
  }
  
  return data.products[0]
}

// Usage
const product = await findByManufacturerSKU("REXROTH-2A2E-3456")
```

## 🏭 Manufacturer Examples

### Example 5: List All Manufacturers
```typescript
const getManufacturers = async () => {
  const response = await fetch(`${API_URL}/admin/manufacturers`)
  const data = await response.json()
  return data.manufacturers
}

// Usage in React
const ManufacturerList = () => {
  const [manufacturers, setManufacturers] = useState([])

  useEffect(() => {
    getManufacturers().then(setManufacturers)
  }, [])

  return (
    <div>
      {manufacturers.map(mfr => (
        <div key={mfr.id}>
          <h3>{mfr.name}</h3>
          <p>{mfr.country}</p>
          <a href={mfr.website_url}>Website</a>
        </div>
      ))}
    </div>
  )
}
```

### Example 6: Create Manufacturer
```typescript
const createManufacturer = async (data: {
  name: string
  slug: string
  website_url?: string
  country?: string
}) => {
  const response = await fetch(`${API_URL}/admin/manufacturers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  return response.json()
}

// Usage
const newManufacturer = await createManufacturer({
  name: "Rexroth",
  slug: "rexroth",
  website_url: "https://www.boschrexroth.com",
  country: "Germany"
})
```

## 🎯 SEO Examples

### Example 7: Generate Product SEO
```typescript
const generateProductSEO = (product: any) => {
  return {
    meta_title: `${product.title} | OMEX`,
    meta_description: product.description.substring(0, 160),
    slug: product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    canonical_url: `https://omex.pl/produkty/${product.sku.toLowerCase()}`,
    structured_data: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description,
      sku: product.sku,
      image: product.thumbnail,
      brand: {
        "@type": "Brand",
        name: product.manufacturer_name
      },
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "PLN",
        availability: product.stock > 0 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock"
      }
    }
  }
}

// Usage
const seoData = generateProductSEO(product)
```

### Example 8: Product Page with SEO
```typescript
// Next.js page with SEO
import Head from 'next/head'

const ProductPage = ({ product }) => {
  return (
    <>
      <Head>
        <title>{product.meta_title}</title>
        <meta name="description" content={product.meta_description} />
        <link rel="canonical" href={product.canonical_url} />
        
        {/* Open Graph */}
        <meta property="og:title" content={product.og_title} />
        <meta property="og:description" content={product.og_description} />
        <meta property="og:image" content={product.og_image} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(product.structured_data)}
        </script>
      </Head>
      
      <div>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <p>Price: {product.price} PLN</p>
      </div>
    </>
  )
}
```

## 💼 B2B Examples

### Example 9: Create Quote
```typescript
const createQuote = async (data: {
  customer_id: string
  items: Array<{
    product_id: string
    quantity: number
  }>
}) => {
  const response = await fetch(`${API_URL}/admin/b2b/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  return response.json()
}

// Usage
const quote = await createQuote({
  customer_id: "cust_123",
  items: [
    { product_id: "prod_hyd001", quantity: 75 }
  ]
})
```

### Example 10: Calculate B2B Pricing
```typescript
const calculateB2BPrice = (product: any, quantity: number) => {
  const tiers = product.pricing_tiers || {
    "1-10": { discount: 0 },
    "11-50": { discount: 0.075 },
    "51-100": { discount: 0.13 },
    "100+": { discount: 0.18 }
  }

  let discount = 0
  if (quantity >= 100) discount = tiers["100+"].discount
  else if (quantity >= 51) discount = tiers["51-100"].discount
  else if (quantity >= 11) discount = tiers["11-50"].discount
  else discount = tiers["1-10"].discount

  const unitPrice = product.price * (1 - discount)
  const totalPrice = unitPrice * quantity

  return {
    quantity,
    unit_price: unitPrice,
    total_price: totalPrice,
    discount_percent: discount * 100,
    savings: (product.price - unitPrice) * quantity
  }
}

// Usage
const pricing = calculateB2BPrice(product, 75)
console.log(`Unit price: ${pricing.unit_price} PLN`)
console.log(`Total: ${pricing.total_price} PLN`)
console.log(`You save: ${pricing.savings} PLN (${pricing.discount_percent}%)`)
```

## 🧪 Testing Examples

### Example 11: Integration Test
```typescript
describe('Phase 0 - Search', () => {
  it('should search products by text', async () => {
    const response = await fetch(
      'http://localhost:9000/store/search?q=pompa'
    )
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.products).toBeInstanceOf(Array)
    expect(data.total).toBeGreaterThan(0)
  })

  it('should filter by price range', async () => {
    const response = await fetch(
      'http://localhost:9000/store/search?q=pompa&min_price=500&max_price=1500'
    )
    const data = await response.json()
    
    data.products.forEach(product => {
      expect(product.price).toBeGreaterThanOrEqual(500)
      expect(product.price).toBeLessThanOrEqual(1500)
    })
  })

  it('should autocomplete search', async () => {
    const response = await fetch(
      'http://localhost:9000/store/search/autocomplete?q=pom'
    )
    const data = await response.json()
    
    expect(data.suggestions).toBeInstanceOf(Array)
    expect(data.suggestions.length).toBeGreaterThan(0)
  })
})
```

### Example 12: Load Test
```bash
# Using Apache Bench
ab -n 1000 -c 10 "http://localhost:9000/store/search?q=pompa"

# Using curl in loop
for i in {1..100}; do
  curl -s "http://localhost:9000/store/search?q=pompa&page=$i" > /dev/null
  echo "Request $i completed"
done
```

## 📊 Analytics Examples

### Example 13: Track Search Queries
```typescript
const trackSearch = async (query: string, resultsCount: number) => {
  await fetch(`${API_URL}/analytics/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      results_count: resultsCount,
      timestamp: new Date().toISOString()
    })
  })
}

// Usage
const results = await searchProducts("pompa")
await trackSearch("pompa", results.length)
```

### Example 14: Popular Searches Widget
```typescript
const PopularSearches = () => {
  const [searches, setSearches] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/analytics/popular-searches?limit=10`)
      .then(r => r.json())
      .then(data => setSearches(data.searches))
  }, [])

  return (
    <div>
      <h3>Popularne wyszukiwania</h3>
      <ul>
        {searches.map(search => (
          <li key={search.query}>
            <a href={`/search?q=${search.query}`}>
              {search.query} ({search.count})
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## 🚀 Performance Tips

1. **Use pagination** - Always limit results
2. **Cache sitemap** - Generate once per day
3. **Index search fields** - Ensure DB indexes exist
4. **Debounce autocomplete** - Wait 300ms before searching
5. **Use CDN for images** - Store product images on CDN
