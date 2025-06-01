
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState = ({ onClearFilters }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">No creators found matching your criteria</p>
      <Button 
        variant="outline" 
        onClick={onClearFilters}
        className="mt-4"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default EmptyState;
