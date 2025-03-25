import React from 'react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
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
              onClick={onLogout}
              className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#e3316c] hover:bg-[#e3316c]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e3316c] transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 