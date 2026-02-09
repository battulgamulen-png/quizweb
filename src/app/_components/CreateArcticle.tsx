"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StarIcon from "../_icons/StarIcon";
import FileIcon from "../_icons/FileIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useClerk, useUser } from "@clerk/nextjs";
import { getSummary } from "../api/article/getSummary";

type CreateArticleProps = {
  title: string;
  content: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  onGenerated: (summary: string) => void;
};

export default function CreateArcticle({
  title,
  content,
  setTitle,
  setContent,
  onGenerated,
}: CreateArticleProps) {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [loading, setLoading] = React.useState(false);

  const handleGenerateSummary = async () => {
    if (!isLoaded) return;
    if (!user) {
      // backend call useeffect dotor
      openSignIn();
      return;
    }

    try {
      setLoading(true);
      const result = await getSummary(content);
      onGenerated(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-214 min-h-110.5 p-7 flex flex-col content-between">
      <CardHeader className="p-0">
        <div className="flex gap-2 items-center">
          <StarIcon />
          <CardTitle>Article Quiz Generator</CardTitle>
        </div>
        <CardDescription>
          Paste your article below to generate a summary and quiz question.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-0">
        <div className="grid gap-2">
          <div className="flex gap-1">
            <FileIcon />
            <Label>Article Title</Label>
          </div>
          <Input
            placeholder="Enter a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex gap-1">
            <FileIcon />
            <Label>Article Content</Label>
          </div>
          <Textarea
            placeholder="Paste content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-30 max-h-90"
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end p-0">
        <Button
          onClick={handleGenerateSummary}
          disabled={!title || !content || loading}
          className="w-40"
        >
          {loading ? "Generating..." : "Generate summary"}
        </Button>
      </CardFooter>
    </Card>
  );
}
