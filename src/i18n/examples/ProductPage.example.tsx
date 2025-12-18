import { useTranslation } from '../hooks/useTranslation'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { formatCurrency, formatDate } from '../utils'

interface Product {
  id: string
  name: string
  price: number
  description: string
  inStock: boolean
  createdAt: Date
}

export function ProductPageExample({ product }: { product: Product }) {
  const { t, loading } = useTranslation()
  const locale = localStorage.getItem('locale') || 'pl'

  if (loading) {
    return <div>{t('common.loading')}</div>
  }

  return (
    <div className="container mx-auto p-6">
      {/* Przełącznik języka */}
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>

      {/* Strona produktu */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <img src={`/products/${product.id}.jpg`} alt={product.name} />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="mb-4">
            <span className="text-2xl font-bold">
              {formatCurrency(product.price, locale as any)}
            </span>
          </div>

          <div className="mb-4">
            {product.inStock ? (
              <span className="text-green-600">{t('products.inStock')}</span>
            ) : (
              <span className="text-red-600">{t('products.outOfStock')}</span>
            )}
          </div>

          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded"
            disabled={!product.inStock}
          >
            {t('products.addToCart')}
          </button>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">{t('products.description')}</h2>
            <p>{product.description}</p>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {t('common.added')}: {formatDate(product.createdAt, locale as any)}
          </div>
        </div>
      </div>
    </div>
  )
}
