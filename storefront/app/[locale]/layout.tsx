import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import '../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/components/providers/Providers'
import ChatWidget from '@/components/chat/ChatWidget'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'

const inter = Inter({ subsets: ['latin'] })

const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://ooxo.pl'

export const metadata: Metadata = {
  metadataBase: new URL(STORE_URL),
  title: {
    default: 'Części do maszyn budowlanych - OMEX | CAT, Komatsu, JCB',
    template: '%s | OMEX - Części do maszyn',
  },
  description: 'Wysokiej jakości części do maszyn budowlanych. Oferujemy oryginalne i zamienne części do CAT, Komatsu, DOOSAN, JCB. Szybka dostawa. Zaufaj nam!',
  keywords: ['części do maszyn budowlanych', 'części CAT', 'części Komatsu', 'części Bobcat', 'filtry do koparek', 'wałki obrotu', 'wieńce obrotu', 'części DOOSAN', 'części JCB'],
  authors: [{ name: 'OMEX' }],
  creator: 'OMEX',
  publisher: 'OMEX',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: STORE_URL,
    siteName: 'OMEX - Części do maszyn budowlanych',
    title: 'Części do maszyn budowlanych - OMEX',
    description: 'Wysokiej jakości części do maszyn budowlanych. CAT, Komatsu, DOOSAN, JCB. Szybka dostawa.',
    images: [
      {
        url: `${STORE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'OMEX - Części do maszyn budowlanych',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OMEX - Części do maszyn budowlanych',
    description: 'Wysokiej jakości części do maszyn budowlanych. CAT, Komatsu, JCB.',
    images: [`${STORE_URL}/images/og-image.jpg`],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: STORE_URL,
    languages: {
      'pl-PL': `${STORE_URL}/pl`,
      'en-US': `${STORE_URL}/en`,
      'de-DE': `${STORE_URL}/de`,
      'uk-UA': `${STORE_URL}/uk`,
    },
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Next.js 15: await params before accessing properties
  const { locale } = await params
  
  // Validate locale and load messages
  const validLocales = ['pl', 'en', 'de', 'uk']
  const validLocale = validLocales.includes(locale) ? locale : 'pl'
  
  let messages
  try {
    messages = (await import(`../../messages/${validLocale}.json`)).default
  } catch (error) {
    // Fallback to Polish if messages file not found
    messages = (await import(`../../messages/pl.json`)).default
  }

  return (
    <html lang={locale || 'pl'} suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <OrganizationSchema />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <ChatWidget />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
