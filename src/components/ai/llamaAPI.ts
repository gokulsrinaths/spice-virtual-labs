/**
 * Llama API Client for Maverick model integration
 * This module provides functions to interact with the Llama API and process responses
 */

import type { AIExplanation, LlamaAPIResponse } from './types';
import { useMockAPIResponse } from './mockApiResponses';

/**
 * Calls the Llama API with the given prompt to get an explanation of a fluid mechanics concept
 * @param prompt The user's selected text or query
 * @param interactionHistory Previous interactions to provide context
 * @returns Promise with the AI explanation
 */
export async function callLlamaAPI(
  prompt: string,
  interactionHistory: { query: string; timestamp: number }[] = []
): Promise<LlamaAPIResponse> {
  console.log('Calling Llama API with prompt:', prompt);
  
  try {
    const explanation = await useMockAPIResponse(prompt, interactionHistory);
    return {
      explanation,
      status: 'success'
    };
  } catch (error) {
    console.error('Error calling Llama API:', error);
    return {
      explanation: {
        definition: 'An error occurred while processing your request. Please try again.',
        examples: ['Try rephrasing your question', 'Check your internet connection'],
        teachingNote: 'If the problem persists, please contact support.'
      },
      status: 'error'
    };
  }
}