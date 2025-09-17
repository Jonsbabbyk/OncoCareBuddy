import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        console.log(`Bypassing registration for user: ${email}`);
        await login(email, 'hackathon-registered-user');
        
        // Redirect to the login page after successful registration
        navigate('/login');

      } else {
        await login(email, password);
        
        // Redirect to the dashboard after a successful login
        navigate('/patient/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Try again.');
    }
  };

  const fillDemoCredentials = (role: 'patient' | 'clinician') => {
    if (role === 'patient') {
      setEmail('jane.doe@email.com');
      setPassword('demo');
    } else {
      setEmail('dr.johnson@clinic.com');
      setPassword('demo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">OncoCare Buddy AI</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track, Understand, and Simplify Your Cancer Care
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isRegistering ? 'Create a New Account' : 'Sign in to your account'}
            </h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : (isRegistering ? 'Register' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register now'}
            </a>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('patient')}
                className="w-full text-left px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Demo Patient: Jane Doe
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('clinician')}
                className="w-full text-left px-3 py-2 text-sm text-green-600 bg-green-50 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Demo Clinician: Dr. Sarah Johnson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};