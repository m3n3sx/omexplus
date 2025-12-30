import React, { useState } from 'react';
import { Machine } from '../types';

interface AddMachineModalProps {
  onClose: () => void;
  onSave: (machine: Machine) => void;
}

export const AddMachineModal: React.FC<AddMachineModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    manufacturer: '',
    model_code: '',
    year_from: '',
    year_to: '',
    engine_model: '',
    serial_start: '',
    serial_end: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new machine object
    const id = `custom_${formData.manufacturer.toLowerCase()}_${formData.model_code.toLowerCase()}_${Date.now()}`;
    
    const newMachine: Machine = {
      id,
      basicInfo: {
        manufacturer: formData.manufacturer,
        model_code: formData.model_code,
        year_from: formData.year_from,
        year_to: formData.year_to || 'Present',
        serial_range_start: formData.serial_start,
        serial_range_end: formData.serial_end,
        type_weight_note: formData.notes
      },
      ratingPlate: {
        operatingweightkg: "",
        enginepowerkw: "",
        engine_model: formData.engine_model,
        enginedisplacementcc: "",
        emission_standard: "",
        hydraulicpressurebar: "",
        fueltankcapacity_l: "",
        hydraulictankcapacity_l: "",
        coolantcapacityl: "",
        engineoilcapacity_l: "",
        adblue_capacity_l: ""
      },
      mechanicalSpecs: {
        max_torque_nm: "",
        hydraulic_pump_type: "",
        hydraulic_flow_max_lmin: "",
        system_voltage_v: "",
        battery_capacity_ah: "",
        travel_speed_kmh: "",
        swing_speed_rpm: "",
        breakout_force_kn: ""
      },
      dimensions: {
        transport_length_mm: "",
        transport_width_mm: "",
        transport_height_mm: "",
        digging_depth_mm: "",
        digging_reach_mm: "",
        dump_height_mm: ""
      },
      soundSpecs: {
        noise_level_external_lwa_db: "",
        noise_level_cabin_lpa_db: ""
      },
      commonIssues: [],
      partsCatalog: [],
      raw: {
        notes: formData.notes,
        specifications: `${formData.manufacturer} ${formData.model_code}, ${formData.notes}, Engine: ${formData.engine_model}`,
        applications: "",
        maintenance: "",
        oem_parts_raw: "",
        notes_pl: "",
        diagnostics_raw: ""
      }
    };

    onSave(newMachine);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Dodaj Nową Maszynę</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Producent</label>
                    <input type="text" required name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="np. CAT" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input type="text" required name="model_code" value={formData.model_code} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="np. 320" />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Rok Od</label>
                    <input type="text" required name="year_from" value={formData.year_from} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="2015" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Rok Do</label>
                    <input type="text" name="year_to" value={formData.year_to} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Present" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Model Silnika</label>
                    <input type="text" name="engine_model" value={formData.engine_model} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="np. Perkins 4.4" />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Serial Od</label>
                    <input type="text" name="serial_start" value={formData.serial_start} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Serial Do</label>
                    <input type="text" name="serial_end" value={formData.serial_end} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Notatki (Typ, Waga)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="np. Excavator, 22000kg" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                Zapisz
              </button>
              <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};