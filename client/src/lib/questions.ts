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
  "Modern Rails",
  "Testing",
  "API",
  "Routing",
  "Deployment"
];

export const difficulties = [
  { value: "all", label: "All Difficulties" },
  { value: "easy", label: "Beginner", badge: "Easy" },
  { value: "medium", label: "Intermediate", badge: "Medium" },
  { value: "hard", label: "Advanced", badge: "Hard" },
];

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "Easy";
    case "medium":
      return "Medium";
    case "hard":
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
