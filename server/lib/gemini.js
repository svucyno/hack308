import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function callGemini(systemPrompt, userMessage, maxTokens = 3000) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const fullPrompt = `${systemPrompt}\n\n---\n\nUser Input:\n${userMessage}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.3,
      },
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw error;
  }
}

export function parseGeminiJSON(text) {
  try {
    // Strip markdown fences that Gemini often adds
    let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    cleaned = cleaned.trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON Parse Error:', e.message);
    console.error('Raw text:', text);
    throw new Error('Failed to parse Gemini response as JSON');
  }
}
