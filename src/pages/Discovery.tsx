import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/Header';

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

  // Get data from brand brief if coming from that flow
  const briefData = location.state;
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  const { creators, loading, refetch, page, setPage, pageSize } = useCreatorData();
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

  // Apply brief-based filters if coming from brand brief
  useEffect(() => {
    if (briefData?.fromBrief && briefData?.briefAnalysis) {
      console.log('Applying filters from brand brief:', briefData.briefAnalysis);
      
      // Apply intelligent filters based on brief analysis
      const intelligentFilters: Partial<FilterOptions> = {};
      
      // You can enhance this logic based on your brief analysis structure
      if (briefData.briefAnalysis.platforms) {
        intelligentFilters.platform = briefData.briefAnalysis.platforms;
      }
      
      if (briefData.briefAnalysis.targetAudience) {
        // Apply audience-based filters
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

    // Navigate to campaigns with selected creators data
    navigate('/campaigns', { 
      state: { 
        selectedCreators, 
        briefData: briefData?.briefAnalysis,
        fromDiscovery: true 
      } 
    });
  };

  // Apply search first, then filters
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
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 hover:bg-white/50 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Discover Creators
                </span>
              </h1>
              {briefData?.fromBrief && (
                <p className="text-gray-600">
                  Showing creators based on your brand brief analysis
                </p>
              )}
            </div>

            {/* Campaign Creation Card */}
            {selectedCreators.length > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">{selectedCreators.length} creator{selectedCreators.length !== 1 ? 's' : ''} selected</span>
                    <Button 
                      onClick={handleCreateCampaign}
                      size="sm"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
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

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => setPage(page - 1)} disabled={page === 1} variant="outline">
            Previous
          </Button>
          <span className="self-center">Page {page}</span>
          <Button onClick={() => setPage(page + 1)} variant="outline">
            Next
          </Button>
        </div>

        {/* Bottom Action Bar */}
        {selectedCreators.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-2xl rounded-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">
                    {selectedCreators.length} creator{selectedCreators.length !== 1 ? 's' : ''} selected
                  </span>
                  <Button 
                    onClick={handleCreateCampaign}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
