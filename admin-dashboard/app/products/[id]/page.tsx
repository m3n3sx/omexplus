"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatPrice, formatDate } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { Product } from "@/lib/types"
import { ArrowLeft, Edit, Trash2, Package } from "lucide-react"

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadProduct()
  }, [router, productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const response = await api.getProduct(productId)
      setProduct(response.product as Product)
    } catch (error) {
      console.error("Error loading product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    try {
      await api.deleteProduct(productId)
      router.push("/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product")
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
              <p className="text-gray-600 mt-1">{product.handle}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/products/${productId}/edit`}>
              <Button variant="secondary">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="secondary" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2 text-red-600" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <p className="mt-1 text-gray-900">{product.title}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-600">{product.description || "No description"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Handle</label>
                  <p className="mt-1 text-gray-900">{product.handle}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <Badge variant={product.status === "published" ? "success" : "default"}>
                      {product.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Variants</h2>
              
              <div className="space-y-4">
                {product.variants?.map((variant) => (
                  <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{variant.title}</h3>
                      <Badge variant={variant.inventory_quantity > 0 ? "success" : "danger"}>
                        {variant.inventory_quantity} in stock
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">SKU:</span>
                        <span className="ml-2 text-gray-900">{variant.sku || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Barcode:</span>
                        <span className="ml-2 text-gray-900">{variant.barcode || "N/A"}</span>
                      </div>
                    </div>
                    
                    {variant.prices && variant.prices.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Prices:</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {variant.prices.map((price, idx) => (
                            <Badge key={idx} variant="info">
                              {formatPrice(price.amount, price.currency_code)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {(!product.variants || product.variants.length === 0) && (
                  <p className="text-gray-600 text-center py-4">No variants available</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
              {product.thumbnail ? (
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="text-gray-900 mt-1">{formatDate(product.created_at)}</p>
                </div>
                
                <div>
                  <span className="text-gray-600">Updated:</span>
                  <p className="text-gray-900 mt-1">{formatDate(product.updated_at)}</p>
                </div>
                
                <div>
                  <span className="text-gray-600">Product ID:</span>
                  <p className="text-gray-900 mt-1 font-mono text-xs break-all">{product.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
