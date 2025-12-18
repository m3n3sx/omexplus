"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Mail, Send, Inbox, AlertCircle } from "lucide-react"

interface Message {
  id: string
  sender_id: string
  sender_name: string
  recipient_id: string | null
  recipient_name: string | null
  subject: string
  content: string
  priority: string
  read: boolean
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: "",
    priority: "normal",
  })

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/team/messages?user_id=admin`,
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

  const sendMessage = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/team/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          ...newMessage,
          sender_id: "admin",
          sender_name: "Admin",
          recipient_id: null,
          recipient_name: "Wszyscy",
        }),
      })
      setShowNewMessage(false)
      setNewMessage({ subject: "", content: "", priority: "normal" })
      loadMessages()
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-600"
      case "high": return "text-orange-600"
      default: return "text-gray-600"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Wiadomości wewnętrzne</h1>
          <button
            onClick={() => setShowNewMessage(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
            Nowa wiadomość
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="col-span-1 bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Inbox className="w-5 h-5" />
                Odebrane ({messages.length})
              </h3>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    !msg.read ? "bg-blue-50" : ""
                  } ${selectedMessage?.id === msg.id ? "border-l-4 border-blue-600" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{msg.sender_name}</p>
                      <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                    </div>
                    {msg.priority !== "normal" && (
                      <AlertCircle className={`w-4 h-4 ${getPriorityColor(msg.priority)}`} />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.created_at).toLocaleString("pl-PL")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div className="col-span-2 bg-white rounded-lg shadow">
            {selectedMessage ? (
              <div className="p-6">
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Od: {selectedMessage.sender_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(selectedMessage.created_at).toLocaleString("pl-PL")}
                      </p>
                    </div>
                    {selectedMessage.priority !== "normal" && (
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(selectedMessage.priority)} bg-opacity-10`}>
                        {selectedMessage.priority}
                      </span>
                    )}
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4" />
                  <p>Wybierz wiadomość aby ją przeczytać</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Message Modal */}
        {showNewMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Nowa wiadomość</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Temat"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                <textarea
                  placeholder="Treść wiadomości"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={8}
                />
                <select
                  value={newMessage.priority}
                  onChange={(e) => setNewMessage({ ...newMessage, priority: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="normal">Normalny priorytet</option>
                  <option value="high">Wysoki priorytet</option>
                  <option value="urgent">Pilne</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={sendMessage}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Wyślij
                  </button>
                  <button
                    onClick={() => setShowNewMessage(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
