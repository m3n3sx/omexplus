'use client'

import { useState, useEffect } from 'react'

interface CompatibilityValidatorProps {
  machineModelId: string
  partId: string
}

export function CompatibilityValidator({ machineModelId, partId }: CompatibilityValidatorProps) {
  const [validation, setValidation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    validateCompatibility()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineModelId, partId])

  const validateCompatibility = async () => {
    try {
      const response = await fetch(
        `/api/advanced-search?action=validate-part&machineId=${machineModelId}&partId=${partId}`
      )
      const data = await response.json()
      setValidation(data)
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-neutral-100 rounded-lg animate-pulse">
        <div className="h-4 bg-neutral-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-neutral-300 rounded w-1/2"></div>
      </div>
    )
  }

  if (!validation) return null

  return (
    <div className={`p-6 rounded-lg border-2 ${
      validation.compatible ? 'bg-success/10 border-success' : 'bg-danger/10 border-danger'
    }`}>
      <div className="flex items-start gap-4">
        <div className="text-4xl">
          {validation.compatible ? '✅' : '❌'}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Compatibility Check
          </h3>
          <p className="text-neutral-700 mb-3">
            {validation.reason}
          </p>
          {validation.isOriginal && (
            <div className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded">
              Original Part
            </div>
          )}
          {validation.notes && (
            <p className="mt-3 text-sm text-neutral-600">
              Note: {validation.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
