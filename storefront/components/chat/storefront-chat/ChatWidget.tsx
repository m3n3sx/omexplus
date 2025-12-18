"use client"

import { useState, useEffect, useRef } from "react"

interface Message {
  id: string
  sender_type: "customer" | "bot" | "agent"
  content: string
  created_at: string
}

interface Conversation {
  id: string
  status: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-odświeżanie wiadomości co 3 sekundy
  useEffect(() => {
    if (conversation?.id) {
      const interval = setInterval(() => {
        loadMessages(conversation.id)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [conversation])

  const startConversation = async () => {
    try {
      const customerEmail = localStorage.getItem("customer_email") || `guest_${Date.now()}@temp.com`
      const customerName = localStorage.getItem("customer_name") || "Gość"
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          customer_email: customerEmail,
          customer_name: customerName,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.conversation || !data.conversation.id) {
        console.error("Invalid response from server:", data)
        throw new Error("Invalid conversation data received")
      }

      setConversation(data.conversation)
      
      // Pobierz wiadomości
      await loadMessages(data.conversation.id)
    } catch (error) {
      console.error("Error starting conversation:", error)
      // Pokaż użytkownikowi błąd
      alert("Nie udało się rozpocząć rozmowy. Spróbuj ponownie później.")
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
      if (data.messages) {
        console.log(`[ChatWidget] Loaded ${data.messages.length} messages`)
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("[ChatWidget] Error loading messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || !conversation) return

    setIsLoading(true)
    const userMessage = inputValue
    setInputValue("")

    // Dodaj wiadomość użytkownika do UI
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      sender_type: "customer",
      content: userMessage,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempMessage])

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/${conversation.id}/messages`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify({ content: userMessage }),
        }
      )

      const data = await response.json()
      
      // Zastąp tymczasową wiadomość prawdziwą
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempMessage.id)
        const newMessages = [data.message]
        if (data.bot_message) {
          newMessages.push(data.bot_message)
        }
        return [...filtered, ...newMessages]
      })
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    if (!conversation) {
      startConversation()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all z-50"
          aria-label="Otwórz chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Czat OMEX</h3>
              <p className="text-xs opacity-90">
                {conversation?.status === "bot" ? "🤖 Bot AI" : "👤 Konsultant"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 rounded p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_type === "customer" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender_type === "customer"
                      ? "bg-blue-600 text-white"
                      : message.sender_type === "bot"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-green-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString("pl-PL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Wpisz wiadomość..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
