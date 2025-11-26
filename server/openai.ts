import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// This is using OpenAI's API, which points to OpenAI's API servers and requires your own API key.
let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required for AI features");
    }
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

export async function analyzeCropImage(base64Image: string, cropName: string, symptoms: string[]): Promise<{
  diseases: Array<{ name: string; confidence: number; riskLevel: string }>;
  analysis: string;
  recommendations: string;
}> {
  try {
    const symptomsText = symptoms.length > 0 ? `Observed symptoms: ${symptoms.join(", ")}` : "";
    
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an expert agricultural pathologist specializing in crop disease diagnosis. Analyze images and provide detailed, actionable recommendations following FAO and ICAR guidelines. Always respond in JSON format with: { "diseases": [{"name": string, "confidence": number (0-1), "riskLevel": "high"|"medium"|"low"}], "analysis": string, "recommendations": string }`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this ${cropName} plant image for diseases or pest damage. ${symptomsText}. Provide the top 3 most likely issues with confidence scores, risk assessment, detailed analysis, and organic/chemical treatment recommendations.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      diseases: result.diseases || [],
      analysis: result.analysis || "Unable to analyze image",
      recommendations: result.recommendations || "Consult with local agricultural expert",
    };
  } catch (error) {
    console.error("OpenAI image analysis error:", error);
    throw new Error("Failed to analyze crop image");
  }
}

export async function getChatResponse(messages: Array<{ role: string; content: string }>, userContext?: any): Promise<string> {
  try {
    const systemMessage = `You are an AI agricultural assistant helping farmers with crop disease diagnosis, pest management, and farming practices. Provide practical, safe, and evidence-based advice following FAO-ICAR guidelines. Be concise and clear. If the user asks about diseases, provide organic treatment options first.`;
    
    const contextMessage = userContext ? `User context: ${JSON.stringify(userContext)}` : "";

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemMessage + (contextMessage ? "\n" + contextMessage : "") } as const,
        ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      max_completion_tokens: 1024,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI chat error:", error);
    throw new Error("Failed to get chat response");
  }
}

export { getOpenAI };
