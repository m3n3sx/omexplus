/**
 * Dashboard Widget Configuration System
 * Inspirowany WordPress Dashboard - customizowalne widgety
 */

export type WidgetSize = 'small' | 'medium' | 'large' | 'full'
export type WidgetId = 
  | 'stats-orders' 
  | 'stats-revenue' 
  | 'stats-customers' 
  | 'stats-new-orders'
  | 'sales-chart'
  | 'recent-orders'
  | 'top-products'
  | 'chat-widget'
  | 'quick-actions'
  | 'stock-alerts'
  | 'calendar-widget'
  | 'tasks-widget'

export interface WidgetConfig {
  id: WidgetId
  title: string
  description: string
  size: WidgetSize
  order: number
  visible: boolean
  collapsed: boolean
  permission?: string // Wymagane uprawnienie
}

export interface DashboardConfig {
  widgets: WidgetConfig[]
  columns: number
  theme: 'light' | 'dark'
}

// Domyślna konfiguracja widgetów
export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'stats-orders', title: 'Wszystkie zamówienia', description: 'Łączna liczba zamówień', size: 'small', order: 1, visible: true, collapsed: false, permission: 'orders.view' },
  { id: 'stats-revenue', title: 'Przychód', description: 'Całkowity przychód', size: 'small', order: 2, visible: true, collapsed: false, permission: 'analytics.view' },
  { id: 'stats-new-orders', title: 'Nowe zamówienia', description: 'Zamówienia z ostatnich 24h', size: 'small', order: 3, visible: true, collapsed: false, permission: 'orders.view' },
  { id: 'stats-customers', title: 'Klienci', description: 'Liczba klientów', size: 'small', order: 4, visible: true, collapsed: false, permission: 'customers.view' },
  { id: 'sales-chart', title: 'Wykres sprzedaży', description: 'Sprzedaż w czasie', size: 'large', order: 5, visible: true, collapsed: false, permission: 'analytics.view' },
  { id: 'top-products', title: 'Top produkty', description: 'Najlepiej sprzedające się', size: 'medium', order: 6, visible: true, collapsed: false, permission: 'products.view' },
  { id: 'chat-widget', title: 'Czat na żywo', description: 'Ostatnie konwersacje', size: 'medium', order: 7, visible: true, collapsed: false, permission: 'chat.view' },
  { id: 'recent-orders', title: 'Ostatnie zamówienia', description: 'Najnowsze zamówienia', size: 'full', order: 8, visible: true, collapsed: false, permission: 'orders.view' },
  { id: 'quick-actions', title: 'Szybkie akcje', description: 'Często używane funkcje', size: 'small', order: 9, visible: true, collapsed: false },
  { id: 'stock-alerts', title: 'Alerty magazynowe', description: 'Niskie stany', size: 'medium', order: 10, visible: true, collapsed: false, permission: 'inventory.view' },
  { id: 'tasks-widget', title: 'Moje zadania', description: 'Lista zadań do wykonania', size: 'medium', order: 11, visible: true, collapsed: false },
]

const STORAGE_KEY = 'omex_dashboard_config'

// Pobierz konfigurację z localStorage
export function getDashboardConfig(): DashboardConfig {
  if (typeof window === 'undefined') {
    return { widgets: DEFAULT_WIDGETS, columns: 4, theme: 'light' }
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return { widgets: DEFAULT_WIDGETS, columns: 4, theme: 'light' }
  }
  
  try {
    const config = JSON.parse(stored) as DashboardConfig
    // Merge z domyślnymi (na wypadek nowych widgetów)
    const mergedWidgets = DEFAULT_WIDGETS.map(defaultWidget => {
      const savedWidget = config.widgets.find(w => w.id === defaultWidget.id)
      return savedWidget ? { ...defaultWidget, ...savedWidget } : defaultWidget
    })
    return { ...config, widgets: mergedWidgets }
  } catch {
    return { widgets: DEFAULT_WIDGETS, columns: 4, theme: 'light' }
  }
}

// Zapisz konfigurację
export function saveDashboardConfig(config: DashboardConfig): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

// Aktualizuj pojedynczy widget
export function updateWidgetConfig(widgetId: WidgetId, updates: Partial<WidgetConfig>): DashboardConfig {
  const config = getDashboardConfig()
  const widgetIndex = config.widgets.findIndex(w => w.id === widgetId)
  
  if (widgetIndex !== -1) {
    config.widgets[widgetIndex] = { ...config.widgets[widgetIndex], ...updates }
    saveDashboardConfig(config)
  }
  
  return config
}

// Zmień kolejność widgetów
export function reorderWidgets(sourceIndex: number, destIndex: number): DashboardConfig {
  const config = getDashboardConfig()
  const widgets = [...config.widgets]
  const [removed] = widgets.splice(sourceIndex, 1)
  widgets.splice(destIndex, 0, removed)
  
  // Aktualizuj order
  widgets.forEach((w, i) => w.order = i + 1)
  
  config.widgets = widgets
  saveDashboardConfig(config)
  return config
}

// Reset do domyślnych
export function resetDashboardConfig(): DashboardConfig {
  const config = { widgets: DEFAULT_WIDGETS, columns: 4, theme: 'light' as const }
  saveDashboardConfig(config)
  return config
}

// Mapowanie rozmiaru na klasy CSS grid
export function getWidgetGridClass(size: WidgetSize): string {
  switch (size) {
    case 'small': return 'col-span-1'
    case 'medium': return 'col-span-1 lg:col-span-2'
    case 'large': return 'col-span-1 lg:col-span-2 xl:col-span-3'
    case 'full': return 'col-span-full'
    default: return 'col-span-1'
  }
}
