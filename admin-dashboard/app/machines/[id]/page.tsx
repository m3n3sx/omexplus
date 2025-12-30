"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { useToast } from "@/components/ui/Toast"
import { isAuthenticated } from "@/lib/auth"
import { apiClient } from "@/lib/api-client"
import { 
  ArrowLeft, Sparkles, Save, Truck, Settings, Gauge, 
  Droplets, Filter, Wrench, AlertTriangle, Zap, Thermometer,
  CircleDot, Cog
} from "lucide-react"

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
  // Specs
  operating_weight_kg: number | null
  engine_power_kw: number | null
  engine_displacement_cc: number | null
  emission_standard: string | null
  hydraulic_pressure_bar: number | null
  fuel_tank_capacity_l: number | null
  hydraulic_tank_capacity_l: number | null
  coolant_capacity_l: number | null
  engine_oil_capacity_l: number | null
  // Filtry
  engine_oil_filter: string | null
  fuel_filter: string | null
  fuel_water_separator: string | null
  air_filter_outer: string | null
  air_filter_inner: string | null
  hydraulic_filter: string | null
  hydraulic_return_filter: string | null
  pilot_filter: string | null
  cabin_filter: string | null
  // Uszczelki
  bucket_cylinder_seal_kit: string | null
  arm_cylinder_seal_kit: string | null
  boom_cylinder_seal_kit: string | null
  swing_motor_seal_kit: string | null
  // Podwozie
  top_roller: string | null
  bottom_roller: string | null
  sprocket: string | null
  idler: string | null
  track_chain: string | null
  // Części zużywalne
  bucket_teeth: string | null
  cutting_edge: string | null
  bucket_adapter: string | null
  side_cutters: string | null
  // Silnik
  starter_motor: string | null
  alternator: string | null
  water_pump: string | null
  thermostat: string | null
  turbocharger: string | null
  injector: string | null
  injection_pump: string | null
  drive_belt: string | null
  fan_belt: string | null
  // Układ Chłodzenia
  radiator: string | null
  radiator_hose_upper: string | null
  radiator_hose_lower: string | null
  oil_cooler: string | null
  // Układ Hydrauliczny
  main_hydraulic_pump: string | null
  pilot_pump: string | null
  control_valve: string | null
  swing_motor: string | null
  travel_motor: string | null
  final_drive: string | null
  // Sworznie i Tuleje
  slew_bearing: string | null
  boom_pin: string | null
  arm_pin: string | null
  bucket_pin: string | null
  boom_bushing: string | null
  arm_bushing: string | null
  bucket_bushing: string | null
  // Elektryka
  oil_pressure_sensor: string | null
  water_temp_sensor: string | null
  fuel_level_sensor: string | null
  hydraulic_temp_sensor: string | null
  work_lights: string | null
  wiper_motor: string | null
  wiper_blades: string | null
  // Klimatyzacja
  ac_compressor: string | null
  condenser: string | null
}

export default function MachineDetailPage() {
  const router = useRouter()
  const params = useParams()
  const toast = useToast()
  const [machine, setMachine] = useState<Machine | null>(null)
  const [loading, setLoading] = useState(true)
  const [enriching, setEnriching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<Machine>>({})
  const [progress, setProgress] = useState({ stage: '', percent: 0 })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    loadMachine()
  }, [params.id])

  const loadMachine = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(`/admin/machines/${params.id}`)
      setMachine(response.machine)
      setFormData(response.machine)
    } catch (error) {
      console.error("Error loading machine:", error)
      toast.error("Błąd ładowania maszyny")
    } finally {
      setLoading(false)
    }
  }

  const handleEnrich = async () => {
    if (!machine) return
    
    setEnriching(true)
    setProgress({ stage: 'Wyszukiwanie specyfikacji...', percent: 30 })
    
    try {
      const response = await apiClient.post(`/admin/machines/${machine.id}/enrich`, {})
      
      setProgress({ stage: 'Zakończono!', percent: 100 })
      setMachine(response.machine)
      setFormData(response.machine)
      toast.success(`Wzbogacono ${response.enrichedFields} pól`)
    } catch (error: any) {
      console.error("Error enriching:", error)
      toast.error(error.message || "Błąd wzbogacania danych")
    } finally {
      setEnriching(false)
      setTimeout(() => setProgress({ stage: '', percent: 0 }), 2000)
    }
  }

  const handleSave = async () => {
    if (!machine) return
    
    setSaving(true)
    try {
      const response = await apiClient.put(`/admin/machines/${machine.id}`, formData)
      setMachine(response.machine)
      setEditMode(false)
      toast.success("Zapisano zmiany")
    } catch (error: any) {
      console.error("Error saving:", error)
      toast.error(error.message || "Błąd zapisywania")
    } finally {
      setSaving(false)
    }
  }

  const InfoRow = ({ label, value, unit, field }: { 
    label: string; value: any; unit?: string; field?: keyof Machine 
  }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      {editMode && field ? (
        <input
          type="text"
          value={formData[field] || ''}
          onChange={(e) => setFormData({...formData, [field]: e.target.value})}
          className="text-sm font-medium text-right border rounded px-2 py-1 w-32"
        />
      ) : (
        <span className="text-sm font-medium text-gray-900">
          {value || <span className="text-gray-300">--</span>} {value && unit}
        </span>
      )}
    </div>
  )

  const PartRow = ({ label, value, field }: { 
    label: string; value: string | null; field?: keyof Machine 
  }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      {editMode && field ? (
        <input
          type="text"
          value={formData[field] as string || ''}
          onChange={(e) => setFormData({...formData, [field]: e.target.value})}
          className="text-sm font-mono text-right border rounded px-2 py-1 w-40"
        />
      ) : value ? (
        <span className="text-sm font-mono font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {value}
        </span>
      ) : (
        <span className="text-sm text-gray-300">--</span>
      )}
    </div>
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!machine) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Maszyna nie znaleziona</p>
          <Button onClick={() => router.push('/machines')} className="mt-4">
            Wróć do listy
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/machines')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Wróć
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-7 h-7" />
                {machine.manufacturer} <span className="text-primary-600">{machine.model_code}</span>
              </h1>
              <p className="text-gray-500">
                {machine.year_from && `${machine.year_from} - ${machine.year_to || 'teraz'}`}
                {machine.engine_model && ` • Silnik: ${machine.engine_model}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button variant="secondary" onClick={() => setEditMode(false)}>
                  Anuluj
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Zapisz
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setEditMode(true)}>
                  Edytuj
                </Button>
                <Button onClick={handleEnrich} disabled={enriching}>
                  {enriching ? <LoadingSpinner size="sm" className="mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Wzbogać AI
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {progress.stage && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-indigo-700">{progress.stage}</span>
              <span className="text-sm text-indigo-600">{progress.percent}%</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Data Source Badge */}
        <div className="flex items-center gap-2">
          <Badge variant={
            machine.data_source === 'ai_enriched' ? 'success' :
            machine.data_source === 'verified_specs' ? 'info' :
            'default'
          }>
            {machine.data_source === 'ai_enriched' ? 'Wzbogacone AI' :
             machine.data_source === 'verified_specs' ? 'Zweryfikowane' :
             machine.data_source}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Specs */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-500" />
                Identyfikacja
              </h3>
              <InfoRow label="Producent" value={machine.manufacturer} />
              <InfoRow label="Model" value={machine.model_code} />
              <InfoRow label="Rodzina" value={machine.model_family} />
              <InfoRow label="Rocznik" value={machine.year_from ? `${machine.year_from} - ${machine.year_to || 'teraz'}` : null} />
              <InfoRow label="S/N od" value={machine.serial_range_start} />
              <InfoRow label="S/N do" value={machine.serial_range_end} />
            </div>

            {/* Technical Specs */}
            <div className="bg-white rounded-lg border p-6 border-l-4 border-l-blue-500">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Gauge className="w-5 h-5 text-blue-500" />
                Specyfikacja techniczna
              </h3>
              <InfoRow label="Masa robocza" value={machine.operating_weight_kg} unit="kg" field="operating_weight_kg" />
              <InfoRow label="Moc silnika" value={machine.engine_power_kw} unit="kW" field="engine_power_kw" />
              <InfoRow label="Pojemność silnika" value={machine.engine_displacement_cc} unit="cc" field="engine_displacement_cc" />
              <InfoRow label="Norma emisji" value={machine.emission_standard} field="emission_standard" />
              <InfoRow label="Ciśnienie hydraul." value={machine.hydraulic_pressure_bar} unit="bar" field="hydraulic_pressure_bar" />
            </div>

            {/* Capacities */}
            <div className="bg-white rounded-lg border p-6 border-l-4 border-l-yellow-500">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-yellow-500" />
                Pojemności
              </h3>
              <InfoRow label="Zbiornik paliwa" value={machine.fuel_tank_capacity_l} unit="L" field="fuel_tank_capacity_l" />
              <InfoRow label="Zbiornik hydraul." value={machine.hydraulic_tank_capacity_l} unit="L" field="hydraulic_tank_capacity_l" />
              <InfoRow label="Płyn chłodzący" value={machine.coolant_capacity_l} unit="L" field="coolant_capacity_l" />
              <InfoRow label="Olej silnikowy" value={machine.engine_oil_capacity_l} unit="L" field="engine_oil_capacity_l" />
            </div>
          </div>

          {/* Right Column - Parts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-green-500" />
                Filtry
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PartRow label="Filtr oleju silnikowego" value={machine.engine_oil_filter} field="engine_oil_filter" />
                <PartRow label="Filtr paliwa" value={machine.fuel_filter} field="fuel_filter" />
                <PartRow label="Separator wody" value={machine.fuel_water_separator} field="fuel_water_separator" />
                <PartRow label="Filtr powietrza zewn." value={machine.air_filter_outer} field="air_filter_outer" />
                <PartRow label="Filtr powietrza wewn." value={machine.air_filter_inner} field="air_filter_inner" />
                <PartRow label="Filtr hydrauliczny" value={machine.hydraulic_filter} field="hydraulic_filter" />
                <PartRow label="Filtr hydraul. powrotny" value={machine.hydraulic_return_filter} field="hydraulic_return_filter" />
                <PartRow label="Filtr pilotowy" value={machine.pilot_filter} field="pilot_filter" />
                <PartRow label="Filtr kabinowy" value={machine.cabin_filter} field="cabin_filter" />
              </div>
            </div>

            {/* Engine Parts */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Cog className="w-5 h-5 text-gray-600" />
                Silnik
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PartRow label="Rozrusznik" value={machine.starter_motor} field="starter_motor" />
                <PartRow label="Alternator" value={machine.alternator} field="alternator" />
                <PartRow label="Pompa wody" value={machine.water_pump} field="water_pump" />
                <PartRow label="Termostat" value={machine.thermostat} field="thermostat" />
                <PartRow label="Turbosprężarka" value={machine.turbocharger} field="turbocharger" />
                <PartRow label="Wtryskiwacz" value={machine.injector} field="injector" />
                <PartRow label="Pompa wtryskowa" value={machine.injection_pump} field="injection_pump" />
                <PartRow label="Pasek napędowy" value={machine.drive_belt} field="drive_belt" />
                <PartRow label="Pasek wentylatora" value={machine.fan_belt} field="fan_belt" />
              </div>
            </div>

            {/* Cooling System */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Thermometer className="w-5 h-5 text-cyan-500" />
                Układ Chłodzenia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PartRow label="Chłodnica" value={machine.radiator} field="radiator" />
                <PartRow label="Wąż chłodnicy górny" value={machine.radiator_hose_upper} field="radiator_hose_upper" />
                <PartRow label="Wąż chłodnicy dolny" value={machine.radiator_hose_lower} field="radiator_hose_lower" />
                <PartRow label="Chłodnica oleju" value={machine.oil_cooler} field="oil_cooler" />
              </div>
            </div>

            {/* Hydraulic System */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-blue-500" />
                Układ Hydrauliczny
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PartRow label="Pompa hydrauliczna główna" value={machine.main_hydraulic_pump} field="main_hydraulic_pump" />
                <PartRow label="Pompa pilotowa" value={machine.pilot_pump} field="pilot_pump" />
                <PartRow label="Rozdzielacz" value={machine.control_valve} field="control_valve" />
                <PartRow label="Silnik obrotu" value={machine.swing_motor} field="swing_motor" />
                <PartRow label="Silnik jazdy" value={machine.travel_motor} field="travel_motor" />
                <PartRow label="Przekładnia boczna" value={machine.final_drive} field="final_drive" />
              </div>
            </div>

            {/* Seals & Hydraulics */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-purple-500" />
                Uszczelki siłowników
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PartRow label="Uszczelki siłownika łyżki" value={machine.bucket_cylinder_seal_kit} field="bucket_cylinder_seal_kit" />
                <PartRow label="Uszczelki siłownika ramienia" value={machine.arm_cylinder_seal_kit} field="arm_cylinder_seal_kit" />
                <PartRow label="Uszczelki siłownika wysięgnika" value={machine.boom_cylinder_seal_kit} field="boom_cylinder_seal_kit" />
                <PartRow label="Uszczelki silnika obrotu" value={machine.swing_motor_seal_kit} field="swing_motor_seal_kit" />
              </div>
            </div>

            {/* Pins and Bushings */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <CircleDot className="w-5 h-5 text-amber-600" />
                Sworznie i Tuleje
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PartRow label="Łożysko obrotu" value={machine.slew_bearing} field="slew_bearing" />
                <PartRow label="Sworzeń wysięgnika" value={machine.boom_pin} field="boom_pin" />
                <PartRow label="Sworzeń ramienia" value={machine.arm_pin} field="arm_pin" />
                <PartRow label="Sworzeń łyżki" value={machine.bucket_pin} field="bucket_pin" />
                <PartRow label="Tuleja wysięgnika" value={machine.boom_bushing} field="boom_bushing" />
                <PartRow label="Tuleja ramienia" value={machine.arm_bushing} field="arm_bushing" />
                <PartRow label="Tuleja łyżki" value={machine.bucket_bushing} field="bucket_bushing" />
              </div>
            </div>

            {/* Undercarriage */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-orange-500" />
                Podwozie
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PartRow label="Rolka górna" value={machine.top_roller} field="top_roller" />
                <PartRow label="Rolka dolna" value={machine.bottom_roller} field="bottom_roller" />
                <PartRow label="Koło napędowe" value={machine.sprocket} field="sprocket" />
                <PartRow label="Koło napinające" value={machine.idler} field="idler" />
                <PartRow label="Łańcuch gąsienicowy" value={machine.track_chain} field="track_chain" />
              </div>
            </div>

            {/* Electrical */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                Elektryka
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PartRow label="Czujnik ciśnienia oleju" value={machine.oil_pressure_sensor} field="oil_pressure_sensor" />
                <PartRow label="Czujnik temp. wody" value={machine.water_temp_sensor} field="water_temp_sensor" />
                <PartRow label="Czujnik poziomu paliwa" value={machine.fuel_level_sensor} field="fuel_level_sensor" />
                <PartRow label="Czujnik temp. hydrauliki" value={machine.hydraulic_temp_sensor} field="hydraulic_temp_sensor" />
                <PartRow label="Lampy robocze" value={machine.work_lights} field="work_lights" />
                <PartRow label="Silnik wycieraczek" value={machine.wiper_motor} field="wiper_motor" />
                <PartRow label="Pióra wycieraczek" value={machine.wiper_blades} field="wiper_blades" />
              </div>
            </div>

            {/* AC */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Thermometer className="w-5 h-5 text-indigo-500" />
                Klimatyzacja
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PartRow label="Sprężarka klimatyzacji" value={machine.ac_compressor} field="ac_compressor" />
                <PartRow label="Skraplacz" value={machine.condenser} field="condenser" />
              </div>
            </div>

            {/* Wear Parts */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Części zużywalne
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PartRow label="Zęby łyżki" value={machine.bucket_teeth} field="bucket_teeth" />
                <PartRow label="Adapter zębów" value={machine.bucket_adapter} field="bucket_adapter" />
                <PartRow label="Nóż tnący" value={machine.cutting_edge} field="cutting_edge" />
                <PartRow label="Noże boczne" value={machine.side_cutters} field="side_cutters" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
