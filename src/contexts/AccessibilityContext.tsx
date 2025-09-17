// src/contexts/AccessibilityContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of our context state
interface AccessibilityContextType {
  isSeniorMode: boolean;
  toggleSeniorMode: () => void;
  isTtsMuted: boolean; // Added for TTS mute functionality
  toggleTtsMute: () => void; // Added for TTS mute functionality
}

// Create the context with a default value
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Create the provider component
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSeniorMode, setIsSeniorMode] = useState(() => {
    // Get initial value from local storage to persist the setting
    const savedMode = localStorage.getItem('seniorMode');
    return savedMode === 'true';
  });
  
  const [isTtsMuted, setIsTtsMuted] = useState(() => {
    const savedMuteState = localStorage.getItem('isTtsMuted');
    return savedMuteState === 'true';
  });

  // Use an effect to update local storage and the body class whenever the senior mode state changes
  useEffect(() => {
    localStorage.setItem('seniorMode', String(isSeniorMode));
    if (isSeniorMode) {
      document.body.classList.add('senior-mode');
    } else {
      document.body.classList.remove('senior-mode');
    }
  }, [isSeniorMode]);

  // Use an effect to update local storage whenever the TTS mute state changes
  useEffect(() => {
    localStorage.setItem('isTtsMuted', String(isTtsMuted));
  }, [isTtsMuted]);

  const toggleSeniorMode = () => {
    setIsSeniorMode(prevMode => !prevMode);
  };
  
  const toggleTtsMute = () => {
    setIsTtsMuted(prevMute => !prevMute);
  };

  return (
    <AccessibilityContext.Provider value={{ isSeniorMode, toggleSeniorMode, isTtsMuted, toggleTtsMute }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook to easily use the context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};