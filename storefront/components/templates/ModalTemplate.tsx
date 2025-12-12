'use client'

import { useEffect } from 'react'
import { Button } from '../ui/Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
}

export function ModalTemplate({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
}: ModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl w-full ${sizeStyles[size]}
          max-h-[90vh] flex flex-col
          animate-in fade-in zoom-in duration-200
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            {title && (
              <h2 id="modal-title" className="text-2xl font-bold text-neutral-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Zamknij"
              >
                <svg
                  className="w-6 h-6 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// Confirmation Modal Template
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export function ConfirmModalTemplate({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Potwierdź',
  cancelLabel = 'Anuluj',
  variant = 'info',
  isLoading = false,
}: ConfirmModalProps) {
  const iconStyles = {
    danger: '🗑️',
    warning: '⚠️',
    info: 'ℹ️',
  }

  const buttonVariants = {
    danger: 'primary' as const,
    warning: 'primary' as const,
    info: 'primary' as const,
  }

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlayClick={!isLoading}
      showCloseButton={!isLoading}
    >
      <div className="text-center">
        {/* Icon */}
        <div className="text-6xl mb-4">{iconStyles[variant]}</div>

        {/* Title */}
        <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-neutral-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariants[variant]}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </ModalTemplate>
  )
}
