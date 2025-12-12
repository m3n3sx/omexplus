import { SearchAndAssistantContainer } from '@/components/SearchAndAssistantContainer'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'integration' })
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default function SearchAssistantPage({ 
  params 
}: { 
  params: { locale: string } 
}) {
  return (
    <SearchAndAssistantContainer
      language={params.locale}
      initialMode="assistant"
    />
  )
}
