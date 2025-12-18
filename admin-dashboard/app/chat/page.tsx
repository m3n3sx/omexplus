"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"

interface Message {
  id: string
  conversation_id: string
  sender_type: "customer" | "bot" | "agent"
  content: string
  created_at: string
}

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
  unread_count?: number
}

const SELECTED_CONVERSATION_KEY = "omex_admin_selected_conversation"

// Wrapper z Suspense dla useSearchParams
function ChatPageContent() {
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [replyText, setReplyText] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notification, setNotification] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [lastMessageCount, setLastMessageCount] = useState<Record<string, number>>({})

  // Wczytaj zapisaną konwersację z URL lub localStorage
  useEffect(() => {
    const urlConvId = searchParams.get("id")
    if (urlConvId) {
      setSelectedConversation(urlConvId)
      localStorage.setItem(SELECTED_CONVERSATION_KEY, urlConvId)
    } else {
      const savedConvId = localStorage.getItem(SELECTED_CONVERSATION_KEY)
      if (savedConvId) {
        setSelectedConversation(savedConvId)
      }
    }
  }, [searchParams])

  // Zapisz wybraną konwersację
  const selectConversation = (convId: string) => {
    setSelectedConversation(convId)
    localStorage.setItem(SELECTED_CONVERSATION_KEY, convId)
    window.history.replaceState({}, "", `/chat?id=${convId}`)
  }

  // Scroll do dołu wiadomości
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Ładowanie konwersacji z powiadomieniami o nowych wiadomościach
  useEffect(() => {
    loadConversations()
    const interval = setInterval(async () => {
      const prevConvs = conversations
      await loadConversations()
      
      // Sprawdź nowe wiadomości
      if (prevConvs.length > 0) {
        conversations.forEach(conv => {
          const prevConv = prevConvs.find(c => c.id === conv.id)
          if (prevConv && conv.message_count > prevConv.message_count) {
            showNotification(`Nowa wiadomość od ${conv.customer_name}`)
            playNotificationSound()
          }
        })
      }
    }, 5000) // Odświeżaj co 5s
    return () => clearInterval(interval)
  }, [filter])

  // Auto-odświeżanie wiadomości w wybranej konwersacji
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
      const interval = setInterval(() => loadMessages(selectedConversation), 3000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const playNotificationSound = () => {
    // Prosty dźwięk powiadomienia
    if (audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }

  const loadConversations = async () => {
    try {
      // Używamy Store API zamiast Admin API (brak autentykacji)
      const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/conversations${filter !== "all" ? `?status=${filter}` : ""}`
      
      const response = await fetch(url, {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      })
      const data = await response.json()
      
      // Sortuj konwersacje - najnowsze na górze
      const sorted = (data.conversations || []).sort((a: Conversation, b: Conversation) => {
        const dateA = a.last_message?.created_at || a.created_at
        const dateB = b.last_message?.created_at || b.created_at
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })
      
      setConversations(sorted)
    } catch (error) {
      console.error("Error loading conversations:", error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/${conversationId}`,
        {
          headers: {
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      )
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const sendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return

    setIsLoading(true)
    try {
      console.log(`[Admin] Sending agent message to conversation ${selectedConversation}`)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/${selectedConversation}/messages`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify({ content: replyText, sender_type: "agent" }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[Admin] Message sent successfully:", data)

      setReplyText("")
      await loadMessages(selectedConversation)
      await loadConversations()
      showNotification("Wiadomość wysłana")
    } catch (error) {
      console.error("[Admin] Error sending reply:", error)
      showNotification("Błąd wysyłania wiadomości")
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (conversationId: string, status: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/chat/${conversationId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      )
      await loadConversations()
      showNotification(`Status zmieniony na: ${status}`)
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      bot: "bg-blue-100 text-blue-800",
      agent: "bg-yellow-100 text-yellow-800",
      open: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    }
    return styles[status as keyof typeof styles] || styles.open
  }

  const filteredConversations = conversations.filter(conv =>
    conv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: conversations.length,
    bot: conversations.filter(c => c.status === "bot").length,
    agent: conversations.filter(c => c.status === "agent").length,
    open: conversations.filter(c => c.status === "open").length,
    closed: conversations.filter(c => c.status === "closed").length,
  }


  return (
    <div className="p-6">
      {/* Audio element for notification sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
        <source src="/sounds/notification.ogg" type="audio/ogg" />
      </audio>
      
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {notification}
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Zarządzanie czatem</h1>
        <div className="flex gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Wszystkie</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-sm text-blue-600">Bot</p>
            <p className="text-2xl font-bold text-blue-600">{stats.bot}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-sm text-yellow-600">Agent</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.agent}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-300px)]">
        <div className="w-1/3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b space-y-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj..."
              className="w-full border rounded-lg px-3 py-2"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="all">Wszystkie</option>
              <option value="bot">Bot</option>
              <option value="agent">Agent</option>
              <option value="open">Otwarte</option>
              <option value="closed">Zamknięte</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conv.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{conv.customer_name}</p>
                    <p className="text-sm text-gray-600">{conv.customer_email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(conv.status)}`}>
                    {conv.status}
                  </span>
                </div>
                {conv.last_message && (
                  <p className="text-sm text-gray-600 truncate">
                    {conv.last_message.content}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(conv.created_at).toLocaleDateString("pl-PL")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    {conversations.find(c => c.id === selectedConversation)?.customer_name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedConversation, "closed")}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Zamknij
                  </button>
                  <button
                    onClick={() => updateStatus(selectedConversation, "agent")}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Przejmij
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_type === "customer" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender_type === "customer"
                          ? "bg-white border"
                          : message.sender_type === "bot"
                          ? "bg-blue-100"
                          : "bg-green-100"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.created_at).toLocaleTimeString("pl-PL")}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendReply()
                      }
                    }}
                    placeholder="Wpisz odpowiedź..."
                    className="flex-1 border rounded-lg px-3 py-2 resize-none"
                    rows={3}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendReply}
                    disabled={isLoading || !replyText.trim()}
                    className="bg-blue-600 text-white rounded-lg px-6 hover:bg-blue-700 disabled:opacity-50"
                  >
                    Wyślij
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Wybierz konwersację
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Export z Suspense wrapper
export default function ChatManagementPage() {
  return (
    <Suspense fallback={<div className="p-6">Ładowanie...</div>}>
      <ChatPageContent />
    </Suspense>
  )
}
