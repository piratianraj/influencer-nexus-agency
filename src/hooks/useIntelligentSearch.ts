
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FilterOptions } from '@/components/AdvancedFilters';

interface SearchResult {
  searchTerm: string;
  filters: Partial<FilterOptions>;
}

export const useIntelligentSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const performIntelligentSearch = async (query: string): Promise<SearchResult | null> => {
    if (!query.trim()) {
      return null;
    }

    setIsSearching(true);
    try {
      console.log('Performing intelligent search for:', query);
      
      const { data, error } = await supabase.functions.invoke('intelligent-search', {
        body: { query }
      });

      if (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to process your search query. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      console.log('Search result:', data);
      return data as SearchResult;
    } catch (error) {
      console.error('Unexpected search error:', error);
      toast({
        title: "Search Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  return { performIntelligentSearch, isSearching };
};
