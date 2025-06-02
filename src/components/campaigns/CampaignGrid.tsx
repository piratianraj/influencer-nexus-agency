
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Users } from 'lucide-react';
import { Campaign } from '@/hooks/useCampaigns';

interface CampaignGridProps {
  campaigns: Campaign[];
  onViewCampaign: (campaign: Campaign) => void;
}

export const CampaignGrid: React.FC<CampaignGridProps> = ({ campaigns, onViewCampaign }) => {
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

  return (
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
              <Button variant="outline" size="sm" onClick={() => onViewCampaign(campaign)}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
