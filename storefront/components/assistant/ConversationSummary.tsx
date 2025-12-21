'use client'

interface ConversationSummaryProps {
  machineType?: string
  manufacturer?: string
  model?: string
  issue?: string
  selectedPart?: any
  language?: string
}

export function ConversationSummary({
  machineType,
  manufacturer,
  model,
  issue,
  selectedPart,
  language = 'en'
}: ConversationSummaryProps) {
  const hasData = machineType || manufacturer || model || issue || selectedPart

  if (!hasData) return null

  return (
    <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4 my-3">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        <h4 className="font-semibold text-neutral-900">
          {language === 'pl' ? 'Podsumowanie rozmowy' : 'Conversation Summary'}
        </h4>
      </div>

      <div className="space-y-2 text-sm">
        {machineType && (
          <div className="flex justify-between">
            <span className="text-neutral-600">
              {language === 'pl' ? 'Typ maszyny:' : 'Machine Type:'}
            </span>
            <span className="font-medium text-neutral-900">{machineType}</span>
          </div>
        )}
        
        {manufacturer && (
          <div className="flex justify-between">
            <span className="text-neutral-600">
              {language === 'pl' ? 'Producent:' : 'Manufacturer:'}
            </span>
            <span className="font-medium text-neutral-900">{manufacturer}</span>
          </div>
        )}
        
        {model && (
          <div className="flex justify-between">
            <span className="text-neutral-600">
              {language === 'pl' ? 'Model:' : 'Model:'}
            </span>
            <span className="font-medium text-neutral-900">{model}</span>
          </div>
        )}
        
        {issue && (
          <div className="flex justify-between">
            <span className="text-neutral-600">
              {language === 'pl' ? 'Problem:' : 'Issue:'}
            </span>
            <span className="font-medium text-neutral-900">{issue}</span>
          </div>
        )}
        
        {selectedPart && (
          <div className="pt-2 border-t border-neutral-300">
            <div className="flex items-center gap-2 text-success">
              <span>✓</span>
              <span className="font-medium">
                {language === 'pl' ? 'Wybrana część:' : 'Selected Part:'}
              </span>
            </div>
            <div className="mt-1 ml-6 text-neutral-900">
              {selectedPart.name}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
