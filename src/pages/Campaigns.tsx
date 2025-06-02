import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, DollarSign, Users, BarChart3, Calendar, Target } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CreateCampaign } from '@/components/CreateCampaign';
import { CampaignDetails } from '@/components/CampaignDetails';
import { Header } from '@/components/Header';
import { useCampaigns, Campaign } from '@/hooks/useCampaigns';
import { useCampaignCreators } from '@/hooks/useCampaignCreators';
import { Skeleton } from '@/components/ui/skeleton';

type WorkflowStep = 'campaign-creation' | 'creator-search' | 'outreach' | 'deal-negotiation' | 'contract' | 'payment' | 'report';

const Campaigns = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const { campaigns, loading, updateCampaign, deleteCampaign, refetch } = useCampaigns();
  const { refetch: refetchCampaignCreators } = useCampaignCreators(campaignId);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

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
    // Update URL to reflect the selected campaign
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    navigate('/campaigns');
  };

  const handleWorkflowUpdate = async (campaignId: string, step: string) => {
    const workflowStep = step as WorkflowStep;
    await updateCampaign(campaignId, { workflow_step: workflowStep });
    // Refetch campaigns to get updated data
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
    refetch();
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show campaign details if a campaign is selected
  if (selectedCampaign) {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-lg font-semibold text-gray-900">{campaign.name}</CardTitle>
                <CardDescription className="text-gray-600">{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Start Date: {formatDate(campaign.start_date)}</span>
                  <span>End Date: {formatDate(campaign.end_date)}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-gray-700">
                    <TrendingUp className="h-4 w-4" />
                    <span>{campaign.total_reach.toLocaleString()} Reach</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-700">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(campaign.budget)} Budget</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-700">
                    <Users className="h-4 w-4" />
                    <span>{campaign.influencer_count} Influencers</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                  <Button variant="outline" size="sm" onClick={() => handleViewCampaign(campaign)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
