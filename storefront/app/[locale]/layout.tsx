import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import '../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/components/providers/Providers'
import ChatWidget from '@/components/chat/ChatWidget'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Części do maszyn budowlanych - OMEX | CAT, Komatsu, JCB',
  description: 'Wysokiej jakości części do maszyn budowlanych. Oferujemy oryginalne i zamienne części do CAT, Komatsu, DOOSAN, JCB. Szybka dostawa. Zaufaj nam!',
  keywords: 'części do maszyn budowlanych, części CAT, części Komatsu, części Bobcat, filtry do koparek, wałki obrotu, wieńce obrotu, części DOOSAN, części JCB',
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
