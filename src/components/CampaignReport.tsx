
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, TrendingUp, Users, DollarSign, Eye, Heart, Share, Target } from 'lucide-react';

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
}

interface CampaignReportProps {
  campaign: Campaign;
  onBack: () => void;
}

export const CampaignReport: React.FC<CampaignReportProps> = ({ campaign, onBack }) => {
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

  const calculateROI = () => {
    if (campaign.total_spend === 0) return 0;
    // Mock ROI calculation - in real app this would be based on conversion data
    const estimatedRevenue = campaign.total_engagement * 2.5; // $2.50 per engagement
    return ((estimatedRevenue - campaign.total_spend) / campaign.total_spend * 100);
  };

  const getCPM = () => {
    if (campaign.total_impressions === 0) return 0;
    return (campaign.total_spend / campaign.total_impressions * 1000);
  };

  const getEngagementRate = () => {
    if (campaign.total_reach === 0) return 0;
    return (campaign.total_engagement / campaign.total_reach * 100);
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
            Back to Campaign
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaign Report</h1>
              <p className="text-gray-600 mt-2">{campaign.name}</p>
            </div>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {calculateROI().toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Return on investment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPM</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(getCPM())}
              </div>
              <p className="text-xs text-muted-foreground">
                Cost per thousand impressions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getEngagementRate().toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Total engagement vs reach
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((campaign.total_spend / campaign.budget) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(campaign.total_spend)} of {formatCurrency(campaign.budget)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Overall campaign performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatNumber(campaign.total_reach)}
                </div>
                <div className="text-sm text-gray-600">Total Reach</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatNumber(campaign.total_impressions)}
                </div>
                <div className="text-sm text-gray-600">Total Impressions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatNumber(campaign.total_engagement)}
                </div>
                <div className="text-sm text-gray-600">Total Engagement</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className={
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span>{new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Influencers:</span>
                <span>{campaign.influencer_count} creators</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Budget:</span>
                <span>{formatCurrency(campaign.budget)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Best Performing Metric</h4>
                <p className="text-sm text-green-700">
                  Engagement rate of {getEngagementRate().toFixed(2)}% exceeds industry average of 2.5%
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Cost Efficiency</h4>
                <p className="text-sm text-blue-700">
                  CPM of {formatCurrency(getCPM())} is competitive for your target audience
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">ROI Performance</h4>
                <p className="text-sm text-purple-700">
                  Current ROI of {calculateROI().toFixed(1)}% shows strong campaign performance
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
