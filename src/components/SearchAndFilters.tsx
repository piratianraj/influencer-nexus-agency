
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Brain, Loader2 } from 'lucide-react';
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
    
    const result = await performIntelligentSearch(aiQuery);
    if (result) {
      onIntelligentSearch(result.searchTerm, result.filters);
      setAiQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAiSearch();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Regular Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search creators by name or niche..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={onToggleFilters}
          className="lg:w-auto w-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* AI-Powered Search */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex-1 relative">
          <Brain className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
          <Input
            type="text"
            placeholder="Try: 'fitness creators with high engagement' or 'verified tech YouTubers from US'"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 border-blue-300 focus:border-blue-500"
          />
        </div>
        <Button 
          onClick={handleAiSearch}
          disabled={isSearching || !aiQuery.trim()}
          className="lg:w-auto w-full bg-blue-600 hover:bg-blue-700"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Brain className="h-4 w-4 mr-2" />
          )}
          AI Search
        </Button>
      </div>
    </div>
  );
};

export default SearchAndFilters;
