// src/pages/SettingsPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext'; // <-- NEW IMPORT

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  // Use the global state and toggle function from the context
  const { isSeniorMode, toggleSeniorMode } = useAccessibility();

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/patient/dashboard')}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">App Settings</h1>
        
        <div className="space-y-6">
          {/* Accessibility Settings Section */}
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-purple-700 mb-3">Accessibility</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {isSeniorMode ? (
                  <Sun className="h-6 w-6 text-yellow-500" />
                ) : (
                  <Moon className="h-6 w-6 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">Senior Mode</p>
                  <p className="text-sm text-gray-500">Larger text and higher contrast for readability.</p>
                </div>
              </div>
              <button
                onClick={toggleSeniorMode} // Use the global toggle function
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isSeniorMode ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isSeniorMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};