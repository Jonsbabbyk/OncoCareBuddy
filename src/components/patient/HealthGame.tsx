import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Gamepad2, 
  Award, 
  Droplet, 
  Pill, 
  Heart, 
  Smile, 
  Dumbbell, 
  MessageCircle,
  Trophy,
  Ambulance,
  Loader
} from 'lucide-react';
import { getQuizQuestion, checkQuizAnswer } from '../../services/groqService';

// To simulate dynamic AI content
const generateDailyChallenge = () => {
  const challenges = [
    { type: 'Hydration Hero', icon: Droplet, text: 'Drink 5 glasses of water before 8 PM.', points: 100 },
    { type: 'Sleep Guardian', icon: Heart, text: 'Try a 15-minute guided meditation before bed.', points: 150 },
    { type: 'Mindful Warrior', icon: Smile, text: 'Perform a 10-minute stretching routine today.', points: 120 },
    { type: 'Medication Champion', icon: Pill, text: 'Log your morning medication within 30 minutes of waking.', points: 180 },
  ];
  return challenges[Math.floor(Math.random() * challenges.length)];
};

// Data for the "Help Esther" mini-game
const estherScenarios = [
  {
    text: "Esther is thirsty. She sees a clean tap and a polluted river. Which water should she drink?",
    choices: [
      { text: "Tap Water", correct: true, feedback: "✅ Correct! Tap water is the safest choice to avoid illness. You earn +50XP.", xp: 50 },
      { text: "River Water", correct: false, feedback: "❌ Oh no! River water can contain germs and contaminants. It's not safe to drink without treatment.", xp: 0 }
    ]
  },
  {
    text: "Esther feels tired. Should she rest for 20 minutes or push on immediately?",
    choices: [
      { text: "Rest 20 Min", correct: true, feedback: "✅ Correct! Resting is vital for recovery and can prevent fatigue-related mistakes. You earn +50XP.", xp: 50 },
      { text: "Push On", correct: false, feedback: "❌ Not the best choice. Pushing on while tired can worsen her condition. Rest is essential for healing.", xp: 0 }
    ]
  },
  {
    text: "Esther needs a bathroom. One is clean, one is dirty. Which should she use?",
    choices: [
      { text: "Clean Bathroom", correct: true, feedback: "✅ Correct! Choosing a clean environment minimizes the risk of infection. You earn +50XP.", xp: 50 },
      { text: "Dirty Bathroom", correct: false, feedback: "❌ Unsafe choice. A dirty environment can expose her to harmful bacteria and viruses.", xp: 0 }
    ]
  },
];

export const HealthGame: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'dashboard' | 'estherGame'>('dashboard');
  const [dailyMission, setDailyMission] = useState<any>(null);
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizState, setQuizState] = useState<'question' | 'waiting' | 'result'>('question');
  const [quizChatLog, setQuizChatLog] = useState<{ role: 'ai' | 'user', message: string }[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // "Help Esther" Game State
  const [estherScenarioIndex, setEstherScenarioIndex] = useState(0);
  const [estherFeedback, setEstherFeedback] = useState('');
  const [estherProgress, setEstherProgress] = useState(0);

  useEffect(() => {
    setDailyMission(generateDailyChallenge());
  }, []);

  const handleMissionComplete = () => {
    alert(`Mission complete! You earned ${dailyMission.points} XP!`);
    setXp(prev => prev + dailyMission.points);
    if (dailyMission.type === 'Hydration Hero' && !badges.includes('Hydration Hero')) {
      setBadges(prev => [...prev, 'Hydration Hero']);
    }
  };
  
  const handleStartQuiz = async () => {
    setShowQuiz(true);
    setIsLoading(true);
    setQuizChatLog([{ role: 'ai', message: 'Generating a health question...' }]);
    
    try {
      const data = await getQuizQuestion();
      setQuizChatLog([{ role: 'ai', message: data.question }]);
      setQuizState('question');
    } catch (error) {
      console.error('Failed to fetch quiz question:', error);
      setQuizChatLog([{ role: 'ai', message: 'Error: Could not generate question. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
    setUserAnswer('');
  };

  const handleQuizSubmit = async () => {
    if (!userAnswer.trim()) return;
    setQuizState('waiting');
    setIsLoading(true);
    setQuizChatLog(prev => [...prev, { role: 'user', message: userAnswer }]);
    
    try {
      const data = await checkQuizAnswer(userAnswer);
      setQuizChatLog(prev => [...prev, { role: 'ai', message: data.feedback }]);
      if (data.is_correct) { // The fix is here: 'isCorrect' was changed to 'is_correct'
        setXp(prev => prev + 50);
      }
    } catch (error) {
      console.error('Failed to submit quiz answer:', error);
      setQuizChatLog(prev => [...prev, { role: 'ai', message: 'Error: Could not check your answer.' }]);
    } finally {
      setIsLoading(false);
      setQuizState('result');
    }
  };
  
  // "Help Esther" Game Logic
  const handleEstherChoice = (choice: { text: string; correct: boolean; feedback: string; xp: number }) => {
    setEstherFeedback(choice.feedback);
    setXp(prev => prev + choice.xp);
    setEstherProgress(prev => prev + 1);

    if (estherScenarioIndex < estherScenarios.length - 1) {
      setTimeout(() => {
        setEstherScenarioIndex(prev => prev + 1);
        setEstherFeedback('');
      }, 2000);
    } else {
      setTimeout(() => {
        alert("🎉 You helped Esther reach the hospital safely!");
        setEstherFeedback("You've unlocked the Health Guardian Badge!");
        setBadges(prev => [...prev, 'Health Guardian']);
      }, 2000);
    }
  };

  const renderEstherGame = () => {
    if (estherScenarioIndex >= estherScenarios.length) {
      return (
        <div className="text-center p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Victory! 🎉</h2>
          <p className="text-gray-700 mb-4">{estherFeedback}</p>
          <button
            onClick={() => {
              setGameState('dashboard');
              setEstherScenarioIndex(0);
              setEstherFeedback('');
              setEstherProgress(0);
            }}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    const currentScenario = estherScenarios[estherScenarioIndex];
    const progressPercentage = (estherProgress / estherScenarios.length) * 100;

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Ambulance className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Help Esther Reach the Hospital 🚑</h1>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="text-center p-4">
          <p className="text-lg font-semibold text-gray-800 mb-6">{currentScenario.text}</p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {currentScenario.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleEstherChoice(choice)}
                className="w-full px-6 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {choice.text}
              </button>
            ))}
          </div>
          {estherFeedback && (
            <div className="mt-6 p-4 text-center text-sm font-medium rounded-md bg-gray-100 border border-gray-200 text-gray-800">
              {estherFeedback}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderQuiz = () => (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <h2 className="text-lg font-semibold text-teal-700 flex items-center mb-4">
        <div className="p-2 bg-teal-100 rounded-full mr-3"><MessageCircle className="h-5 w-5" /></div>
        AI Knowledge Battle
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader className="animate-spin text-teal-500 h-8 w-8" />
        </div>
      ) : (
        <>
          <div className="bg-gray-100 p-4 rounded-lg h-48 overflow-y-auto">
            {quizChatLog.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className={`p-2 rounded-lg text-sm max-w-[75%] ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border'}`}>
                  {message.message}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={quizState !== 'question'}
            />
            <button
              onClick={handleQuizSubmit}
              disabled={userAnswer.trim() === '' || quizState !== 'question'}
              className="ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => {
            if (gameState === 'estherGame') {
              setGameState('dashboard');
            } else {
              navigate('/patient/dashboard');
            }
          }}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        </div>

        {/* Main Game Dashboard */}
        {gameState === 'dashboard' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Gamepad2 className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">CareQuest AI</h1>
            </div>
            <p className="text-gray-600 mb-6">
              Your personalized health adventure. Complete missions, earn XP, and become a health champion!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NEW: Esther Game Card */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-red-100 transition-colors"
                   onClick={() => setGameState('estherGame')}>
                <Ambulance className="h-10 w-10 text-red-500" />
                <h2 className="font-semibold text-lg text-red-700">Help Esther Reach the Hospital</h2>
                <p className="text-sm text-red-600 text-center">A story-driven game to learn about health safety.</p>
              </div>

              {/* Daily Mission */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-6 w-6 text-indigo-500" />
                  <h2 className="font-semibold text-lg text-indigo-700">Your Mission Today</h2>
                </div>
                {dailyMission && (
                  <>
                    <p className="text-sm font-medium text-indigo-600">
                      {dailyMission.icon && <dailyMission.icon className="h-4 w-4 inline mr-2" />}
                      {dailyMission.text}
                    </p>
                    <button 
                      onClick={handleMissionComplete} 
                      className="mt-auto px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Complete
                    </button>
                  </>
                )}
              </div>

              {/* AI Knowledge Battle */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-teal-500" />
                  <h2 className="font-semibold text-lg text-teal-700">AI Knowledge Battle</h2>
                </div>
                <p className="text-sm text-teal-600">Answer a quick quiz from our AI assistant!</p>
                <button
                  onClick={handleStartQuiz}
                  className="mt-auto px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                >
                  Start Battle
                </button>
              </div>

              {/* Progress & Badges */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-green-500" />
                  <h2 className="font-semibold text-lg text-green-700">Your Progress</h2>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Total XP: {xp}</p>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.min(xp / 1000, 1) * 100}%` }}
                  ></div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {badges.map(badge => (
                    <span key={badge} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Award className="h-4 w-4 mr-1" />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* "Help Esther" Game UI */}
        {gameState === 'estherGame' && renderEstherGame()}
        
        {/* Conditionally render quiz if showQuiz is true */}
        {showQuiz && renderQuiz()}
      </main>
  );
};