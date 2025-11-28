import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Slide, SlideType, PollOption } from "../types";

// Helper to safely get env var without crashing in browser if process is undefined
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error
  }
  return undefined;
};

// Mock fallback generator based on type
const generateMockSlide = (topic: string, type: SlideType): Slide => {
  const timestamp = Date.now();
  
  if (type === SlideType.WORD_CLOUD) {
    return {
      id: `gen_${timestamp}`,
      type: SlideType.WORD_CLOUD,
      question: `关于"${topic}"，用一个词形容你的看法？`,
      words: [
        { text: '示例词1', count: 1 }
      ]
    };
  }

  if (type === SlideType.QNA) {
    return {
      id: `gen_${timestamp}`,
      type: SlideType.QNA,
      question: `关于"${topic}"，你有什么疑问或见解？`,
      qnaEntries: []
    };
  }

  // Default to POLL
  return {
    id: `gen_${timestamp}`,
    type: SlideType.POLL,
    question: `AI 生成：关于"${topic}"的关键问题是？`,
    options: [
      { id: `opt_${timestamp}_1`, label: '选项 A：非常重要', count: 0 },
      { id: `opt_${timestamp}_2`, label: '选项 B：一般重要', count: 0 },
      { id: `opt_${timestamp}_3`, label: '选项 C：不相关', count: 0 },
    ]
  };
};

export const generateSlideContent = async (topic: string, type: SlideType = SlideType.POLL): Promise<Slide> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("No API Key found. Returning mock AI response.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
    return generateMockSlide(topic, type);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    let systemInstruction = "";
    let prompt = "";
    let responseSchema: Schema;

    // Define Schema and Prompts based on Type
    if (type === SlideType.POLL) {
        systemInstruction = "You are an expert educational content creator. Create a multiple-choice poll question.";
        prompt = `Create a poll question and 3-4 distinct options about the topic: "${topic}". Language must be Simplified Chinese.`;
        
        responseSchema = {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING, description: "The poll question." },
                options: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            label: { type: Type.STRING, description: "Option text." }
                        },
                        required: ["label"]
                    }
                }
            },
            required: ["question", "options"]
        };
    } else if (type === SlideType.WORD_CLOUD) {
        systemInstruction = "You are an expert presenter. Create a prompt for a Word Cloud activity.";
        prompt = `Create a concise, open-ended question that encourages one-word answers about the topic: "${topic}". Language must be Simplified Chinese.`;
        
        responseSchema = {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING, description: "The word cloud prompt question." }
            },
            required: ["question"]
        };
    } else {
        // Q&A
        systemInstruction = "You are an expert moderator. Create a discussion prompt.";
        prompt = `Create a broad, open-ended question to start a Q&A session or discussion about: "${topic}". Language must be Simplified Chinese.`;
        
        responseSchema = {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING, description: "The Q&A discussion starter." }
            },
            required: ["question"]
        };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    const data = JSON.parse(jsonText);
    const timestamp = Date.now();

    // Transform API response to App Domain Model
    if (type === SlideType.POLL) {
        return {
            id: `gen_${timestamp}`,
            type: SlideType.POLL,
            question: data.question,
            options: data.options.map((opt: any, idx: number) => ({
                id: `opt_${timestamp}_${idx}`,
                label: opt.label,
                count: 0
            }))
        };
    } else if (type === SlideType.WORD_CLOUD) {
        return {
            id: `gen_${timestamp}`,
            type: SlideType.WORD_CLOUD,
            question: data.question,
            words: []
        };
    } else {
        return {
            id: `gen_${timestamp}`,
            type: SlideType.QNA,
            question: data.question,
            qnaEntries: []
        };
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to mock if API fails
    return generateMockSlide(topic, type);
  }
};

export const generateSlidesFromPdf = async (pdfBase64: string): Promise<Slide[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("No API Key found. Returning mock PDF response.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    return [
      generateMockSlide("PDF分析1", SlideType.POLL),
      generateMockSlide("PDF分析2", SlideType.WORD_CLOUD)
    ];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timestamp = Date.now();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: pdfBase64,
            },
          },
          {
            text: `Analyze this document and create 3 distinct interactive presentation slides based on its key content. 
            Return a JSON array where each item represents a slide.
            
            Include:
            1. One Multiple Choice Question (POLL) to test understanding.
            2. One Word Cloud Prompt (WORD_CLOUD) to gather opinions/keywords.
            3. One Q&A Prompt (QNA) for open discussion.

            Language: Simplified Chinese.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["POLL", "WORD_CLOUD", "QNA"] },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                     label: { type: Type.STRING }
                  }
                },
                description: "Only for POLL type"
              }
            },
            required: ["type", "question"]
          }
        }
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    const data = JSON.parse(jsonText);

    return data.map((item: any, index: number) => {
        const slideId = `pdf_${timestamp}_${index}`;
        if (item.type === 'POLL') {
            return {
                id: slideId,
                type: SlideType.POLL,
                question: item.question,
                options: item.options?.map((opt: any, idx: number) => ({
                    id: `${slideId}_opt_${idx}`,
                    label: opt.label,
                    count: 0
                })) || []
            };
        } else if (item.type === 'WORD_CLOUD') {
            return {
                id: slideId,
                type: SlideType.WORD_CLOUD,
                question: item.question,
                words: []
            };
        } else {
             return {
                id: slideId,
                type: SlideType.QNA,
                question: item.question,
                qnaEntries: []
            };
        }
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return [];
  }
}