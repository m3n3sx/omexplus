'use client'

import { useState, useRef } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  language: string
}

export function ChatInput({ onSend, disabled = false, language }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const placeholder = language === 'pl'
    ? 'Napisz wiadomość...'
    : 'Type a message...'

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200 bg-white">
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none resize-none max-h-32 disabled:bg-neutral-100 disabled:cursor-not-allowed"
          style={{ minHeight: '40px' }}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          <span className="text-xl">📤</span>
        </button>
      </div>
    </form>
  )
}
