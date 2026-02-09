"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const getSummary = async (content: string): Promise<string> => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please provide a concise summary of the following article:\n\n${content}`,
    });

    const summary =
      result.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join("") ?? "";

    return summary;
  } catch (e) {
    console.error(e);
    return "";
  }
};
