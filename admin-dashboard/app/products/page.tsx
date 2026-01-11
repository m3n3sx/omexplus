"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { useToast } from "@/components/ui/Toast"
import { formatPrice, formatDate } from "@/lib/utils"
import { isAuthenticated } from "@/lib/auth"
import api from "@/lib/api-client"
import { Product } from "@/lib/types"
import { Search, Plus, Edit, Trash2, Archive, RotateCcw, Package } from "lucide-react"

type ViewMode = "active" | "archive"

export default function ProductsPage() {
  const router = useRouter()
  const toast = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("active")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [counts, setCounts] = useState({ active: 0, archive: 0 })
  const productsPerPage = 20

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const toggleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Czy na pewno chcesz usunąć ${selectedProducts.length} produktów?`)) return
    
    try {
      for (const productId of selectedProducts) {
        await api.deleteProduct(productId)
      }
      toast.success(`Usunięto ${selectedProducts.length} produktów`)
      setSelectedProducts([])
      await loadProducts()
    } catch (error) {
      console.error("Error deleting products:", error)
      alert("Błąd podczas usuwania produktów")
    }
  }

  const handleArchive = async (productId: string) => {
    try {
      await api.updateProduct(productId, { status: "draft" })
      toast.success("Produkt został zarchiwizowany")
      await loadProducts()
    } catch (error) {
      console.error("Error archiving product:", error)
      toast.error("Błąd podczas archiwizacji")
    }
  }

  const handleRestore = async (productId: string) => {
    try {
      await api.updateProduct(productId, { status: "published" })
      toast.success("Produkt został przywrócony")
      await loadProducts()
    } catch (error) {
      console.error("Error restoring product:", error)
      toast.error("Błąd podczas przywracania")
    }
  }

  const handleBulkArchive = async () => {
    if (!confirm(`Czy na pewno chcesz zarchiwizować ${selectedProducts.length} produktów?`)) return
    
    try {
      for (const productId of selectedProducts) {
        await api.updateProduct(productId, { status: "draft" })
      }
      toast.success(`Zarchiwizowano ${selectedProducts.length} produktów`)
      setSelectedProducts([])
      await loadProducts()
    } catch (error) {
      console.error("Error archiving products:", error)
      toast.error("Błąd podczas archiwizacji")
    }
  }

  const handleBulkRestore = async () => {
    if (!confirm(`Czy na pewno chcesz przywrócić ${selectedProducts.length} produktów?`)) return
    
    try {
      for (const productId of selectedProducts) {
        await api.updateProduct(productId, { status: "published" })
      }
      toast.success(`Przywrócono ${selectedProducts.length} produktów`)
      setSelectedProducts([])
      await loadProducts()
    } catch (error) {
      console.error("Error restoring products:", error)
      toast.error("Błąd podczas przywracania")
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadProducts()
    loadCounts()
  }, [router, currentPage, viewMode, supplierFilter])

  const loadCounts = async () => {
    try {
      const [activeRes, archiveRes] = await Promise.all([
        api.getProducts({ status: "published", limit: 1 }),
        api.getProducts({ status: "draft", limit: 1 })
      ])
      setCounts({
        active: activeRes.count || 0,
        archive: archiveRes.count || 0
      })
    } catch (error) {
      console.error("Error loading counts:", error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * productsPerPage
      
      const params: any = {
        limit: productsPerPage,
        offset,
        status: viewMode === "active" ? "published" : "draft"
      }
      
      // Use api-client instead of medusaClient
      const response = await api.getProducts(params)
      
      // Filter by supplier if needed
      let filteredProducts = response.products as Product[]
      if (supplierFilter !== "all") {
        filteredProducts = filteredProducts.filter(p => 
          (p as any).metadata?.supplier === supplierFilter
        )
      }
      
      setProducts(filteredProducts)
      setTotalPages(Math.ceil((response.count || 0) / productsPerPage))
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten produkt?")) return
    
    try {
      await api.deleteProduct(productId)
      toast.success("Produkt został usunięty")
      await loadProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Błąd podczas usuwania produktu")
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
            <h1 className="text-2xl font-bold text-theme-primary">Produkty</h1>
            <p className="text-theme-secondary mt-1">Zarządzaj katalogiem produktów</p>
          </div>
          <div className="flex space-x-2">
            {selectedProducts.length > 0 && (
              <>
                {viewMode === "active" ? (
                  <Button variant="secondary" onClick={handleBulkArchive}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archiwizuj ({selectedProducts.length})
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handleBulkRestore}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Przywróć ({selectedProducts.length})
                  </Button>
                )}
                <Button variant="danger" onClick={handleBulkDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Usuń ({selectedProducts.length})
                </Button>
              </>
            )}
            <Link href="/products/import">
              <Button variant="secondary">
                Import CSV
              </Button>
            </Link>
            <Link href="/products/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Dodaj produkt
              </Button>
            </Link>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex space-x-1 bg-theme-tertiary p-1 rounded-lg w-fit">
          <button
            onClick={() => { setViewMode("active"); setCurrentPage(1); setSelectedProducts([]); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
              viewMode === "active" 
                ? "bg-theme-secondary text-theme-primary shadow-sm" 
                : "text-theme-secondary hover:text-theme-primary"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Aktywne</span>
            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-xs">{counts.active}</span>
          </button>
          <button
            onClick={() => { setViewMode("archive"); setCurrentPage(1); setSelectedProducts([]); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
              viewMode === "archive" 
                ? "bg-theme-secondary text-theme-primary shadow-sm" 
                : "text-theme-secondary hover:text-theme-primary"
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>Archiwum</span>
            <span className="bg-theme-hover text-theme-muted px-2 py-0.5 rounded-full text-xs">{counts.archive}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-theme-secondary rounded-lg border border-theme p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-muted" />
              <input
                type="text"
                placeholder="Szukaj produktów..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            
            <select
              value={supplierFilter}
              onChange={(e) => { setSupplierFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border border-theme bg-theme-primary text-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Wszyscy dostawcy</option>
              <option value="omexplus">Omexplus</option>
              <option value="kolaiwalki">Kolaiwalki</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-theme-secondary rounded-lg border border-theme">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-theme"
                  />
                </TableHead>
                <TableHead>Produkt</TableHead>
                <TableHead>Dostawca</TableHead>
                <TableHead>Magazyn</TableHead>
                <TableHead>Cena</TableHead>
                <TableHead>Utworzono</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const firstVariant = product.variants?.[0]
                const price = firstVariant?.prices?.[0]
                const inventory = firstVariant?.inventory_quantity || 0
                const isSelected = selectedProducts.includes(product.id)
                const supplier = (product as any).metadata?.supplier
                
                return (
                  <TableRow key={product.id} className={isSelected ? "bg-accent/10" : ""}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="w-4 h-4 rounded border-theme"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt={product.title} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-theme-tertiary rounded flex items-center justify-center">
                            <span className="text-theme-muted text-xs">Brak</span>
                          </div>
                        )}
                        <div>
                          <Link href={`/products/${product.id}`} className="font-medium text-accent hover:underline">
                            {product.title}
                          </Link>
                          <p className="text-sm text-theme-secondary">{product.handle}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {supplier ? (
                        <Badge variant={supplier === "omexplus" ? "info" : "default"}>
                          {supplier}
                        </Badge>
                      ) : (
                        <span className="text-theme-muted">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={inventory > 0 ? "text-green-600 dark:text-green-400" : "text-theme-muted"}>
                        {inventory > 0 ? `${inventory} szt.` : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {price && price.amount > 0 ? formatPrice(price.amount, price.currency_code) : (
                        <span className="text-orange-500 dark:text-orange-400 text-sm">Zapytaj</span>
                      )}
                    </TableCell>
                    <TableCell className="text-theme-secondary">{formatDate(product.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Link href={`/products/${product.id}`}>
                          <Button size="sm" variant="ghost" title="Edytuj">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        {viewMode === "active" ? (
                          <Button size="sm" variant="ghost" onClick={() => handleArchive(product.id)} title="Archiwizuj">
                            <Archive className="w-4 h-4 text-theme-muted" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => handleRestore(product.id)} title="Przywróć">
                            <RotateCcw className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)} title="Usuń">
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
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
            <p className="text-sm text-theme-secondary">
              Strona {currentPage} z {totalPages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Poprzednia
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Następna
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
