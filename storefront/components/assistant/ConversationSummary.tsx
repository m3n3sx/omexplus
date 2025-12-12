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
        <span className="text-xl">📋</span>
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
