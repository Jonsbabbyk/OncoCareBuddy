// server.js
import express from 'express';
import Groq from 'groq-sdk';
import 'dotenv/config'; 
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// A simple in-memory store for the current quiz state
let currentQuizState = {
    question: null,
    correctAnswer: null,
};

// Crisis keywords for the safety net
const CRISIS_KEYWORDS = [
    "end it all", "give up", "can't go on", "hopeless", "suicide",
    "kill myself", "want to die", "ending my life"
];

// Existing Groq endpoints from your code
app.post('/api/get-ai-guidance', async (req, res) => {
  try {
    const { symptomType, severity, notes } = req.body;
    
    const systemPrompt = `
      You are a helpful and empathetic AI assistant for cancer patients.
      Provide non-medical guidance based on the user's symptom.
      Always include a clear disclaimer that your advice is for informational purposes only and does not replace professional medical advice.
      
      Format your response as a JSON object with three keys:
      1. 'urgencyLevel': string ('high', 'medium', or 'low' based on severity).
      2. 'response': string (A brief assessment of the symptom).
      3. 'recommendations': string[] (A list of 2-3 actionable recommendations).
    `;

    const userPrompt = `
      Symptom: ${symptomType}, Severity: ${severity}/5, Notes: ${notes}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });

    const aiResponse = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
    res.json(aiResponse);
  } catch (error) {
    console.error('Error with Groq API call:', error);
    res.status(500).json({ error: 'Failed to get AI guidance.' });
  }
});

app.post('/api/simplify-note', async (req, res) => {
  try {
    const { originalText } = req.body;

    const systemPrompt = `
      You are a helpful assistant that simplifies complex medical notes into simple, easy-to-understand language.
      Keep the response concise and use non-technical terms.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: originalText }
      ],
      model: 'llama-3.1-8b-instant', 
    });

    const simplifiedText = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't simplify that note.";
    res.json({ simplifiedText });
  } catch (error) {
    console.error('Error simplifying note with Groq:', error);
    res.status(500).json({ error: 'Failed to simplify note.' });
  }
});

app.post('/api/chat-response', async (req, res) => {
  try {
    const { userMessage } = req.body;
    
    const systemPrompt = `
      You are a compassionate and helpful AI assistant for cancer patients.
      Provide general, non-medical information and support.
      Always include a clear disclaimer at the end of your response stating that your advice is for informational purposes only and does not replace professional medical advice.
      Keep responses concise, empathetic, and easy to understand.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      model: 'llama-3.1-8b-instant', 
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
    res.json({ aiResponse });
  } catch (error) {
    console.error('Error with Groq chat API call:', error);
    res.status(500).json({ error: 'Failed to get a chat response.' });
  }
});

// Your existing Quiz Endpoint
app.post('/api/quiz', async (req, res) => {
    try {
        const { action, user_answer } = req.body;

        switch (action) {
            case 'get_question':
                const questionPrompt = `
                    Generate a single, multiple-choice health quiz question. 
                    Provide the correct answer letter and a short, one-sentence explanation in a JSON object.
                    Example JSON format: 
                    {"question": "What is a common side effect of chemotherapy?", "options": ["A. Increased appetite", "B. Hair loss", "C. Improved sleep"], "correctAnswer": "B", "explanation": "Hair loss is a very common side effect of chemotherapy as the treatment affects rapidly dividing cells, including hair follicles."}
                `;
                const questionCompletion = await groq.chat.completions.create({
                    messages: [
                        { role: 'user', content: questionPrompt }
                    ],
                    model: 'llama-3.1-8b-instant',
                    response_format: { type: 'json_object' }
                });
                const quizData = JSON.parse(questionCompletion.choices[0]?.message?.content || '{}');
                
                currentQuizState.question = quizData.question;
                currentQuizState.correctAnswer = quizData.correctAnswer;
                
                res.json(quizData);
                break;

            case 'check_answer':
                if (!currentQuizState.correctAnswer) {
                    return res.status(400).json({ feedback: "No question was asked yet. Please start a new battle.", is_correct: false });
                }
                
                const isCorrect = user_answer.trim().toUpperCase() === currentQuizState.correctAnswer.trim().toUpperCase();
                
                let feedbackMessage;
                if (isCorrect) {
                    feedbackMessage = "✅ Correct! Great job!";
                } else {
                    const explanationPrompt = `
                        The question was "${currentQuizState.question}".
                        The correct answer was "${currentQuizState.correctAnswer}".
                        The user answered "${user_answer}".
                        Write a single, friendly, and brief sentence explaining why the correct answer is right and why the user's answer was not, without giving away the full explanation.
                    `;
                    const explanationCompletion = await groq.chat.completions.create({
                        messages: [
                            { role: 'user', content: explanationPrompt }
                        ],
                        model: 'llama-3.1-8b-instant'
                    });
                    feedbackMessage = explanationCompletion.choices[0]?.message?.content || "That's a good guess, but it wasn't the correct answer. Try again next time!";
                }

                res.json({ is_correct: isCorrect, feedback: feedbackMessage });
                
                currentQuizState.question = null;
                currentQuizState.correctAnswer = null;
                break;

            default:
                res.status(400).json({ error: 'Invalid action.' });
        }
    } catch (error) {
        console.error('Error with Groq quiz API call:', error);
        res.status(500).json({ error: 'Failed to process quiz request.' });
    }
});

// NEW: MindCare AI Endpoint to check for crisis messages
app.post('/api/mindcare/check-crisis', (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some(keyword => userMessage.includes(keyword));

    if (isCrisis) {
        return res.json({
            isCrisis: true,
            message: "It sounds like you may need urgent support. Please reach out to a professional immediately. Here is a helpline: **988 Suicide & Crisis Lifeline**."
        });
    }

    res.json({ isCrisis: false, message: "" });
});

// NEW: MindCare AI chat endpoint with mock AI responses
app.post('/api/mindcare/chat', async (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    let responseText;

    if (userMessage.includes("breathing exercise")) {
        responseText = "Let's begin a simple box breathing exercise. Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. I'll guide you...";
    } else if (userMessage.includes("relaxing sounds")) {
        responseText = "Finding a peaceful sound can be very calming. I recommend trying soft rain sounds or ambient forest noises. You can find many free options online.";
    } else if (userMessage.includes("positive reflection")) {
        responseText = "What is one small success or happy moment you experienced today? It doesn't have to be big, just something that brought a smile to your face.";
    } else if (userMessage.includes("sleep")) {
        responseText = "Getting good sleep is vital for mental health. Try to avoid screens an hour before bed and make sure your room is dark and cool.";
    } else {
        // Here, we can reuse your /api/chat-response endpoint logic
        const systemPrompt = `
            You are a compassionate and helpful AI assistant for cancer patients.
            Provide general, non-medical information and support.
            Always include a clear disclaimer at the end of your response stating that your advice is for informational purposes only and does not replace professional medical advice.
            Keep responses concise, empathetic, and easy to understand.
        `;

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                model: 'llama-3.1-8b-instant', 
            });
            responseText = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
        } catch (error) {
            console.error('Error with Groq chat API call:', error);
            res.status(500).json({ error: 'Failed to get a chat response.' });
            return;
        }
    }

    res.json({ message: responseText });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});