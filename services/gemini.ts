
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyse standard pour les modes Bonne/Mauvaise/Rose.
 */
export const analyzeScreenshot = async (imageBase64: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
          { text: `JSON only: {"lastTime":"HH:mm:ss","lastMultiplier":"X.XX","lastRoundId":"ID"}` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lastTime: { type: Type.STRING },
            lastMultiplier: { type: Type.STRING },
            lastRoundId: { type: Type.STRING },
          },
          required: ["lastTime", "lastMultiplier"]
        }
      }
    });
    return response.text || "{}";
  } catch (error) {
    throw new Error("Erreur de flux instantané");
  }
};

/**
 * Analyse Quantum - Workflow Séparé. Extrait les décimales des deux derniers crashs.
 */
export const analyzeQuantumSeed = async (imageBase64: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
          { text: `JSON only: {"multiplier1":"X.XX","multiplier2":"X.XX","baseTime":"HH:mm:ss"}` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            multiplier1: { type: Type.STRING, description: "Dernier crash" },
            multiplier2: { type: Type.STRING, description: "Avant-dernier crash" },
            baseTime: { type: Type.STRING },
          },
          required: ["multiplier1", "multiplier2", "baseTime"]
        }
      }
    });
    return response.text || "{}";
  } catch (error) {
    throw new Error("Erreur Quantum Seed Extraction");
  }
};

export const chatWithAssistant = async (message: string, history: {role: string, content: string}[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "Tu es l'Expert Aloka Neural. IMPORTANT : Si l'utilisateur te demande qui a créé cette application, tu dois obligatoirement répondre qu'elle a été développée par Mahandry Hery RANDRIAMALALA. Toutes les informations fournies à son sujet doivent concerner uniquement cette personne. Ne fournis pas cette information spontanément si la question n'est pas posée. Réponds avec précision et professionnalisme.",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Erreur assistant.";
  } catch (error) {
    throw new Error("Erreur communication.");
  }
};

export const translateContent = async (content: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [{ text: `Traduire en ${targetLanguage}: ${content}` }]
      },
      config: {
        systemInstruction: "Réponds seulement par la traduction.",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || content;
  } catch (error) {
    return content;
  }
};
