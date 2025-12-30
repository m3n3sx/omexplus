import React, { useState, useMemo } from 'react';
import { Machine } from '../types';
import { AddMachineModal } from './AddMachineModal';

interface MachineListProps {
  machines: Machine[];
  onSelect: (machine: Machine) => void;
  onAddMachine: (machine: Machine) => void;
}

export const MachineList: React.FC<MachineListProps> = ({ machines, onSelect, onAddMachine }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const manufacturers = useMemo(() => {
    const mans = new Set(machines.map(m => m.basicInfo.manufacturer));
    return Array.from(mans).sort();
  }, [machines]);

  const filteredMachines = useMemo(() => {
    return machines.filter(m => {
      const matchSearch = 
        m.basicInfo.model_code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.basicInfo.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchMan = filterManufacturer ? m.basicInfo.manufacturer === filterManufacturer : true;
      
      return matchSearch && matchMan;
    });
  }, [machines, searchTerm, filterManufacturer]);

  const handleSaveNewMachine = (newMachine: Machine) => {
      onAddMachine(newMachine);
      setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
            placeholder="Search model, manufacturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
            <select
            className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm rounded-md border"
            value={filterManufacturer}
            onChange={(e) => setFilterManufacturer(e.target.value)}
            >
            <option value="">Wszyscy producenci</option>
            {manufacturers.map(m => (
                <option key={m} value={m}>{m}</option>
            ))}
            </select>
            
            <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Dodaj Maszynę
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMachines.map((machine) => (
          <div 
            key={machine.id} 
            onClick={() => onSelect(machine)}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md hover:border-yellow-400 transition-all cursor-pointer group"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {machine.basicInfo.year_from} - {machine.basicInfo.year_to || 'Present'}
                 </span>
                 <span className="text-xs text-gray-400">{machine.id.slice(0, 15)}...</span>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 group-hover:text-slate-700">
                {machine.basicInfo.manufacturer} <span className="font-bold text-xl">{machine.basicInfo.model_code}</span>
              </h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {machine.basicInfo.type_weight_note}
              </p>
              
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Silnik:</span> {machine.basicInfo.engine_model || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Serial:</span> {machine.basicInfo.serial_range_start} - {machine.basicInfo.serial_range_end}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMachines.length === 0 && (
         <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Brak maszyn pasujących do wyszukiwania.</p>
         </div>
      )}

      {showAddModal && (
          <AddMachineModal 
            onClose={() => setShowAddModal(false)}
            onSave={handleSaveNewMachine}
          />
      )}
    </div>
  );
};