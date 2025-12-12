'use client'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onReset: () => void
}

export function ProgressBar({ currentStep, totalSteps, onBack, onReset }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  const steps = [
    'Search',
    'Machine Type',
    'Manufacturer',
    'Model',
    'Symptom',
    'Category',
    'Results'
  ]

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-neutral-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Labels */}
      <div className="hidden md:flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index <= currentStep
                ? 'text-primary-600 font-semibold'
                : 'text-neutral-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                index < currentStep
                  ? 'bg-primary-600 text-white'
                  : index === currentStep
                  ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                  : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className="ml-2 text-xs">{step}</span>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onBack}
          disabled={currentStep === 0}
          className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          🔄 Start Over
        </button>
      </div>
    </div>
  )
}
