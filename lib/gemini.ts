import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiModel: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

export function getGeminiModel() {
  if (geminiModel) return geminiModel;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 2048,
    },
  });

  return geminiModel;
}
