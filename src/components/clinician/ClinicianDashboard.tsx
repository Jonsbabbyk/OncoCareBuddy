import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockPatients, mockSymptoms } from '../../data/mockData';
import { Patient, Symptom } from '../../types';
import { Users, AlertTriangle, Download, Eye, Calendar } from 'lucide-react';

export const ClinicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const getPatientStatus = (patientId: string) => {
    const patientSymptoms = mockSymptoms.filter(s => s.patientId === patientId);
    if (patientSymptoms.length === 0) return { level: 'none', color: 'text-gray-500 bg-gray-50' };
    
    const recentSymptom = patientSymptoms[0];
    const urgency = recentSymptom.aiGuidance?.urgencyLevel;
    
    switch (urgency) {
      case 'high': return { level: 'High Risk', color: 'text-red-700 bg-red-50' };
      case 'medium': return { level: 'Monitor', color: 'text-yellow-700 bg-yellow-50' };
      default: return { level: 'Stable', color: 'text-green-700 bg-green-50' };
    }
  };

  const getPatientAlerts = (patientId: string) => {
    const symptoms = mockSymptoms.filter(s => s.patientId === patientId);
    return symptoms.filter(s => s.aiGuidance?.urgencyLevel === 'high').length;
  };

  const PatientDetailView = ({ patient }: { patient: Patient }) => {
    const patientSymptoms = mockSymptoms.filter(s => s.patientId === patient.id);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
            <p className="text-sm text-gray-600">{patient.diagnosis}</p>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 inline mr-1" />
              Export Report
            </button>
            <button
              type="button"
              onClick={() => setSelectedPatient(null)}
              className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back to List
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Symptoms Timeline</h3>
            <div className="space-y-4">
              {patientSymptoms.map((symptom) => (
                <div key={symptom.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="font-medium text-gray-900 capitalize">
                          {symptom.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          Severity: {symptom.severity}/5
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(symptom.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {symptom.notes && (
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Patient Notes:</strong> {symptom.notes}
                        </p>
                      )}
                      
                      {symptom.aiGuidance && (
                        <div className={`p-3 rounded-md ${
                          symptom.aiGuidance.urgencyLevel === 'high' 
                            ? 'bg-red-50 border border-red-200' 
                            : symptom.aiGuidance.urgencyLevel === 'medium'
                            ? 'bg-yellow-50 border border-yellow-200'
                            : 'bg-green-50 border border-green-200'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className={`h-4 w-4 ${
                              symptom.aiGuidance.urgencyLevel === 'high' 
                                ? 'text-red-600' 
                                : symptom.aiGuidance.urgencyLevel === 'medium'
                                ? 'text-yellow-600'
                                : 'text-green-600'
                            }`} />
                            <span className="font-medium text-sm">
                              AI Assessment: {symptom.aiGuidance.urgencyLevel.toUpperCase()} Priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {symptom.aiGuidance.response}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedPatient) {
    return (
      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PatientDetailView patient={selectedPatient} />
      </main>
    );
  }

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Clinician Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor patient symptoms and AI-flagged alerts
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{mockPatients.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockSymptoms.filter(s => s.aiGuidance?.urgencyLevel === 'high').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reports Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockSymptoms.filter(s => 
                  new Date(s.date).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Patient Monitoring</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Symptom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alerts
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPatients.map((patient) => {
                const lastSymptom = mockSymptoms.find(s => s.patientId === patient.id);
                const status = getPatientStatus(patient.id);
                const alerts = getPatientAlerts(patient.id);
                
                return (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.diagnosis}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lastSymptom ? (
                        <div>
                          <div className="text-sm text-gray-900 capitalize">
                            {lastSymptom.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(lastSymptom.date).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No symptoms logged</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {alerts > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {alerts}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};