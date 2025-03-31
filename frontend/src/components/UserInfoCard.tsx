import { IUser } from '@avishaidotan/shared-lib';
import React from 'react';

interface UserInfoCardProps {
  user: IUser | null;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  return (
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
            <span className="font-medium text-white">ID:</span> {user?._id?.toString()}
          </p>
        </div>
      </div>
    </div>
  );
}; 