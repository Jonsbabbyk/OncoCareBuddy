// src/services/groqService.ts
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Interfaces for existing services (This is for a different feature)
export interface GroqGuidanceResponse {
    urgencyLevel: 'high' | 'medium' | 'low';
    response: string;
    recommendations: string[];
}

export async function getGroqGuidance(
    symptomType: string,
    severity: number,
    notes: string
): Promise<GroqGuidanceResponse> {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/get-ai-guidance`, {
            symptomType,
            severity,
            notes,
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching AI guidance from backend:', error);
        throw new Error('Failed to get guidance from AI. Please try again.');
    }
}

// Correct Interfaces for the quiz functionality to match the Node.js backend
export interface QuizQuestionResponse {
    question: string;
}

export interface QuizAnswerResponse {
    is_correct: boolean;
    feedback: string;
}

// Functions for the quiz functionality
export async function getQuizQuestion(): Promise<QuizQuestionResponse> {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/quiz`, {
            action: 'get_question',
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz question from backend:', error);
        throw new Error('Failed to load quiz question from AI. Please try again.');
    }
}

export async function checkQuizAnswer(userAnswer: string): Promise<QuizAnswerResponse> {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/quiz`, {
            action: 'check_answer',
            user_answer: userAnswer,
        });
        return response.data;
    } catch (error) {
        console.error('Error checking quiz answer with backend:', error);
        throw new Error('Failed to check answer with AI. Please try again.');
    }
}

// Functions for the MindCare AI functionality
export async function getMindcareResponse(message: string) {
    const response = await axios.post(`${API_BASE_URL}/api/mindcare/chat`, {
        message,
    });
    return response.data;
}

export async function checkCrisisMessage(message: string) {
    const response = await axios.post(`${API_BASE_URL}/api/mindcare/check-crisis`, {
        message,
    });
    return response.data;
}