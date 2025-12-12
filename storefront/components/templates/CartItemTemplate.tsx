import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

interface CartItemProps {
  item: {
    id: string
    title: string
    handle: string
    thumbnail?: string
    quantity: number
    price: number
    currency: string
    variant?: {
      title?: string
    }
  }
  onUpdateQuantity?: (id: string, quantity: number) => void
  onRemove?: (id: string) => void
}

export function CartItemTemplate({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const locale = useLocale()
  const t = useTranslations('templates.cart')

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-200">
      {/* Product Image */}
      <Link href={`/${locale}/products/${item.handle}`} className="flex-shrink-0">
        <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              📦
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/${locale}/products/${item.handle}`}
          className="font-bold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2"
        >
          {item.title}
        </Link>
        {item.variant?.title && (
          <p className="text-sm text-neutral-600 mt-1">{item.variant.title}</p>
        )}

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-neutral-300 rounded-lg">
            <button
              onClick={() => onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
              className="px-3 py-1 hover:bg-neutral-100 transition-colors"
              aria-label={t('decreaseQuantity')}
            >
              −
            </button>
            <span className="px-4 py-1 border-x border-neutral-300 font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
              className="px-3 py-1 hover:bg-neutral-100 transition-colors"
              aria-label={t('increaseQuantity')}
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemove?.(item.id)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            {t('remove')}
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <div className="font-bold text-lg text-neutral-900">
          {(item.price * item.quantity).toFixed(2)} {item.currency}
        </div>
        <div className="text-sm text-neutral-600 mt-1">
          {item.price.toFixed(2)} {item.currency} / {t('perItem')}
        </div>
      </div>
    </div>
  )
}
