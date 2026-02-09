"use client";

export default function EditorPage() {
  const handleSaveAndLeave = async () => {
    await fetch("/api/save-and-leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "My article",
        content: "Full content...",
        summary: "Short summary",
        quizzes: [
          {
            question: "What is Prisma?",
            options: ["ORM", "DB", "Framework"],
            answer: "ORM",
          },
        ],
      }),
    });
  };

  return <button onClick={handleSaveAndLeave}>Save & Leave</button>;
}
