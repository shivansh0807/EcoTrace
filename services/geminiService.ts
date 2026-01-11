
import { GoogleGenAI, Type } from "@google/genai";
import { DailySummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEcoInsights = async (summary: DailySummary) => {
  const prompt = "Analyze this digital carbon footprint. " +
    "Device: " + summary.profile.type + " on " + summary.profile.network + ". " +
    "Total Emissions: " + summary.totalEmissionsGrams + "g. " +
    "Provide 3 scientific tips to reduce this specific footprint. Output JSON.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              impactLevel: { type: Type.STRING },
              actionableTip: { type: Type.STRING }
            },
            required: ['title', 'description', 'impactLevel', 'actionableTip']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Insights Error:", error);
    return [];
  }
};

export const askCarbonQuestion = async (question: string) => {
  const prompt = "Sustainability Expert. Question: " + question + ". Be concise. Estimate CO2 impact in grams.";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text;
  } catch (e) {
    return "The Auditor is recalibrating. Please try again.";
  }
};
