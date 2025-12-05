"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatPrice, formatDate } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import medusaClient from "@/lib/medusa-client"
import { Product } from "@/lib/types"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const productsPerPage = 20

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadProducts()
  }, [router, currentPage, statusFilter])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * productsPerPage
      
      const params: any = {
        limit: productsPerPage,
        offset,
      }
      
      if (statusFilter !== "all") {
        params.status = statusFilter
      }
      
      const response = await medusaClient.admin.products.list(params)
      setProducts(response.products as Product[])
      setTotalPages(Math.ceil((response.count || 0) / productsPerPage))
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    try {
      await medusaClient.admin.products.delete(productId)
      await loadProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product")
    }
  }

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      product.title.toLowerCase().includes(query) ||
      product.handle.toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <Link href="/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const firstVariant = product.variants?.[0]
                const price = firstVariant?.prices?.[0]
                const inventory = firstVariant?.inventory_quantity || 0
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt={product.title} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                        <div>
                          <Link href={`/products/${product.id}`} className="font-medium text-primary-600 hover:text-primary-700">
                            {product.title}
                          </Link>
                          <p className="text-sm text-gray-600">{product.handle}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === "published" ? "success" : "default"}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={inventory > 0 ? "text-green-600" : "text-red-600"}>
                        {inventory} in stock
                      </span>
                    </TableCell>
                    <TableCell>
                      {price ? formatPrice(price.amount, price.currency_code) : "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-600">{formatDate(product.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/products/${product.id}`}>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
