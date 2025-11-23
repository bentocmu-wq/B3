import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT_TEMPLATE } from "./constants";
import { Message, Sender } from "./types";

let geminiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!geminiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      console.error("API_KEY is missing in process.env");
      throw new Error("MISSING_API_KEY");
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
    
    const systemInstruction = SYSTEM_PROMPT_TEMPLATE.replace('{{DATA_CONTEXT}}', dataContext);

    const recentHistory = history.slice(-6).map(msg => ({
      role: msg.sender === Sender.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const model = 'gemini-2.5-flash';

    const chat = client.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      },
      history: recentHistory
    });

    const result = await chat.sendMessage({
        message: userMessage
    });

    return result.text || "ขออภัยค่ะ ระบบขัดข้องชั่วคราว (No Response)";

  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    const errStr = error.toString();
    const errMsg = error.message || "";

    // Specific Error Handling for User Feedback
    if (errMsg === "MISSING_API_KEY") {
        return "⚠️ ขออภัยค่ะ ระบบยังไม่พบ API Key\n(กรุณาไปที่ Vercel > Settings > Environment Variables > เพิ่ม API_KEY)";
    }

    if (errStr.includes("400") || errStr.includes("INVALID_ARGUMENT")) {
        return "❌ API Key ไม่ถูกต้อง (Error 400)\n(กรุณาตรวจสอบว่า Copy รหัสมาครบไหม มีเว้นวรรคเกินมาหรือไม่)";
    }

    if (errStr.includes("403") || errStr.includes("PERMISSION_DENIED")) {
        return "🚫 สิทธิ์การเข้าถึงถูกปฏิเสธ (Error 403)\n(อาจเกิดจาก Key ผิดประเภท หรือยังไม่ได้เปิดใช้บริการใน Google Cloud)";
    }
    
    if (errStr.includes("429")) {
        return "⏳ ระบบกำลังทำงานหนัก (Rate Limit)\n(กรุณารอสักครู่แล้วถามใหม่นะคะ)";
    }

    return `⚠️ เกิดข้อผิดพลาดทางเทคนิค:\n"${errMsg || errStr}"\n(โปรดแจ้งปัญหานี้ให้ผู้ดูแลระบบทราบ)`;
  }
};