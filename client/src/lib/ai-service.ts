import { apiRequest } from "./queryClient";

export interface WebsiteGenerationPrompt {
  prompt: string;
}

export interface WebsiteGenerationResult {
  html: string;
  css: string;
  js: string;
  preview: string;
}

export async function generateWebsite(prompt: WebsiteGenerationPrompt): Promise<WebsiteGenerationResult> {
  const response = await apiRequest("POST", "/api/ai/generate-website", prompt);
  return await response.json();
}

export async function analyzeCanvaDesign(imageData: string): Promise<WebsiteGenerationResult> {
  const response = await apiRequest("POST", "/api/ai/analyze-canva", { imageData });
  return await response.json();
}
