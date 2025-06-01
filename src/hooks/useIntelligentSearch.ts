
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { FilterOptions } from '@/components/AdvancedFilters';

interface SearchResult {
  searchTerm: string;
  filters: Partial<FilterOptions>;
  sessionId?: string;
}

export const useIntelligentSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, guestId } = useAuth();

  const performIntelligentSearch = async (query: string): Promise<SearchResult | null> => {
    if (!query.trim()) {
      return null;
    }

    setIsSearching(true);
    try {
      console.log('Performing RAG intelligent search for:', query);
      console.log('User ID:', user?.id, 'Guest ID:', guestId);
      
      // Call the new RAG-enabled search function
      const { data, error } = await supabase.functions.invoke('rag-intelligent-search', {
        body: { 
          query,
          sessionId: currentSessionId,
          userId: user?.id || null,
          guestUserId: guestId || null
        }
      });

      if (error) {
        console.error('RAG search error:', error);
        console.log('Falling back to basic search');
        
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

      console.log('RAG search result:', data);
      
      // Store session ID for feedback tracking
      if (data.sessionId) {
        setCurrentSessionId(data.sessionId);
      }
      
      return data as SearchResult;
    } catch (error) {
      console.error('Unexpected search error:', error);
      
      toast({
        title: "Search Error",
        description: "Search temporarily unavailable. Using basic text search.",
        variant: "destructive"
      });
      
      return {
        searchTerm: query,
        filters: {}
      };
    } finally {
      setIsSearching(false);
    }
  };

  const getCurrentSessionId = () => currentSessionId;

  const clearSession = () => {
    setCurrentSessionId(null);
  };

  return { 
    performIntelligentSearch, 
    isSearching,
    getCurrentSessionId,
    clearSession
  };
};
