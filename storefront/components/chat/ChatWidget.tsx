"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const CHAT_SEARCH_RESULTS_KEY = "omex_chat_search_results"
const CHAT_SEARCH_CONTEXT_KEY = "omex_chat_search_context"

interface Message {
  id: string
  sender_type: "customer" | "bot" | "agent"
  content: string
  created_at: string
  attachment_url?: string
  attachment_name?: string
}

interface Conversation {
  id: string
  status: string
}

interface SearchProduct {
  id: string
  title: string
  handle: string
  thumbnail?: string
  variants?: { sku?: string; prices?: { amount: number; currency_code: string }[] }[]
}

interface SearchContext {
  brand?: string
  model?: string
  machineType?: string
  category?: string
}

const CONVERSATION_STORAGE_KEY = "omex_chat_conversation_id"
const CONVERSATION_EXPIRY_KEY = "omex_chat_conversation_expiry"
const CONVERSATION_TTL = 24 * 60 * 60 * 1000
const SOUND_ENABLED_KEY = "omex_chat_sound_enabled"

export default function ChatWidget() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showRating, setShowRating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([])
  const [searchContext, setSearchContext] = useState<SearchContext>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastMessageCountRef = useRef(0)

  // Function to open search with chat results
  const openSearchWithResults = () => {
    // Deduplicate results by id before saving
    const uniqueResults = searchResults.filter((product, index, self) => 
      index === self.findIndex((p) => p.id === product.id)
    )
    // Save results and context to sessionStorage
    if (uniqueResults.length > 0) {
      sessionStorage.setItem(CHAT_SEARCH_RESULTS_KEY, JSON.stringify(uniqueResults))
    }
    if (Object.keys(searchContext).length > 0) {
      sessionStorage.setItem(CHAT_SEARCH_CONTEXT_KEY, JSON.stringify(searchContext))
    }
    // Build search query
    const searchQuery = [searchContext.brand, searchContext.model, searchContext.category].filter(Boolean).join(' ')
    // Navigate to search page with flag
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&from=chat`)
  }

  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+dnZmTi4J6c29vcHR6gYmQl5ycm5iUjoiCfHZxbm1ucnmAh46UmZubmZWQioR+eHNvbW5xd36Ei5GXm5ybmJOOiIN9d3JubW9zeYCGjZOYm5qYlI+KhH54c29ub3N5gIaMkpiampeTjoqEfnhzcG5vc3qAhoySmJqal5OOiYN9eHNvbm9zeoCGjJKYmpqXk46JhH54c29ub3N5gIaMkpiampeTjoqEfnhzcG5vc3qAhoySmJqal5OOiYN9eHNvbm9zeoCGjJKYmpqXk46JhH54c29ub3N5gIaMkpiampeTjomEfXhzb25vc3mAhoySmJqal5OOiYR9eHNvbm9zeYCGjJKYmpqXk46JhH14c29ub3N5gIaMkpiampeT")
    const savedSound = localStorage.getItem(SOUND_ENABLED_KEY)
    if (savedSound !== null) setSoundEnabled(savedSound === "true")
  }, [])

  const playNotificationSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }, [soundEnabled])

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  useEffect(() => { scrollToBottom() }, [messages])

  useEffect(() => {
    if (conversation?.id) {
      const interval = setInterval(() => loadMessages(conversation.id), 3000)
      return () => clearInterval(interval)
    }
  }, [conversation])

  useEffect(() => {
    if (messages.length > lastMessageCountRef.current) {
      const newMsgs = messages.slice(lastMessageCountRef.current)
      const hasNew = newMsgs.some(m => m.sender_type !== "customer")
      if (hasNew) {
        if (!isOpen) setUnreadCount(prev => prev + newMsgs.filter(m => m.sender_type !== "customer").length)
        playNotificationSound()
        if (!isOpen && "Notification" in window && Notification.permission === "granted") {
          new Notification("Nowa wiadomość - OMEX", { body: newMsgs[newMsgs.length - 1].content.substring(0, 100), icon: "/favicon.ico" })
        }
      }
    }
    lastMessageCountRef.current = messages.length
  }, [messages, isOpen, playNotificationSound])

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") await Notification.requestPermission()
  }

  const saveConversationToStorage = (id: string) => {
    localStorage.setItem(CONVERSATION_STORAGE_KEY, id)
    localStorage.setItem(CONVERSATION_EXPIRY_KEY, String(Date.now() + CONVERSATION_TTL))
  }

  const getConversationFromStorage = (): string | null => {
    const id = localStorage.getItem(CONVERSATION_STORAGE_KEY)
    const expiry = localStorage.getItem(CONVERSATION_EXPIRY_KEY)
    if (!id || !expiry) return null
    if (Date.now() > parseInt(expiry)) {
      localStorage.removeItem(CONVERSATION_STORAGE_KEY)
      localStorage.removeItem(CONVERSATION_EXPIRY_KEY)
      return null
    }
    return id
  }

  const loadMessages = async (conversationId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/${conversationId}`, {
        headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" }
      })
      if (!res.ok) return false
      const data = await res.json()
      if (data.messages) {
        // Deduplicate messages by id
        const uniqueMessages = data.messages.filter((msg: Message, index: number, self: Message[]) => 
          index === self.findIndex((m) => m.id === msg.id)
        )
        setMessages(uniqueMessages)
      }
      if (data.conversation) { setConversation(data.conversation); saveConversationToStorage(data.conversation.id); return true }
      return false
    } catch { return false }
  }

  const createNewConversation = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" },
        body: JSON.stringify({ customer_email: `guest_${Date.now()}@temp.com`, customer_name: "Gość" })
      })
      if (!res.ok) {
        console.error("Failed to create conversation:", res.status)
        return
      }
      const data = await res.json()
      if (data.conversation) { 
        setConversation(data.conversation)
        saveConversationToStorage(data.conversation.id)
        if (data.messages) {
          setMessages(data.messages)
        }
      }
    } catch (error) {
      console.error("Error creating conversation:", error)
    }
  }

  const startConversation = async () => {
    setIsLoading(true)
    try {
      const stored = getConversationFromStorage()
      if (stored) { 
        const ok = await loadMessages(stored)
        if (ok) { 
          setIsLoading(false)
          return 
        } 
      }
      await createNewConversation()
    } catch (error) {
      console.error("Error starting conversation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (content?: string, attachmentUrl?: string, attachmentName?: string) => {
    const msg = content || inputValue
    if (!msg.trim() && !attachmentUrl) return
    if (!conversation) return
    setIsLoading(true)
    if (!content) setInputValue("")
    const temp: Message = { id: `temp_${Date.now()}`, sender_type: "customer", content: msg, created_at: new Date().toISOString(), attachment_url: attachmentUrl, attachment_name: attachmentName }
    setMessages(prev => [...prev, temp])
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" },
        body: JSON.stringify({ content: msg, attachment_url: attachmentUrl, attachment_name: attachmentName })
      })
      if (!res.ok) {
        console.error("Failed to send message:", res.status)
        // Keep the temp message but mark it as failed
        return
      }
      const data = await res.json()
      console.log('Chat response:', data)
      setMessages(prev => { 
        const f = prev.filter(m => m.id !== temp.id)
        const n = [data.message]
        if (data.bot_message) n.push(data.bot_message)
        return [...f, ...n] 
      })
      // Set quick replies if available
      if (data.quick_replies && Array.isArray(data.quick_replies) && data.quick_replies.length > 0) {
        setQuickReplies(data.quick_replies)
      } else {
        setQuickReplies([])
      }
      // Set search results if available
      if (data.search_results && Array.isArray(data.search_results) && data.search_results.length > 0) {
        setSearchResults(data.search_results)
      }
      // Update search context from response
      if (data.search_context) {
        setSearchContext(prev => ({ ...prev, ...data.search_context }))
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !conversation) return
    if (file.size > 5 * 1024 * 1024) { alert("Plik za duży (max 5MB)"); return }
    setIsUploading(true)
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("conversation_id", conversation.id)
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/upload`, {
        method: "POST", headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" }, body: fd
      })
      if (res.ok) { const data = await res.json(); await sendMessage(`📎 ${file.name}`, data.url, file.name) }
    } catch {}
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleRating = async (rating: number) => {
    if (!conversation) return
    try {
      await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/chat/${conversation.id}/rate`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" },
        body: JSON.stringify({ rating })
      })
    } catch {}
    setShowRating(false)
    localStorage.removeItem(CONVERSATION_STORAGE_KEY)
    localStorage.removeItem(CONVERSATION_EXPIRY_KEY)
    setConversation(null)
    setMessages([])
  }

  const handleOpen = () => { setIsOpen(true); setUnreadCount(0); requestNotificationPermission(); if (!conversation) startConversation() }
  const handleClose = () => { setIsOpen(false); if (messages.length > 2) setShowRating(true) }
  const toggleSound = () => { const v = !soundEnabled; setSoundEnabled(v); localStorage.setItem(SOUND_ENABLED_KEY, String(v)) }

  return (
    <>
      {!isOpen && (
        <button onClick={handleOpen} className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all z-50" aria-label="Otwórz chat">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>}
        </button>
      )}
      {showRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-center">Oceń rozmowę</h3>
            <p className="text-gray-600 text-sm mb-4 text-center">Jak oceniasz naszą obsługę?</p>
            <div className="flex justify-center gap-2 mb-4">{[1,2,3,4,5].map(s => <button key={s} onClick={() => handleRating(s)} className="text-3xl hover:scale-110 transition-transform">⭐</button>)}</div>
            <button onClick={() => setShowRating(false)} className="w-full text-gray-500 text-sm hover:text-gray-700">Pomiń</button>
          </div>
        </div>
      )}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div><h3 className="font-semibold">Czat OMEX</h3><p className="text-xs opacity-90">{conversation?.status === "bot" ? "Bot AI" : "Konsultant"}</p></div>
            <div className="flex items-center gap-2">
              <button onClick={toggleSound} className="text-white hover:bg-blue-700 rounded p-1" title={soundEnabled ? "Wyłącz dźwięk" : "Włącz dźwięk"}>
                {soundEnabled ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>}
              </button>
              <button onClick={() => setShowRating(true)} className="text-white hover:bg-blue-700 rounded p-1" title="Zakończ rozmowę"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></button>
              <button onClick={handleClose} className="text-white hover:bg-blue-700 rounded p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender_type === "customer" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${m.sender_type === "customer" ? "bg-blue-600 text-white" : m.sender_type === "bot" ? "bg-gray-200 text-gray-800" : "bg-green-100 text-gray-800 border border-green-200"}`}>
                  {m.sender_type === "agent" && <p className="text-xs text-green-600 font-medium mb-1">Konsultant</p>}
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  {m.attachment_url && <a href={m.attachment_url} target="_blank" rel="noopener noreferrer" className="text-xs underline mt-1 block">📎 {m.attachment_name || "Załącznik"}</a>}
                  <p className="text-xs opacity-70 mt-1">{new Date(m.created_at).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            ))}
            {isLoading && <div className="flex justify-start"><div className="bg-gray-200 rounded-lg p-3"><div className="flex gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}}></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}}></span></div></div></div>}
            <div ref={messagesEndRef} />
          </div>
          {/* Product Results */}
          {searchResults.length > 0 && (
            <div className="px-4 py-2 border-t bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Znalezione produkty ({searchResults.length})</span>
                <button 
                  onClick={() => setSearchResults([])} 
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {searchResults.slice(0, 3).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    target="_blank"
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {product.thumbnail && (
                      <img src={product.thumbnail} alt="" className="w-10 h-10 object-cover rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{product.title}</p>
                      {product.variants?.[0]?.sku && (
                        <p className="text-xs text-gray-500">SKU: {product.variants[0].sku}</p>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
              {searchResults.length > 3 && (
                <Link
                  href={`/search?q=${encodeURIComponent(searchContext.brand || '')} ${encodeURIComponent(searchContext.model || '')}`}
                  target="_blank"
                  className="block mt-2 text-center text-xs text-blue-600 hover:text-blue-800"
                >
                  Zobacz wszystkie ({searchResults.length}) →
                </Link>
              )}
            </div>
          )}
          {/* Quick Replies */}
          {quickReplies.length > 0 && (
            <div className="px-4 py-2 border-t bg-gray-50 flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => {
                // Handle special actions
                if (reply.includes('wyszukiwark')) {
                  return (
                    <button
                      key={index}
                      onClick={openSearchWithResults}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-all flex items-center gap-1"
                    >
                      🔍 Otwórz wyszukiwarkę
                    </button>
                  )
                }
                return (
                  <button
                    key={index}
                    onClick={() => { setQuickReplies([]); sendMessage(reply); }}
                    className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-full text-sm hover:bg-blue-50 hover:border-blue-500 transition-all"
                  >
                    {reply}
                  </button>
                )
              })}
            </div>
          )}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
              <button onClick={() => fileInputRef.current?.click()} disabled={isUploading || isLoading} className="text-gray-500 hover:text-blue-600 disabled:opacity-50 p-2" title="Załącz plik">
                {isUploading ? <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>}
              </button>
              <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()} placeholder="Wpisz wiadomość..." className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" disabled={isLoading} />
              <button onClick={() => sendMessage()} disabled={isLoading || !inputValue.trim()} className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
