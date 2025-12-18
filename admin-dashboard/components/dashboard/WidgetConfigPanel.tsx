"use client"

import { useState } from "react"
import { 
  X, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Columns,
  GripVertical,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  WidgetConfig, 
  DashboardConfig, 
  DEFAULT_WIDGETS,
  WidgetSize 
} from "@/lib/dashboard-config"

interface WidgetConfigPanelProps {
  config: DashboardConfig
  onClose: () => void
  onUpdateWidget: (widgetId: string, updates: Partial<WidgetConfig>) => void
  onReset: () => void
  onReorderWidgets: (widgets: WidgetConfig[]) => void
}

export default function WidgetConfigPanel({
  config,
  onClose,
  onUpdateWidget,
  onReset,
  onReorderWidgets,
}: WidgetConfigPanelProps) {
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedWidget || draggedWidget === targetId) return

    const widgets = [...config.widgets]
    const draggedIndex = widgets.findIndex(w => w.id === draggedWidget)
    const targetIndex = widgets.findIndex(w => w.id === targetId)

    const [removed] = widgets.splice(draggedIndex, 1)
    widgets.splice(targetIndex, 0, removed)

    // Update order
    widgets.forEach((w, i) => w.order = i + 1)
    onReorderWidgets(widgets)
    setDraggedWidget(null)
  }

  const sizes: { value: WidgetSize; label: string }[] = [
    { value: 'small', label: 'S' },
    { value: 'medium', label: 'M' },
    { value: 'large', label: 'L' },
    { value: 'full', label: 'Full' },
  ]

  const visibleCount = config.widgets.filter(w => w.visible).length
  const hiddenCount = config.widgets.filter(w => !w.visible).length

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Konfiguracja dashboardu</h2>
            <p className="text-sm text-gray-500">
              Przeciągnij widgety aby zmienić kolejność, kliknij aby pokazać/ukryć
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 px-6 py-3 bg-gray-50 border-b">
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">{visibleCount} widocznych</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <EyeOff className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{hiddenCount} ukrytych</span>
          </div>
        </div>

        {/* Widget list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {config.widgets
              .sort((a, b) => a.order - b.order)
              .map((widget) => (
                <div
                  key={widget.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, widget.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, widget.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    widget.visible 
                      ? "bg-white border-gray-200 hover:border-blue-300" 
                      : "bg-gray-50 border-gray-100 opacity-60",
                    draggedWidget === widget.id && "ring-2 ring-blue-500 shadow-lg"
                  )}
                >
                  {/* Drag handle */}
                  <div className="cursor-grab active:cursor-grabbing text-gray-400">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Visibility toggle */}
                  <button
                    onClick={() => onUpdateWidget(widget.id, { visible: !widget.visible })}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      widget.visible 
                        ? "bg-green-100 text-green-600 hover:bg-green-200" 
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    )}
                  >
                    {widget.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Widget info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium",
                      widget.visible ? "text-gray-900" : "text-gray-500"
                    )}>
                      {widget.title}
                    </p>
                    <p className="text-xs text-gray-400">{widget.description}</p>
                  </div>

                  {/* Size selector */}
                  <div className="flex gap-1">
                    {sizes.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => onUpdateWidget(widget.id, { size: size.value })}
                        className={cn(
                          "w-8 h-8 text-xs font-medium rounded transition-colors",
                          widget.size === size.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Przywróć domyślne
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            Gotowe
          </button>
        </div>
      </div>
    </div>
  )
}
