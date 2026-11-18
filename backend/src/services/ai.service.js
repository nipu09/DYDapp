import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateHabitReport = async (habitData) => {
  try {
    console.log("Calling Groq AI...");

    const completion = await groq.chat.completions.create({
     model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `
            You are Aadat AI, a friendly and intelligent habit coach.

            Analyze the user's weekly habit performance.

            Provide:
            1. A short weekly report.
            2. Strengths.
            3. Areas for improvement.
            4. Actionable suggestions.

            Be encouraging, practical and concise.

            Return ONLY valid JSON in this exact format:

            {
              "report": "string",
              "strengths": ["string"],
              "improvements": ["string"],
              "suggestions": ["string"]
            }
          `,
        },
        {
          role: "user",
          content: JSON.stringify(habitData),
        },
      ],

      temperature: 0.7,
      max_completion_tokens: 1000,

      response_format: {
        type: "json_object",
      },
    });

    const content = completion.choices[0].message.content;

    return JSON.parse(content);

  } catch (error) {
    console.error("Groq AI Error:", error.message);
    throw error;
  }
};