// src/services/aiService.ts

import { AIGuidance } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

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
    const response = await fetch(`${API_BASE_URL}/get-ai-guidance`, {
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

    // Map the Groq response to your AIGuidance type
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
    const response = await fetch(`${API_BASE_URL}/simplify-note`, {
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
    const response = await fetch(`${API_BASE_URL}/chat-response`, {
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