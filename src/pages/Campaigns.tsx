
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { CreateCampaign } from '@/components/CreateCampaign';
import { CampaignDetails } from '@/components/CampaignDetails';
import { CampaignHeader } from '@/components/campaigns/CampaignHeader';
import { CampaignGrid } from '@/components/campaigns/CampaignGrid';
import { CampaignLoadingSkeleton } from '@/components/campaigns/CampaignLoadingSkeleton';
import { useCampaigns, Campaign } from '@/hooks/useCampaigns';
import { useCampaignCreators } from '@/hooks/useCampaignCreators';

type WorkflowStep = 'campaign-creation' | 'creator-search' | 'outreach' | 'deal-negotiation' | 'contract' | 'payment' | 'report';

const Campaigns = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const [searchParams] = useSearchParams();
  const { campaigns, loading, updateCampaign, deleteCampaign, refetch } = useCampaigns();
  const { refetch: refetchCampaignCreators } = useCampaignCreators(campaignId);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Check for create parameter in URL
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateForm(true);
    }
  }, [searchParams]);

  // Check if we have a specific campaign ID in the URL
  useEffect(() => {
    if (campaignId) {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        setSelectedCampaign(campaign);
      }
    }
  }, [campaignId, campaigns]);

  // Refetch campaign creators when coming back from Discovery
  useEffect(() => {
    if (campaignId && refetchCampaignCreators) {
      refetchCampaignCreators();
    }
  }, [campaignId, refetchCampaignCreators]);

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    setShowCreateForm(false);
    navigate('/campaigns');
  };

  const handleWorkflowUpdate = async (campaignId: string, step: string) => {
    const workflowStep = step as WorkflowStep;
    await updateCampaign(campaignId, { workflow_step: workflowStep });
    await refetch();
  };

  const handleEditCampaign = () => {
    if (selectedCampaign) {
      setShowCreateForm(true);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    const success = await deleteCampaign(campaignId);
    if (success) {
      handleBackToCampaigns();
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setSelectedCampaign(null);
    navigate('/campaigns');
    refetch();
  };

  const handleCreateCampaign = () => {
    setShowCreateForm(true);
    setSelectedCampaign(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CampaignLoadingSkeleton />
        </div>
      </div>
    );
  }

  // Show campaign details if a campaign is selected
  if (selectedCampaign && !showCreateForm) {
    return (
      <CampaignDetails
        campaign={selectedCampaign}
        onBack={handleBackToCampaigns}
        onEdit={handleEditCampaign}
        onDelete={handleDeleteCampaign}
        onWorkflowUpdate={handleWorkflowUpdate}
      />
    );
  }

  // Show create campaign form
  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CreateCampaign
            editingCampaign={selectedCampaign}
            onClose={handleBackToCampaigns}
            onSuccess={handleCreateSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CampaignHeader onCreateCampaign={handleCreateCampaign} />
        <CampaignGrid campaigns={campaigns} onViewCampaign={handleViewCampaign} />
      </div>
    </div>
  );
};

export default Campaigns;
