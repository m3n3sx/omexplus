import React, { useState, useMemo } from 'react';
import { Machine, Part, TechnicalDocument } from '../types';
import { enrichMachineData } from '../services/geminiService';
import { medusaService } from '../services/medusaService';
import { PART_CATEGORIES } from '../constants';

interface MachineDetailProps {
  machine: Machine;
  onBack: () => void;
  onUpdate: (updatedMachine: Machine) => void;
}

export const MachineDetail: React.FC<MachineDetailProps> = ({ machine, onBack, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [partSearch, setPartSearch] = useState('');
  const [progressStage, setProgressStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const handleEnrich = async () => {
    if (!process.env.API_KEY) {
        setError("Błąd konfiguracji: Brak klucza API (process.env.API_KEY).");
        return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    setProgressStage('Rozpoczynam...');
    setProgressPercent(0);
    
    try {
      const data = await enrichMachineData(machine, (stage, progress) => {
        setProgressStage(stage);
        setProgressPercent(progress);
      });
      if (data) {
        // Helper to merge objects - only overwrite with non-empty values
        const mergeSpecs = (existing: any, newData: any) => {
          const result = { ...existing };
          if (newData) {
            Object.keys(newData).forEach(key => {
              const val = newData[key];
              if (val !== undefined && val !== null && val !== '') {
                result[key] = val;
              }
            });
          }
          return result;
        };

        // Merge existing parts with new parts found by AI
        const currentParts = machine.partsCatalog || [];
        const newParts = data.newParts || [];
        
        // Deduplicate based on OEM number
        const uniqueNewParts = newParts.filter(np => 
            np && np.oemNumber && !currentParts.some(cp => cp.oemNumber === np.oemNumber)
        ).map((np, idx) => ({ ...np, id: `ai-gen-${Date.now()}-${idx}` }));

        const updatedMachine: Machine = {
            ...machine,
            ratingPlate: mergeSpecs(machine.ratingPlate, data.ratingPlate),
            mechanicalSpecs: mergeSpecs(machine.mechanicalSpecs, data.mechanicalSpecs),
            dimensions: mergeSpecs(machine.dimensions, data.dimensions),
            soundSpecs: mergeSpecs(machine.soundSpecs, data.soundSpecs),
            commonIssues: data.commonIssues && data.commonIssues.length > 0 ? data.commonIssues : machine.commonIssues,
            partsCatalog: [...currentParts, ...uniqueNewParts],
            technicalDocs: data.technicalDocs && data.technicalDocs.length > 0 ? data.technicalDocs : (machine.technicalDocs || []),
            groundingMetadata: data.groundingMetadata
        };
        
        console.log('AI returned specs:', data.ratingPlate);
        console.log('Merged ratingPlate:', updatedMachine.ratingPlate);
        
        setSuccessMsg(`Znaleziono ${uniqueNewParts.length} nowych części!`);
        await handleSave(updatedMachine);
      } else {
          setError("AI nie zwróciło danych (pusta odpowiedź).");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Wystąpił nieoczekiwany błąd podczas łączenia z usługą AI.");
    } finally {
      setIsLoading(false);
      setProgressStage('');
      setProgressPercent(0);
    }
  };

  const handleSave = async (machineToSave: Machine) => {
      setIsSaving(true);
      try {
          await medusaService.updateMachine(machineToSave);
          onUpdate(machineToSave);
          setSuccessMsg("Dane zostały zapisane w bazie.");
          setTimeout(() => setSuccessMsg(null), 3000);
      } catch (e) {
          setError("Błąd zapisu do bazy danych.");
      } finally {
          setIsSaving(false);
      }
  };

  const InfoRow = ({ label, value, unit }: { label: string; value: string; unit?: string }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right">
        {value || <span className="text-gray-300 italic">--</span>} {value && unit}
      </span>
    </div>
  );

  const SectionHeader = ({ title, icon }: { title: string; icon?: React.ReactNode }) => (
    <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-200">
        {icon}
        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">{title}</h3>
    </div>
  );

  const groupedParts = useMemo<Record<string, Part[]>>(() => {
    const groups: Record<string, Part[]> = {};
    const parts = machine.partsCatalog || [];
    
    parts.forEach(part => {
      const searchLower = partSearch.toLowerCase();
      const matchesSearch = 
        part.name.toLowerCase().includes(searchLower) || 
        part.oemNumber.toLowerCase().includes(searchLower) || 
        part.category.toLowerCase().includes(searchLower) ||
        (part.alternatives && part.alternatives.some(alt => alt.partNumber.toLowerCase().includes(searchLower)));

      if (partSearch && !matchesSearch) {
          return;
      }

      if (!groups[part.category]) {
        groups[part.category] = [];
      }
      groups[part.category].push(part);
    });
    
    return Object.keys(groups).sort((a, b) => {
        const indexA = PART_CATEGORIES.indexOf(a);
        const indexB = PART_CATEGORIES.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    }).reduce<Record<string, Part[]>>((obj, key) => {
        obj[key] = groups[key];
        return obj;
    }, {});
  }, [machine.partsCatalog, partSearch]);

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="text-slate-600 hover:text-slate-900 flex items-center text-sm font-medium transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Wróć do listy
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{machine.basicInfo.manufacturer} <span className="text-yellow-600">{machine.basicInfo.model_code}</span></h1>
          <p className="text-gray-500 mt-1">{machine.basicInfo.type_weight_note}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
             <button 
                onClick={handleEnrich}
                disabled={isLoading || isSaving}
                className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                )}
                Weryfikuj AI (Search + Docs)
            </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isLoading && progressStage && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-indigo-700">{progressStage}</span>
            <span className="text-sm text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-indigo-500 mt-2">Wyszukiwanie w 4 etapach: specyfikacje → filtry/silnik → hydraulika/podwozie → elektryka/kabina</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">Wystąpił błąd:</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
            </div>
        </div>
      )}
      
      {successMsg && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-sm text-green-700">{successMsg}</p>
        </div>
      )}

      {/* Grounding Sources (Google Search Results) */}
      {machine.groundingMetadata?.groundingChunks && machine.groundingMetadata.groundingChunks.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">Źródła wiedzy (Google Search)</h4>
              <ul className="space-y-1">
                  {machine.groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                      if (chunk.web?.uri) {
                          return (
                              <li key={i} className="text-sm truncate">
                                  <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                      {chunk.web.title || chunk.web.uri}
                                  </a>
                              </li>
                          )
                      }
                      return null;
                  })}
              </ul>
          </div>
      )}

      {/* Technical Documentation Section (NEW) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-l-purple-500">
          <SectionHeader 
              title="Dokumentacja Techniczna" 
              icon={<svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} 
          />
          {machine.technicalDocs && machine.technicalDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {machine.technicalDocs.map((doc, idx) => (
                    <div key={idx} className="bg-purple-50 p-3 rounded border border-purple-100 flex flex-col">
                        <div className="flex justify-between items-start">
                             <span className="font-bold text-purple-900 text-sm">{doc.title}</span>
                             <span className="text-xs bg-white text-purple-600 px-2 py-0.5 rounded border border-purple-200">{doc.type}</span>
                        </div>
                        {doc.publicationNumber && (
                            <div className="text-xs text-purple-700 mt-1 font-mono">ID: {doc.publicationNumber}</div>
                        )}
                        {doc.description && (
                            <div className="text-xs text-purple-500 mt-1">{doc.description}</div>
                        )}
                    </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Kliknij 'Weryfikuj AI', aby wyszukać dostępne instrukcje i katalogi.</p>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Technical Specs */}
        <div className="space-y-6 lg:col-span-1">
             {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <SectionHeader title="Identyfikacja" />
                <InfoRow label="Rocznik (Od)" value={machine.basicInfo.year_from} />
                <InfoRow label="Rocznik (Do)" value={machine.basicInfo.year_to} />
                <InfoRow label="Serial (Start)" value={machine.basicInfo.serial_range_start} />
                <InfoRow label="Serial (Koniec)" value={machine.basicInfo.serial_range_end} />
            </div>

            {/* Virtual Rating Plate */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-t-4 border-t-slate-800">
                <SectionHeader title="Wirtualna Tabliczka" icon={<svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
                
                <InfoRow label="Model Silnika" value={machine.ratingPlate.engine_model} />
                <InfoRow label="Moc" value={machine.ratingPlate.enginepowerkw} unit="kW" />
                <InfoRow label="Masa" value={machine.ratingPlate.operatingweightkg} />
                <InfoRow label="Pojemność" value={machine.ratingPlate.enginedisplacementcc} unit="cc" />
                <InfoRow label="Norma Emisji" value={machine.ratingPlate.emission_standard} />
                <InfoRow label="Ciśnienie Hydr." value={machine.ratingPlate.hydraulicpressurebar} unit="bar" />
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Pojemności (Capacities)</h4>
                    <InfoRow label="Paliwo" value={machine.ratingPlate.fueltankcapacity_l} unit="L" />
                    <InfoRow label="Hydraulika" value={machine.ratingPlate.hydraulictankcapacity_l} unit="L" />
                    <InfoRow label="AdBlue" value={machine.ratingPlate.adblue_capacity_l} unit="L" />
                    <InfoRow label="Chłodziwo" value={machine.ratingPlate.coolantcapacityl} unit="L" />
                    <InfoRow label="Olej Silnikowy" value={machine.ratingPlate.engineoilcapacity_l} unit="L" />
                </div>
            </div>

            {/* Mechanical Specs - RESTORED */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-t-4 border-t-yellow-600">
                <SectionHeader title="Specyfikacja Mech." icon={<svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>} />
                
                <InfoRow label="Moment Obr." value={machine.mechanicalSpecs.max_torque_nm} unit="Nm" />
                <InfoRow label="Przepływ Pompy" value={machine.mechanicalSpecs.hydraulic_flow_max_lmin} unit="l/min" />
                <InfoRow label="Napięcie" value={machine.mechanicalSpecs.system_voltage_v} unit="V" />
                <InfoRow label="Siła Zrywania" value={machine.mechanicalSpecs.breakout_force_kn} unit="kN" />
                <InfoRow label="Prędkość Jazdy" value={machine.mechanicalSpecs.travel_speed_kmh} unit="km/h" />
                <InfoRow label="Prędkość Obrotu" value={machine.mechanicalSpecs.swing_speed_rpm} unit="rpm" />
                 <div className="mt-2 text-xs text-gray-500">
                     <span className="font-semibold">Typ Pompy:</span> {machine.mechanicalSpecs.hydraulic_pump_type || 'N/A'}
                 </div>
            </div>

            {/* Dimensions - RESTORED */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-t-4 border-t-blue-500">
                 <SectionHeader title="Wymiary" icon={<svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>} />
                 <InfoRow label="Długość Transp." value={machine.dimensions.transport_length_mm} unit="mm" />
                 <InfoRow label="Szerokość Transp." value={machine.dimensions.transport_width_mm} unit="mm" />
                 <InfoRow label="Wysokość Transp." value={machine.dimensions.transport_height_mm} unit="mm" />
                 <div className="my-2 border-t border-gray-100"></div>
                 <InfoRow label="Głęb. Kopania" value={machine.dimensions.digging_depth_mm} unit="mm" />
                 <InfoRow label="Zasięg Kopania" value={machine.dimensions.digging_reach_mm} unit="mm" />
                 <InfoRow label="Wys. Załadunku" value={machine.dimensions.dump_height_mm} unit="mm" />
            </div>
            
            {/* Common Issues Section */}
            <div className={`bg-white rounded-xl shadow-sm border border-l-4 p-6 ${machine.commonIssues && machine.commonIssues.length > 0 ? 'border-red-200 border-l-red-500' : 'border-gray-200 border-l-gray-300'}`}>
                <SectionHeader 
                    title="Typowe Usterki" 
                    icon={<svg className={`w-5 h-5 ${machine.commonIssues && machine.commonIssues.length > 0 ? 'text-red-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} 
                />
                {machine.commonIssues && machine.commonIssues.length > 0 ? (
                    <ul className="grid grid-cols-1 gap-2">
                        {machine.commonIssues.map((issue, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-700">
                                <span className="text-red-400 mr-2">•</span>
                                {issue}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-400 italic">Brak zgłoszonych typowych usterek.</p>
                )}
            </div>
        </div>

        {/* Right Column: Technical Parts Catalog */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <SectionHeader title="Katalog Części Zamiennych" icon={<svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} />
                    <div className="relative w-full sm:w-64">
                         <input
                            type="text"
                            placeholder="Szukaj (OEM, Zamiennik, Nazwa)..."
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-slate-500 focus:border-slate-500"
                            value={partSearch}
                            onChange={(e) => setPartSearch(e.target.value)}
                         />
                         <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                         </svg>
                    </div>
                </div>

                {Object.keys(groupedParts).length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">Brak części pasujących do wyszukiwania.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedParts).map(([category, parts]: [string, Part[]]) => (
                            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-slate-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                    <h4 className="font-bold text-slate-700">{category}</h4>
                                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">{parts.length} poz.</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-white">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numer OEM</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwa / Producent</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zamienniki (Aftermarket)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {parts.map((part) => (
                                                <tr key={part.id} className="hover:bg-slate-50 transition-colors align-top">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                        {part.diagramReference || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                                        {part.oemNumber}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div className="font-medium">{part.name}</div>
                                                        <div className="text-xs text-gray-500">{part.manufacturer}</div>
                                                        {part.description && <div className="text-xs text-gray-400 mt-1">{part.description}</div>}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {part.alternatives && part.alternatives.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {part.alternatives.map((alt, idx) => (
                                                                    <div key={idx} className="flex items-center space-x-2 bg-green-50 px-2 py-1 rounded border border-green-100">
                                                                        <span className="font-bold text-green-700">{alt.partNumber}</span>
                                                                        <span className="text-xs text-green-600">({alt.manufacturer})</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300 italic text-xs">Brak danych</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
