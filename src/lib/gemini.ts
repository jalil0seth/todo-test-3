import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDyW6Gz9hrjc6mbsAUpBhFhPMJd8jAVpzg");

const INITIAL_PROMPT = `You are a task management assistant. Explain how you can help with task management.

Format your response in markdown like this:

# Task Assistant Capabilities

## Organization:
- Task creation and management
- Priority setting
- Time management

## Features:
- Subtask support
- Comments and collaboration
- Tags and categories

Notes:
- All responses are markdown formatted
- Focus on practical solutions

Solutions:
- Clear organization system
- Efficient workflow management
- Productivity optimization`;

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // For the initial greeting, use the predefined format
    const finalPrompt = prompt === "What can you help me with as a task assistant?"
      ? INITIAL_PROMPT
      : prompt + "\n\nFormat the response in markdown with clear sections, bullet points, and solutions.";
    
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}