"use client"

import { useState } from "react"
import { 
  GripVertical, 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  X,
  Maximize2,
  Minimize2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { WidgetConfig, WidgetSize } from "@/lib/dashboard-config"

interface WidgetWrapperProps {
  config: WidgetConfig
  children: React.ReactNode
  onToggleCollapse: () => void
  onToggleVisibility: () => void
  onChangeSize: (size: WidgetSize) => void
  isDragging?: boolean
  dragHandleProps?: any
}

export default function WidgetWrapper({
  config,
  children,
  onToggleCollapse,
  onToggleVisibility,
  onChangeSize,
  isDragging,
  dragHandleProps,
}: WidgetWrapperProps) {
  const [showSettings, setShowSettings] = useState(false)

  const sizes: { value: WidgetSize; label: string }[] = [
    { value: 'small', label: 'Mały' },
    { value: 'medium', label: 'Średni' },
    { value: 'large', label: 'Duży' },
    { value: 'full', label: 'Pełna szerokość' },
  ]

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all",
        isDragging && "shadow-lg ring-2 ring-blue-500 opacity-90",
        config.collapsed && "h-auto"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <button
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
            title="Przeciągnij aby zmienić pozycję"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          
          <h3 className="font-medium text-gray-900">{config.title}</h3>
        </div>

        <div className="flex items-center gap-1">
          {/* Size toggle */}
          <button
            onClick={() => {
              const currentIndex = sizes.findIndex(s => s.value === config.size)
              const nextIndex = (currentIndex + 1) % sizes.length
              onChangeSize(sizes[nextIndex].value)
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Zmień rozmiar"
          >
            {config.size === 'full' ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              title="Ustawienia"
            >
              <Settings className="w-4 h-4" />
            </button>

            {showSettings && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <p className="text-xs text-gray-500 px-2 py-1">Rozmiar widgetu</p>
                  {sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => {
                        onChangeSize(size.value)
                        setShowSettings(false)
                      }}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100",
                        config.size === size.value && "bg-blue-50 text-blue-600"
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      onToggleVisibility()
                      setShowSettings(false)
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-red-50 text-red-600"
                  >
                    Ukryj widget
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Collapse */}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title={config.collapsed ? "Rozwiń" : "Zwiń"}
          >
            {config.collapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={onToggleVisibility}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            title="Ukryj widget"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!config.collapsed && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  )
}
