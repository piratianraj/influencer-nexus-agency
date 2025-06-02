
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Eye, Heart, TrendingUp } from 'lucide-react';

interface CampaignMetrics {
  totalSpent: number;
  totalReach: number;
  totalEngagements: number;
  totalImpressions: number;
  averageEngagementRate: number;
  roi: number;
}

interface MetricsCardsProps {
  metrics: CampaignMetrics;
  brief?: any;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics, brief }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{metrics.totalSpent.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {brief && `${((metrics.totalSpent || 0) / brief.budget * 100).toFixed(1)}% of budget`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalReach.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Unique users reached
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Engagements</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalEngagements.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.averageEngagementRate}% avg rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ROI</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.roi}x</div>
          <p className="text-xs text-muted-foreground">
            Return on investment
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
