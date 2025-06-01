
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const SearchAndFilters = ({ searchTerm, onSearchChange, showFilters, onToggleFilters }: SearchAndFiltersProps) => {
  return (
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
  );
};

export default SearchAndFilters;
