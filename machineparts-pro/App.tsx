import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { MachineList } from './components/MachineList';
import { MachineDetail } from './components/MachineDetail';
import { medusaService } from './services/medusaService';
import { Machine } from './types';

const App: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            const data = await medusaService.getMachines();
            setMachines(data);
        } catch (e) {
            console.error("Failed to fetch machines from backend", e);
        } finally {
            setLoading(false);
        }
    };

    loadData();
  }, []);

  const handleUpdateMachine = (updated: Machine) => {
      setMachines(prev => prev.map(m => m.id === updated.id ? updated : m));
      setSelectedMachine(updated);
  };

  const handleAddMachine = async (newMachine: Machine) => {
      await medusaService.addMachine(newMachine);
      setMachines(prev => [newMachine, ...prev]);
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                  <p className="mt-4 text-gray-600">Ładowanie bazy maszyn...</p>
              </div>
          </div>
      );
  }

  return (
    <Layout onGoHome={() => setSelectedMachine(null)}>
      {selectedMachine ? (
        <MachineDetail 
            machine={selectedMachine} 
            onBack={() => setSelectedMachine(null)}
            onUpdate={handleUpdateMachine}
        />
      ) : (
        <MachineList 
            machines={machines} 
            onSelect={setSelectedMachine} 
            onAddMachine={handleAddMachine}
        />
      )}
    </Layout>
  );
};

export default App;