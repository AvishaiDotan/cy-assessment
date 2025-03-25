import React from 'react';
import { IPhishingPayload } from '@avishaidotan/shared-lib';

interface CreateSimulationFormProps {
  formData: Partial<IPhishingPayload>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IPhishingPayload>>>;
  onSubmit: (data: Partial<IPhishingPayload>) => Promise<void>;
  createSuccess: boolean;
}

export const CreateSimulationForm: React.FC<CreateSimulationFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  createSuccess
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-[#ffffff]/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg mb-6 border border-gray-700">
      <div className="p-5">
        <h2 className="text-lg font-medium text-white mb-4">Create New Phishing Simulation</h2>
        
        {createSuccess && (
          <div className="mb-4 bg-[#6834f4]/20 border border-[#6834f4] text-[#6834f4] px-4 py-3 rounded">
            Simulation created successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
  );
}; 