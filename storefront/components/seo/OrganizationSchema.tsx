'use client'

export function OrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://ooxo.pl'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OMEX - Części do maszyn budowlanych',
    alternateName: 'OMEX',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: 'Profesjonalny dostawca części do maszyn budowlanych. Filtry, oleje, wieńce obrotu, wałki i części zamienne do CAT, Komatsu, Bobcat, JCB i innych.',
    foundingDate: '2007',
    sameAs: [
      'https://www.facebook.com/omexplus',
      'https://www.linkedin.com/company/omex-czesci',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+48-61-XXX-XXXX',
        email: 'kontakt@ooxo.pl',
        areaServed: ['PL', 'EU'],
        availableLanguage: ['pl', 'en', 'de', 'uk'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: '+48-61-XXX-XXXX',
        email: 'sprzedaz@ooxo.pl',
        areaServed: ['PL', 'EU'],
        availableLanguage: ['pl', 'en'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Przykładowa 1',
      addressLocality: 'Poznań',
      addressRegion: 'Wielkopolskie',
      postalCode: '60-001',
      addressCountry: 'PL',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  )
}
