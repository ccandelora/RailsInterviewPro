import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { QuestionCard } from "@/components/question/QuestionCard";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { DifficultyFilter } from "@/components/filters/DifficultyFilter";
import { Pagination } from "@/components/pagination/Pagination";
import { Question } from "@shared/schema";
import { QuestionWithUserPrefs, categories, difficulties } from "@/lib/questions";
import { apiRequest } from "@/lib/queryClient";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 5;

export default function Home() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsWithPrefs, setQuestionsWithPrefs] = useState<QuestionWithUserPrefs[]>([]);
  
  // Fetch questions
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ["/api/questions"],
  });
  
  // When questions data is loaded, initialize questions with preferences
  useEffect(() => {
    if (questions) {
      // Initialize user preferences (in a real app, these would come from the server)
      const withPrefs: QuestionWithUserPrefs[] = (questions as Question[]).map(question => ({
        ...question,
        favorite: false,
        completed: false,
        expanded: false
      }));
      setQuestionsWithPrefs(withPrefs);
    }
  }, [questions]);
  
  // Filter questions
  const filteredQuestions = questionsWithPrefs.filter(question => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = activeCategory === "all" || 
      question.category === activeCategory;
    
    // Filter by difficulty
    const matchesDifficulty = activeDifficulty === "all" || 
      question.difficulty === activeDifficulty;
    
    // Filter by favorites
    const matchesFavorites = !showOnlyFavorites || question.favorite;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorites;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, activeDifficulty, showOnlyFavorites]);
  
  // Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  const handleDifficultyChange = (difficulty: string) => {
    setActiveDifficulty(difficulty);
  };
  
  const handleToggleFavorites = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
  };
  
  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveDifficulty("all");
    setShowOnlyFavorites(false);
    setCurrentPage(1);
  };
  
  const handleToggleFavorite = (question: QuestionWithUserPrefs) => {
    setQuestionsWithPrefs(prev => 
      prev.map(q => 
        q.id === question.id 
          ? { ...q, favorite: !q.favorite } 
          : q
      )
    );
    
    // In a real app, you would save this to the server
    // apiRequest("post", "/api/user-preferences", {
    //   userId: 1, // Current user
    //   questionId: question.id,
    //   isFavorite: !question.favorite,
    //   isCompleted: question.completed
    // });
  };
  
  const handleToggleCompleted = (question: QuestionWithUserPrefs) => {
    setQuestionsWithPrefs(prev => 
      prev.map(q => 
        q.id === question.id 
          ? { ...q, completed: !q.completed } 
          : q
      )
    );
    
    // In a real app, you would save this to the server
    // apiRequest("post", "/api/user-preferences", {
    //   userId: 1, // Current user
    //   questionId: question.id,
    //   isFavorite: question.favorite,
    //   isCompleted: !question.completed
    // });
  };
  
  const handleToggleExpand = (question: QuestionWithUserPrefs) => {
    setQuestionsWithPrefs(prev => 
      prev.map(q => 
        q.id === question.id 
          ? { ...q, expanded: !q.expanded } 
          : q
      )
    );
  };

  return (
    <MainLayout
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onResetFilters={handleResetFilters}
      onToggleFavorites={handleToggleFavorites}
      showOnlyFavorites={showOnlyFavorites}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar for filters */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
            
            <DifficultyFilter
              difficulties={difficulties}
              activeDifficulty={activeDifficulty}
              onDifficultyChange={handleDifficultyChange}
            />
          </div>
        </aside>
        
        {/* Main content area */}
        <div className="flex-1">
          {/* Featured image banner */}
          <div className="mb-6 rounded-xl overflow-hidden shadow-md">
            <div className="h-48 bg-gradient-to-r from-cyan-500 to-blue-500 relative">
              <img 
                src="https://images.unsplash.com/photo-1573496527892-904f897eb744?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300&q=80" 
                alt="Ruby on Rails programming interview preparation" 
                className="w-full h-full object-cover mix-blend-overlay opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Ruby on Rails Interview Questions
                </h1>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4">
              <p className="text-gray-600 dark:text-gray-300">
                Prepare for your next Rails interview with our comprehensive question database
              </p>
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2.5"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading questions...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <Card className="shadow-md">
              <CardContent className="p-6 flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Error loading questions</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  There was a problem loading the interview questions. Please try again later.
                </p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </CardContent>
            </Card>
          )}
          
          {/* No results message */}
          {!isLoading && !error && filteredQuestions.length === 0 && (
            <Card className="shadow-md">
              <CardContent className="p-6 flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No questions found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button onClick={handleResetFilters}>Reset All Filters</Button>
              </CardContent>
            </Card>
          )}
          
          {/* Questions list */}
          {!isLoading && !error && filteredQuestions.length > 0 && (
            <div className="space-y-6">
              {paginatedQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompleted={handleToggleCompleted}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
              
              {/* Pagination */}
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredQuestions.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
