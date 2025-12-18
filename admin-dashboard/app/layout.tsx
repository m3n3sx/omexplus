import type { Metadata } from "next"
import "./globals.css"
import { ToastProvider } from "@/components/ui/Toast"

export const metadata: Metadata = {
  title: "OMEX Admin Dashboard",
  description: "E-commerce admin dashboard for OMEX",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
