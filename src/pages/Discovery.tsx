
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AdvancedFilters, FilterOptions } from '@/components/AdvancedFilters';
import DiscoveryHeader from '@/components/DiscoveryHeader';
import SearchAndFilters from '@/components/SearchAndFilters';
import ActiveFilters from '@/components/ActiveFilters';
import DiscoveryContent from '@/components/DiscoveryContent';
import DiscoveryModals from '@/components/DiscoveryModals';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCreatorData } from '@/hooks/useCreatorData';
import { useCreatorFilters } from '@/hooks/useCreatorFilters';
import { useDiscoveryState } from '@/hooks/useDiscoveryState';

const Discovery = () => {
  const navigate = useNavigate();
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
  const {
    state,
    updateState,
    handleOutreach,
    handleNegotiationComplete,
    handleOpenContract,
    handleOpenInvoice,
    handleContractStatusChange,
    handleInvoiceStatusChange,
    closeOutreachModal,
    closeContractModal,
    closeInvoiceModal,
  } = useDiscoveryState();

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
    
    updateState({ searchTerm });
    setFilters(prevFilters => ({
      ...prevFilters,
      ...intelligentFilters
    }));
  };

  const filteredCreators = applyFilters(applySearch(creators, state.searchTerm), filters);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <DiscoveryHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 hover:bg-white/50 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Creators
            </span>
          </h1>
          
          <SearchAndFilters
            searchTerm={state.searchTerm}
            onSearchChange={(searchTerm) => updateState({ searchTerm })}
            showFilters={state.showFilters}
            onToggleFilters={() => updateState({ showFilters: !state.showFilters })}
            onIntelligentSearch={handleIntelligentSearch}
          />

          <ActiveFilters filters={filters} onUpdateFilters={setFilters} />
        </div>

        <div className="flex gap-8">
          {state.showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onReset={resetFilters}
                />
              </div>
            </div>
          )}

          <DiscoveryContent
            filteredCreators={filteredCreators}
            negotiations={state.negotiations}
            contractStatuses={state.contractStatuses}
            invoiceStatuses={state.invoiceStatuses}
            onOutreach={handleOutreach}
            onOpenContract={handleOpenContract}
            onOpenInvoice={handleOpenInvoice}
            onClearFilters={resetFilters}
          />
        </div>
      </div>

      <DiscoveryModals
        selectedCreator={state.selectedCreator}
        outreachModalOpen={state.outreachModalOpen}
        outreachType={state.outreachType}
        contractModalOpen={state.contractModalOpen}
        invoiceModalOpen={state.invoiceModalOpen}
        negotiations={state.negotiations}
        contractStatuses={state.contractStatuses}
        invoiceStatuses={state.invoiceStatuses}
        onCloseOutreach={closeOutreachModal}
        onCloseContract={closeContractModal}
        onCloseInvoice={closeInvoiceModal}
        onNegotiationComplete={handleNegotiationComplete}
        onContractStatusChange={handleContractStatusChange}
        onInvoiceStatusChange={handleInvoiceStatusChange}
      />
    </div>
  );
};

export default Discovery;
