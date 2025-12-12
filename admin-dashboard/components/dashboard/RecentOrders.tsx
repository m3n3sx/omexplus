import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import Badge from "@/components/ui/Badge"
import { formatPrice, formatDate, getOrderStatusColor } from "@/lib/utils"
import { Order } from "@/lib/types"

interface RecentOrdersProps {
  orders: Order[]
}

const statusTranslations: { [key: string]: string } = {
  'pending': 'Oczekujące',
  'completed': 'Zrealizowane',
  'canceled': 'Anulowane',
  'draft': 'Wersja robocza',
  'archived': 'Zarchiwizowane',
  'requires_action': 'Wymaga działania'
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ostatnie zamówienia</CardTitle>
        <Link href="/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Zobacz wszystkie
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zamówienie</TableHead>
              <TableHead>Klient</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Wartość</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/orders/${order.id}`} className="font-medium text-primary-600 hover:text-primary-700">
                    #{order.display_id}
                  </Link>
                </TableCell>
                <TableCell>{order.email || 'Brak email'}</TableCell>
                <TableCell className="text-gray-600">{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {statusTranslations[order.status] || order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {order.total ? `${(order.total / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN` : '0,00 PLN'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
