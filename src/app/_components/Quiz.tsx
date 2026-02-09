"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAnswer } from "../types/quizTypes";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type QuizResult = {
  score: number;
  answers: UserAnswer[];
};

type QuizProps = {
  questions: Question[];
  onFinish: (result: QuizResult) => void;
};

export default function Quiz({ questions, onFinish }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);

  const q = questions[current];

  const handleSelect = (index: number) => {
    const isCorrect = index === Number(q.answer);

    const updatedAnswers: UserAnswer[] = [
      ...answers,
      {
        question: q.question,
        userAnswer: q.options[index],
        correctAnswer: q.options[Number(q.answer)],
        isCorrect,
      },
    ];

    const newScore = isCorrect ? score + 1 : score;

    if (current + 1 === questions.length) {
      onFinish({
        score: newScore,
        answers: updatedAnswers,
      });
      return;
    }

    setAnswers(updatedAnswers);
    setScore(newScore);
    setCurrent((c) => c + 1);
  };

  return (
    <Card className="w-214 p-6 flex flex-col gap-4">
      <CardHeader>
        <CardTitle>
          Question {current + 1} / {questions.length}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="text-lg font-medium">{q.question}</div>

        {q.options.map((opt, i) => (
          <Button
            key={i}
            variant="outline"
            onClick={() => handleSelect(i)}
            className="justify-start"
          >
            {opt}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
