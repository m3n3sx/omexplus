import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

interface MainCategoryCardProps {
  category: {
    id: string
    name: string
    description?: string
    handle: string
    product_count?: number
  }
}

export function MainCategoryCard({ category }: MainCategoryCardProps) {
  const locale = useLocale()
  const t = useTranslations('templates.category')
  
  // Generate description based on category name if not provided
  const getDescription = () => {
    if (category.description) return category.description
    
    const count = category.product_count || '40+'
    const descriptions: Record<string, string> = {
      'hydrauliczny': `Pompy, silniki, zawory, cylindry hydrauliczne - ${count} sprzedaży`,
      'silnik': `Części zamienne do silników, osprzęt - ${count} sprzedaży`,
      'filtry': `Filtry oleju, paliwa, powietrza - ${count} sprzedaży`,
      'elektryka': `Komponenty elektryczne, wiązki, czujniki - ${count} sprzedaży`,
      'hamulcowy': `Tarcze, klocki, cylindry hamulcowe - ${count} sprzedaży`,
      'chlodzenia': `Chłodnice, wentylatory, termostaty - ${count} sprzedaży`,
    }
    
    const handle = category.handle.toLowerCase()
    for (const [key, desc] of Object.entries(descriptions)) {
      if (handle.includes(key)) return desc
    }
    
    return `Szeroki wybór części i akcesoriów - ${count} sprzedaży`
  }
  
  return (
    <Link
      href={`/${locale}/categories/${category.handle}`}
      className="group block bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          {category.name}
        </h3>
        <p className="text-sm text-neutral-600 line-clamp-2">
          {getDescription()}
        </p>
      </div>
      
      <button className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors">
        {t('seeMore')}
        <svg 
          className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </Link>
  )
}
