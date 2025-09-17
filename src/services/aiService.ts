import { AIGuidance } from '../types';

// Use the environment variable-based configuration
// This is the correct way to get the dynamic URL
import { API_BASE_URL } from '../config';

/**
 * Generates AI-powered guidance for a user's symptom.
 * It calls a real Groq AI model and formats the response.
 */
export const generateAIGuidance = async (
  symptomType: string,
  severity: number,
  notes: string
): Promise<AIGuidance> => {
  try {
    // The fetch URL now correctly uses the dynamic API_BASE_URL and the /api path.
    const response = await fetch(`${API_BASE_URL}/api/get-ai-guidance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptomType, severity, notes }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with an error: ${errorText}`);
    }

    const aiResponse = await response.json();

    return {
      id: `guidance-${Date.now()}`,
      symptomId: '',
      response: aiResponse.response,
      urgencyLevel: aiResponse.urgencyLevel,
      recommendations: aiResponse.recommendations,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to generate AI guidance:", error);
    throw error;
  }
};

/**
 * Simplifies a doctor's note using a real AI model.
 * It calls the backend server which uses Groq for simplification.
 */
export const simplifyDoctorNote = async (originalText: string): Promise<string> => {
  try {
    // Corrected fetch URL
    const response = await fetch(`${API_BASE_URL}/api/simplify-note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalText }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with an error: ${errorText}`);
    }

    const data = await response.json();
    return data.simplifiedText;

  } catch (error) {
    console.error("Failed to simplify note:", error);
    throw new Error("Failed to simplify note. Please try again.");
  }
};

/**
 * Gets a chat-based AI response to a user's message.
 * It calls the backend server which uses Groq for the chat.
 */
export const getChatResponse = async (userMessage: string): Promise<string> => {
  try {
    // Corrected fetch URL
    const response = await fetch(`${API_BASE_URL}/api/chat-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with an error: ${errorText}`);
    }

    const data = await response.json();
    return data.aiResponse;
  } catch (error) {
    console.error("Failed to get chat response:", error);
    throw new Error("Failed to get a chat response. Please try again.");
  }
};