import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
export function getGeminiModel(model = "gemini-1.5-pro") {
  return genAI.getGenerativeModel({ model });
}
