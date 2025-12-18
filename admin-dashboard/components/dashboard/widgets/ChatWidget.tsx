"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MessageCircle, User, Bot, Clock, ArrowRight, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  customer_name: string
  customer_email: string
  status: string
  created_at: string
  last_message?: {
    content: string
    created_at: string
    sender_type: string
  }
  unread_count?: number
}

export default function ChatWidget() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadConversations()
    const interval = setInterval(loadConversations, 30000) // Odświeżaj co 30s
    return () => clearInterval(interval)
  }, [])

  const loadConversations = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/conversations`
      const response = await fetch(url, {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      })
      
      if (!response.ok) throw new Error("Błąd ładowania")
      
      const data = await response.json()
      const sorted = (data.conversations || [])
        .sort((a: Conversation, b: Conversation) => {
          const dateA = a.last_message?.created_at || a.created_at
          const dateB = b.last_message?.created_at || b.created_at
          return new Date(dateB).getTime() - new Date(dateA).getTime()
        })
        .slice(0, 5) // Tylko 5 ostatnich
      
      setConversations(sorted)
      setError(null)
    } catch (err) {
      setError("Nie można załadować czatów")
      console.error("Error loading chat conversations:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      bot: "bg-blue-100 text-blue-700",
      agent: "bg-yellow-100 text-yellow-700",
      open: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-600",
    }
    return styles[status] || styles.open
  }

  const getStatusIcon = (status: string) => {
    if (status === 'bot') return <Bot className="w-3 h-3" />
    return <User className="w-3 h-3" />
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return "teraz"
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} godz.`
    return date.toLocaleDateString("pl-PL", { day: "numeric", month: "short" })
  }

  const stats = {
    total: conversations.length,
    waiting: conversations.filter(c => c.status === 'bot' || c.status === 'open').length,
    agent: conversations.filter(c => c.status === 'agent').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={loadConversations}
          className="mt-2 text-blue-600 text-sm hover:underline"
        >
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">
            <span className="font-semibold">{stats.waiting}</span> oczekujących
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-600">
            <span className="font-semibold">{stats.agent}</span> w obsłudze
          </span>
        </div>
      </div>

      {/* Conversations list */}
      {conversations.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Brak aktywnych konwersacji</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/chat?id=${conv.id}`}
              className="block p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">
                      {conv.customer_name}
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                      getStatusBadge(conv.status)
                    )}>
                      {getStatusIcon(conv.status)}
                      {conv.status}
                    </span>
                  </div>
                  
                  {conv.last_message && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conv.last_message.sender_type === 'customer' ? '' : '→ '}
                      {conv.last_message.content}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatTime(conv.last_message?.created_at || conv.created_at)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer link */}
      <Link
        href="/chat"
        className="flex items-center justify-center gap-2 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        Zobacz wszystkie konwersacje
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
