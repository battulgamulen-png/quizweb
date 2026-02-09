"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RestartIcon from "../_icons/RestartIcon";
import BookMarkIcon from "../_icons/BookMarkIcon";
import XIconCircleRed from "../_icons/XIconCircleRed";
import CheckIconGreen from "../_icons/CheckIconGreen";

type Answer = {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

type Props = {
  score: number;
  total: number;
  answers: Answer[];
  onRestart: () => void;
  onLeave: () => void;
  isSaving: boolean;
};

export default function QuizAnswers({
  score,
  total,
  answers,
  onRestart,
  onLeave,
  isSaving,
}: Props) {
  return (
    <Card className="w-107 p-7 flex flex-col gap-6">
      <CardHeader className="p-0">
        <CardTitle className="text-[28px] font-semibold">
          Your score: {score}{" "}
          <span className="text-[16px] text-[#71717A]">/ {total}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-5">
        {answers.map((a, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="mt-1">
              {a.isCorrect ? <CheckIconGreen /> : <XIconCircleRed />}
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[15px] text-[#3F3F46]">
                {i + 1}. {a.question}
              </p>

              <p className="text-[14px] text-black">
                Your answer: <span className="font-medium">{a.userAnswer}</span>
              </p>

              {!a.isCorrect && (
                <p className="text-[14px] text-[#22C55E]">
                  Correct: {a.correctAnswer}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-0 flex gap-4">
        <button
          onClick={onRestart}
          className="flex-1 h-10 border rounded-md flex gap-2 items-center justify-center text-[14px]"
        >
          <RestartIcon />
          Restart quiz
        </button>

        <button
          onClick={onLeave}
          disabled={isSaving}
          className="flex-1 h-10 bg-black text-white rounded-md flex gap-2 items-center justify-center text-[14px]"
        >
          <BookMarkIcon />
          {isSaving ? "Saving..." : "Save & Leave"}
        </button>
      </CardFooter>
    </Card>
  );
}
