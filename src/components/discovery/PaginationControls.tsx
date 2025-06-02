
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  currentPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  canGoPrevious: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  onPreviousPage,
  onNextPage,
  canGoPrevious
}) => {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <Button onClick={onPreviousPage} disabled={!canGoPrevious} variant="outline">
        Previous
      </Button>
      <span className="self-center">Page {currentPage}</span>
      <Button onClick={onNextPage} variant="outline">
        Next
      </Button>
    </div>
  );
};
