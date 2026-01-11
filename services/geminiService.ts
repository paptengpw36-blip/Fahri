
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize GoogleGenAI with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeNotes = async (notes: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ringkaskan notulen rapat berikut ini menjadi poin-poin penting yang padat dan profesional untuk standar pemerintahan Indonesia: \n\n${notes}`,
      config: {
        systemInstruction: "Anda adalah asisten administrasi pemerintahan profesional. Gunakan bahasa Indonesia yang formal (EYD) dan ringkas."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing notes:", error);
    return "Gagal merangkum notulen.";
  }
};

export const extractActionItems = async (notes: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ekstrak daftar tindakan (Action Items) dari notulen berikut ini. Sertakan nama penanggung jawab jika ada. \n\n${notes}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING, description: "Deskripsi tugas" },
              assignee: { type: Type.STRING, description: "Nama penanggung jawab" },
              deadline: { type: Type.STRING, description: "Tenggat waktu jika disebutkan" }
            },
            required: ["task"]
          }
        }
      }
    });
    // response.text is a property, not a method.
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error extracting action items:", error);
    return [];
  }
};
