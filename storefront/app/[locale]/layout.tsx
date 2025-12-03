import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import '../globals.css'
import { NewHeader } from '@/components/layout/NewHeader'
import { NewFooter } from '@/components/layout/NewFooter'
import { Providers } from '@/components/providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OMEX - Części do Maszyn Budowlanych',
  description: 'Profesjonalny sklep B2B z częściami do maszyn budowlanych',
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
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <NewHeader />
              <main className="flex-1">
                {children}
              </main>
              <NewFooter />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
