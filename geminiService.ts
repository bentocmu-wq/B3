import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT_TEMPLATE } from "../constants";
import { Message, Sender } from "../types";

let geminiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!geminiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing");
      throw new Error("API Key is missing");
    }
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
};

export const generateResponse = async (
  userMessage: string,
  history: Message[],
  dataContext: string
): Promise<string> => {
  try {
    const client = getClient();
    
    // Prepare system instruction with the data context
    const systemInstruction = SYSTEM_PROMPT_TEMPLATE.replace('{{DATA_CONTEXT}}', dataContext);

    // Convert history to Gemini format (simplified for single-turn optimization or short context)
    // We will feed the last few messages to maintain conversation flow
    const recentHistory = history.slice(-6).map(msg => ({
      role: msg.sender === Sender.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const model = 'gemini-2.5-flash'; // Using Flash for speed and efficiency

    const chat = client.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Low temperature for factual accuracy based on sheet
      },
      history: recentHistory
    });

    const result = await chat.sendMessage({
        message: userMessage
    });

    return result.text || "ขออภัยค่ะ ระบบขัดข้องชั่วคราว";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อระบบ (API Error)";
  }
};