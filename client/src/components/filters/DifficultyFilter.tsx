import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDifficultyColor } from "@/lib/questions";

interface DifficultyOption {
  value: string;
  label: string;
  badge?: string;
}

interface DifficultyFilterProps {
  difficulties: DifficultyOption[];
  activeDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
}

export function DifficultyFilter({ 
  difficulties, 
  activeDifficulty, 
  onDifficultyChange 
}: DifficultyFilterProps) {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Difficulty</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {difficulties.map((difficulty) => (
          <Button
            key={difficulty.value}
            variant={activeDifficulty === difficulty.value ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onDifficultyChange(difficulty.value)}
          >
            {difficulty.badge && (
              <Badge 
                variant="difficulty" 
                className={`mr-2 ${getDifficultyColor(difficulty.value === "all" ? "" : difficulty.value)}`}
              >
                {difficulty.badge}
              </Badge>
            )}
            {difficulty.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
