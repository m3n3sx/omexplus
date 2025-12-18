"use client"

import { useState, useEffect } from "react"

interface ContactForm {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: string
  created_at: string
  conversation_id?: string
}

export default function ContactFormsPage() {
  const [forms, setForms] = useState<ContactForm[]>([])
  const [selectedForm, setSelectedForm] = useState<ContactForm | null>(null)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    loadForms()
  }, [filter])

  const loadForms = async () => {
    try {
      const url = filter === "all"
        ? `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/contact-forms`
        : `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/contact-forms?status=${filter}`
      
      const response = await fetch(url)
      const data = await response.json()
      setForms(data.contact_forms || [])
    } catch (error) {
      console.error("Error loading forms:", error)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/contact-forms/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      )
      await loadForms()
      if (selectedForm?.id === id) {
        setSelectedForm({ ...selectedForm, status })
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      new: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
    }
    return styles[status as keyof typeof styles] || styles.new
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Formularze kontaktowe</h1>
        <p className="text-gray-600">Zarządzaj zgłoszeniami od klientów</p>
      </div>

      <div className="flex gap-6">
        {/* Lista formularzy */}
        <div className="w-1/2 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="all">Wszystkie</option>
              <option value="new">Nowe</option>
              <option value="in_progress">W trakcie</option>
              <option value="resolved">Rozwiązane</option>
            </select>
          </div>

          <div className="divide-y max-h-[calc(100vh-300px)] overflow-y-auto">
            {forms.map((form) => (
              <div
                key={form.id}
                onClick={() => setSelectedForm(form)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedForm?.id === form.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{form.name}</p>
                    <p className="text-sm text-gray-600">{form.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(form.status)}`}>
                    {form.status === "new" ? "Nowe" : form.status === "in_progress" ? "W trakcie" : "Rozwiązane"}
                  </span>
                </div>
                <p className="font-medium text-sm mb-1">{form.subject}</p>
                <p className="text-sm text-gray-600 truncate">{form.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(form.created_at).toLocaleString("pl-PL")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Szczegóły formularza */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {selectedForm ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedForm.subject}</h2>
                  <span className={`text-sm px-3 py-1 rounded ${getStatusBadge(selectedForm.status)}`}>
                    {selectedForm.status === "new" ? "Nowe" : selectedForm.status === "in_progress" ? "W trakcie" : "Rozwiązane"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedForm.id, "in_progress")}
                    className="px-4 py-2 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                  >
                    W trakcie
                  </button>
                  <button
                    onClick={() => updateStatus(selectedForm.id, "resolved")}
                    className="px-4 py-2 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    Rozwiązane
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Imię i nazwisko</label>
                  <p className="text-lg">{selectedForm.name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-lg">
                    <a href={`mailto:${selectedForm.email}`} className="text-blue-600 hover:underline">
                      {selectedForm.email}
                    </a>
                  </p>
                </div>

                {selectedForm.phone && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Telefon</label>
                    <p className="text-lg">
                      <a href={`tel:${selectedForm.phone}`} className="text-blue-600 hover:underline">
                        {selectedForm.phone}
                      </a>
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-600">Wiadomość</label>
                  <p className="text-lg whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {selectedForm.message}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Data zgłoszenia</label>
                  <p className="text-lg">
                    {new Date(selectedForm.created_at).toLocaleString("pl-PL")}
                  </p>
                </div>

                {selectedForm.conversation_id && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💬 To zgłoszenie ma powiązaną konwersację w czacie
                    </p>
                    <a
                      href={`/chat?conversation=${selectedForm.conversation_id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Przejdź do konwersacji →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Wybierz formularz aby zobaczyć szczegóły
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
