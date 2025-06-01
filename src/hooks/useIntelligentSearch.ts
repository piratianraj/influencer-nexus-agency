
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
        console.error('Intelligent search error:', error);
        console.log('Falling back to basic text search');
        
        // Show a toast to inform user about the fallback
        toast({
          title: "AI Search Unavailable",
          description: "Using basic search instead. Try searching for creator names or niches.",
          variant: "default"
        });
        
        return {
          searchTerm: query,
          filters: {}
        };
      }

      console.log('Intelligent search result:', data);
      return data as SearchResult;
    } catch (error) {
      console.error('Unexpected search error:', error);
      
      // Show error toast
      toast({
        title: "Search Error",
        description: "Search temporarily unavailable. Using basic text search.",
        variant: "destructive"
      });
      
      // Always return a fallback
      return {
        searchTerm: query,
        filters: {}
      };
    } finally {
      setIsSearching(false);
    }
  };

  return { performIntelligentSearch, isSearching };
};
