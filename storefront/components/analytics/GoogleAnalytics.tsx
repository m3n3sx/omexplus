'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID // G-CB30RXPQ69

// Google Ads Conversion ID
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID // AW-751186138

// Google Tag Manager ID (optional)
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID // GT-MR8NT4D

// Track page views
function GoogleAnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    // Send page view to GA4
    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID && !GOOGLE_ADS_ID && !GTM_ID) {
    return null
  }

  const primaryId = GA_MEASUREMENT_ID || GOOGLE_ADS_ID || GTM_ID

  return (
    <>
      {/* Google Tag Manager / gtag.js */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          ${GA_MEASUREMENT_ID ? `gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });` : ''}
          
          ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ''}
          
          ${GTM_ID ? `gtag('config', '${GTM_ID}');` : ''}
        `}
      </Script>
      
      {/* Page view tracker */}
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>
    </>
  )
}

// ============ EVENT TRACKING HELPERS ============

// Declare gtag on window
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}
