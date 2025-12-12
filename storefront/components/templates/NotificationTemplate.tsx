'use client'

import { useEffect, useState } from 'react'

interface NotificationProps {
  id?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  onClose?: () => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export function NotificationTemplate({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  position = 'top-right',
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  if (!isVisible) return null

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      icon: '✓',
      iconBg: 'bg-green-500',
      text: 'text-green-900',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      icon: '✗',
      iconBg: 'bg-red-500',
      text: 'text-red-900',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      icon: '⚠',
      iconBg: 'bg-yellow-500',
      text: 'text-yellow-900',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      icon: 'ℹ',
      iconBg: 'bg-blue-500',
      text: 'text-blue-900',
    },
  }

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  const style = typeStyles[type]

  return (
    <div
      className={`
        fixed ${positionStyles[position]} z-50 w-full max-w-sm
        ${isExiting ? 'animate-out fade-out slide-out-to-right' : 'animate-in fade-in slide-in-from-right'}
      `}
    >
      <div
        className={`
          ${style.bg} ${style.border} border-l-4 rounded-lg shadow-lg p-4
          flex items-start gap-3
        `}
      >
        {/* Icon */}
        <div
          className={`
            ${style.iconBg} w-8 h-8 rounded-full flex items-center justify-center
            text-white font-bold flex-shrink-0
          `}
        >
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-bold ${style.text} mb-1`}>{title}</h4>
          )}
          <p className={`text-sm ${style.text}`}>{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
          aria-label="Zamknij"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Notification Context
import { createContext, useContext } from 'react'

interface NotificationContextType {
  notifications: Array<NotificationProps & { id: string }>
  show: (notification: Omit<NotificationProps, 'id' | 'onClose'>) => void
  remove: (id: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

// Notification Provider Component
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Array<NotificationProps & { id: string }>>([])

  const show = (notification: Omit<NotificationProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications((prev) => [...prev, { ...notification, id }])
  }

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const success = (message: string, title?: string) => {
    show({ type: 'success', message, title })
  }

  const error = (message: string, title?: string) => {
    show({ type: 'error', message, title })
  }

  const warning = (message: string, title?: string) => {
    show({ type: 'warning', message, title })
  }

  const info = (message: string, title?: string) => {
    show({ type: 'info', message, title })
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        show,
        remove,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      {/* Render notifications directly without separate container */}
      {notifications.map((notification) => (
        <NotificationTemplate
          key={notification.id}
          {...notification}
          onClose={() => remove(notification.id!)}
        />
      ))}
    </NotificationContext.Provider>
  )
}

// Notification Manager Hook
export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}


