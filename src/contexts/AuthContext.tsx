import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean; // Added this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lazy state initialization to read from localStorage only once.
const getInitialUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('oncocare_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState(false);

  // The isAuthenticated state is derived from the user state
  const isAuthenticated = !!user; // Added this line

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate a quick API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let foundUser = mockUsers.find(u => u.email === email);

    if (!foundUser) {
      // Create a demo user based on the email provided
      const role = email.includes('dr.') || email.includes('clinician') ? 'clinician' : 'patient';
      
      foundUser = {
        id: 'demo-' + Date.now(), // Generate a unique ID for the demo user
        name: email.split('@')[0], // Use the part before the @ symbol as the name
        email: email,
        role: role,
        patientId: role === 'patient' ? 'patient-demo' : undefined,
      };
    }

    setUser(foundUser);
    localStorage.setItem('oncocare_user', JSON.stringify(foundUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oncocare_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};