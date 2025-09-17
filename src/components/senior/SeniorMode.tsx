import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioButton } from '../common/AudioButton';
import { LoadingSpinner } from '../common/LoadingSpinner';
import {
  Phone,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  FileText,
  Upload,
  Mic,
  Volume2,
  User,
  MessageSquare,
  Settings,
} from 'lucide-react';

interface CheckInStatus {
  status: 'ok' | 'help' | 'emergency' | null;
  timestamp: Date | null;
  notes?: string;
}

interface CaregiverAlert {
  id: string;
  type: 'missed_checkin' | 'missed_medication' | 'help_requested' | 'emergency';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export const SeniorMode: React.FC = () => {
  const navigate = useNavigate();
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>({
    status: null,
    timestamp: null,
  });
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [helpNotes, setHelpNotes] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [doctorNote, setDoctorNote] = useState('');
  const [simplifiedNote, setSimplifiedNote] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [medicationTaken, setMedicationTaken] = useState(false);
  const [caregiverAlerts, setCaregiverAlerts] = useState<CaregiverAlert[]>([
    {
      id: '1',
      type: 'missed_checkin',
      message: 'Daily check-in missed at 11:30 AM',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: false,
    },
  ]);

  // NEW: State for messaging caregiver
  const [showCaregiverMessage, setShowCaregiverMessage] = useState(false);
  const [caregiverMessage, setCaregiverMessage] = useState('');

  const handleCheckIn = (status: 'ok' | 'help' | 'emergency') => {
    if (status === 'help') {
      setShowHelpForm(true);
      return;
    }

    if (status === 'emergency') {
      setShowEmergencyConfirm(true);
      return;
    }

    setCheckInStatus({
      status,
      timestamp: new Date(),
      notes: status === 'ok' ? 'Feeling good today' : undefined,
    });

    // Clear any missed check-in alerts
    setCaregiverAlerts((prev) =>
      prev.map((alert) =>
        alert.type === 'missed_checkin'
          ? { ...alert, resolved: true }
          : alert
      )
    );
  };

  const handleHelpSubmit = () => {
    setCheckInStatus({
      status: 'help',
      timestamp: new Date(),
      notes: `${selectedSymptom}: ${helpNotes}`,
    });

    // Create caregiver alert
    const newAlert: CaregiverAlert = {
      id: Date.now().toString(),
      type: 'help_requested',
      message: `Help requested: ${selectedSymptom}. Notes: ${helpNotes}`,
      timestamp: new Date(),
      resolved: false,
    };

    setCaregiverAlerts((prev) => [newAlert, ...prev]);
    setShowHelpForm(false);
    setHelpNotes('');
    setSelectedSymptom('');
  };

  const handleEmergencyConfirm = () => {
    setCheckInStatus({
      status: 'emergency',
      timestamp: new Date(),
      notes: 'Emergency assistance requested',
    });

    // Create emergency alert
    const emergencyAlert: CaregiverAlert = {
      id: Date.now().toString(),
      type: 'emergency',
      message: 'EMERGENCY: Immediate assistance requested',
      timestamp: new Date(),
      resolved: false,
    };

    setCaregiverAlerts((prev) => [emergencyAlert, ...prev]);
    setShowEmergencyConfirm(false);

    // In real app, this would trigger actual emergency protocols
    alert('Emergency services and caregiver have been notified!');
  };

  const handleMedicationTaken = () => {
    setMedicationTaken(true);
    // Clear medication alerts
    setCaregiverAlerts((prev) =>
      prev.map((alert) =>
        alert.type === 'missed_medication'
          ? { ...alert, resolved: true }
          : alert
      )
    );
  };

  const handleSimplifyNote = async () => {
    if (!doctorNote.trim()) return;

    setIsSimplifying(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock AI simplification for seniors
    const simplified = `**Your Medicine Instructions - Made Simple**

• **Take 1 pill of Metformin every morning with breakfast**
• **Take 1 pill of Lisinopril every evening with dinner**

**Important:**
• Drink a full glass of water with each pill
• If you miss a dose, take it when you remember
• **Do not take 2 pills at once**

**Call your doctor if:**
• You feel dizzy or sick
• You have trouble breathing
• You forget your medicine for 2 days

**Next appointment:** Monday, February 5th at 2:00 PM`;

    setSimplifiedNote(simplified);
    setIsSimplifying(false);
  };

  // NEW: Function to handle sending the message
  const handleSendMessage = () => {
    if (!caregiverMessage.trim()) return;
    // Logic to send the message to the caregiver.
    // This could involve an API call or other notification.
    alert(`Message sent to Sarah: "${caregiverMessage}"`);

    // Create a new alert for the caregiver's recent alerts list
    const newAlert: CaregiverAlert = {
      id: Date.now().toString(),
      type: 'help_requested',
      message: `Message sent to caregiver: "${caregiverMessage}"`,
      timestamp: new Date(),
      resolved: false,
    };

    setCaregiverAlerts((prev) => [newAlert, ...prev]);

    // Clear the message and hide the textbox
    setCaregiverMessage('');
    setShowCaregiverMessage(false);
  };

  const containerClass = isHighContrast
    ? 'min-h-screen bg-black text-white'
    : 'min-h-screen bg-gradient-to-br from-blue-50 to-green-50';

  const cardClass = isHighContrast
    ? 'bg-gray-900 border-2 border-white text-white'
    : 'bg-white border border-gray-200 shadow-lg';

  return (
    <div className={containerClass}>
      {/* Header */}
      <header
        className={`${
          isHighContrast ? 'bg-gray-900 border-white' : 'bg-white border-gray-200'
        } border-b shadow-sm`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Senior Mode — Simple. Safe. Connected.
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setIsHighContrast(!isHighContrast)}
                className="p-3 rounded-lg border-2 border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500"
                aria-label="Toggle high contrast mode"
              >
                <Settings className="h-6 w-6" />
              </button>

              <a
                href="tel:999"
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 min-h-[44px]"
                aria-label="Emergency call 999"
              >
                <Phone className="h-6 w-6" />
                <span>🔴 Emergency — Call</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Check-In Card */}
          <div className={`${cardClass} rounded-xl p-8`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle2 className="h-8 w-8 mr-3 text-green-600" />
              Daily Check-In
            </h2>

            {checkInStatus.status ? (
              <div className="space-y-4">
                <div
                  className={`p-6 rounded-lg border-2 ${
                    checkInStatus.status === 'ok'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : checkInStatus.status === 'help'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <p className="text-xl font-semibold">
                    {checkInStatus.status === 'ok' && '✅ You checked in as OK'}
                    {checkInStatus.status === 'help' && '🟡 Help request sent'}
                    {checkInStatus.status === 'emergency' &&
                      '🔴 Emergency alert sent'}
                  </p>
                  <p className="text-lg mt-2">
                    {checkInStatus.timestamp?.toLocaleTimeString()}
                  </p>
                  {checkInStatus.notes && (
                    <p className="text-base mt-2">{checkInStatus.notes}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setCheckInStatus({ status: null, timestamp: null })}
                  className="w-full py-4 px-6 text-lg font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[44px]"
                >
                  Check In Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => handleCheckIn('ok')}
                  className="w-full py-6 px-6 text-xl font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 min-h-[44px]"
                >
                  ✅ I'm OK
                </button>

                <button
                  type="button"
                  onClick={() => handleCheckIn('help')}
                  className="w-full py-6 px-6 text-xl font-bold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-500 min-h-[44px]"
                >
                  🟡 I need help
                </button>

                <button
                  type="button"
                  onClick={() => handleCheckIn('emergency')}
                  className="w-full py-6 px-6 text-xl font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 min-h-[44px]"
                >
                  🔴 Emergency
                </button>
              </div>
            )}
          </div>

          {/* Medication Reminder Card */}
          <div className={`${cardClass} rounded-xl p-8`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Clock className="h-8 w-8 mr-3 text-blue-600" />
              Next Medication
            </h2>

            <div className="space-y-6">
              <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Metformin 500mg
                </h3>
                <p className="text-lg text-blue-800 mb-4">
                  📅 Due: Today at 8:00 AM<br />
                  🍽️ Take with breakfast
                </p>

                {!medicationTaken ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleMedicationTaken}
                      className="flex-1 py-4 px-6 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 min-h-[44px]"
                    >
                      ✔ Taken
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-4 px-6 text-lg font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500 min-h-[44px]"
                    >
                      ⏰ Remind me later
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-green-100 border-2 border-green-300 rounded-lg">
                    <p className="text-lg font-semibold text-green-800">
                      ✅ Medication taken at {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Doctor's Note Simplifier Card */}
          <div className={`${cardClass} rounded-xl p-8`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FileText className="h-8 w-8 mr-3 text-purple-600" />
              Doctor's Note Simplifier
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="doctor-note" className="block text-lg font-semibold mb-3">
                  Paste your doctor's instructions:
                </label>
                <textarea
                  id="doctor-note"
                  rows={4}
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 resize-none"
                  placeholder="Paste medical instructions here..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSimplifyNote}
                  disabled={isSimplifying || !doctorNote.trim()}
                  className="flex-1 flex items-center justify-center py-4 px-6 text-lg font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  {isSimplifying ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Simplifying...
                    </>
                  ) : (
                    <>
                      <FileText className="h-6 w-6 mr-2" />
                      Simplify & Read
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="py-4 px-6 text-lg font-bold text-purple-600 bg-purple-100 border-2 border-purple-300 rounded-lg hover:bg-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-500 min-h-[44px]"
                  aria-label="Voice input for doctor's note"
                >
                  <Mic className="h-6 w-6" />
                </button>
              </div>

              {simplifiedNote && (
                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div
                    className="text-lg leading-relaxed text-gray-800 whitespace-pre-line"
                    style={{ fontSize: '20px', lineHeight: '1.6' }}
                    dangerouslySetInnerHTML={{
                      __html: simplifiedNote.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                    }}
                  />

                  <div className="mt-4">
                    <AudioButton
                      text={simplifiedNote.replace(/\*\*/g, '')}
                      size="lg"
                      className="w-full justify-center text-lg py-4"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Caregiver Contact Card */}
          <div className={`${cardClass} rounded-xl p-8`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <User className="h-8 w-8 mr-3 text-green-600" />
              Your Caregiver
            </h2>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Sarah Johnson</h3>
                  <p className="text-lg text-gray-600">Primary Caregiver</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+1234567890"
                  className="flex-1 flex items-center justify-center py-4 px-6 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 min-h-[44px]"
                >
                  <Phone className="h-6 w-6 mr-2" />
                  Call
                </a>
                <button
                  type="button"
                  onClick={() => setShowCaregiverMessage(true)} // Toggles the visibility of the message box
                  className="flex-1 flex items-center justify-center py-4 px-6 text-lg font-bold text-green-600 bg-green-100 border-2 border-green-300 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-4 focus:ring-green-500 min-h-[44px]"
                >
                  <MessageSquare className="h-6 w-6 mr-2" />
                  Text
                </button>
              </div>

              {/* NEW: Conditional Message Box */}
              {showCaregiverMessage ? (
                <div className="space-y-4 mt-6">
                  <textarea
                    value={caregiverMessage}
                    onChange={(e) => setCaregiverMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={3}
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-500 resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSendMessage}
                      disabled={!caregiverMessage.trim()}
                      className="flex-1 py-4 px-6 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    >
                      Send Message
                    </button>
                    <button
                      onClick={() => setShowCaregiverMessage(false)}
                      className="flex-1 py-4 px-6 text-lg font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500 min-h-[44px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Alerts</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {caregiverAlerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.resolved
                          ? 'bg-gray-50 border-gray-200 text-gray-600'
                          : alert.type === 'emergency'
                          ? 'bg-red-50 border-red-200 text-red-800'
                          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      }`}
                    >
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs mt-1">
                        {alert.timestamp.toLocaleString()}
                        {alert.resolved && ' • Resolved'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Main App */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate('/patient/dashboard')}
            className="py-4 px-8 text-lg font-semibold text-blue-600 bg-blue-100 border-2 border-blue-300 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[44px]"
          >
            ← Back to Main App
          </button>
        </div>
      </main>

      {/* Help Form Modal */}
      {showHelpForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${cardClass} rounded-xl p-8 max-w-md w-full`}>
            <h3 className="text-2xl font-bold mb-6">
              What kind of help do you need?
            </h3>

            <div className="space-y-4 mb-6">
              {[
                'Feeling dizzy or unsteady',
                'Pain or discomfort',
                'Trouble breathing',
                'Medication questions',
                'Need someone to talk to',
                'Other',
              ].map((symptom) => (
                <label key={symptom} className="flex items-center">
                  <input
                    type="radio"
                    name="symptom"
                    value={symptom}
                    checked={selectedSymptom === symptom}
                    onChange={(e) => setSelectedSymptom(e.target.value)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 mr-3"
                  />
                  <span className="text-lg">{symptom}</span>
                </label>
              ))}
            </div>

            <textarea
              value={helpNotes}
              onChange={(e) => setHelpNotes(e.target.value)}
              placeholder="Tell us more (optional)..."
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 mb-6 resize-none"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleHelpSubmit}
                disabled={!selectedSymptom}
                className="flex-1 py-4 px-6 text-lg font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                Send Help Request
              </button>
              <button
                type="button"
                onClick={() => setShowHelpForm(false)}
                className="flex-1 py-4 px-6 text-lg font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500 min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Confirmation Modal */}
      {showEmergencyConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`${cardClass} rounded-xl p-8 max-w-md w-full border-4 border-red-500`}
          >
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                Emergency Confirmation
              </h3>
              <p className="text-lg mb-6">
                This will immediately notify your caregiver and emergency services.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleEmergencyConfirm}
                  className="flex-1 py-4 px-6 text-lg font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 min-h-[44px]"
                >
                  Yes, Emergency!
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmergencyConfirm(false)}
                  className="flex-1 py-4 px-6 text-lg font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500 min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};