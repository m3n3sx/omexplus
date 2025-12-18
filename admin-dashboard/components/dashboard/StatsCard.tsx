import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  iconColor?: string
  compact?: boolean
}

export default function StatsCard({ title, value, icon: Icon, trend, iconColor = "text-primary-600", compact = false }: StatsCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-gray-100", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "↑" : "↓"} {typeof trend.value === 'number' ? trend.value.toFixed(1) : trend.value}{trend.label ? '' : '%'} {trend.label || 'vs poprzedni miesiąc'}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-full bg-gray-100", iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
