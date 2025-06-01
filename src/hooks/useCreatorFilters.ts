
import { FilterOptions } from '@/components/AdvancedFilters';

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
  const applyFilters = (creators: Creator[], filters: FilterOptions) => {
    return creators.filter(creator => {
      // Platform filter
      if (filters.platform.length > 0 && !filters.platform.some(p => creator.platforms.includes(p))) {
        return false;
      }
      
      // Followers filter
      if (filters.followers.min > 0 && creator.followers < filters.followers.min) return false;
      if (filters.followers.max > 0 && creator.followers > filters.followers.max) return false;
      
      // Engagement filter
      if (filters.engagement.min > 0 && creator.engagement < filters.engagement.min) return false;
      if (filters.engagement.max > 0 && creator.engagement > filters.engagement.max) return false;
      
      // Niche filter
      if (filters.niche.length > 0 && !filters.niche.some(n => creator.niche.includes(n))) {
        return false;
      }
      
      // Location filter
      if (filters.location.length > 0 && !filters.location.includes(creator.location)) {
        return false;
      }
      
      // Price filter
      if (filters.priceRange.min > 0 && creator.rates.post < filters.priceRange.min) return false;
      if (filters.priceRange.max > 0 && creator.rates.post > filters.priceRange.max) return false;
      
      // Verified filter
      if (filters.verified !== null && creator.verified !== filters.verified) return false;
      
      return true;
    });
  };

  const applySearch = (creators: Creator[], searchTerm: string) => {
    return creators.filter(creator =>
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.niche.some(n => n.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return { applyFilters, applySearch };
};
