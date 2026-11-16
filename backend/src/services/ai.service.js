import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateHabitReport = async (habitStats) => {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Gemini request: attempt ${attempt}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: JSON.stringify(habitStats),
        config: {
          systemInstruction: `
            You are a supportive AI Habit Coach.

            Return ONLY valid JSON:
            {
              "report": "Short weekly summary",
              "strengths": ["strength 1"],
              "improvements": ["improvement 1"],
              "suggestions": ["suggestion 1"]
            }

            Be encouraging, practical, and use actual statistics.
          `,
          responseMimeType: "application/json",
        },
      });

      return JSON.parse(response.text);

    } catch (error) {
      console.error(`Gemini attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 2000)
      );
    }
  }
};