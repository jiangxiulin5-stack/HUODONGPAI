import { GoogleGenAI, Type } from "@google/genai";
import { Slide, SlideType } from "../types";

// This service mocks the creation of a slide if no API key is present,
// or uses Gemini if the key is available.

const MOCK_GENERATED_SLIDE: Slide = {
  id: `gen_${Date.now()}`,
  type: SlideType.POLL,
  question: "AI 生成：人工智能对未来教育最大的影响是？",
  options: [
    { id: 'go1', label: '个性化学习路径', count: 0 },
    { id: 'go2', label: '教师角色的转变', count: 0 },
    { id: 'go3', label: '自动批改与评估', count: 0 },
    { id: 'go4', label: '全球知识的平权', count: 0 },
  ]
};

export const generateSlideContent = async (topic: string): Promise<Slide> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API Key found. Returning mock AI response.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_GENERATED_SLIDE;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Schema for structured output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: "The poll question based on the topic." },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING, description: "A poll option text." }
            },
            required: ["label"]
          },
          description: "List of 3-4 options for the poll."
        }
      },
      required: ["question", "options"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a poll question and options about this topic: "${topic}". Language must be Simplified Chinese.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    const data = JSON.parse(jsonText);

    return {
      id: `gen_${Date.now()}`,
      type: SlideType.POLL,
      question: data.question,
      options: data.options.map((opt: any, idx: number) => ({
        id: `opt_${Date.now()}_${idx}`,
        label: opt.label,
        count: 0
      }))
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return MOCK_GENERATED_SLIDE;
  }
};