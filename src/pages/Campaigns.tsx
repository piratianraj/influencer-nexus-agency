import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Users, TrendingUp, DollarSign, Calendar, CheckCircle, ArrowLeft, ArrowLeft as LucideArrowLeft, Trash2, MoreVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { CampaignDetails } from '@/components/CampaignDetails';
import { CampaignReport } from '@/components/CampaignReport';
import { CreateCampaign } from '@/components/CreateCampaign';
import { WorkflowGuide } from '@/components/WorkflowGuide';
import { Header } from '@/components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCampaigns } from '@/hooks/useCampaigns';

const Campaigns = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useCampaigns();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
  const [showNewCampaignSuccess, setShowNewCampaignSuccess] = useState(false);
  const [showEditCampaign, setShowEditCampaign] = useState(false);
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null);

  // Handle URL query parameter for creating campaign
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('create') === 'true') {
      if (user) {
        setShowCreateCampaign(true);
        // Clean up URL
        navigate('/campaigns', { replace: true });
      } else {
        setAuthModalOpen(true);
      }
    }
  }, [location.search, user, navigate]);

  // Handle coming from Discovery with selected creators
  useEffect(() => {
    const discoveryData = location.state;
    if (discoveryData?.fromDiscovery && discoveryData?.selectedCreators) {
      setShowCreateCampaign(true);
      setShowNewCampaignSuccess(true);
      
      toast({
        title: "Ready to Create Campaign",
        description: `${discoveryData.selectedCreators.length} creators selected from Discovery.`,
      });
    }
  }, [location.state, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getWorkflowProgress = (step: string) => {
    const steps = ['campaign-creation', 'creator-search', 'outreach', 'deal-negotiation', 'contract', 'payment', 'report'];
    const currentIndex = steps.indexOf(step);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const getWorkflowStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      'campaign-creation': 'Campaign Creation',
      'creator-search': 'Creator Search',
      'outreach': 'Outreach',
      'deal-negotiation': 'Negotiation',
      'contract': 'Contract',
      'payment': 'Payment',
      'report': 'Report'
    };
    return labels[step] || step;
  };

  const handleCreateCampaign = async (newCampaign: any) => {
    const discoveryData = location.state;
    const campaignData = {
      ...newCampaign,
      workflow_step: 'campaign-creation',
      influencer_count: discoveryData?.selectedCreators?.length || 0
    };
    
    const result = await createCampaign(campaignData);
    if (result) {
      setShowCreateCampaign(false);
      setShowNewCampaignSuccess(false);
      navigate('/campaigns', { replace: true });
    }
  };

  const handleEditCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowEditCampaign(true);
  };

  const handleUpdateCampaign = async (updatedCampaign: any) => {
    if (!selectedCampaign) return;
    const result = await updateCampaign(selectedCampaign.id, updatedCampaign);
    if (result) {
      setShowEditCampaign(false);
      setSelectedCampaign(null);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    setDeletingCampaignId(campaignId);
    const success = await deleteCampaign(campaignId);
    setDeletingCampaignId(null);
    
    if (success) {
      // If we're currently viewing the deleted campaign, go back to list
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(null);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to view your campaigns</p>
            <Button onClick={() => setAuthModalOpen(true)}>
              Sign In
            </Button>
          </div>
        </div>
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      </div>
    );
  }

  if (selectedCampaign && showReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CampaignReport 
          campaign={selectedCampaign} 
          onBack={() => {
            setShowReport(false);
            setSelectedCampaign(null);
          }} 
        />
      </div>
    );
  }

  if (selectedCampaign && showEditCampaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CreateCampaign
          onBack={() => setShowEditCampaign(false)}
          onSubmit={handleUpdateCampaign}
          prefilledData={selectedCampaign}
        />
      </div>
    );
  }

  if (selectedCampaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CampaignDetails 
          campaign={selectedCampaign} 
          onBack={() => setSelectedCampaign(null)}
          onViewReport={() => setShowReport(true)}
          onEdit={() => handleEditCampaign(selectedCampaign)}
          onDelete={handleDeleteCampaign}
        />
      </div>
    );
  }

  if (showCreateCampaign) {
    const discoveryData = location.state;
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        {showNewCampaignSuccess && discoveryData?.selectedCreators && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-green-700">
                Great! You've selected {discoveryData.selectedCreators.length} creator{discoveryData.selectedCreators.length !== 1 ? 's' : ''} from Discovery. 
                Now let's create your campaign.
              </p>
            </div>
          </div>
        )}
        <CreateCampaign 
          onBack={() => {
            setShowCreateCampaign(false);
            setShowNewCampaignSuccess(false);
          }}
          onSubmit={handleCreateCampaign}
          prefilledData={discoveryData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
              <p className="text-gray-600 mt-2">Manage your influencer marketing campaigns</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowCreateCampaign(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card 
              key={campaign.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer relative group"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1" onClick={() => setSelectedCampaign(campaign)}>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge className={`${getStatusColor(campaign.status)} mt-2`}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deletingCampaignId === campaign.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                          All associated data including creators, analytics, and contracts will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={deletingCampaignId === campaign.id}
                        >
                          {deletingCampaignId === campaign.id ? 'Deleting...' : 'Delete Campaign'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <CardDescription className="line-clamp-2" onClick={() => setSelectedCampaign(campaign)}>
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent onClick={() => setSelectedCampaign(campaign)}>
                <div className="space-y-3">
                  {/* Workflow Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Workflow Progress</span>
                      <Badge variant="outline" className="text-xs">
                        {getWorkflowStepLabel(campaign.workflow_step)}
                      </Badge>
                    </div>
                    <Progress 
                      value={getWorkflowProgress(campaign.workflow_step)} 
                      className="h-2"
                    />
                  </div>

                  {/* Existing metrics */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>Budget</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(campaign.budget)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Spent</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(campaign.total_spend)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Reach</span>
                    </div>
                    <span className="font-semibold">{formatNumber(campaign.total_reach)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Duration</span>
                    </div>
                    <span className="text-sm">
                      {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-sm text-gray-600">
                      {campaign.influencer_count} influencer{campaign.influencer_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {campaigns.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first influencer campaign</p>
            <Button onClick={() => setShowCreateCampaign(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
