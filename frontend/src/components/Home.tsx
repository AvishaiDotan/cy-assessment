import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

enum ThemeMode {
    LIGHT = "LIGHT",
    DARK = "DARK",
    SYSTEM = "SYSTEM"
}

enum Language {
    EN = "EN",
    ES = "ES",
    HE = "HE"
}

export const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    theme: ThemeMode.SYSTEM,
    language: Language.EN,
  });
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await ({} as any).getAllSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSetting = await ({} as any).createSetting(formData);
      setSettings([...settings, newSetting]);
      setFormData({ theme: ThemeMode.SYSTEM, language: Language.EN });
      setCreateSuccess(true);
      setTimeout(() => setCreateSuccess(false), 3000);
    } catch (err) {
      setError('Failed to create setting');
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
              <h2 className="text-lg font-medium text-white mb-4">Account Information</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">Name:</span> {user?.name}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">Email:</span> {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-[#ffffff]/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-gray-700">
            <div className="p-5">
              <h2 className="text-lg font-medium text-white mb-4">Phishing Campaign Settings</h2>
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6834f4]"></div>
                </div>
              ) : error ? (
                <div className="text-[#e3316c] text-sm">{error}</div>
              ) : settings.length > 0 ? (
                <div className="space-y-4">
                  {settings.map((setting) => (
                    <div key={setting.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-white">Campaign Theme: {setting.theme}</p>
                          <p className="text-sm text-gray-300">Notification Language: {setting.language}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No campaign settings found</p>
              )}
            </div>
          </div>

          {/* Create Settings Section */}
          <div className="bg-[#ffffff]/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg mt-6 border border-gray-700">
            <div className="p-5">
              <h2 className="text-lg font-medium text-white mb-4">Create New Campaign Setting</h2>
              
              {createSuccess && (
                <div className="mb-4 bg-[#6834f4]/20 border border-[#6834f4] text-[#6834f4] px-4 py-3 rounded">
                  Campaign setting created successfully!
                </div>
              )}
              
              <form onSubmit={handleCreateSetting} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Theme</label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value as ThemeMode })}
                    className="w-full px-3 py-2 bg-[#ffffff]/10 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#6834f4] focus:border-transparent"
                  >
                    {Object.values(ThemeMode).map((theme) => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Notification Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
                    className="w-full px-3 py-2 bg-[#ffffff]/10 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#6834f4] focus:border-transparent"
                  >
                    {Object.values(Language).map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#6834f4] hover:bg-[#6834f4]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6834f4] transition duration-150 ease-in-out"
                >
                  Create Campaign Setting
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 