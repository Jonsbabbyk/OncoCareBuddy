import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SkipLink } from './components/common/SkipLink';
import { Header } from './components/common/Header';
import { LandingPage } from './components/landing/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { SymptomLogger } from './components/patient/SymptomLogger';
import { NotesSimplifier } from './components/patient/NotesSimplifier';
import { AIChat } from './components/patient/AIChat';
import { MedicationRemindersPage } from './components/patient/MedicationRemindersPage'; 
import { ClinicianDashboard } from './components/clinician/ClinicianDashboard';
import { SeniorMode } from './components/senior/SeniorMode';
import { MentalHealth } from './components/patient/MentalHealth'; 
import { HealthGame } from './components/patient/HealthGame'; 
import { SettingsPage } from './components/patient/SettingsPage';
import { AccessibilityProvider } from './contexts/AccessibilityContext'; 
import { AccessibilityPage } from './components/patient/AccessibilityPage'; // Corrected import path

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * A private route component that checks for authentication.
 * If the user is authenticated, it renders the child components.
 * Otherwise, it navigates the user to the login page.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* Public Routes - Accessible to all */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/accessibility" element={<AccessibilityPage />} /> {/* Add the new route here */}
        
        {/* Patient Routes - Protected */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/symptoms/log"
          element={
            <ProtectedRoute>
              <SymptomLogger />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/notes"
          element={
            <ProtectedRoute>
              <NotesSimplifier />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/ai-chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/reminders"
          element={
            <ProtectedRoute>
              <MedicationRemindersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/mental-health"
          element={
            <ProtectedRoute>
              <MentalHealth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/health-game"
          element={
            <ProtectedRoute>
              <HealthGame />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Clinician Routes - Protected */}
        <Route
          path="/clinician/dashboard"
          element={
            <ProtectedRoute>
              <ClinicianDashboard />
            </ProtectedRoute>
          }
        />

        {/* Senior Mode Route - Protected */}
        <Route
          path="/senior-mode"
          element={
            <ProtectedRoute>
              <SeniorMode />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <SkipLink />
            <AppRoutes />
          </div>
        </Router>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;