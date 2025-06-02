
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface CampaignLoadingSkeletonProps {
  count?: number;
}

export const CampaignLoadingSkeleton: React.FC<CampaignLoadingSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  );
};
