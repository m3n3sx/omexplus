'use client'

interface Product {
  id: string
  title: string
  handle: string
  thumbnail?: string
  variants?: Array<{
    id: string
    sku?: string
    title?: string
  }>
  metadata?: {
    machine_brand?: string
    machine_model?: string
  }
}

interface ProductCardsProps {
  products: Product[]
  language: string
  onProductClick?: (product: Product) => void
  onAddToCart?: (product: Product) => void
}

export function ProductCards({ 
  products, 
  language, 
  onProductClick,
  onAddToCart 
}: ProductCardsProps) {
  if (!products || products.length === 0) return null

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs text-neutral-500 px-1">
        {language === 'pl' 
          ? `Znaleziono ${products.length} produktów:` 
          : `Found ${products.length} products:`}
      </p>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {products.slice(0, 4).map((product) => (
          <div 
            key={product.id}
            className="bg-white border border-neutral-200 rounded-lg p-3 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => onProductClick?.(product)}
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              {product.thumbnail ? (
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  className="w-14 h-14 object-cover rounded"
                />
              ) : (
                <div className="w-14 h-14 bg-neutral-100 rounded flex items-center justify-center">
                  <span className="text-2xl">🔧</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-neutral-900 line-clamp-2">
                  {product.title}
                </h4>
                
                {product.variants?.[0]?.sku && (
                  <p className="text-xs text-neutral-500 mt-0.5">
                    SKU: {product.variants[0].sku}
                  </p>
                )}

                {product.metadata?.machine_brand && (
                  <p className="text-xs text-primary-600 mt-0.5">
                    {product.metadata.machine_brand} {product.metadata.machine_model || ''}
                  </p>
                )}
              </div>

              {/* Add to cart button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart?.(product)
                }}
                className="self-center px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors"
              >
                {language === 'pl' ? 'Dodaj' : 'Add'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length > 4 && (
        <button 
          className="w-full text-center text-sm text-primary-600 hover:text-primary-700 py-2"
          onClick={() => onProductClick?.(products[0])}
        >
          {language === 'pl' 
            ? `Zobacz wszystkie (${products.length})` 
            : `View all (${products.length})`}
        </button>
      )}
    </div>
  )
}
