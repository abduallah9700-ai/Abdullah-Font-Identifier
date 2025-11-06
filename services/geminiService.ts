import { GoogleGenAI, Type } from "@google/genai";
import type { FontAnalysisResponse } from '../types';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        "primary_font_name": {
            type: Type.STRING,
            description: "The closest identified font name, e.g., 'Helvetica Neue' or 'Georgia'."
        },
        "confidence_level": {
            type: Type.NUMBER,
            description: "A confidence score for the primary match, between 0.0 (low) and 1.0 (high)."
        },
        "matches": {
            type: Type.ARRAY,
            description: "A list of the top 3 closest alternative font matches.",
            items: {
                type: Type.OBJECT,
                properties: {
                    "name": {type: Type.STRING},
                    "description": {type: Type.STRING, description: "Visual classification, e.g., 'Geometric Sans-serif' or 'Modern Serif'"}
                },
                required: ["name", "description"]
            }
        }
    },
    required: ["primary_font_name", "confidence_level", "matches"]
};

const SYSTEM_INSTRUCTION = "Act as a world-class typographic analyst and font identification engine. Your sole task is to meticulously analyze the provided image, which contains text, and identify the primary typeface used. If an exact match is uncertain, provide the top 3 closest known commercial or popular open-source font matches based on visual characteristics. You MUST adhere strictly to the JSON schema provided in the generation configuration and MUST NOT include any conversational text, markdown, or explanation outside of the JSON object.";
const USER_QUERY = "Analyze the attached image and identify the font used. Provide the primary identification and the top 3 closest matches, along with a confidence level for your primary identification.";
const MAX_RETRIES = 3;

export const identifyFont = async (base64Image: string, mimeType: string): Promise<FontAnalysisResponse> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { text: USER_QUERY },
                        {
                            inlineData: {
                                mimeType,
                                data: base64Image,
                            },
                        },
                    ],
                },
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });

            const jsonText = response.text.trim();
            const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
            const parsedData = JSON.parse(cleanedJsonText);
            return parsedData as FontAnalysisResponse;

        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt === MAX_RETRIES - 1) {
                throw new Error("Failed to identify font after multiple attempts.");
            }
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("An unexpected error occurred in the retry loop.");
};
