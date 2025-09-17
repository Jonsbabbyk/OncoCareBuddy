import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { simplifyDoctorNote } from '../../services/aiService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { mockDoctorNotes } from '../../data/mockData';

export const NotesSimplifier: React.FC = () => {
  const navigate = useNavigate();
  const [originalText, setOriginalText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalText.trim()) return;

    setIsLoading(true);
    try {
      const simplified = await simplifyDoctorNote(originalText);
      setSimplifiedText(simplified);
    } catch (error) {
      console.error('Error simplifying note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleNote = () => {
    setOriginalText(mockDoctorNotes[0].originalText);
    setSimplifiedText('');
  };

  const clearForm = () => {
    setOriginalText('');
    setSimplifiedText('');
  };

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

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Doctor's Note Simplifier
          </h1>
          <p className="text-sm text-gray-600">
            Upload or paste your doctor's notes to get them simplified in easy-to-understand language.
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Original Medical Note</h2>
                <button
                  type="button"
                  onClick={loadSampleNote}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
                >
                  Load Sample
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PDF (Demo - Not functional)
                  </label>
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Upload a file</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500">
                  — or —
                </div>

                <div>
                  <label htmlFor="originalText" className="block text-sm font-medium text-gray-700 mb-2">
                    Paste Medical Text
                  </label>
                  <textarea
                    id="originalText"
                    rows={8}
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                    placeholder="Paste your doctor's notes here..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading || !originalText.trim()}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Simplifying...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Simplify Note
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Output Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Simplified Version</h2>
              
              {simplifiedText ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-lg leading-relaxed text-gray-800 font-medium">
                      {simplifiedText}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <AudioButton 
                      text={simplifiedText} 
                      className="w-full justify-center"
                    />
                    
                    <div className="text-xs text-gray-500 text-center">
                      The simplified text uses everyday language and shorter sentences 
                      to help you better understand your medical instructions.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-md">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Your simplified notes will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};