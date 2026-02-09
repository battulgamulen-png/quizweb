"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StarIcon from "@/app/_icons/StarIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpenIcon, ChevronLeft } from "lucide-react";
import { AppSidebar } from "@/app/_features/app-sidebar";

type Quiz = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

type Article = {
  id: string;
  title: string;
  summary: string;
  content: string;
  quizzes: Quiz[];
};

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/historyCard/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setArticle)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  if (!article) {
    return <div className="mt-10 text-center">Article not found</div>;
  }

  return (
    <div className="h-full w-full grid md:grid-cols-[auto_1fr]">
      <div className="border-r">
        <AppSidebar />
      </div>
      <div className="flex justify-center mt-10">
        <div className="flex flex-col gap-6">
          <div className="w-12 h-10 border rounded-md border-[#E4E4E7] bg-white flex justify-center items-center">
            <button
              onClick={() => router.push("/")}
              className="flex justify-center items-center w-12 h-10"
            >
              <ChevronLeft />
            </button>
          </div>

          <Card className="w-155 p-7 flex flex-col gap-5">
            <CardHeader className="p-0">
              <div className="flex gap-2 items-center">
                <StarIcon />
                <CardTitle>Article Quiz Generator</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <BookOpenIcon className="w-4 h-4" />
                <CardDescription>Summarized content</CardDescription>
              </div>
              <div>
                <div className="text-xl font-bold">{article.title}</div>
                <p className="text-sm text-muted-foreground">
                  {article.summary}
                </p>
              </div>
            </CardContent>

            <CardContent className="p-0 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <BookOpenIcon className="w-4 h-4" />
                <CardDescription>Article content</CardDescription>
              </div>
              <div className="max-h-40 overflow-y-auto text-sm">
                {article.content}
              </div>
            </CardContent>

            <Button
              onClick={() => router.push(`/article/${article.id}/quiz`)}
              className="w-31 h-10"
            >
              Take Quiz
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
