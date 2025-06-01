
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Brain, Loader2 } from 'lucide-react';
import { useIntelligentSearch } from '@/hooks/useIntelligentSearch';
import { FilterOptions } from '@/components/AdvancedFilters';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onIntelligentSearch: (searchTerm: string, filters: Partial<FilterOptions>) => void;
}

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  showFilters, 
  onToggleFilters,
  onIntelligentSearch 
}: SearchAndFiltersProps) => {
  const [aiQuery, setAiQuery] = useState('');
  const { performIntelligentSearch, isSearching } = useIntelligentSearch();

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) return;
    
    console.log('Performing AI search with query:', aiQuery);
    const result = await performIntelligentSearch(aiQuery);
    if (result) {
      console.log('AI search result:', result);
      onIntelligentSearch(result.searchTerm, result.filters);
      // Also update the current search term for immediate filtering
      onSearchChange(result.searchTerm);
      setAiQuery('');
    }
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

  return (
    <div className="flex flex-col gap-4">
      {/* Single AI-Powered Search */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
        <div className="flex-1 relative">
          <Brain className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
          <Input
            type="text"
            placeholder="Try: 'fitness creators with high engagement' or 'verified tech YouTubers from US' or just 'fitness'"
            value={aiQuery}
            onChange={(e) => handleDirectSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 border-blue-300 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
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
            onClick={onToggleFilters}
            className="lg:w-auto w-full bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Filters'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
