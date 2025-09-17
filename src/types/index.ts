// Core application types
export interface Patient {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  diagnosis: string;
  treatmentPlan: string;
}

export interface Symptom {
  id: string;
  patientId: string;
  date: string;
  type: 'pain' | 'fatigue' | 'nausea' | 'dizziness' | 'other';
  severity: 1 | 2 | 3 | 4 | 5;
  notes: string;
  aiGuidance?: AIGuidance;
}

export interface AIGuidance {
  id: string;
  symptomId: string;
  response: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  timestamp: string;
}

export interface Reminder {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  timeOfDay: string;
  frequency: string;
  isCompleted: boolean;
  timestamp: string;
}

export interface DoctorNote {
  id: string;
  patientId: string;
  originalText: string;
  simplifiedText: string;
  dateCreated: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'clinician';
  patientId?: string;
}