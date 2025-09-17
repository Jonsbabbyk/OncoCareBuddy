import { Patient, Symptom, AIGuidance, Reminder, DoctorNote, User } from '../types';

// Sample patient data
export const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    name: 'Jane Doe',
    email: 'jane.doe@email.com',
    dateOfBirth: '1975-06-15',
    diagnosis: 'Breast Cancer Stage II',
    treatmentPlan: 'Chemotherapy + Radiation'
  }
];

// Sample users (for demo login)
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane.doe@email.com',
    role: 'patient',
    patientId: 'patient-1'
  },
  {
    id: 'user-2',
    name: 'Dr. Sarah Johnson',
    email: 'dr.johnson@clinic.com',
    role: 'clinician'
  }
];

// Sample AI guidance responses
export const mockAIGuidance: AIGuidance[] = [
  {
    id: 'guidance-1',
    symptomId: 'symptom-1',
    response: 'Your pain level of 3 out of 5 is manageable but should be monitored. Take your prescribed pain medication as directed. If pain increases to level 4 or higher, or persists for more than 2 days, contact your doctor.',
    urgencyLevel: 'medium',
    recommendations: [
      'Take prescribed pain medication as directed',
      'Apply heat or cold as comfortable',
      'Rest and avoid strenuous activities',
      'Contact doctor if pain worsens'
    ],
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    id: 'guidance-2',
    symptomId: 'symptom-2',
    response: 'Nausea is a common side effect of chemotherapy. Your severity level of 2 suggests mild discomfort. Try eating small, frequent meals and avoid strong odors. If nausea worsens or prevents you from eating, contact your care team.',
    urgencyLevel: 'low',
    recommendations: [
      'Eat small, frequent meals',
      'Stay hydrated with clear fluids',
      'Avoid strong smells and spicy foods',
      'Take anti-nausea medication if prescribed'
    ],
    timestamp: '2024-01-14T14:15:00Z'
  },
  {
    id: 'guidance-3',
    symptomId: 'symptom-3',
    response: 'Dizziness with severity level 4 requires attention. This could be related to your medication or treatment. Sit or lie down immediately when feeling dizzy. Contact your doctor today to discuss this symptom.',
    urgencyLevel: 'high',
    recommendations: [
      'Sit or lie down when dizzy',
      'Move slowly when changing positions',
      'Stay hydrated',
      'Contact your doctor today'
    ],
    timestamp: '2024-01-13T09:45:00Z'
  }
];

// Sample symptoms with corresponding AI guidance
export const mockSymptoms: Symptom[] = [
  {
    id: 'symptom-1',
    patientId: 'patient-1',
    date: '2024-01-15',
    type: 'pain',
    severity: 3,
    notes: 'Sharp pain in chest area, worse in the morning',
    aiGuidance: mockAIGuidance[0]
  },
  {
    id: 'symptom-2',
    patientId: 'patient-1',
    date: '2024-01-14',
    type: 'nausea',
    severity: 2,
    notes: 'Mild nausea after chemotherapy session',
    aiGuidance: mockAIGuidance[1]
  },
  {
    id: 'symptom-3',
    patientId: 'patient-1',
    date: '2024-01-13',
    type: 'dizziness',
    severity: 4,
    notes: 'Feeling lightheaded when standing up',
    aiGuidance: mockAIGuidance[2]
  }
];

// Sample medication reminders
export const mockReminders: Reminder[] = [
  {
    id: 'reminder-1',
    patientId: 'patient-1',
    medication: 'Ondansetron',
    dosage: '8mg',
    timeOfDay: '08:00',
    frequency: 'Every 8 hours',
    isCompleted: false
  },
  {
    id: 'reminder-2',
    patientId: 'patient-1',
    medication: 'Ibuprofen',
    dosage: '400mg',
    timeOfDay: '12:00',
    frequency: 'As needed for pain',
    isCompleted: true
  },
  {
    id: 'reminder-3',
    patientId: 'patient-1',
    medication: 'Vitamin D',
    dosage: '1000IU',
    timeOfDay: '20:00',
    frequency: 'Daily',
    isCompleted: false
  }
];

// Sample doctor's notes
export const mockDoctorNotes: DoctorNote[] = [
  {
    id: 'note-1',
    patientId: 'patient-1',
    originalText: 'Patient to administer subcutaneous injection of Filgrastim 300mcg daily for 7 days post-chemotherapy to prevent neutropenia. Monitor for signs of bone pain. Discontinue if severe allergic reaction occurs. Follow up in clinic in 2 weeks for CBC with differential.',
    simplifiedText: 'Give yourself a shot of Filgrastim medicine under your skin once a day for 7 days after chemotherapy. This helps prevent infection. You might get some bone pain - this is normal. Stop the medicine and call us right away if you have a bad allergic reaction like trouble breathing or severe rash. Come back to see us in 2 weeks for blood tests.',
    dateCreated: '2024-01-12'
  }
];