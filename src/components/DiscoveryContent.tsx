
import React from 'react';
import { FilterOptions } from '@/components/AdvancedFilters';
import { Creator } from '@/types/discovery';
import CreatorGrid from '@/components/CreatorGrid';
import EmptyState from '@/components/EmptyState';

interface DiscoveryContentProps {
  filteredCreators: Creator[];
  negotiations: Record<string, any>;
  contractStatuses: Record<string, "none" | "unsigned" | "signed">;
  invoiceStatuses: Record<string, "none" | "unpaid" | "paid">;
  onOutreach: (creator: Creator, type: "email" | "call") => void;
  onOpenContract: (creator: Creator) => void;
  onOpenInvoice: (creator: Creator) => void;
  onClearFilters: () => void;
}

const DiscoveryContent = ({
  filteredCreators,
  negotiations,
  contractStatuses,
  invoiceStatuses,
  onOutreach,
  onOpenContract,
  onOpenInvoice,
  onClearFilters
}: DiscoveryContentProps) => {
  return (
    <div className="flex-1">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600 font-medium">
          {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filteredCreators.length === 0 ? (
        <EmptyState onClearFilters={onClearFilters} />
      ) : (
        <CreatorGrid
          creators={filteredCreators}
          negotiations={negotiations}
          contractStatuses={contractStatuses}
          invoiceStatuses={invoiceStatuses}
          onOutreach={onOutreach}
          onOpenContract={onOpenContract}
          onOpenInvoice={onOpenInvoice}
        />
      )}
    </div>
  );
};

export default DiscoveryContent;
