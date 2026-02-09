"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription as DialogDesc,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, BookOpenIcon } from "lucide-react";
import StarIcon from "../_icons/StarIcon";

type Props = {
  title: string;
  summary: string;
  content: string;
  onBack: () => void;
  onQuiz: () => Promise<void>;
};

export default function SummarizedContent({
  title,
  summary,
  content,
  onBack,
  onQuiz,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!summary) return null;

  const handleQuiz = async () => {
    setLoading(true);
    await onQuiz();
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        onClick={onBack}
        className="w-12 h-10 border rounded-md flex items-center justify-center cursor-pointer bg-white"
      >
        <ChevronLeft />
      </div>

      <Card className="w-214 min-h-89 p-7 flex flex-col gap-5">
        <CardHeader className="p-0">
          <div className="flex gap-2 items-center">
            <StarIcon />
            <CardTitle>{title}</CardTitle>
          </div>

          <div className="flex gap-2 items-center">
            <BookOpenIcon className="w-4 h-4" />
            <CardDescription>Summarized content</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Textarea value={summary} disabled className="min-h-40" />
        </CardContent>

        <CardFooter className="flex justify-between items-center p-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open full content</Button>
            </DialogTrigger>

            <DialogContent className="min-w-157">
              <DialogHeader>
                <DialogTitle className="text-[24px]">{title}</DialogTitle>
                <DialogDesc className="whitespace-pre-wrap overflow-y-auto max-h-160">
                  {content}
                </DialogDesc>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Button onClick={handleQuiz} disabled={loading}>
            {loading ? "Preparing quiz…" : "Take a quiz"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
