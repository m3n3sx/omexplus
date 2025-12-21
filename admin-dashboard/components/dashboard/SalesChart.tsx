"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SalesChartProps {
  data: Array<{
    date: string
    sales: number
  }>
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-theme-secondary p-3 border border-theme rounded shadow-lg">
        <p className="text-sm font-semibold text-theme-primary">{payload[0].payload.date}</p>
        <p className="text-sm text-theme-secondary">
          Sprzedaż: <span className="font-bold text-accent">{payload[0].value.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN</span>
        </p>
      </div>
    )
  }
  return null
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Przegląd sprzedaży (ostatnie 30 dni)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="date" stroke="var(--text-muted)" />
            <YAxis tickFormatter={(value) => `${value.toLocaleString('pl-PL')} PLN`} stroke="var(--text-muted)" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="sales" stroke="rgb(var(--accent-500))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
