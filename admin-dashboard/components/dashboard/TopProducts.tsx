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
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  {product.thumbnail ? (
                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-gray-500 font-medium">{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.title}</p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${(product.revenue / 100).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
