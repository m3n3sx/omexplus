'use client'

import { useState } from 'react'
import { 
  Bot, Sparkles, Send, Loader2, TrendingUp, Target, 
  ShoppingCart, Users, Zap, CheckCircle, AlertCircle,
  Lightbulb, BarChart3, RefreshCw, Copy, ExternalLink
} from 'lucide-react'

interface AIRecommendation {
  id: string
  type: 'optimization' | 'campaign' | 'budget' | 'audience'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  action: string
  metrics?: {
    estimatedIncrease?: string
    estimatedSavings?: string
    confidence: number
  }
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  recommendations?: AIRecommendation[]
}

const SAMPLE_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: '1',
    type: 'optimization',
    title: 'Zwiększ budżet kampanii "Filtry CAT"',
    description: 'Ta kampania ma ROAS 5.2x i jest ograniczona budżetem. Zwiększenie budżetu o 30% może przynieść dodatkowe 15-20 konwersji tygodniowo.',
    impact: 'high',
    action: 'Zwiększ budżet',
    metrics: { estimatedIncrease: '+18 konwersji/tydzień', confidence: 87 }
  },
  {
    id: '2',
    type: 'audience',
    title: 'Nowa grupa odbiorców: Firmy budowlane',
    description: 'Analiza pokazuje, że firmy budowlane z sektora B2B mają 3x wyższy współczynnik konwersji. Stwórz dedykowaną kampanię.',
    impact: 'high',
    action: 'Stwórz kampanię',
    metrics: { estimatedIncrease: '+25% konwersji', confidence: 82 }
  },
  {
    id: '3',
    type: 'budget',
    title: 'Wstrzymaj kampanię "Promocje świąteczne"',
    description: 'ROAS 2.1x jest poniżej progu rentowności. Przenieś budżet do lepiej działających kampanii.',
    impact: 'medium',
    action: 'Wstrzymaj',
    metrics: { estimatedSavings: '1,640 zł/miesiąc', confidence: 94 }
  },
  {
    id: '4',
    type: 'campaign',
    title: 'Uruchom remarketing dynamiczny',
    description: 'Użytkownicy porzucający koszyk to 23% ruchu. Remarketing może odzyskać 8-12% tych konwersji.',
    impact: 'high',
    action: 'Konfiguruj',
    metrics: { estimatedIncrease: '+10% przychodów', confidence: 79 }
  },
]

const typeIcons = {
  optimization: TrendingUp,
  campaign: Target,
  budget: BarChart3,
  audience: Users
}

const typeColors = {
  optimization: 'text-blue-600 bg-blue-100',
  campaign: 'text-purple-600 bg-purple-100',
  budget: 'text-green-600 bg-green-100',
  audience: 'text-orange-600 bg-orange-100'
}

const impactColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-700'
}

export function AIMarketingManager() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Cześć! Jestem Twoim AI Marketing Managerem. Analizuję dane z Google Analytics i Ads, żeby pomóc Ci optymalizować kampanie. Oto moje rekomendacje na dziś:',
      timestamp: new Date(),
      recommendations: SAMPLE_RECOMMENDATIONS
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI response - in production this would call Gemini API
    setTimeout(() => {
      const responses: Record<string, string> = {
        'budżet': 'Na podstawie analizy ostatnich 30 dni, rekomenduję następujący podział budżetu:\n\n• Filtry CAT (Search): 40% - najwyższy ROAS\n• Remarketing: 25% - wysoka konwersja\n• Części Komatsu: 20% - stabilny wzrost\n• Brand: 15% - budowanie świadomości\n\nCzy chcesz, żebym przygotował szczegółowy plan?',
        'kampania': 'Mogę pomóc stworzyć nową kampanię! Jaką kategorię produktów chcesz promować? Na podstawie danych, najlepiej konwertują:\n\n1. Filtry (ROAS 5.2x)\n2. Części do koparek (ROAS 4.1x)\n3. Wałki obrotu (ROAS 3.8x)',
        'roas': 'Aktualny ROAS dla wszystkich kampanii wynosi 4.2x. To dobry wynik! Najlepsze kampanie:\n\n🥇 Remarketing Koszyk: 6.1x\n🥈 Filtry CAT Search: 5.2x\n🥉 Brand OMEX: 4.5x\n\nKampania "Promocje świąteczne" (2.1x) wymaga optymalizacji lub wstrzymania.',
        'default': 'Rozumiem! Przeanalizuję dane i przygotuję rekomendacje. Na podstawie aktualnych trendów widzę kilka możliwości optymalizacji. Czy chcesz, żebym skupił się na:\n\n1. Zwiększeniu konwersji\n2. Obniżeniu kosztów\n3. Dotarciu do nowych odbiorców\n\nWybierz opcję lub opisz swój cel.'
      }

      const lowerInput = input.toLowerCase()
      let response = responses.default
      if (lowerInput.includes('budżet') || lowerInput.includes('budget')) response = responses['budżet']
      else if (lowerInput.includes('kampani') || lowerInput.includes('campaign')) response = responses['kampania']
      else if (lowerInput.includes('roas') || lowerInput.includes('zwrot')) response = responses['roas']

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setLoading(false)
    }, 1500)
  }

  const handleApplyRecommendation = (rec: AIRecommendation) => {
    alert(`Zastosowano: ${rec.title}\n\nW produkcji ta akcja zostanie wykonana przez Google Ads API.`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Chat */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border flex flex-col h-[600px]">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Marketing Manager</h3>
            <p className="text-xs text-gray-500">Powered by Gemini</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-500">AI Manager</span>
                  </div>
                )}
                <div className={`rounded-xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
                
                {/* Recommendations */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.recommendations.map((rec) => {
                      const TypeIcon = typeIcons[rec.type]
                      return (
                        <div key={rec.id} className="bg-white dark:bg-gray-800 border rounded-lg p-3 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${typeColors[rec.type]}`}>
                              <TypeIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{rec.title}</h4>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColors[rec.impact]}`}>
                                  {rec.impact === 'high' ? 'Wysoki wpływ' : rec.impact === 'medium' ? 'Średni wpływ' : 'Niski wpływ'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{rec.description}</p>
                              {rec.metrics && (
                                <div className="flex items-center gap-4 text-xs mb-2">
                                  {rec.metrics.estimatedIncrease && (
                                    <span className="text-green-600 flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      {rec.metrics.estimatedIncrease}
                                    </span>
                                  )}
                                  {rec.metrics.estimatedSavings && (
                                    <span className="text-blue-600 flex items-center gap-1">
                                      <Zap className="w-3 h-3" />
                                      Oszczędność: {rec.metrics.estimatedSavings}
                                    </span>
                                  )}
                                  <span className="text-gray-500">
                                    Pewność: {rec.metrics.confidence}%
                                  </span>
                                </div>
                              )}
                              <button
                                onClick={() => handleApplyRecommendation(rec)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <CheckCircle className="w-3 h-3" />
                                {rec.action}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                
                <span className="text-xs text-gray-400 mt-1 block">
                  {msg.timestamp.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI analizuje...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Zapytaj o kampanie, budżet, optymalizację..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => setInput('Jak poprawić ROAS?')}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200"
            >
              💡 Jak poprawić ROAS?
            </button>
            <button 
              onClick={() => setInput('Zaproponuj podział budżetu')}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200"
            >
              💰 Podział budżetu
            </button>
            <button 
              onClick={() => setInput('Stwórz nową kampanię')}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200"
            >
              🚀 Nowa kampania
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats & Actions */}
      <div className="space-y-4">
        {/* AI Insights */}
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>3 kampanie działają powyżej celu ROAS</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>1 kampania wymaga optymalizacji</span>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Potencjał wzrostu: +25% konwersji</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Szybkie akcje
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Odśwież analizę</p>
                <p className="text-xs text-gray-500">Pobierz najnowsze dane</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <Copy className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Eksportuj raport</p>
                <p className="text-xs text-gray-500">PDF z rekomendacjami</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <ExternalLink className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Otwórz Google Ads</p>
                <p className="text-xs text-gray-500">Przejdź do panelu</p>
              </div>
            </button>
          </div>
        </div>

        {/* Performance Score */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            Wynik kampanii
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${78 * 3.51} ${100 * 3.51}`}
                  className="text-green-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">78</span>
                <span className="text-xs text-gray-500">/ 100</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Dobry wynik! Zastosuj rekomendacje AI, aby osiągnąć 90+
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIMarketingManager
