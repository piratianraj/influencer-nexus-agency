
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { FilterOptions } from '@/components/AdvancedFilters';

interface ActiveFiltersProps {
  filters: FilterOptions;
  onUpdateFilters: (newFilters: FilterOptions) => void;
}

const ActiveFilters = ({ filters, onUpdateFilters }: ActiveFiltersProps) => {
  const hasActiveFilters = filters.platform.length > 0 || filters.niche.length > 0 || filters.location.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {filters.platform.map(platform => (
        <Badge key={platform} variant="secondary" className="flex items-center gap-1">
          {platform}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onUpdateFilters({
              ...filters, 
              platform: filters.platform.filter(p => p !== platform)
            })}
          />
        </Badge>
      ))}
      {filters.niche.map(niche => (
        <Badge key={niche} variant="secondary" className="flex items-center gap-1">
          {niche}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onUpdateFilters({
              ...filters, 
              niche: filters.niche.filter(n => n !== niche)
            })}
          />
        </Badge>
      ))}
      {filters.location.map(location => (
        <Badge key={location} variant="secondary" className="flex items-center gap-1">
          {location}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onUpdateFilters({
              ...filters, 
              location: filters.location.filter(l => l !== location)
            })}
          />
        </Badge>
      ))}
    </div>
  );
};

export default ActiveFilters;
