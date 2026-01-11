"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"
import { Plus, Trash2, GripVertical, Package, DollarSign, AlertCircle } from "lucide-react"

// Predefiniowane opcje dla części do maszyn
const PREDEFINED_OPTIONS = [
  { title: "Rozmiar", values: ["25mm", "30mm", "35mm", "40mm", "45mm", "50mm", "55mm", "60mm", "65mm", "70mm", "75mm", "80mm", "90mm", "100mm"] },
  { title: "Średnica", values: ["Ø20", "Ø25", "Ø30", "Ø35", "Ø40", "Ø45", "Ø50", "Ø55", "Ø60", "Ø65", "Ø70", "Ø75", "Ø80", "Ø90", "Ø100"] },
  { title: "Długość", values: ["100mm", "150mm", "200mm", "250mm", "300mm", "350mm", "400mm", "450mm", "500mm", "600mm", "700mm", "800mm", "1000mm"] },
  { title: "Materiał", values: ["Stal", "Stal nierdzewna", "Aluminium", "Mosiądz", "Brąz", "Żeliwo", "Tworzywo", "Guma", "Poliuretan"] },
  { title: "Typ", values: ["Oryginał", "Zamiennik", "Premium", "Economy"] },
  { title: "Producent", values: ["OEM", "Aftermarket", "CAT", "Komatsu", "Volvo", "JCB", "Hitachi", "CASE", "New Holland"] },
  { title: "Wersja", values: ["Standard", "Wzmocniona", "HD (Heavy Duty)", "XL", "Kompakt"] },
  { title: "Klasa", values: ["A", "B", "C", "Premium", "Standard", "Economy"] },
]

export interface ProductOption {
  id: string
  title: string
  values: { id: string; value: string }[]
}

export interface ProductVariant {
  id: string
  title: string
  sku?: string
  barcode?: string
  inventory_quantity: number
  prices: { amount: number; currency_code: string }[]
  options?: { value: string; option_id: string }[]
}

interface VariantEditorProps {
  options: ProductOption[]
  variants: ProductVariant[]
  onOptionsChange: (options: ProductOption[]) => void
  onVariantsChange: (variants: ProductVariant[]) => void
  productTitle?: string
}

export default function VariantEditor({
  options,
  variants,
  onOptionsChange,
  onVariantsChange,
  productTitle = "Produkt"
}: VariantEditorProps) {
  const [showAddOption, setShowAddOption] = useState(false)
  const [newOptionTitle, setNewOptionTitle] = useState("")
  const [newOptionValues, setNewOptionValues] = useState("")
  const [selectedPredefined, setSelectedPredefined] = useState("")

  // Dodaj nową opcję
  const handleAddOption = () => {
    if (!newOptionTitle.trim()) return

    const values = newOptionValues
      .split(",")
      .map(v => v.trim())
      .filter(v => v)
      .map(v => ({ id: `opt_val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, value: v }))

    if (values.length === 0) return

    const newOption: ProductOption = {
      id: `opt_${Date.now()}`,
      title: newOptionTitle.trim(),
      values
    }

    onOptionsChange([...options, newOption])
    setNewOptionTitle("")
    setNewOptionValues("")
    setShowAddOption(false)

    // Automatycznie generuj warianty
    generateVariants([...options, newOption])
  }

  // Użyj predefiniowanej opcji
  const handleUsePredefined = () => {
    const predefined = PREDEFINED_OPTIONS.find(p => p.title === selectedPredefined)
    if (!predefined) return

    setNewOptionTitle(predefined.title)
    setNewOptionValues(predefined.values.slice(0, 5).join(", ")) // Domyślnie pierwsze 5 wartości
  }

  // Usuń opcję
  const handleRemoveOption = (optionId: string) => {
    const newOptions = options.filter(o => o.id !== optionId)
    onOptionsChange(newOptions)
    
    if (newOptions.length === 0) {
      // Jeśli nie ma opcji, zostaw jeden domyślny wariant
      onVariantsChange([{
        id: variants[0]?.id || `var_${Date.now()}`,
        title: "Domyślny",
        sku: variants[0]?.sku || "",
        inventory_quantity: variants[0]?.inventory_quantity || 0,
        prices: variants[0]?.prices || [{ amount: 0, currency_code: "pln" }],
        options: []
      }])
    } else {
      generateVariants(newOptions)
    }
  }

  // Dodaj wartość do opcji
  const handleAddOptionValue = (optionId: string, value: string) => {
    if (!value.trim()) return

    const newOptions = options.map(opt => {
      if (opt.id === optionId) {
        return {
          ...opt,
          values: [...opt.values, { id: `opt_val_${Date.now()}`, value: value.trim() }]
        }
      }
      return opt
    })

    onOptionsChange(newOptions)
    generateVariants(newOptions)
  }

  // Usuń wartość z opcji
  const handleRemoveOptionValue = (optionId: string, valueId: string) => {
    const newOptions = options.map(opt => {
      if (opt.id === optionId) {
        return {
          ...opt,
          values: opt.values.filter(v => v.id !== valueId)
        }
      }
      return opt
    })

    // Usuń opcję jeśli nie ma wartości
    const filteredOptions = newOptions.filter(opt => opt.values.length > 0)
    onOptionsChange(filteredOptions)
    
    if (filteredOptions.length > 0) {
      generateVariants(filteredOptions)
    }
  }

  // Generuj wszystkie kombinacje wariantów
  const generateVariants = (opts: ProductOption[]) => {
    if (opts.length === 0) return

    const combinations = generateCombinations(opts)
    const existingVariantsMap = new Map(variants.map(v => [getVariantKey(v, opts), v]))

    const newVariants: ProductVariant[] = combinations.map((combo, index) => {
      const key = combo.map(c => c.value).join(" / ")
      const existing = existingVariantsMap.get(key)

      return {
        id: existing?.id || `var_${Date.now()}_${index}`,
        title: key,
        sku: existing?.sku || "",
        barcode: existing?.barcode || "",
        inventory_quantity: existing?.inventory_quantity || 0,
        prices: existing?.prices || [{ amount: 0, currency_code: "pln" }],
        options: combo.map(c => ({ value: c.value, option_id: c.optionId }))
      }
    })

    onVariantsChange(newVariants)
  }

  // Pomocnicza funkcja do generowania kombinacji
  const generateCombinations = (opts: ProductOption[]): Array<Array<{ optionId: string; value: string }>> => {
    if (opts.length === 0) return [[]]
    
    const [first, ...rest] = opts
    const restCombinations = generateCombinations(rest)
    
    const result: Array<Array<{ optionId: string; value: string }>> = []
    for (const value of first.values) {
      for (const combo of restCombinations) {
        result.push([{ optionId: first.id, value: value.value }, ...combo])
      }
    }
    
    return result
  }

  // Klucz wariantu do mapowania
  const getVariantKey = (variant: ProductVariant, opts: ProductOption[]): string => {
    if (!variant.options) return variant.title
    return variant.options.map(o => o.value).join(" / ")
  }

  // Aktualizuj wariant
  const handleVariantUpdate = (variantId: string, field: string, value: any) => {
    const newVariants = variants.map(v => {
      if (v.id === variantId) {
        if (field === "price") {
          return {
            ...v,
            prices: [{ amount: Math.round(parseFloat(value) * 100) || 0, currency_code: "pln" }]
          }
        }
        return { ...v, [field]: value }
      }
      return v
    })
    onVariantsChange(newVariants)
  }

  // Sprawdź czy produkt ma warianty
  const hasVariants = options.length > 0 && variants.length > 1

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Warianty produktu</h3>
          <p className="text-sm text-gray-500 mt-1">
            {hasVariants 
              ? `${variants.length} wariantów na podstawie ${options.length} opcji`
              : "Produkt bez wariantów - dodaj opcje aby utworzyć warianty"}
          </p>
        </div>
        {!showAddOption && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowAddOption(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Dodaj opcję
          </Button>
        )}
      </div>

      {/* Formularz dodawania opcji */}
      {showAddOption && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-blue-900">Dodaj nową opcję wariantu</h4>
          
          {/* Predefiniowane opcje */}
          <div className="flex gap-2">
            <select
              value={selectedPredefined}
              onChange={(e) => setSelectedPredefined(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Wybierz predefiniowaną opcję --</option>
              {PREDEFINED_OPTIONS.map(opt => (
                <option key={opt.title} value={opt.title}>{opt.title}</option>
              ))}
            </select>
            <Button type="button" variant="secondary" onClick={handleUsePredefined} disabled={!selectedPredefined}>
              Użyj
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwa opcji
              </label>
              <input
                type="text"
                value={newOptionTitle}
                onChange={(e) => setNewOptionTitle(e.target.value)}
                placeholder="np. Rozmiar, Materiał, Typ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wartości (oddzielone przecinkami)
              </label>
              <input
                type="text"
                value={newOptionValues}
                onChange={(e) => setNewOptionValues(e.target.value)}
                placeholder="np. 50mm, 60mm, 70mm"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => {
              setShowAddOption(false)
              setNewOptionTitle("")
              setNewOptionValues("")
            }}>
              Anuluj
            </Button>
            <Button type="button" onClick={handleAddOption} disabled={!newOptionTitle.trim() || !newOptionValues.trim()}>
              Dodaj opcję
            </Button>
          </div>
        </div>
      )}

      {/* Lista opcji */}
      {options.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Opcje wariantów</h4>
          {options.map((option) => (
            <div key={option.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">{option.title}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(option.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {option.values.map((val) => (
                  <span
                    key={val.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                  >
                    {val.value}
                    <button
                      type="button"
                      onClick={() => handleRemoveOptionValue(option.id, val.id)}
                      className="text-gray-400 hover:text-red-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <AddValueInput
                  onAdd={(value) => handleAddOptionValue(option.id, value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista wariantów */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Warianty ({variants.length})
            </h4>
            {variants.length > 1 && (
              <div className="text-sm text-gray-500">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Ustaw cenę 0 dla wariantów "Zapytaj o cenę"
              </div>
            )}
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wariant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cena (PLN)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {variants.map((variant) => {
                  const price = variant.prices?.[0]?.amount || 0
                  return (
                    <tr key={variant.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{variant.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={variant.sku || ""}
                          onChange={(e) => handleVariantUpdate(variant.id, "sku", e.target.value)}
                          placeholder="SKU"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={price > 0 ? (price / 100).toFixed(2) : ""}
                            onChange={(e) => handleVariantUpdate(variant.id, "price", e.target.value)}
                            placeholder="0.00"
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                          {price === 0 && (
                            <span className="ml-2 text-xs text-purple-600">Zapytaj</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          value={variant.inventory_quantity}
                          onChange={(e) => handleVariantUpdate(variant.id, "inventory_quantity", parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Informacja dla produktów bez wariantów */}
      {!hasVariants && variants.length === 1 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Produkt bez wariantów</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Ten produkt ma tylko jeden wariant. Dodaj opcje (np. Rozmiar, Materiał) aby utworzyć warianty produktu.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={variants[0]?.sku || ""}
                    onChange={(e) => handleVariantUpdate(variants[0].id, "sku", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cena (PLN) 
                    <span className="text-gray-400 font-normal ml-1">- zostaw 0 dla "Zapytaj o cenę"</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={(variants[0]?.prices?.[0]?.amount || 0) > 0 ? ((variants[0]?.prices?.[0]?.amount || 0) / 100).toFixed(2) : ""}
                    onChange={(e) => handleVariantUpdate(variants[0].id, "price", e.target.value)}
                    placeholder="0.00 = Zapytaj o cenę"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stan magazynowy</label>
                  <input
                    type="number"
                    min="0"
                    value={variants[0]?.inventory_quantity || 0}
                    onChange={(e) => handleVariantUpdate(variants[0].id, "inventory_quantity", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Komponent do dodawania wartości
function AddValueInput({ onAdd }: { onAdd: (value: string) => void }) {
  const [value, setValue] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = () => {
    if (value.trim()) {
      onAdd(value.trim())
      setValue("")
      setIsEditing(false)
    }
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="inline-flex items-center gap-1 px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-primary-500 hover:text-primary-600"
      >
        <Plus className="w-3 h-3" />
        Dodaj
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-1">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleSubmit()
          }
          if (e.key === "Escape") {
            setIsEditing(false)
            setValue("")
          }
        }}
        placeholder="Wartość"
        autoFocus
        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="text-green-600 hover:text-green-800"
      >
        ✓
      </button>
      <button
        type="button"
        onClick={() => {
          setIsEditing(false)
          setValue("")
        }}
        className="text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  )
}
