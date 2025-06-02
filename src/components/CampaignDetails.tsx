
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Users, TrendingUp, DollarSign, Eye, Heart, BarChart3, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnhancedWorkflowGuide } from '@/components/EnhancedWorkflowGuide';
import { CampaignCreatorCard } from '@/components/campaigns/CampaignCreatorCard';
import { useCampaignCreators } from '@/hooks/useCampaignCreators';
import { Campaign } from '@/hooks/useCampaigns';

interface CampaignDetailsProps {
  campaign: Campaign;
  onBack: () => void;
  onViewReport?: () => void;
  onEdit?: () => void;
  onDelete?: (campaignId: string) => void;
  onWorkflowUpdate?: (campaignId: string, step: string) => void;
}

export const CampaignDetails: React.FC<CampaignDetailsProps> = ({ 
  campaign, 
  onBack, 
  onViewReport, 
  onEdit,
  onDelete,
  onWorkflowUpdate
}) => {
  const { campaignCreators, loading, removeCreatorFromCampaign } = useCampaignCreators(campaign.id);

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
      case 'completed': return 'bg-green-100 text-green-800';
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

  const handleWorkflowStepUpdate = (stepId: string) => {
    if (onWorkflowUpdate) {
      onWorkflowUpdate(campaign.id, stepId);
    }
  };

  const handleRemoveCreator = async (campaignCreatorId: string) => {
    await removeCreatorFromCampaign(campaignCreatorId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
              <p className="text-gray-600 mt-2">{campaign.description}</p>
            </div>
            <div className="flex gap-2">
              {onViewReport && (
                <Button onClick={onViewReport} className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Report
                </Button>
              )}
              {onEdit && (
                <Button onClick={onEdit} className="flex items-center gap-2" variant="outline">
                  Edit Campaign
                </Button>
              )}
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                      Delete
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
                        onClick={() => onDelete(campaign.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Campaign
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Workflow Progress */}
        {campaign.workflow_step && (
          <div className="mb-8">
            <EnhancedWorkflowGuide 
              campaignId={campaign.id}
              campaignName={campaign.name}
              currentStep={campaign.workflow_step} 
              onStepUpdate={handleWorkflowStepUpdate}
              onEdit={onEdit} 
            />
          </div>
        )}

        {/* Campaign Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(campaign.budget)}</div>
              <p className="text-xs text-muted-foreground">
                Spent: {formatCurrency(campaign.total_spend)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(campaign.total_reach)}</div>
              <p className="text-xs text-muted-foreground">
                Unique users reached
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impressions</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(campaign.total_impressions)}</div>
              <p className="text-xs text-muted-foreground">
                Total views
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(campaign.total_engagement)}</div>
              <p className="text-xs text-muted-foreground">
                Likes, comments, shares
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Campaign Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-600">Start Date:</span>
                <span className="font-semibold ml-2">
                  {new Date(campaign.start_date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">End Date:</span>
                <span className="font-semibold ml-2">
                  {new Date(campaign.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Influencers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Campaign Influencers</CardTitle>
                <CardDescription>
                  {campaignCreators.length} creator{campaignCreators.length !== 1 ? 's' : ''} in this campaign
                </CardDescription>
              </div>
              <Link to={`/discovery?campaignId=${campaign.id}`}>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Creators
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading creators...
              </div>
            ) : campaignCreators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaignCreators.map((creator) => (
                  <CampaignCreatorCard
                    key={creator.id}
                    creator={creator}
                    onRemove={handleRemoveCreator}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No creators added to this campaign yet</p>
                <Link to={`/discovery?campaignId=${campaign.id}`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Creator
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
