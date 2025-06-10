// Define interfaces for API responses
export interface AIExplanation {
  definition?: string;
  formula?: string;
  formulaDescription?: string;
  relatedConcepts?: string[];
  examples?: string[];
  references?: { title: string; url: string }[];
  imageUrl?: string;
  teachingNote?: string;
}

export interface LlamaAPIResponse {
  explanation: AIExplanation;
  status: string;
} 