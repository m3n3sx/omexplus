import { SearchAndAssistantContainer } from '@/components/SearchAndAssistantContainer'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'integration' })
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default function ZnajdzCzesciPage({ 
  params 
}: { 
  params: { locale: string } 
}) {
  return (
    <main className="min-h-screen">
      <SearchAndAssistantContainer
        language={params.locale}
        initialMode="assistant"
      />
    </main>
  )
}
