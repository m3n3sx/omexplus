"use client"

import { useEffect, useState } from "react"
import { MessageCircle, User, Clock } from "lucide-react"
import Link from "next/link"

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
  message_count: number
}

export default function ChatWidget() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    waiting: 0,
  })

  useEffect(() => {
    loadConversations()
    const interval = setInterval(loadConversations, 10000) // Odświeżaj co 10s
    return () => clearInterval(interval)
  }, [])

  const loadConversations = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/conversations`,
        {
          headers: {
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      )
      const data = await response.json()
      const convs = data.conversations || []
      
      // Sortuj - najnowsze na górze
      const sorted = convs.sort((a: Conversation, b: Conversation) => {
        const dateA = a.last_message?.created_at || a.created_at
        const dateB = b.last_message?.created_at || b.created_at
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })
      
      setConversations(sorted.slice(0, 5)) // Pokaż tylko 5 najnowszych
      
      // Oblicz statystyki
      setStats({
        total: convs.length,
        active: convs.filter((c: Conversation) => c.status === "agent").length,
        waiting: convs.filter((c: Conversation) => c.status === "bot" || c.status === "open").length,
      })
    } catch (error) {
      console.error("Error loading conversations:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "bot":
        return "bg-blue-100 text-blue-800"
      case "agent":
        return "bg-yellow-100 text-yellow-800"
      case "open":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "bot":
        return "Bot"
      case "agent":
        return "Agent"
      case "open":
        return "Otwarta"
      case "closed":
        return "Zamknięta"
      default:
        return status
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return "teraz"
    if (minutes < 60) return `${minutes}m temu`
    if (hours < 24) return `${hours}h temu`
    return `${days}d temu`
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Czat na żywo</h2>
        </div>
        <Link
          href="/chat"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Zobacz wszystkie →
        </Link>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-600">Wszystkie</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.active}</div>
          <div className="text-xs text-gray-600">Aktywne</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.waiting}</div>
          <div className="text-xs text-gray-600">Czekają</div>
        </div>
      </div>

      {/* Lista konwersacji */}
      <div className="space-y-3">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Brak aktywnych konwersacji</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/chat?id=${conv.id}`}
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-sm text-gray-900">
                    {conv.customer_name}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(conv.status)}`}>
                  {getStatusLabel(conv.status)}
                </span>
              </div>
              
              {conv.last_message && (
                <p className="text-xs text-gray-600 truncate mb-2">
                  {conv.last_message.content}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(conv.last_message?.created_at || conv.created_at)}</span>
                </div>
                <span>{conv.message_count} wiadomości</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {conversations.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <Link
            href="/chat"
            className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Otwórz panel czatu
          </Link>
        </div>
      )}
    </div>
  )
}
