import { type Question } from "@shared/schema";

export type QuestionWithUserPrefs = Question & {
  favorite: boolean;
  completed: boolean;
  expanded: boolean;
};

export const categories = [
  "Fundamentals",
  "Architecture",
  "Database",
  "ORM",
  "Frontend",
  "Security",
  "Performance",
];

export const difficulties = [
  { value: "all", label: "All Difficulties" },
  { value: "beginner", label: "Beginner", badge: "Easy" },
  { value: "intermediate", label: "Intermediate", badge: "Medium" },
  { value: "advanced", label: "Advanced", badge: "Hard" },
];

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800";
    case "advanced":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "Easy";
    case "intermediate":
      return "Medium";
    case "advanced":
      return "Hard";
    default:
      return difficulty;
  }
};

export const formatAnswer = (answer: string) => {
  // Handle code blocks for highlighting with Prism.js
  let formattedAnswer = answer.replace(/```ruby([\s\S]*?)```/g, (match, code) => {
    return `<pre><code class="language-ruby">${code.trim()}</code></pre>`;
  });
  
  // Handle Markdown-style bold text
  formattedAnswer = formattedAnswer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle plain text line breaks
  formattedAnswer = formattedAnswer.replace(/\n\n/g, '<br><br>');
  
  return formattedAnswer;
};
