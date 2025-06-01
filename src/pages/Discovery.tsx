import React, { useState } from 'react';
import OutreachModal from '@/components/OutreachModal';
import ContractModal from '@/components/ContractModal';
import InvoiceModal from '@/components/InvoiceModal';
import { AdvancedFilters, FilterOptions } from '@/components/AdvancedFilters';
import DiscoveryHeader from '@/components/DiscoveryHeader';
import SearchAndFilters from '@/components/SearchAndFilters';
import ActiveFilters from '@/components/ActiveFilters';
import CreatorGrid from '@/components/CreatorGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { useCreatorData } from '@/hooks/useCreatorData';
import { useCreatorFilters } from '@/hooks/useCreatorFilters';

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

interface NegotiationData {
  contact_method: "email" | "call";
  agreed_price: number;
  deliverables_count: number;
  availability_window: string;
  follow_up_flag: boolean;
  parsed_summary: string;
  contacted_at: string;
  status: string;
}

const Discovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [outreachModalOpen, setOutreachModalOpen] = useState(false);
  const [outreachType, setOutreachType] = useState<"email" | "call">("email");
  const [showFilters, setShowFilters] = useState(false);
  const [negotiations, setNegotiations] = useState<Record<string, NegotiationData>>({});
  const [contractStatuses, setContractStatuses] = useState<Record<string, "none" | "unsigned" | "signed">>({});
  const [invoiceStatuses, setInvoiceStatuses] = useState<Record<string, "none" | "unpaid" | "paid">>({});
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    followers: { min: 0, max: 0 },
    engagement: { min: 0, max: 0 },
    location: [],
    niche: [],
    priceRange: { min: 0, max: 0 },
    verified: null,
  });

  const { creators, loading } = useCreatorData();
  const { applyFilters, applySearch } = useCreatorFilters();

  const resetFilters = () => {
    setFilters({
      platform: [],
      followers: { min: 0, max: 0 },
      engagement: { min: 0, max: 0 },
      location: [],
      niche: [],
      priceRange: { min: 0, max: 0 },
      verified: null,
    });
  };

  const handleIntelligentSearch = (searchTerm: string, intelligentFilters: Partial<FilterOptions>) => {
    console.log('Applying intelligent search:', { searchTerm, intelligentFilters });
    
    // Update search term
    setSearchTerm(searchTerm);
    
    // Update filters with intelligent results
    setFilters(prevFilters => ({
      ...prevFilters,
      ...intelligentFilters
    }));
  };

  const filteredCreators = applyFilters(applySearch(creators, searchTerm), filters);

  const handleOutreach = (creator: Creator, type: "email" | "call") => {
    setSelectedCreator(creator);
    setOutreachType(type);
    setOutreachModalOpen(true);
  };

  const handleNegotiationComplete = (creatorId: string, negotiationData: NegotiationData) => {
    setNegotiations(prev => ({ ...prev, [creatorId]: negotiationData }));
    setContractStatuses(prev => ({ ...prev, [creatorId]: "none" }));
    setInvoiceStatuses(prev => ({ ...prev, [creatorId]: "none" }));
  };

  const handleOpenContract = (creator: Creator) => {
    setSelectedCreator(creator);
    setContractModalOpen(true);
  };

  const handleOpenInvoice = (creator: Creator) => {
    setSelectedCreator(creator);
    setInvoiceModalOpen(true);
  };

  const handleContractStatusChange = (creatorId: string, status: "unsigned" | "signed") => {
    setContractStatuses(prev => ({ ...prev, [creatorId]: status }));
  };

  const handleInvoiceStatusChange = (creatorId: string, status: "unpaid" | "paid") => {
    setInvoiceStatuses(prev => ({ ...prev, [creatorId]: status }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DiscoveryHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Creators</h1>
          
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onIntelligentSearch={handleIntelligentSearch}
          />

          <ActiveFilters filters={filters} onUpdateFilters={setFilters} />
        </div>

        <div className="flex gap-8">
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <AdvancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
              />
            </div>
          )}

          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredCreators.length === 0 ? (
              <EmptyState onClearFilters={resetFilters} />
            ) : (
              <CreatorGrid
                creators={filteredCreators}
                negotiations={negotiations}
                contractStatuses={contractStatuses}
                invoiceStatuses={invoiceStatuses}
                onOutreach={handleOutreach}
                onOpenContract={handleOpenContract}
                onOpenInvoice={handleOpenInvoice}
              />
            )}
          </div>
        </div>
      </div>

      <OutreachModal
        creator={selectedCreator}
        isOpen={outreachModalOpen}
        onClose={() => {
          setOutreachModalOpen(false);
          setSelectedCreator(null);
        }}
        type={outreachType}
        onNegotiationComplete={handleNegotiationComplete}
      />

      {selectedCreator && negotiations[selectedCreator.id] && (
        <>
          <ContractModal
            isOpen={contractModalOpen}
            onClose={() => {
              setContractModalOpen(false);
              setSelectedCreator(null);
            }}
            creatorName={selectedCreator.name}
            negotiationData={negotiations[selectedCreator.id]}
            contractStatus={contractStatuses[selectedCreator.id] || "none"}
            onStatusChange={(status) => handleContractStatusChange(selectedCreator.id, status)}
          />

          <InvoiceModal
            isOpen={invoiceModalOpen}
            onClose={() => {
              setInvoiceModalOpen(false);
              setSelectedCreator(null);
            }}
            creatorName={selectedCreator.name}
            negotiationData={negotiations[selectedCreator.id]}
            invoiceStatus={invoiceStatuses[selectedCreator.id] || "none"}
            onStatusChange={(status) => handleInvoiceStatusChange(selectedCreator.id, status)}
            contractSigned={contractStatuses[selectedCreator.id] === "signed"}
          />
        </>
      )}
    </div>
  );
};

export default Discovery;
