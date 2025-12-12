'use client'

import { useEffect, useRef } from 'react'

interface AutocompleteItem {
  id: string
  label: string
  sublabel?: string
}

interface AutocompleteDropdownProps {
  items: AutocompleteItem[]
  onSelect: (id: string) => void
  onClose: () => void
}

export function AutocompleteDropdown({ items, onSelect, onClose }: AutocompleteDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  if (items.length === 0) {
    return null
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 w-full mt-2 bg-white border-2 border-primary-500 rounded-lg shadow-2xl max-h-80 overflow-y-auto"
      role="listbox"
    >
      <div className="p-2 bg-primary-50 border-b border-primary-200 text-xs font-semibold text-primary-900 sticky top-0">
        {items.length} {items.length === 1 ? 'result' : 'results'} found
      </div>
      
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-neutral-100 last:border-0 focus:bg-primary-100 focus:outline-none"
          role="option"
          aria-selected={false}
          tabIndex={0}
        >
          <div className="font-medium text-neutral-900">{item.label}</div>
          {item.sublabel && (
            <div className="text-sm text-neutral-600 mt-0.5">{item.sublabel}</div>
          )}
        </button>
      ))}
    </div>
  )
}
