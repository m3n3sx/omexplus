import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"

interface TopProduct {
  id: string
  title: string
  sales: number
  revenue: number
  thumbnail?: string
}

interface TopProductsProps {
  products: TopProduct[]
}

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Najlepsze produkty</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-sm text-theme-muted text-center py-4">Brak danych o produktach</p>
          ) : (
            products.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-theme-tertiary rounded-lg flex items-center justify-center">
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-theme-muted font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-theme-primary">{product.title}</p>
                    <p className="text-xs text-theme-muted">{product.sales} sprzedanych</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-theme-primary">
                    {(product.revenue / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
