"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Quiz from "@/app/_components/Quiz";
import QuizAnswers from "@/app/_components/QuizAnswers";
import { AppSidebar } from "@/app/_features/app-sidebar";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type QuizResult = {
  score: number;
  answers: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
};

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Quiz data авах
  useEffect(() => {
    if (!id) return;

    fetch(`/api/historyCard/${id}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data.quizzes))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="mt-10 text-center">Loading quiz…</div>;
  }

  if (result) {
    return (
      <div className="flex justify-center mt-10">
        <QuizAnswers
          score={result.score}
          total={questions.length}
          answers={result.answers}
          onRestart={() => {
            setResult(null);
          }}
          onLeave={() => {
            router.push(`/article/${id}`);
          }}
          isSaving={false}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full grid md:grid-cols-[auto_1fr]">
      <div className="border-r">
        <AppSidebar />
      </div>
      <div>
        <div className="flex justify-center mt-10">
          <Quiz
            questions={questions}
            onFinish={(res) => {
              setResult(res);
            }}
          />
        </div>
      </div>
    </div>
  );
}
