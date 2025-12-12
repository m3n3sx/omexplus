import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"

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
}

export default function StatsCard({ title, value, icon: Icon, trend, iconColor = "text-primary-600" }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "↑" : "↓"} {typeof trend.value === 'number' ? trend.value.toFixed(1) : trend.value}{trend.label ? '' : '%'} {trend.label || 'vs poprzedni miesiąc'}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gray-100 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  )
}
