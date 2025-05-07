import React, { useState } from "react";
import { Link } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Star, RotateCcw, Menu, X } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  onToggleFavorites: () => void;
  showOnlyFavorites: boolean;
}

export function MainLayout({
  children,
  searchQuery,
  onSearchChange,
  onResetFilters,
  onToggleFavorites,
  showOnlyFavorites,
}: MainLayoutProps) {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary w-8 h-8 mr-2"
                >
                  <path d="M6 6.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z" />
                  <path d="M14 6.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z" />
                  <path d="M6 14.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z" />
                  <path d="M14 14.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z" />
                </svg>
                <span className="text-xl font-bold text-gray-900 dark:text-white">RailsPrep</span>
              </Link>
            </div>
            
            {/* Search bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <SearchBar 
                value={searchQuery} 
                onChange={onSearchChange} 
                placeholder="Search questions..." 
              />
            </div>
            
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-2">
              <Button
                variant={showOnlyFavorites ? "secondary" : "ghost"}
                size="sm"
                onClick={onToggleFavorites}
                className="flex items-center gap-1"
              >
                <Star className={`h-4 w-4 ${showOnlyFavorites ? "text-yellow-500 fill-yellow-500" : ""}`} />
                <span>Favorites</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Search bar - Mobile */}
              <div className="px-2 my-2">
                <SearchBar 
                  value={searchQuery} 
                  onChange={onSearchChange} 
                  placeholder="Search questions..." 
                />
              </div>
              
              {/* Mobile navigation */}
              <Button
                variant={showOnlyFavorites ? "secondary" : "ghost"}
                onClick={onToggleFavorites}
                className="w-full justify-start"
              >
                <Star className={`h-4 w-4 mr-2 ${showOnlyFavorites ? "text-yellow-500 fill-yellow-500" : ""}`} />
                <span>Favorites</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={onResetFilters}
                className="w-full justify-start"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                <span>Reset Filters</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="w-full justify-start"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    <span>Dark Mode</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
