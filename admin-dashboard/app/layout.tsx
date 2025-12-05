import type { Metadata } from "next"
import "./globals.css"

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
      <body>{children}</body>
    </html>
  )
}
