// src/components/SymptomLogger.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { generateAIGuidance } from '../../services/aiService';
import { GroqGuidanceResponse } from '../../services/groqService'; // 1. Import the new type
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

export const SymptomLogger: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState<GroqGuidanceResponse | null>(null); // 2. Update the state type
  const [error, setError] = useState<string | null>(null); // 3. Add state for error messages
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '' as 'pain' | 'fatigue' | 'nausea' | 'dizziness' | 'other',
    severity: 1 as 1 | 2 | 3 | 4 | 5,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      const guidance = await generateAIGuidance(formData.type, formData.severity, formData.notes);
      setAIResponse(guidance);
    } catch (err: any) {
      console.error('Error generating AI guidance:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-green-200 bg-green-50';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'medium': return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      default: return <CheckCircle2 className="h-6 w-6 text-green-600" />;
    }
  };

  const getUrgencyTitle = (level: string) => {
    switch (level) {
      case 'high': return 'Urgent - Contact your healthcare team';
      case 'medium': return 'Monitor - Watch for changes';
      default: return 'Manageable - Continue monitoring';
    }
  };

  // Display AI response section
  if (aiResponse) {
    return (
      <main id="main-content" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setAIResponse(null)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Log Another Symptom</span>
          </button>
        </div>

        <div className={`bg-white rounded-lg border-2 p-6 ${getUrgencyColor(aiResponse.urgencyLevel)}`}>
          <div className="flex items-start space-x-4 mb-4">
            {getUrgencyIcon(aiResponse.urgencyLevel)}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {getUrgencyTitle(aiResponse.urgencyLevel)}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                AI Guidance for your {formData.type} (Severity: {formData.severity}/5)
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Assessment</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {aiResponse.response}
              </p>
              <div className="mt-3">
                <AudioButton text={aiResponse.response} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h2>
              <ul className="space-y-2">
                {aiResponse.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <p>
                  This guidance is for informational purposes only and does not replace professional medical advice. 
                  For emergencies, contact your healthcare provider immediately.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/patient/dashboard')}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </button>
              <button
                type="button"
                onClick={() => setAIResponse(null)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Log Another Symptom
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Display symptom logger form
  return (
    <main id="main-content" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Log Your Symptoms</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 4. Display a dedicated error message section */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-3">
              What symptom are you experiencing?
            </legend>
            <div className="space-y-3">
              {[
                { value: 'pain', label: 'Pain' },
                { value: 'fatigue', label: 'Fatigue' },
                { value: 'nausea', label: 'Nausea' },
                { value: 'dizziness', label: 'Dizziness' },
                { value: 'other', label: 'Other' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center">
                  <input
                    type="radio"
                    name="symptomType"
                    value={value}
                    checked={formData.type === value}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-3">
              How severe is this symptom? (1 = Very Mild, 5 = Severe)
            </legend>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((level) => (
                <label key={level} className="flex flex-col items-center">
                  <input
                    type="radio"
                    name="severity"
                    value={level}
                    checked={formData.severity === level}
                    onChange={(e) => setFormData(prev => ({ ...prev, severity: Number(e.target.value) as any }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mb-1"
                    required
                  />
                  <span className="text-xs text-gray-600">{level}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Describe any additional details about your symptom..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Analyzing with AI...
              </>
            ) : (
              'Analyze with AI'
            )}
          </button>
        </form>
      </div>
    </main>
  );
};