import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Brain, MessageCircle, FileText, Users, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-8">
              <Heart className="h-16 w-16 text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-900">
                OncoCare Buddy AI
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track, Understand, and Simplify Your Cancer Care
            </p>
            
            <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
              Empowering cancer patients with AI-powered symptom tracking, 
              personalized guidance, and simplified medical communication.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/senior-mode"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg"
              >
                Senior Mode
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Cancer Care Support
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides the tools and guidance you need 
              to manage your cancer care journey with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Symptom Tracking */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <Activity className="h-10 w-10 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Track Symptoms & Get AI Guidance
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Log your daily symptoms and receive intelligent, personalized guidance 
                from our AI system. Get clear recommendations on when to monitor, 
                when to call your doctor, and how to manage discomfort.
              </p>
            </div>

            {/* Feature 2: Medical Notes */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <FileText className="h-10 w-10 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Simplify Medical Instructions
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Transform complex medical language into clear, easy-to-understand 
                instructions. Our AI breaks down doctor's notes and medical jargon 
                into simple language with audio playback support.
              </p>
            </div>

            {/* Feature 3: Care Team Connection */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <Users className="h-10 w-10 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Stay Connected to Your Care Team
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Keep your healthcare providers informed with automated alerts 
                for concerning symptoms. Your care team can monitor your progress 
                and respond quickly when needed.
              </p>
            </div>

            {/* Feature 4: AI Assistant */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <MessageCircle className="h-10 w-10 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  24/7 AI Assistant
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Get answers to your questions anytime. Our AI assistant provides 
                reliable information about medications, treatments, and general 
                cancer care guidance in plain language.
              </p>
            </div>

            {/* Feature 5: Medication Reminders */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <Brain className="h-10 w-10 text-orange-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Smart Medication Reminders
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Never miss a dose with intelligent medication reminders. 
                Track your medications, set custom schedules, and receive 
                timely notifications to stay on track with your treatment.
              </p>
            </div>

            {/* Feature 6: Accessibility */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <Heart className="h-10 w-10 text-teal-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Accessible & User-Friendly
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Designed with accessibility in mind. Features include text-to-speech, 
                high contrast modes, keyboard navigation, and screen reader support 
                to ensure everyone can use our platform effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Take Control of Your Cancer Care Journey
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients who are managing their care with confidence
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors shadow-lg"
          >
            Start Your Journey Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="h-8 w-8 text-blue-400" />
                <h3 className="text-xl font-bold">OncoCare Buddy AI</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering cancer patients with AI-powered tools for better care management, 
                clearer communication, and improved quality of life.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Get Support
                  </Link>
                </li>
                <li>
                  <Link to="/emergency" className="text-gray-400 hover:text-white transition-colors">
                    Emergency Resources
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 OncoCare Buddy AI. This demo application is for educational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  ); 
};