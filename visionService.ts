
import { GoogleGenAI, Type } from "@google/genai";

export interface FrameAnalysis {
  ocrText: string;
  detectedObjects: Array<{ type: string; confidence: number }>;
  conformanceStatus: 'OPTIMAL' | 'ISSUE_DETECTED' | 'WARNING';
  details: string;
}

export const analyzeFrame = async (base64Image: string, promptContext: string): Promise<FrameAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          { text: `Role: Cricket DCA Visual Auditor. Your mission is to identify hardware health and billing relevance from equipment frames. Context: ${promptContext}. 
                   Tasks: 
                   1. Extract legible text (serial numbers, error codes, labels).
                   2. Identify robot/copier components or environmental obstacles.
                   3. Determine if the unit is functioning optimally or requires a service dispatch.
                   Return JSON format.` },
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ocrText: { type: Type.STRING },
            detectedObjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  confidence: { type: Type.NUMBER }
                }
              }
            },
            conformanceStatus: { type: Type.STRING, enum: ["OPTIMAL", "ISSUE_DETECTED", "WARNING"] },
            details: { type: Type.STRING }
          },
          required: ["ocrText", "detectedObjects", "conformanceStatus", "details"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as FrameAnalysis;
  } catch (error) {
    console.error("Frame Analysis Failed:", error);
    throw error;
  }
};
