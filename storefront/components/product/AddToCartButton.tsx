'use client'

import { useState } from 'react'
import { useCartContext } from '@/contexts/CartContext'

interface AddToCartButtonProps {
  variantId: string
  disabled?: boolean
  className?: string
}

export function AddToCartButton({ variantId, disabled, className }: AddToCartButtonProps) {
  const { addItem, loading } = useCartContext()
  const [quantity, setQuantity] = useState(1)
  const [success, setSuccess] = useState(false)

  const handleAddToCart = async () => {
    try {
      await addItem(variantId, quantity)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Nie udało się dodać do koszyka')
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || disabled}
      className={className}
      style={{
        width: '100%',
        padding: '0.75rem 1rem',
        backgroundColor: success ? '#10b981' : (loading || disabled ? '#9ca3af' : '#3b82f6'),
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: (loading || disabled) ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        minHeight: '44px',
      }}
    >
      {loading ? (
        <>⏳ Dodawanie...</>
      ) : success ? (
        <>✓ Dodano!</>
      ) : (
        <>🛒 Dodaj do koszyka</>
      )}
    </button>
  )
}
