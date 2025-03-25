import React from 'react';
import { IPhishingPayload } from '@avishaidotan/shared-lib';

interface SimulationsTableProps {
  simulations: IPhishingPayload[];
  loading: boolean;
  error: string | null;
  isPolling: boolean;
}

export const SimulationsTable: React.FC<SimulationsTableProps> = ({
  simulations,
  loading,
  error,
  isPolling
}) => {
  return (
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
        ) : Array.isArray(simulations) && simulations.length > 0 ? (
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
  );
}; 