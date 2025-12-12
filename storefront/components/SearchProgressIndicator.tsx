'use client'

interface SearchProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  completedSteps: string[]
  language?: string
}

const stepIcons = ['🔍', '🚜', '🏭', '📋', '🔧', '⚙️', '✅']
const stepLabelsEn = ['Search', 'Type', 'Manufacturer', 'Model', 'Issue', 'Category', 'Results']
const stepLabelsPl = ['Szukaj', 'Typ', 'Producent', 'Model', 'Problem', 'Kategoria', 'Wyniki']

export function SearchProgressIndicator({
  currentStep,
  totalSteps,
  completedSteps,
  language = 'en'
}: SearchProgressIndicatorProps) {
  const labels = language === 'pl' ? stepLabelsPl : stepLabelsEn
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps + 1 }).map((_, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <div
              key={index}
              className="flex flex-col items-center"
            >
              {/* Icon */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-lg
                  transition-all duration-300
                  ${isCompleted ? 'bg-primary-600 text-white scale-100' : ''}
                  ${isCurrent ? 'bg-primary-600 text-white scale-110 ring-4 ring-primary-200' : ''}
                  ${isUpcoming ? 'bg-neutral-200 text-neutral-400 scale-90' : ''}
                `}
              >
                {isCompleted ? '✓' : stepIcons[index]}
              </div>

              {/* Label */}
              <span
                className={`
                  text-xs mt-2 font-medium
                  ${isCurrent ? 'text-primary-600' : 'text-neutral-500'}
                `}
              >
                {labels[index]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress text */}
      <div className="text-center mt-4 text-sm text-neutral-600">
        {language === 'pl' 
          ? `Krok ${currentStep} z ${totalSteps}`
          : `Step ${currentStep} of ${totalSteps}`
        }
      </div>
    </div>
  )
}
