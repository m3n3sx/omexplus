'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  titleHighlight?: string
  subtitle?: string
  breadcrumbs: BreadcrumbItem[]
}

export function PageHero({ title, titleHighlight, subtitle, breadcrumbs }: PageHeroProps) {
  const locale = useLocale()

  return (
    <>
      {/* Breadcrumb - simple version */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-4">
        <div className="text-sm text-secondary-500">
          {breadcrumbs.map((item, index) => (
            <span key={index}>
              {item.href ? (
                <Link href={item.href} className="text-primary-500 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
              {index < breadcrumbs.length - 1 && ' / '}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section - Induxter Dark Style */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 pb-8">
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 text-white relative overflow-hidden">
          {/* Orange accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          
          <div className="relative z-10">
            {subtitle && (
              <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">
                {subtitle}
              </span>
            )}
            <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading">
              {title}
              {titleHighlight && (
                <span className="text-primary-500"> {titleHighlight}</span>
              )}
            </h1>
          </div>
        </div>
      </div>
    </>
  )
}
