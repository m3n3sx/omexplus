'use client'

import { useState, useRef } from 'react'

interface SearchInputProps {
  onSearch: (query: string) => void
  isAnalyzing: boolean
}

export function SearchInput({ onSearch, isAnalyzing }: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in your browser')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const examples = [
    "Hydraulic pump for my CAT 320D",
    "Engine parts for Komatsu excavator",
    "My pump is leaking",
    "Need starter for JCB 3CX"
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          What are you looking for?
        </h2>
        <p className="text-neutral-600">
          Describe your machine or issue in your own words
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Hydraulic pump for CAT 320D or My pump is leaking..."
            className="w-full px-6 py-4 text-lg border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            disabled={isAnalyzing}
            aria-label="Search for parts"
          />
          
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
              isListening 
                ? 'bg-danger text-white animate-pulse' 
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            }`}
            aria-label="Voice input"
            disabled={isAnalyzing}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>
        </div>

        <button
          type="submit"
          disabled={!query.trim() || isAnalyzing}
          className="w-full py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Analyzing your request...
            </span>
          ) : (
            'Search Parts'
          )}
        </button>
      </form>

      {/* OR Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-neutral-500 font-medium">OR</span>
        </div>
      </div>

      {/* Manual Wizard Button */}
      <button
        onClick={() => onSearch('')}
        className="w-full py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all duration-200"
        disabled={isAnalyzing}
      >
        Use Step-by-Step Wizard
      </button>

      {/* Example Searches */}
      <div className="mt-8">
        <p className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          Try these examples:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="text-left px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-700"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-neutral-200">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <h3 className="font-semibold text-neutral-900 mb-1">AI-Powered</h3>
          <p className="text-sm text-neutral-600">
            Understands natural language
          </p>
        </div>
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="font-semibold text-neutral-900 mb-1">Validated</h3>
          <p className="text-sm text-neutral-600">
            100% compatibility checked
          </p>
        </div>
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <h3 className="font-semibold text-neutral-900 mb-1">Fast Results</h3>
          <p className="text-sm text-neutral-600">
            Find parts in seconds
          </p>
        </div>
      </div>
    </div>
  )
}
