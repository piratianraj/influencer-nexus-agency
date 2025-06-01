import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { CampaignDetails } from '@/components/CampaignDetails';
import { CampaignReport } from '@/components/CampaignReport';
import { CreateCampaign } from '@/components/CreateCampaign';
import { WorkflowGuide } from '@/components/WorkflowGuide';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  total_spend: number;
  total_reach: number;
  total_impressions: number;
  total_engagement: number;
  start_date: string;
  end_date: string;
  influencer_count: number;
  workflow_step: string;
}

// Mock data since we can't use real Supabase auth yet
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Fashion Launch',
    description: 'Promoting our new summer collection with fashion influencers',
    status: 'active',
    budget: 50000,
    total_spend: 32500,
    total_reach: 2500000,
    total_impressions: 5200000,
    total_engagement: 125000,
    start_date: '2024-06-01',
    end_date: '2024-08-31',
    influencer_count: 8,
    workflow_step: 'payment'
  },
  {
    id: '2',
    name: 'Tech Product Review',
    description: 'Getting tech reviewers to showcase our latest gadget',
    status: 'completed',
    budget: 25000,
    total_spend: 24800,
    total_reach: 1200000,
    total_impressions: 2800000,
    total_engagement: 85000,
    start_date: '2024-04-15',
    end_date: '2024-05-15',
    influencer_count: 5,
    workflow_step: 'report'
  },
  {
    id: '3',
    name: 'Holiday Campaign 2024',
    description: 'End of year holiday marketing push',
    status: 'draft',
    budget: 75000,
    total_spend: 0,
    total_reach: 0,
    total_impressions: 0,
    total_engagement: 0,
    start_date: '2024-12-01',
    end_date: '2024-12-31',
    influencer_count: 0,
    workflow_step: 'campaign-creation'
  },
  {
    id: '4',
    name: 'Fitness Challenge',
    description: 'Promoting healthy lifestyle with fitness influencers',
    status: 'paused',
    budget: 30000,
    total_spend: 15600,
    total_reach: 800000,
    total_impressions: 1900000,
    total_engagement: 45000,
    start_date: '2024-05-01',
    end_date: '2024-07-31',
    influencer_count: 3,
    workflow_step: 'contract'
  }
];

const Campaigns = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);

  const getStatusColor = (status: Campaign['status']) => {
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

  const handleCreateCampaign = (newCampaign: Omit<Campaign, 'id'>) => {
    const campaign: Campaign = {
      ...newCampaign,
      id: Date.now().toString(),
      workflow_step: 'campaign-creation'
    };
    setCampaigns([...campaigns, campaign]);
    setShowCreateCampaign(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your campaigns</p>
          <Button onClick={() => setAuthModalOpen(true)}>
            Sign In
          </Button>
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
      <CampaignReport 
        campaign={selectedCampaign} 
        onBack={() => {
          setShowReport(false);
          setSelectedCampaign(null);
        }} 
      />
    );
  }

  if (selectedCampaign) {
    return (
      <CampaignDetails 
        campaign={selectedCampaign} 
        onBack={() => setSelectedCampaign(null)}
        onViewReport={() => setShowReport(true)}
      />
    );
  }

  if (showCreateCampaign) {
    return (
      <CreateCampaign 
        onBack={() => setShowCreateCampaign(false)}
        onSubmit={handleCreateCampaign}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
            <p className="text-gray-600 mt-2">Manage your influencer marketing campaigns</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowWorkflowGuide(!showWorkflowGuide)}
            >
              Workflow Guide
            </Button>
            <Button onClick={() => setShowCreateCampaign(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Start New Campaign
            </Button>
          </div>
        </div>

        {showWorkflowGuide && (
          <div className="mb-8">
            <WorkflowGuide />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card 
              key={campaign.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCampaign(campaign)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
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

        {campaigns.length === 0 && (
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
