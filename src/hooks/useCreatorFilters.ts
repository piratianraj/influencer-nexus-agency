
import { FilterOptions } from '@/components/AdvancedFilters';
import { useSearchFeedback } from '@/hooks/useSearchFeedback';
import { useIntelligentSearch } from '@/hooks/useIntelligentSearch';

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location: string;
  niche: string[];
  platforms: string[];
  followers: number;
  engagement: number;
  rates: {
    post: number;
    story: number;
  };
  verified: boolean;
}

export const useCreatorFilters = () => {
  const { recordFeedback } = useSearchFeedback();
  const { getCurrentSessionId } = useIntelligentSearch();

  const applyFilters = (creators: Creator[], filters: FilterOptions) => {
    console.log('Applying filters:', filters, 'to creators:', creators.length);
    
    return creators.filter(creator => {
      // Platform filter
      if (filters.platform && filters.platform.length > 0 && !filters.platform.some(p => creator.platforms.includes(p))) {
        return false;
      }
      
      // Followers filter
      if (filters.followers) {
        if (filters.followers.min > 0 && creator.followers < filters.followers.min) return false;
        if (filters.followers.max > 0 && creator.followers > filters.followers.max) return false;
      }
      
      // Engagement filter
      if (filters.engagement) {
        if (filters.engagement.min > 0 && creator.engagement < filters.engagement.min) return false;
        if (filters.engagement.max > 0 && creator.engagement > filters.engagement.max) return false;
      }
      
      // Niche filter
      if (filters.niche && filters.niche.length > 0 && !filters.niche.some(n => 
        creator.niche.some(creatorNiche => 
          creatorNiche.toLowerCase().includes(n.toLowerCase()) || 
          n.toLowerCase().includes(creatorNiche.toLowerCase())
        )
      )) {
        return false;
      }
      
      // Location filter (more flexible matching)
      if (filters.location && filters.location.length > 0) {
        const locationMatch = filters.location.some(filterLocation =>
          creator.location.toLowerCase().includes(filterLocation.toLowerCase()) ||
          filterLocation.toLowerCase().includes(creator.location.toLowerCase())
        );
        if (!locationMatch) return false;
      }
      
      // Price filter
      if (filters.priceRange) {
        if (filters.priceRange.min > 0 && creator.rates.post < filters.priceRange.min) return false;
        if (filters.priceRange.max > 0 && creator.rates.post > filters.priceRange.max) return false;
      }
      
      // Verified filter
      if (filters.verified !== null && creator.verified !== filters.verified) return false;
      
      return true;
    });
  };

  const applySearch = (creators: Creator[], searchTerm: string) => {
    if (!searchTerm.trim()) {
      console.log('No search term, returning all creators:', creators.length);
      return creators;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = creators.filter(creator => {
      // Comprehensive search across all relevant fields
      const nameMatch = creator.name.toLowerCase().includes(searchLower);
      const usernameMatch = creator.username.toLowerCase().includes(searchLower);
      const locationMatch = creator.location.toLowerCase().includes(searchLower);
      
      // Enhanced niche matching with partial word support
      const nicheMatch = creator.niche.some(n => 
        n.toLowerCase().includes(searchLower) || 
        searchLower.includes(n.toLowerCase())
      );
      
      // Platform matching
      const platformMatch = creator.platforms.some(p => 
        p.toLowerCase().includes(searchLower) || 
        searchLower.includes(p.toLowerCase())
      );
      
      // Multi-word search support
      const searchWords = searchLower.split(' ').filter(word => word.length > 2);
      const multiWordMatch = searchWords.length > 1 ? searchWords.every(word =>
        creator.name.toLowerCase().includes(word) ||
        creator.niche.some(n => n.toLowerCase().includes(word)) ||
        creator.location.toLowerCase().includes(word) ||
        creator.platforms.some(p => p.toLowerCase().includes(word))
      ) : false;
      
      return nameMatch || nicheMatch || usernameMatch || locationMatch || platformMatch || multiWordMatch;
    });
    
    console.log('Search term:', searchTerm, 'filtered creators:', filtered.length, 'from total:', creators.length);
    return filtered;
  };

  // Function to record when user clicks on a creator
  const recordCreatorClick = (creatorId: string) => {
    const sessionId = getCurrentSessionId();
    if (sessionId) {
      recordFeedback({
        sessionId,
        action: 'click',
        creatorId
      });
    }
  };

  // Function to record when user initiates outreach
  const recordCreatorOutreach = (creatorId: string) => {
    const sessionId = getCurrentSessionId();
    if (sessionId) {
      recordFeedback({
        sessionId,
        action: 'outreach',
        creatorId
      });
    }
  };

  return { 
    applyFilters, 
    applySearch,
    recordCreatorClick,
    recordCreatorOutreach
  };
};
