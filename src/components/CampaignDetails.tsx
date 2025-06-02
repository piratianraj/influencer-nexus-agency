import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Users, TrendingUp, DollarSign, Eye, Heart, Share, BarChart3, Trash2 } from 'lucide-react';
import { EnhancedWorkflowGuide } from '@/components/EnhancedWorkflowGuide';
import { Campaign } from '@/hooks/useCampaigns';

interface Influencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  agreed_rate: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  deliverables: string[];
}

interface CampaignDetailsProps {
  campaign: Campaign;
  onBack: () => void;
  onViewReport?: () => void;
  onEdit?: () => void;
  onDelete?: (campaignId: string) => void;
  onWorkflowUpdate?: (campaignId: string, step: string) => void;
}

// Mock influencer data
const mockInfluencers: Record<string, Influencer[]> = {
  '1': [
    {
      id: '1',
      name: 'Emma Style',
      platform: 'Instagram',
      followers: 450000,
      engagement_rate: 3.2,
      agreed_rate: 2500,
      status: 'completed',
      deliverables: ['3 feed posts', '5 stories', '1 reel']
    },
    {
      id: '2',
      name: 'Fashion Forward Mia',
      platform: 'TikTok',
      followers: 680000,
      engagement_rate: 4.1,
      agreed_rate: 3200,
      status: 'accepted',
      deliverables: ['4 TikTok videos', '2 Instagram posts']
    }
  ],
  '2': [
    {
      id: '3',
      name: 'TechReviewer Pro',
      platform: 'YouTube',
      followers: 1200000,
      engagement_rate: 2.8,
      agreed_rate: 5000,
      status: 'completed',
      deliverables: ['1 review video', '2 shorts']
    }
  ],
  '4': [
    {
      id: '4',
      name: 'FitLife Coach',
      platform: 'Instagram',
      followers: 320000,
      engagement_rate: 3.8,
      agreed_rate: 1800,
      status: 'accepted',
      deliverables: ['5 workout posts', '10 stories']
    }
  ]
};

export const CampaignDetails: React.FC<CampaignDetailsProps> = ({ 
  campaign, 
  onBack, 
  onViewReport, 
  onEdit,
  onDelete,
  onWorkflowUpdate
}) => {
  const influencers = mockInfluencers[campaign.id] || [];

  const getStatusColor = (status: Campaign['status'] | Influencer['status']) => {
    switch (status) {
      case 'active':
      case 'accepted':
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused':
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled':
      case 'declined': return 'bg-red-100 text-red-800';
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
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Campaign Workflow Progress</CardTitle>
              <CardDescription>
                Track your campaign progress through each stage with interactive controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedWorkflowGuide 
                campaignId={campaign.id}
                currentStep={campaign.workflow_step} 
                onStepUpdate={handleWorkflowStepUpdate}
                onEdit={onEdit} 
              />
            </CardContent>
          </Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Campaign Influencers</CardTitle>
            <CardDescription>
              {influencers.length} influencer{influencers.length !== 1 ? 's' : ''} in this campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            {influencers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Influencer</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Followers</TableHead>
                    <TableHead>Engagement Rate</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deliverables</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {influencers.map((influencer) => (
                    <TableRow key={influencer.id}>
                      <TableCell className="font-medium">{influencer.name}</TableCell>
                      <TableCell>{influencer.platform}</TableCell>
                      <TableCell>{formatNumber(influencer.followers)}</TableCell>
                      <TableCell>{influencer.engagement_rate}%</TableCell>
                      <TableCell>{formatCurrency(influencer.agreed_rate)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(influencer.status)}>
                          {influencer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {influencer.deliverables.map((deliverable, index) => (
                            <div key={index}>{deliverable}</div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No influencers added to this campaign yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
