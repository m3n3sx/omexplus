'use client'

import { ReactNode } from 'react'
import { useCMSPage } from '@/hooks/useCMSPage'
import { CMSPageRenderer } from './CMSPageRenderer'

interface CMSPageWrapperProps {
  pageKey: string
  children: ReactNode // Fallback content (oryginalna strona)
}

/**
 * Wrapper który sprawdza czy strona ma treść w CMS.
 * Jeśli tak - renderuje treść z CMS.
 * Jeśli nie - renderuje oryginalną treść (children).
 */
export function CMSPageWrapper({ pageKey, children }: CMSPageWrapperProps) {
  const { content, loading, error } = useCMSPage(pageKey)

  // Podczas ładowania pokazuj oryginalną treść
  if (loading) {
    return <>{children}</>
  }

  // Jeśli błąd lub brak treści CMS - pokazuj oryginalną treść
  if (error || !content) {
    return <>{children}</>
  }

  // Jeśli treść CMS nie ma elementów - pokazuj oryginalną treść
  if (!content.content?.elements || content.content.elements.length === 0) {
    return <>{children}</>
  }

  // Renderuj treść z CMS
  return <CMSPageRenderer pageKey={pageKey} />
}

export default CMSPageWrapper
