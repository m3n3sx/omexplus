"use client"

import { useState, ReactNode, DragEvent } from "react"
import { GripVertical, ChevronDown, ChevronUp, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { WidgetConfig, WidgetSize, getWidgetGridClass } from "@/lib/dashboard-config"

interface DraggableWidgetGridProps {
  widgets: WidgetConfig[]
  onReorder: (widgets: WidgetConfig[]) => void
  onUpdateWidget: (widgetId: string, updates: Partial<WidgetConfig>) => void
  renderContent: (widgetId: string) => ReactNode
  editMode: boolean
}

export default function DraggableWidgetGrid({
  widgets,
  onReorder,
  onUpdateWidget,
  renderContent,
  editMode,
}: DraggableWidgetGridProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const handleDragStart = (e: DragEvent<HTMLDivElement>, widgetId: string) => {
    setDraggedId(widgetId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", widgetId)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>, widgetId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (widgetId !== draggedId) {
      setDragOverId(widgetId)
    }
  }

  const handleDragLeave = () => {
    setDragOverId(null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault()
    setDragOverId(null)

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      return
    }

    const oldIndex = widgets.findIndex((w) => w.id === draggedId)
    const newIndex = widgets.findIndex((w) => w.id === targetId)

    if (oldIndex === -1 || newIndex === -1) {
      setDraggedId(null)
      return
    }

    const newWidgets = [...widgets]
    const [removed] = newWidgets.splice(oldIndex, 1)
    newWidgets.splice(newIndex, 0, removed)

    newWidgets.forEach((w, i) => (w.order = i + 1))
    onReorder(newWidgets)
    setDraggedId(null)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
  }

  const sizes: WidgetSize[] = ["small", "medium", "large", "full"]

  const cycleSize = (widget: WidgetConfig) => {
    const currentIndex = sizes.indexOf(widget.size)
    const nextIndex = (currentIndex + 1) % sizes.length
    onUpdateWidget(widget.id, { size: sizes[nextIndex] })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={cn(
            getWidgetGridClass(widget.size),
            "transition-all duration-200"
          )}
          draggable={editMode}
          onDragStart={(e) => handleDragStart(e, widget.id)}
          onDragOver={(e) => handleDragOver(e, widget.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, widget.id)}
          onDragEnd={handleDragEnd}
        >
          <div
            className={cn(
              "bg-theme-secondary rounded-xl shadow-sm border border-theme overflow-hidden transition-all duration-200",
              draggedId === widget.id && "opacity-50 scale-95",
              dragOverId === widget.id && "ring-2 ring-accent ring-offset-2",
              editMode && "border-blue-300"
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b border-theme",
                editMode ? "bg-blue-50/50 cursor-grab active:cursor-grabbing" : ""
              )}
            >
              {editMode && (
                <GripVertical className="w-4 h-4 text-theme-muted" />
              )}

              <h3 className="font-medium text-theme-primary flex-1 truncate">
                {widget.title}
              </h3>

              <div className="flex items-center gap-1">
                {editMode && (
                  <>
                    <button
                      onClick={() => cycleSize(widget)}
                      className="p-1.5 text-theme-muted hover:text-theme-primary hover:bg-theme-hover rounded text-xs font-medium"
                      title={`Rozmiar: ${widget.size}`}
                    >
                      {widget.size === "small" && "S"}
                      {widget.size === "medium" && "M"}
                      {widget.size === "large" && "L"}
                      {widget.size === "full" && "F"}
                    </button>

                    <button
                      onClick={() => onUpdateWidget(widget.id, { visible: false })}
                      className="p-1.5 text-theme-muted hover:text-red-500 hover:bg-red-50 rounded"
                      title="Ukryj widget"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => onUpdateWidget(widget.id, { collapsed: !widget.collapsed })}
                  className="p-1.5 text-theme-muted hover:text-theme-primary hover:bg-theme-hover rounded"
                >
                  {widget.collapsed ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            {!widget.collapsed && (
              <div className="p-4">{renderContent(widget.id)}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
