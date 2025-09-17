import React, { useState } from 'react';
import {
  Heart,
  Glasses,
  Monitor,
  Keyboard,
  Speaker,
  FileText,
  ArrowRight,
  Home,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Feature = {
  icon: JSX.Element;
  title: string;
  description: string;
  moreInfo: string;
};

const features: Feature[] = [
  {
    icon: <Speaker className="flex-shrink-0 h-10 w-10 text-blue-600 mt-1" />,
    title: 'Screen Reader Compatibility',
    description: 'Semantic HTML and ARIA attributes for compatibility with screen readers.',
    moreInfo:
      'We ensure that all content is properly marked up for screen readers like JAWS, NVDA, and VoiceOver. Headings, landmarks, and labels are used consistently.',
  },
  {
    icon: <Keyboard className="flex-shrink-0 h-10 w-10 text-green-600 mt-1" />,
    title: 'Keyboard Navigation',
    description: 'Navigate the site entirely with a keyboard.',
    moreInfo:
      'Users can tab through links, buttons, and forms in a logical order. Focus states are visible and intuitive.',
  },
  {
    icon: <Glasses className="flex-shrink-0 h-10 w-10 text-purple-600 mt-1" />,
    title: 'High Contrast & Readability',
    description: 'Text and UI components use accessible color contrast.',
    moreInfo:
      'We follow WCAG 2.1 color contrast standards to ensure all content is legible. Fonts are clean and resizable.',
  },
  {
    icon: <Monitor className="flex-shrink-0 h-10 w-10 text-indigo-600 mt-1" />,
    title: 'Adjustable Text Sizing',
    description: 'Text resizes properly without layout issues.',
    moreInfo:
      'Zooming up to 200% in browsers keeps content fully readable without horizontal scrolling or loss of structure.',
  },
  {
    icon: <FileText className="flex-shrink-0 h-10 w-10 text-orange-600 mt-1" />,
    title: 'Plain Language',
    description: 'Simple and understandable language across the platform.',
    moreInfo:
      'We avoid technical jargon and aim to make all instructions and content clear for all reading levels.',
  },
  {
    icon: <FileText className="flex-shrink-0 h-10 w-10 text-teal-600 mt-1" />,
    title: 'Image Alternative Text',
    description: 'All important images have descriptive alt text.',
    moreInfo:
      'Images include meaningful alt attributes to describe purpose, context, or function for screen readers.',
  },
];

export const AccessibilityPage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const closeModal = () => setSelectedFeature(null);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header Section */}
      <header className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="absolute top-4 left-4 p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors"
            aria-label="Go to Home"
          >
            <Home className="h-6 w-6 text-white" />
          </Link>
          <Heart className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Accessibility at OncoCare Buddy AI</h1>
          <p className="text-xl text-blue-200">
            We are committed to making our platform usable for everyone, regardless of ability.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We continuously work to improve our website's accessibility to comply with Web Content Accessibility Guidelines (WCAG) 2.1 AA standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFeature(feature)}
              className="text-left w-full p-6 bg-gray-50 rounded-lg shadow-md flex items-start space-x-4 hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-haspopup="dialog"
              aria-expanded={selectedFeature?.title === feature.title}
              aria-controls="feature-modal"
            >
              {feature.icon}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Feedback and Support</h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            If you encounter any accessibility barriers or have suggestions on how we can improve, please do not hesitate to contact us.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg"
          >
            Contact Support
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </main>

      {/* Modal */}
      {selectedFeature && (
        <div
          id="feature-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 id="modal-title" className="text-2xl font-semibold text-gray-900 mb-4">
              {selectedFeature.title}
            </h2>
            <p className="text-gray-700">{selectedFeature.moreInfo}</p>
          </div>
        </div>
      )}
    </div>
  );
};
