import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Brain, 
  Clock, 
  FileText, 
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Heart, // <--- NEW IMPORT
  Gamepad2 // <--- NEW IMPORT
} from 'lucide-react';
import { mockSymptoms, mockReminders } from '../../data/mockData';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const patientSymptoms = mockSymptoms.filter(s => s.patientId === user?.patientId);
  const patientReminders = mockReminders.filter(r => r.patientId === user?.patientId);
  const recentSymptom = patientSymptoms[0];
  const upcomingReminders = patientReminders.filter(r => !r.isCompleted);

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'medium': return <AlertCircle className="h-5 w-5" />;
      default: return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's your care summary for today
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Logging Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Symptom Tracking</h2>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Track your symptoms and get AI-powered guidance
          </p>
          
          <Link
            to="/patient/symptoms/log"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Log New Symptom
          </Link>
        </div>

        {/* AI Guidance Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Guidance</h2>
            </div>
          </div>

          {recentSymptom?.aiGuidance ? (
            <div className="space-y-3">
              <div className={`flex items-start space-x-3 p-3 rounded-md border ${getUrgencyColor(recentSymptom.aiGuidance.urgencyLevel)}`}>
                {getUrgencyIcon(recentSymptom.aiGuidance.urgencyLevel)}
                <div>
                  <p className="text-sm font-medium">Recent guidance for {recentSymptom.type}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(recentSymptom.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Link
                to="/patient/ai-guidance"
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Full Guidance
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Log your first symptom to receive personalized AI guidance
              </p>
              <Link
                to="/patient/symptoms/log"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Log symptom →
              </Link>
            </div>
          )}
        </div>

        {/* Medication Reminders Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Medication Reminders</h2>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingReminders.slice(0, 3).map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium text-gray-900">{reminder.medication}</p>
                  <p className="text-xs text-gray-600">{reminder.dosage} • {reminder.timeOfDay}</p>
                </div>
                <button
                  type="button"
                  className="text-green-600 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label={`Mark ${reminder.medication} as taken`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <Link
              to="/patient/reminders"
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage Reminders
            </Link>
          </div>
        </div>

        {/* Doctor Notes Simplifier Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Doctor's Notes</h2>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Upload and simplify complex medical instructions
          </p>
          
          <Link
            to="/patient/notes"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload Note
          </Link>
        </div>

        {/* AI Q&A & Mental Health Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Ask questions about your treatment, medications, or symptoms
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Link
              to="/patient/ai-chat"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Chat
            </Link>

            {/* NEW LINK: Mental Wellness */}
            <Link
              to="/patient/mental-health"
              className="inline-flex items-center px-4 py-2 border border-pink-300 text-sm font-medium rounded-md shadow-sm text-pink-600 bg-pink-50 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <Heart className="h-4 w-4 mr-2" />
              Mental Wellness
            </Link>
            
            <Link
              to="/senior-mode"
              className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-md shadow-sm text-purple-600 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Senior Mode
            </Link>
            
            <div className="text-xs text-gray-500 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              This does not replace medical advice. For emergencies, call your doctor.
            </div>
          </div>
        </div>

        {/* NEW CARD: Health Game */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="h-8 w-8 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-900">Health Quest Game</h2>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Make your health journey fun! Play games to learn and stay engaged.
          </p>
          
          <Link
            to="/patient/health-game"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Play Now
          </Link>
        </div>
      </div>
    </main>
  );
};