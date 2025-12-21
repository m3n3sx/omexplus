"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Search, User, LogOut, ShoppingCart, MessageCircle, AlertTriangle, Package, X, Check } from "lucide-react"
import { logout, getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import api from "@/lib/api-client"
import ThemeSwitcher from "./ThemeSwitcher"

interface Notification {
  id: string
  type: 'order' | 'chat' | 'stock' | 'system'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: Date
}

const NOTIFICATIONS_KEY = 'omex_notifications_read'

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUser(getCurrentUser())
    loadNotifications()
    
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const readIds = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]')
      const notifs: Notification[] = []

      try {
        const ordersRes = await api.getOrders({ limit: 10 })
        const recentOrders = (ordersRes.orders || []).filter((o: any) => {
          const created = new Date(o.created_at)
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          return created > dayAgo
        })
        
        recentOrders.slice(0, 5).forEach((order: any) => {
          notifs.push({
            id: `order_${order.id}`,
            type: 'order',
            title: 'Nowe zamówienie',
            message: `Zamówienie #${order.display_id || order.id.slice(-6)} - ${((order.total || 0) / 100).toFixed(2)} PLN`,
            link: `/orders/${order.id}`,
            read: readIds.includes(`order_${order.id}`),
            createdAt: new Date(order.created_at)
          })
        })
      } catch (e) {
        console.error('Failed to load orders for notifications:', e)
      }

      try {
        const chatsRes = await api.getConversations({ status: 'bot', limit: 5 })
        const unreadChats = chatsRes.conversations || []
        
        unreadChats.slice(0, 3).forEach((chat: any) => {
          notifs.push({
            id: `chat_${chat.id}`,
            type: 'chat',
            title: 'Nowa wiadomość',
            message: `${chat.customer_name || 'Klient'} czeka na odpowiedź`,
            link: `/chat?id=${chat.id}`,
            read: readIds.includes(`chat_${chat.id}`),
            createdAt: new Date(chat.updated_at || chat.created_at)
          })
        })
      } catch (e) {}

      notifs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      setNotifications(notifs)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (id: string) => {
    const readIds = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]')
    if (!readIds.includes(id)) {
      readIds.push(id)
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(readIds))
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allIds))
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearNotification = (id: string) => {
    markAsRead(id)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length
  
  const handleLogout = async () => {
    await logout()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-4 h-4 text-blue-500" />
      case 'chat': return <MessageCircle className="w-4 h-4 text-green-500" />
      case 'stock': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default: return <Package className="w-4 h-4 text-theme-muted" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 1) return 'teraz'
    if (minutes < 60) return `${minutes} min temu`
    if (hours < 24) return `${hours}h temu`
    return date.toLocaleDateString('pl-PL')
  }
  
  return (
    <header className="bg-theme-secondary border-b border-theme h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center flex-1 max-w-2xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-muted" />
            <input
              type="text"
              placeholder="Szukaj zamówień, produktów, klientów..."
              className="w-full pl-10 pr-4 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-6">
          <ThemeSwitcher />
          
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-theme-secondary rounded-xl shadow-2xl border border-theme z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-theme-tertiary border-b border-theme">
                  <h3 className="font-semibold text-theme-primary">Powiadomienia</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Oznacz wszystkie
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {loading && notifications.length === 0 ? (
                    <div className="p-8 text-center text-theme-muted">
                      <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2"></div>
                      Ładowanie...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-theme-muted">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Brak nowych powiadomień
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-theme-hover border-b border-theme last:border-0 ${!notif.read ? 'bg-accent/10' : ''}`}
                      >
                        <div className="mt-1">{getNotificationIcon(notif.type)}</div>
                        <div className="flex-1 min-w-0">
                          {notif.link ? (
                            <Link 
                              href={notif.link}
                              onClick={() => {
                                markAsRead(notif.id)
                                setShowNotifications(false)
                              }}
                              className="block"
                            >
                              <p className={`text-sm ${!notif.read ? 'font-medium text-theme-primary' : 'text-theme-secondary'}`}>
                                {notif.title}
                              </p>
                              <p className="text-sm text-theme-muted truncate">{notif.message}</p>
                              <p className="text-xs text-theme-muted mt-1">{formatTime(notif.createdAt)}</p>
                            </Link>
                          ) : (
                            <>
                              <p className={`text-sm ${!notif.read ? 'font-medium text-theme-primary' : 'text-theme-secondary'}`}>
                                {notif.title}
                              </p>
                              <p className="text-sm text-theme-muted truncate">{notif.message}</p>
                              <p className="text-xs text-theme-muted mt-1">{formatTime(notif.createdAt)}</p>
                            </>
                          )}
                        </div>
                        <button 
                          onClick={() => clearNotification(notif.id)}
                          className="p-1 text-theme-muted hover:text-theme-primary hover:bg-theme-hover rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="px-4 py-3 bg-theme-tertiary border-t border-theme text-center">
                    <Link 
                      href="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-sm text-accent hover:underline"
                    >
                      Zobacz wszystkie powiadomienia
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* User menu */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-theme-tertiary flex items-center justify-center">
                <span className="text-sm font-medium text-theme-primary">
                  {user?.first_name?.[0]}{user?.last_name?.[0] || 'A'}
                </span>
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.first_name || 'Admin'}
              </span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-theme-secondary rounded-lg shadow-lg border border-theme py-1 z-50">
                <div className="px-4 py-2 border-b border-theme">
                  <p className="text-sm font-medium text-theme-primary">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-theme-muted">{user?.email}</p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center w-full px-4 py-2 text-sm text-theme-secondary hover:bg-theme-hover"
                >
                  <User className="w-4 h-4 mr-2" />
                  Ustawienia
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Wyloguj
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
