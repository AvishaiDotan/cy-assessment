import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { simulationsService } from '../services/simulationsService';

export const LandingLink: React.FC = () => {
  const { userId, tokenId } = useParams<{ userId: string; tokenId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && tokenId) {
      visitPhishingLink(userId, tokenId);
    }
  }, []);

  const visitPhishingLink = async (userId: string, tokenId: string) => {
    await simulationsService.visitPhishingLink(userId, tokenId);
  };

  return (
    <div className="min-h-screen bg-[#18186d] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Phishing link has been visited
        </h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-[#6834f4] text-white rounded-md hover:bg-[#6834f4]/90 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}; 