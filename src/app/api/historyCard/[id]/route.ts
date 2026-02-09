import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 🔥 params-г заавал await хийнэ
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      quizzes: {
        select: {
          id: true,
          question: true,
          options: true,
          answer: true,
        },
      },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}
