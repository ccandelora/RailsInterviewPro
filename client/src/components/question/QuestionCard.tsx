import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Star, CheckCircle } from "lucide-react";
import { QuestionWithUserPrefs, getDifficultyColor, getDifficultyLabel, formatAnswer } from "@/lib/questions";
import Prism from "prismjs";

interface QuestionCardProps {
  question: QuestionWithUserPrefs;
  onToggleFavorite: (question: QuestionWithUserPrefs) => void;
  onToggleCompleted: (question: QuestionWithUserPrefs) => void;
  onToggleExpand: (question: QuestionWithUserPrefs) => void;
}

export function QuestionCard({ 
  question, 
  onToggleFavorite, 
  onToggleCompleted,
  onToggleExpand 
}: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(question.expanded);
  
  useEffect(() => {
    setIsExpanded(question.expanded);
  }, [question.expanded]);
  
  useEffect(() => {
    if (isExpanded) {
      // Need to wait for the DOM to update before highlighting
      setTimeout(() => {
        Prism.highlightAll();
      }, 0);
    }
  }, [isExpanded]);
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    onToggleExpand(question);
  };
  
  const difficultyColor = getDifficultyColor(question.difficulty);
  const difficultyLabel = getDifficultyLabel(question.difficulty);
  
  return (
    <Card className={`shadow-md overflow-hidden transition-all duration-200 ${question.favorite ? 'ring-2 ring-yellow-500' : ''}`}>
      <CardHeader className="p-4 sm:p-6 flex flex-row justify-between items-start space-y-0 pb-2">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <Badge variant="category" className="mr-1">{question.category}</Badge>
            <Badge variant="difficulty" className={difficultyColor}>{difficultyLabel}</Badge>
          </div>
          <h3 
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary"
            onClick={handleToggleExpand}
          >
            {question.question}
          </h3>
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleCompleted(question)}
            title={question.completed ? "Mark as not completed" : "Mark as completed"}
            className={`rounded-full ${question.completed ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}
          >
            <CheckCircle className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(question)}
            title={question.favorite ? "Remove from favorites" : "Add to favorites"}
            className={`rounded-full ${question.favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'}`}
          >
            <Star className={question.favorite ? "h-5 w-5 fill-yellow-500" : "h-5 w-5"} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleExpand}
            title={isExpanded ? "Collapse" : "Expand"}
            className="rounded-full text-gray-400 hover:text-gray-500"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-800">
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formatAnswer(question.answer) }} />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
