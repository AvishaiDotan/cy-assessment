import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IPhishingPayload } from 'shared-lib';
import { simulationsService } from '../services/simulationsService';
import { pollingService } from '../services/pollingService';


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

  const handleCreateSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSimulation = await simulationsService.createSimulation(formData);
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
      {/* Navigation */}
      <nav className="bg-[#6834f4] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#6834f4] font-bold text-lg">C</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-white">Cymulate Phishing Management</h1>
                <p className="text-sm text-gray-300">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#e3316c] hover:bg-[#e3316c]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e3316c] transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* User Details Card */}
          <div className="bg-[#ffffff]/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg mb-6 border border-gray-700">
            <div className="p-5">
              <h2 className="text-lg font-medium text-white mb-4">User Information</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">Name:</span> {user?.name}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">Email:</span> {user?.email}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">ID:</span> {user?._id}
                </p>
              </div>
            </div>
          </div>

          {/* Create Simulation Form */}
          <div className="bg-[#ffffff]/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg mb-6 border border-gray-700">
            <div className="p-5">
              <h2 className="text-lg font-medium text-white mb-4">Create New Phishing Simulation</h2>
              
              {createSuccess && (
                <div className="mb-4 bg-[#6834f4]/20 border border-[#6834f4] text-[#6834f4] px-4 py-3 rounded">
                  Simulation created successfully!
                </div>
              )}
              
              <form onSubmit={handleCreateSimulation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    className="w-full px-3 py-2 bg-[#ffffff]/10 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#6834f4] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email Content</label>
                  <textarea
                    value={formData.emailContent}
                    onChange={(e) => setFormData({ ...formData, emailContent: e.target.value })}
                    className="w-full px-3 py-2 bg-[#ffffff]/10 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#6834f4] focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#6834f4] hover:bg-[#6834f4]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6834f4] transition duration-150 ease-in-out"
                >
                  Create Simulation
                </button>
              </form>
            </div>
          </div>

          {/* Simulations Table */}
          <div className="bg-[#ffffff]/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-gray-700">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Phishing Simulations</h2>
                {isPolling && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#6834f4]"></div>
                )}
              </div>
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6834f4]"></div>
                </div>
              ) : error ? (
                <div className="text-[#e3316c] text-sm">{error}</div>
              ) : simulations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Recipient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email Content</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Link</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {simulations.map((simulation) => (
                        <tr key={simulation._id?.toString()} className="hover:bg-[#ffffff]/5">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{simulation.recipient}</td>
                          <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{simulation.emailContent?.substring(0, 50)}...</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {simulation.status === 'pending' ? 'Pending' : simulation.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{simulation.link}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(simulation.createdAt!).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No simulations found</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 