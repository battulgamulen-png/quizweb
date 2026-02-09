import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

type MCQ = {
  question: string;
  options: string[];
  answer: string;
};

async function generateQuestionsFromSummary(summary: string): Promise<MCQ[]> {
  const prompt = `
Generate 5 multiple choice questions based on the following article summary.

Return the response in this exact JSON format:
[
  {
    "question": "Question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "0"
  }
]

Rules:
- Return ONLY valid JSON
- answer must be the index (0-3) of the correct option
- Do NOT add explanations or extra text

Article summary:
${summary}
`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text =
    result.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";

  const questions: MCQ[] = JSON.parse(text);
  return questions;
}

export async function POST(req: Request) {
  try {
    const { articleId, summary } = await req.json();

    // Case 1: Generate quizzes from summary only (for new unsaved articles)
    if (summary && !articleId) {
      const generatedQuizzes = await generateQuestionsFromSummary(summary);

      if (!generatedQuizzes || generatedQuizzes.length === 0) {
        return NextResponse.json(
          { message: "Failed to generate quizzes" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        quizzes: generatedQuizzes,
        isExisting: false,
      });
    }

    // Case 2: Get or generate quizzes for an existing article
    if (!articleId) {
      return NextResponse.json(
        { message: "Article ID or summary is required" },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { quizzes: true },
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    // If quizzes already exist, return them
    if (article.quizzes && article.quizzes.length > 0) {
      return NextResponse.json({
        success: true,
        quizzes: article.quizzes,
        isExisting: true,
      });
    }

    // Generate new quizzes
    const generatedQuizzes = await generateQuestionsFromSummary(article.summary);

    if (!generatedQuizzes || generatedQuizzes.length === 0) {
      return NextResponse.json(
        { message: "Failed to generate quizzes" },
        { status: 500 }
      );
    }

    // Save quizzes to database
    await prisma.quiz.createMany({
      data: generatedQuizzes.map((q) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        articleId: articleId,
      })),
    });

    // Fetch the created quizzes to return them with IDs
    const quizzes = await prisma.quiz.findMany({
      where: { articleId: articleId },
    });

    return NextResponse.json({
      success: true,
      quizzes,
      isExisting: false,
    });
  } catch (error) {
    console.error("Generate quizzes error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
