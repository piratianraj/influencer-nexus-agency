
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Brain, Loader2, Lightbulb } from 'lucide-react';
import { useIntelligentSearch } from '@/hooks/useIntelligentSearch';
import { useSearchFeedback } from '@/hooks/useSearchFeedback';
import { FilterOptions } from '@/components/AdvancedFilters';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onIntelligentSearch: (searchTerm: string, filters: Partial<FilterOptions>) => void;
  resultsCount?: number;
}

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  showFilters, 
  onToggleFilters,
  onIntelligentSearch,
  resultsCount = 0
}: SearchAndFiltersProps) => {
  const [aiQuery, setAiQuery] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  
  const { performIntelligentSearch, isSearching, getCurrentSessionId } = useIntelligentSearch();
  const { recordFeedback, learnFromSuccess } = useSearchFeedback();
  
  const lastSearchRef = useRef<{ query: string; filters: any; sessionId?: string }>({ query: '', filters: {} });

  const exampleQueries = [
    "fitness creators with high engagement",
    "tech YouTubers from US with 100k+ followers",
    "fashion influencers in India",
    "active creators with over 50k followers",
    "food bloggers with low engagement rate",
    "verified travel creators from Europe"
  ];

  // Record feedback when results are viewed
  useEffect(() => {
    const sessionId = getCurrentSessionId();
    const lastSearch = lastSearchRef.current;
    
    if (sessionId && resultsCount > 0 && lastSearch.query) {
      const sessionDuration = searchStartTime ? Math.floor((Date.now() - searchStartTime) / 1000) : undefined;
      
      recordFeedback({
        sessionId,
        action: 'view_results',
        resultsCount,
        sessionDuration
      });

      // If user got good results and didn't need to refine, this is a success
      if (resultsCount > 3) {
        learnFromSuccess(sessionId, lastSearch.query, lastSearch.filters);
      }
    }
  }, [resultsCount, getCurrentSessionId, recordFeedback, learnFromSuccess, searchStartTime]);

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) return;
    
    setSearchStartTime(Date.now());
    console.log('Performing AI search with query:', aiQuery);
    
    const result = await performIntelligentSearch(aiQuery);
    if (result) {
      console.log('AI search result:', result);
      
      // Store last search for feedback tracking
      lastSearchRef.current = {
        query: aiQuery,
        filters: result.filters,
        sessionId: result.sessionId
      };
      
      onIntelligentSearch(result.searchTerm, result.filters);
      onSearchChange(result.searchTerm);
      setAiQuery('');
      setShowExamples(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setAiQuery(example);
    setShowExamples(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAiSearch();
    }
  };

  const handleDirectSearch = (value: string) => {
    setAiQuery(value);
    onSearchChange(value);
  };

  const handleFilterToggle = () => {
    const sessionId = getCurrentSessionId();
    if (sessionId) {
      recordFeedback({
        sessionId,
        action: 'refine_search'
      });
    }
    onToggleFilters();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* AI-Powered Natural Language Search */}
      <div className="flex flex-col gap-4 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-blue-200/50">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">AI-Powered Search (Learning Enabled)</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
            className="ml-auto text-blue-600 hover:text-blue-800"
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            Examples
          </Button>
        </div>
        
        {showExamples && (
          <div className="bg-white/80 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-3">Try these example searches:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-left text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Brain className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
            <Input
              type="text"
              placeholder="The AI learns from each search to get better! Try: 'fitness creators with high engagement'"
              value={aiQuery}
              onChange={(e) => handleDirectSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 border-blue-300 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-base"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleAiSearch}
              disabled={isSearching || !aiQuery.trim()}
              className="lg:w-auto w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              AI Search
            </Button>
            <Button 
              variant="outline" 
              onClick={handleFilterToggle}
              className="lg:w-auto w-full bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Filters'}
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-600">
          <p><strong>🧠 Smart Learning:</strong> This AI learns from every search and interaction to provide better results over time!</p>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
