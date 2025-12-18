import { useTranslation } from '../hooks/useTranslation'
import { formatCurrency } from '../utils'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export function CartPageExample({ items }: { items: CartItem[] }) {
  const { t } = useTranslation()
  const locale = localStorage.getItem('locale') || 'pl'

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 15
  const tax = subtotal * 0.23
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl mb-4">{t('cart.title')}</h1>
        <p className="text-gray-600 mb-4">{t('cart.empty')}</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded">
          {t('cart.continueShopping')}
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t('cart.title')}</h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          {items.map(item => (
            <div key={item.id} className="border-b py-4 flex justify-between">
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-gray-600">
                  {t('cart.quantity')}: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  {formatCurrency(item.price * item.quantity, locale as any)}
                </p>
                <button className="text-red-600 text-sm">
                  {t('cart.removeItem')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">{t('checkout.orderSummary')}</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}</span>
              <span>{formatCurrency(subtotal, locale as any)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('cart.shipping')}</span>
              <span>{formatCurrency(shipping, locale as any)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('cart.tax')}</span>
              <span>{formatCurrency(tax, locale as any)}</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between font-bold text-lg">
              <span>{t('cart.total')}</span>
              <span>{formatCurrency(total, locale as any)}</span>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded">
            {t('cart.proceedToCheckout')}
          </button>
        </div>
      </div>
    </div>
  )
}
