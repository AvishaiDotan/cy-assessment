import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import { simulationsService } from '../services/simulationsService';
import { pollingService } from '../services/pollingService';
import { Navbar } from './Navbar';
import { UserInfoCard } from './UserInfoCard';
import { CreateSimulationForm } from './CreateSimulationForm';
import { SimulationsTable } from './SimulationsTable';

export const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const [simulations, setSimulations] = useState<IPhishingPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [formData, setFormData] = useState<Partial<IPhishingPayload>>({
    recipient: '',
    emailContent: '',
    status: 'pending',
    link: '',
  });
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    // Subscribe to polling service
    const unsubscribe = pollingService.subscribe((data, polling) => {
      if (data.length > 0) {
        setSimulations(data);
      }
      setIsPolling(polling);
      setError(null);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleCreateSimulation = async (simulationData: Partial<IPhishingPayload>) => {
    try {
      const newSimulation = await simulationsService.createSimulation(simulationData);
      setSimulations([...simulations, newSimulation]);
      setFormData({
        recipient: '',
        emailContent: '',
        status: 'pending',
        link: '',
      });
      setCreateSuccess(true);
      setTimeout(() => setCreateSuccess(false), 3000);
    } catch (err) {
      setError('Failed to create simulation');
    }
  };

  return (
    <div className="min-h-screen bg-[#18186d]">
      <Navbar user={user} onLogout={logout} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <UserInfoCard user={user} />
          
          <CreateSimulationForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateSimulation}
            createSuccess={createSuccess}
          />
          
          <SimulationsTable 
            simulations={simulations}
            loading={loading}
            error={error}
            isPolling={isPolling}
          />
        </div>
      </main>
    </div>
  );
}; 