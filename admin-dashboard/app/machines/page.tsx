"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { useToast } from "@/components/ui/Toast"
import { isAuthenticated } from "@/lib/auth"
import { apiClient } from "@/lib/api-client"
import { Search, Plus, Edit, Trash2, Truck, Filter, X, Check } from "lucide-react"

interface Machine {
  id: string
  manufacturer: string
  model_code: string
  model_family: string
  serial_range_start: string
  serial_range_end: string
  year_from: number | null
  year_to: number | null
  engine_manufacturer: string
  engine_model: string
  data_source: string
  notes: string
  created_at: string
}

interface Manufacturer {
  manufacturer: string
  count: number
}

export default function MachinesPage() {
  const router = useRouter()
  const toast = useToast()
  const [machines, setMachines] = useState<Machine[]>([])
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedManufacturer, setSelectedManufacturer] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadMachines()
  }, [router, selectedManufacturer])


  const loadMachines = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedManufacturer) params.append('manufacturer', selectedManufacturer)
      if (searchQuery) params.append('search', searchQuery)
      params.append('limit', '100')
      
      const response = await apiClient.get(`/admin/machines?${params.toString()}`)
      setMachines(response.machines || [])
      setManufacturers(response.manufacturers || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error("Error loading machines:", error)
      toast.error("Błąd ładowania maszyn")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadMachines()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tę maszynę?")) return
    
    setDeletingId(id)
    try {
      await apiClient.delete(`/admin/machines/${id}`)
      toast.success("Maszyna usunięta")
      loadMachines()
    } catch (error) {
      console.error("Error deleting machine:", error)
      toast.error("Błąd usuwania maszyny")
    } finally {
      setDeletingId(null)
    }
  }

  const getMachineType = (notes: string | null): string => {
    if (!notes) return 'Inne'
    if (notes.includes('excavator')) return 'Koparka'
    if (notes.includes('wheel_loader')) return 'Ładowarka'
    if (notes.includes('dozer')) return 'Spychacz'
    if (notes.includes('backhoe')) return 'Koparko-ładowarka'
    if (notes.includes('telehandler')) return 'Telehandler'
    if (notes.includes('mining')) return 'Górnicza'
    return 'Inne'
  }

  const getWeight = (notes: string | null): string => {
    if (!notes) return '-'
    const match = notes.match(/(\d+)kg/)
    if (match) {
      const kg = parseInt(match[1])
      if (kg >= 1000) return `${(kg/1000).toFixed(1)}t`
      return `${kg}kg`
    }
    return '-'
  }

  if (loading && machines.length === 0) {
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-7 h-7" />
              Baza maszyn
            </h1>
            <p className="text-gray-600 mt-1">
              {total} maszyn w bazie danych
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj maszynę
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Szukaj modelu lub silnika..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Wszyscy producenci</option>
              {manufacturers.map(m => (
                <option key={m.manufacturer} value={m.manufacturer}>
                  {m.manufacturer} ({m.count})
                </option>
              ))}
            </select>
            <Button variant="secondary" onClick={handleSearch}>
              <Filter className="w-4 h-4 mr-2" />
              Filtruj
            </Button>
          </div>
        </div>


        {/* Machines Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producent</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Lata produkcji</TableHead>
                <TableHead>Silnik</TableHead>
                <TableHead>Waga</TableHead>
                <TableHead>Źródło</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>
                    <span className="font-medium">{machine.manufacturer}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{machine.model_code}</span>
                      {machine.model_family && (
                        <span className="text-gray-500 text-sm ml-2">({machine.model_family})</span>
                      )}
                    </div>
                    {(machine.serial_range_start || machine.serial_range_end) && (
                      <div className="text-xs text-gray-500">
                        S/N: {machine.serial_range_start || '?'} - {machine.serial_range_end || '?'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      (machine.notes || '').includes('excavator') ? 'info' :
                      (machine.notes || '').includes('loader') ? 'success' :
                      (machine.notes || '').includes('dozer') ? 'warning' :
                      'default'
                    }>
                      {getMachineType(machine.notes || '')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {machine.year_from ? (
                      <span>
                        {machine.year_from} - {machine.year_to || 'teraz'}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {machine.engine_model || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getWeight(machine.notes || '')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={machine.data_source === 'manual' ? 'warning' : 'default'}>
                      {machine.data_source === 'verified_specs' ? 'Zweryfikowane' : 
                       machine.data_source === 'manual' ? 'Ręczne' : machine.data_source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingMachine(machine)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(machine.id)}
                        disabled={deletingId === machine.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        {deletingId === machine.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {machines.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              Brak maszyn spełniających kryteria
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingMachine) && (
        <MachineModal
          machine={editingMachine}
          onClose={() => {
            setShowAddModal(false)
            setEditingMachine(null)
          }}
          onSave={() => {
            setShowAddModal(false)
            setEditingMachine(null)
            loadMachines()
            toast.success(editingMachine ? "Maszyna zaktualizowana" : "Maszyna dodana")
          }}
        />
      )}
    </DashboardLayout>
  )
}


// Machine Add/Edit Modal Component
function MachineModal({ 
  machine, 
  onClose, 
  onSave 
}: { 
  machine: Machine | null
  onClose: () => void
  onSave: () => void 
}) {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    manufacturer: machine?.manufacturer || '',
    model_code: machine?.model_code || '',
    model_family: machine?.model_family || '',
    serial_range_start: machine?.serial_range_start || '',
    serial_range_end: machine?.serial_range_end || '',
    year_from: machine?.year_from?.toString() || '',
    year_to: machine?.year_to?.toString() || '',
    engine_manufacturer: machine?.engine_manufacturer || '',
    engine_model: machine?.engine_model || '',
    notes: machine?.notes || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.manufacturer || !formData.model_code) {
      toast.error("Producent i model są wymagane")
      return
    }

    setSaving(true)
    try {
      const data = {
        ...formData,
        year_from: formData.year_from ? parseInt(formData.year_from) : null,
        year_to: formData.year_to ? parseInt(formData.year_to) : null,
      }

      if (machine) {
        await apiClient.put(`/admin/machines/${machine.id}`, data)
      } else {
        await apiClient.post('/admin/machines', data)
      }
      onSave()
    } catch (error: any) {
      console.error("Error saving machine:", error)
      toast.error(error.message || "Błąd zapisywania")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {machine ? 'Edytuj maszynę' : 'Dodaj nową maszynę'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producent *
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                placeholder="np. CATERPILLAR"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                value={formData.model_code}
                onChange={(e) => setFormData({...formData, model_code: e.target.value})}
                placeholder="np. 320D"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rodzina modelu
              </label>
              <input
                type="text"
                value={formData.model_family}
                onChange={(e) => setFormData({...formData, model_family: e.target.value})}
                placeholder="np. 32"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model silnika
              </label>
              <input
                type="text"
                value={formData.engine_model}
                onChange={(e) => setFormData({...formData, engine_model: e.target.value})}
                placeholder="np. Cat C6.4"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rok produkcji od
              </label>
              <input
                type="number"
                value={formData.year_from}
                onChange={(e) => setFormData({...formData, year_from: e.target.value})}
                placeholder="np. 2007"
                min="1950"
                max="2030"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rok produkcji do
              </label>
              <input
                type="number"
                value={formData.year_to}
                onChange={(e) => setFormData({...formData, year_to: e.target.value})}
                placeholder="np. 2012 (puste = nadal)"
                min="1950"
                max="2030"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numer seryjny od
              </label>
              <input
                type="text"
                value={formData.serial_range_start}
                onChange={(e) => setFormData({...formData, serial_range_start: e.target.value})}
                placeholder="np. ABC00001"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numer seryjny do
              </label>
              <input
                type="text"
                value={formData.serial_range_end}
                onChange={(e) => setFormData({...formData, serial_range_end: e.target.value})}
                placeholder="np. ABC99999"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notatki (typ maszyny, waga)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="np. excavator, 20000kg"
              rows={2}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Anuluj
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {machine ? 'Zapisz zmiany' : 'Dodaj maszynę'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
