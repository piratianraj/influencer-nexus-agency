
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/Header';
import { AdvancedFilters, FilterOptions } from '@/components/AdvancedFilters';
import SearchAndFilters from '@/components/SearchAndFilters';
import ActiveFilters from '@/components/ActiveFilters';
import DiscoveryContent from '@/components/DiscoveryContent';
import DiscoveryModals from '@/components/DiscoveryModals';
import { DiscoveryPageHeader } from '@/components/discovery/DiscoveryPageHeader';
import { PaginationControls } from '@/components/discovery/PaginationControls';
import { BottomActionBar } from '@/components/discovery/BottomActionBar';
import { useCreatorData } from '@/hooks/useCreatorData';
import { useCreatorFilters } from '@/hooks/useCreatorFilters';
import { useDiscoveryState } from '@/hooks/useDiscoveryState';
import { useCampaignCreators } from '@/hooks/useCampaignCreators';

const Discovery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    followers: { min: 0, max: 0 },
    engagement: { min: 0, max: 0 },
    location: [],
    niche: [],
    priceRange: { min: 0, max: 0 },
    verified: null,
  });

  const briefData = location.state;
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  const urlParams = new URLSearchParams(location.search);
  const campaignId = urlParams.get('campaignId');
  const isAddingToCampaign = Boolean(campaignId);

  const { creators, loading, refetch, page, setPage, pageSize } = useCreatorData();
  const { applyFilters, applySearch } = useCreatorFilters();
  const { addCreatorToCampaign } = useCampaignCreators(campaignId || undefined);
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

  // Apply brief-based filters if coming from brand brief
  useEffect(() => {
    if (briefData?.fromBrief && briefData?.briefAnalysis) {
      console.log('Applying filters from brand brief:', briefData.briefAnalysis);
      
      const intelligentFilters: Partial<FilterOptions> = {};
      
      if (briefData.briefAnalysis.platforms) {
        intelligentFilters.platform = briefData.briefAnalysis.platforms;
      }
      
      if (briefData.briefAnalysis.targetAudience) {
        intelligentFilters.niche = briefData.briefAnalysis.targetAudience.interests || [];
      }

      setFilters(prevFilters => ({
        ...prevFilters,
        ...intelligentFilters
      }));

      toast({
        title: "Brief Analysis Applied",
        description: "Filters have been set based on your brand brief analysis.",
      });
    }
  }, [briefData, toast]);

  const resetFilters = () => {
    console.log('Resetting filters');
    setFilters({
      platform: [],
      followers: { min: 0, max: 0 },
      engagement: { min: 0, max: 0 },
      location: [],
      niche: [],
      priceRange: { min: 0, max: 0 },
      verified: null,
    });
    updateState({ searchTerm: '' });
  };

  const handleIntelligentSearch = (searchTerm: string, intelligentFilters: Partial<FilterOptions>) => {
    console.log('Applying intelligent search:', { searchTerm, intelligentFilters });
    
    updateState({ searchTerm });
    setFilters(prevFilters => ({
      ...prevFilters,
      ...intelligentFilters
    }));
  };

  const handleCreatorSelect = (creatorId: string) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId) 
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleCreateCampaign = () => {
    if (selectedCreators.length === 0) {
      toast({
        title: "No Creators Selected",
        description: "Please select at least one creator to proceed with campaign creation.",
        variant: "destructive"
      });
      return;
    }

    navigate('/campaigns', { 
      state: { 
        selectedCreators, 
        briefData: briefData?.briefAnalysis,
        fromDiscovery: true 
      } 
    });
  };

  const handleAddToCampaign = async () => {
    if (selectedCreators.length === 0) {
      toast({
        title: "No Creators Selected",
        description: "Please select at least one creator to add to the campaign.",
        variant: "destructive"
      });
      return;
    }

    if (!campaignId || !addCreatorToCampaign) {
      toast({
        title: "Error",
        description: "Campaign ID not found.",
        variant: "destructive"
      });
      return;
    }

    try {
      const addPromises = selectedCreators.map(creatorId => 
        addCreatorToCampaign(creatorId, campaignId)
      );
      
      await Promise.all(addPromises);

      toast({
        title: "Creators Added",
        description: `${selectedCreators.length} creator${selectedCreators.length !== 1 ? 's' : ''} added to campaign successfully.`,
      });

      navigate(`/campaigns/${campaignId}`);
    } catch (error) {
      console.error('Error adding creators to campaign:', error);
      toast({
        title: "Error",
        description: "Failed to add creators to campaign. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    if (isAddingToCampaign && campaignId) {
      navigate(`/campaigns/${campaignId}`);
    } else {
      navigate(-1);
    }
  };

  const searchedCreators = applySearch(creators, state.searchTerm);
  const filteredCreators = applyFilters(searchedCreators, filters);

  console.log('Total creators:', creators.length, 'After search:', searchedCreators.length, 'After filters:', filteredCreators.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(pageSize)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full mb-4" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiscoveryPageHeader
          onBack={handleBack}
          isAddingToCampaign={isAddingToCampaign}
          briefData={briefData}
          selectedCreatorsCount={selectedCreators.length}
          onCreateCampaign={handleCreateCampaign}
          onAddToCampaign={handleAddToCampaign}
        />
        
        <SearchAndFilters
          searchTerm={state.searchTerm}
          onSearchChange={(searchTerm) => updateState({ searchTerm })}
          showFilters={state.showFilters}
          onToggleFilters={() => updateState({ showFilters: !state.showFilters })}
          onIntelligentSearch={handleIntelligentSearch}
        />

        <ActiveFilters filters={filters} onUpdateFilters={setFilters} />

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
            filteredCreators={filteredCreators.map(creator => ({
              ...creator,
              isSelected: selectedCreators.includes(creator.id)
            }))}
            negotiations={state.negotiations}
            contractStatuses={state.contractStatuses}
            invoiceStatuses={state.invoiceStatuses}
            onOutreach={handleOutreach}
            onOpenContract={handleOpenContract}
            onOpenInvoice={handleOpenInvoice}
            onClearFilters={resetFilters}
            onCreatorSelect={handleCreatorSelect}
          />
        </div>

        <PaginationControls
          currentPage={page}
          onPreviousPage={() => setPage(page - 1)}
          onNextPage={() => setPage(page + 1)}
          canGoPrevious={page > 1}
        />

        <BottomActionBar
          selectedCreatorsCount={selectedCreators.length}
          isAddingToCampaign={isAddingToCampaign}
          onCreateCampaign={handleCreateCampaign}
          onAddToCampaign={handleAddToCampaign}
        />
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
