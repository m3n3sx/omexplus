'use client'

import { ReactNode } from 'react'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { NotificationProvider } from '@/components/templates'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}
