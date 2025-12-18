"use client"

/**
 * CSV Import Page
 * 
 * Importuj produkty z CSV - kluczowe dla katalogów dostawców
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import { Upload, Download, FileText, CheckCircle, XCircle } from "lucide-react"

export default function ImportPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [updateMode, setUpdateMode] = useState('create_or_update')
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResults(null)
    }
  }

  const handleImport = async () => {
    if (!file) {
      alert("Wybierz plik CSV")
      return
    }

    try {
      setImporting(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('updateMode', updateMode)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/products/import`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('medusa_admin_token')}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Import failed')
      }

      const data = await response.json()
      setResults(data)
      
      if (data.failed === 0) {
        alert(`✅ Import zakończony!\n\nUtworzono: ${data.created}\nZaktualizowano: ${data.updated}`)
      } else {
        alert(`⚠️ Import zakończony z błędami\n\nUtworzono: ${data.created}\nZaktualizowano: ${data.updated}\nBłędy: ${data.failed}`)
      }
    } catch (error) {
      console.error("Import error:", error)
      alert("❌ Błąd podczas importu")
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = `handle,title,description,price,stock,sku,status,currency
pump-001,Hydraulic Pump,High pressure hydraulic pump,299.99,50,PUMP001,published,pln
seal-002,Hydraulic Seal,Wear resistant seal,49.99,100,SEAL002,published,pln
filter-003,Oil Filter,Premium oil filter,29.99,75,FILT003,published,pln`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import Products from CSV</h1>
          <p className="text-gray-600 mt-1">
            Importuj produkty z pliku CSV - idealny dla katalogów dostawców
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-semibold text-blue-900 mb-3">📋 Instrukcje:</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Pobierz szablon CSV poniżej</li>
            <li>Wypełnij dane produktów w Excel/Google Sheets</li>
            <li>Zapisz jako CSV (UTF-8)</li>
            <li>Wybierz tryb importu</li>
            <li>Prześlij plik</li>
          </ol>
        </div>

        {/* Template Download */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold mb-4">1. Pobierz szablon CSV</h2>
          <Button variant="secondary" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Pobierz szablon
          </Button>
          
          <div className="mt-4 p-4 bg-gray-50 rounded text-sm font-mono">
            <div className="text-gray-600 mb-2">Format CSV:</div>
            <div>handle,title,description,price,stock,sku,status,currency</div>
            <div className="text-gray-500">pump-001,Hydraulic Pump,High pressure pump,299.99,50,PUMP001,published,pln</div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold mb-4">2. Wybierz plik CSV</h2>
          
          <div className="space-y-4">
            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plik CSV
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100"
                />
                {file && (
                  <div className="flex items-center gap-2 text-green-600">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Update Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tryb importu
              </label>
              <select
                value={updateMode}
                onChange={(e) => setUpdateMode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="create_or_update">Utwórz nowe lub zaktualizuj istniejące</option>
                <option value="create_only">Tylko twórz nowe (pomiń istniejące)</option>
                <option value="update_only">Tylko aktualizuj istniejące (pomiń nowe)</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">
                Produkty są identyfikowane po polu "handle"
              </p>
            </div>

            {/* Import Button */}
            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? 'Importowanie...' : 'Importuj produkty'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold mb-4">Wyniki importu</h2>
            
            {/* Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.total}</div>
                <div className="text-sm text-blue-800">Razem</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.created}</div>
                <div className="text-sm text-green-800">Utworzono</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{results.updated}</div>
                <div className="text-sm text-yellow-800">Zaktualizowano</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-sm text-red-800">Błędy</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Handle</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Action</th>
                    <th className="px-4 py-2 text-left">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {results.results.map((result: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">{result.handle}</td>
                      <td className="px-4 py-2">{result.title}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          result.action === 'created' ? 'bg-green-100 text-green-800' :
                          result.action === 'updated' ? 'bg-yellow-100 text-yellow-800' :
                          result.action === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {result.action}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-red-600 text-xs">
                        {result.error || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
