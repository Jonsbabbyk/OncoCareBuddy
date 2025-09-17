import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Smile, Sun, Moon, Volume2, Mic, BookOpen, 
  MessageCircle, Loader
} from 'lucide-react';
import { getMindcareResponse, checkCrisisMessage } from '../../services/groqService';

// Moods for the tracker
const moodEmojis = [
    { label: 'Happy', emoji: '😊' },
    { label: 'Neutral', emoji: '😐' },
    { label: 'Sad', emoji: '😔' },
    { label: 'Anxious', emoji: '😟' },
    { label: 'Stressed', emoji: '😩' },
];

// Helper function to generate a random relaxing tip
const getRandomRelaxationTip = () => {
  const tips = [
    "You can find comfort in the smallest things. What's one small thing you're grateful for today?",
    "Sometimes the best therapy is a moment of quiet. Try a 2-minute break just for yourself.",
    "Remember that rest is not a reward, it's a necessity. Listen to your body and give it what it needs.",
    "Your feelings are valid. Take a deep breath and acknowledge them without judgment.",
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};


export const MentalHealth: React.FC = () => {
    const navigate = useNavigate();
    const [chatLog, setChatLog] = useState<{ role: 'ai' | 'user', message: string }[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dailyMood, setDailyMood] = useState<string | null>(null);
    const chatboxRef = useRef<HTMLDivElement>(null);

    // Placeholder data for mood tracking visualization
    const [moodData, setMoodData] = useState([
      { date: 'Mon', mood: 'Happy' },
      { date: 'Tue', mood: 'Sad' },
      { date: 'Wed', mood: 'Neutral' },
      { date: 'Thu', mood: 'Anxious' },
      { date: 'Fri', mood: 'Happy' },
    ]);

    useEffect(() => {
      // Auto-scroll chatbox to the bottom
      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    }, [chatLog]);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const newUserMessage = userInput;
        setChatLog(prev => [...prev, { role: 'user', message: newUserMessage }]);
        setUserInput('');
        setIsLoading(true);

        try {
            // First, check if the message is a crisis message
            const crisisResponse = await checkCrisisMessage(newUserMessage);

            if (crisisResponse.isCrisis) {
                setChatLog(prev => [...prev, { role: 'ai', message: crisisResponse.message }]);
            } else {
                // If not a crisis, get a regular mindcare response
                const aiResponse = await getMindcareResponse(newUserMessage);
                setChatLog(prev => [...prev, { role: 'ai', message: aiResponse.message }]);
            }
        } catch (error) {
            console.error('Failed to get AI response:', error);
            setChatLog(prev => [...prev, { role: 'ai', message: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = async (action: string) => {
      const userMessage = action;
      setChatLog(prev => [...prev, { role: 'user', message: userMessage }]);
      setIsLoading(true);

      try {
          const aiResponse = await getMindcareResponse(userMessage);
          setChatLog(prev => [...prev, { role: 'ai', message: aiResponse.message }]);
      } catch (error) {
          console.error('Failed to get AI response:', error);
          setChatLog(prev => [...prev, { role: 'ai', message: "Sorry, I couldn't get a response. Try again." }]);
      } finally {
          setIsLoading(false);
      }
    };

    const handleMoodCheckin = (mood: string) => {
      setDailyMood(mood);
      // Simulate adding to mood data for visualization
      setMoodData(prev => [...prev, { date: 'Today', mood: mood }]);
      setChatLog(prev => [...prev, { role: 'user', message: `I'm feeling ${mood}.` }]);
      handleQuickAction(`I'm feeling ${mood}.`);
    };

    return (
        <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate('/patient/dashboard')}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
    
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-8 w-8 text-pink-600" />
              <h1 className="text-2xl font-bold text-gray-900">MindCare AI</h1>
            </div>
            <p className="text-gray-600 mb-6">
              Your personalized mental wellness companion. Let's talk about how you're feeling.
            </p>
    
            {/* AI Chat Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-pink-700 flex items-center mb-4">
                <div className="p-2 bg-pink-100 rounded-full mr-3"><MessageCircle className="h-5 w-5" /></div>
                How are you feeling today?
              </h2>
              <div ref={chatboxRef} className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto mb-4">
                {chatLog.length > 0 ? (
                  chatLog.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                      <div className={`p-3 rounded-lg text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border'}`}>
                        {msg.message}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 italic mt-8">
                    Start a conversation with your AI companion.
                  </div>
                )}
                {isLoading && (
                  <div className="flex justify-start mb-2">
                    <div className="p-3 rounded-lg text-sm bg-white text-gray-800 border">
                      <Loader className="animate-spin h-5 w-5 text-gray-500 inline-block" />
                      <span className="ml-2">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
    
              {/* Mood Buttons & Input */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {moodEmojis.map(mood => (
                  <button
                    key={mood.label}
                    onClick={() => handleMoodCheckin(mood.label)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label={`Select mood: ${mood.label}`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  placeholder="Type or speak how you're feeling..."
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={!userInput.trim() || isLoading}
                >
                  Send
                </button>
                <button
                  onClick={() => alert("Voice-to-text functionality is active! (Simulated)")}
                  className="ml-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
                  disabled={isLoading}
                  aria-label="Start voice input"
                >
                  <Mic className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
    
            {/* AI-Powered Quick Interventions */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-pink-700 flex items-center mb-4">
                <div className="p-2 bg-pink-100 rounded-full mr-3"><Volume2 className="h-5 w-5" /></div>
                Quick Interventions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleQuickAction('Guide me through a breathing exercise.')}
                  className="bg-purple-100 border border-purple-200 text-purple-800 p-4 rounded-lg flex items-center space-x-3 hover:bg-purple-200 transition-colors"
                >
                  <Sun className="h-6 w-6" />
                  <span className="font-semibold">Guided Breathing</span>
                </button>
                <button
                  onClick={() => handleQuickAction('Suggest some relaxing sounds.')}
                  className="bg-blue-100 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-center space-x-3 hover:bg-blue-200 transition-colors"
                >
                  <Moon className="h-6 w-6" />
                  <span className="font-semibold">Relaxing Sounds</span>
                </button>
                <button
                  onClick={() => handleQuickAction('Help me with a positive reflection.')}
                  className="bg-yellow-100 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-center space-x-3 hover:bg-yellow-200 transition-colors"
                >
                  <BookOpen className="h-6 w-6" />
                  <span className="font-semibold">Positive Reflection</span>
                </button>
                <button
                  onClick={() => handleQuickAction('Give me tips to improve my sleep.')}
                  className="bg-indigo-100 border border-indigo-200 text-indigo-800 p-4 rounded-lg flex items-center space-x-3 hover:bg-indigo-200 transition-colors"
                >
                  <Moon className="h-6 w-6" />
                  <span className="font-semibold">AI Sleep Coach</span>
                </button>
              </div>
            </div>

            {/* Mood Tracking & Visualization */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-pink-700 flex items-center mb-4">
                <div className="p-2 bg-pink-100 rounded-full mr-3"><Heart className="h-5 w-5" /></div>
                Mood Tracker
              </h2>
              <p className="text-gray-600 italic mb-4">Your emotional summary for the week:</p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="grid grid-cols-5 text-center font-semibold text-sm text-gray-500 mb-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                </div>
                <div className="flex justify-between">
                  {moodData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span className="text-2xl mb-1">
                        {moodEmojis.find(m => m.label === day.mood)?.emoji || '❔'}
                      </span>
                      <span className="text-xs text-gray-500">{day.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
    
            {/* Crisis Safety Net */}
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-700">Crisis Safety Net</p>
              <p className="text-sm text-red-600">
                If you are experiencing a mental health emergency, please contact a professional immediately.
                <br />
                **National Suicide Prevention Lifeline:** 988
              </p>
            </div>
          </div>
        </main>
    );
};