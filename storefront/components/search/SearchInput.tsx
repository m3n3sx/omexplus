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
            🎤
          </button>
        </div>

        <button
          type="submit"
          disabled={!query.trim() || isAnalyzing}
          className="w-full py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚙️</span>
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
        <p className="text-sm font-medium text-neutral-700 mb-3">
          💡 Try these examples:
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
          <div className="text-3xl mb-2">🤖</div>
          <h3 className="font-semibold text-neutral-900 mb-1">AI-Powered</h3>
          <p className="text-sm text-neutral-600">
            Understands natural language
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">✅</div>
          <h3 className="font-semibold text-neutral-900 mb-1">Validated</h3>
          <p className="text-sm text-neutral-600">
            100% compatibility checked
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-semibold text-neutral-900 mb-1">Fast Results</h3>
          <p className="text-sm text-neutral-600">
            Find parts in seconds
          </p>
        </div>
      </div>
    </div>
  )
}
