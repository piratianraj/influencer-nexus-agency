
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CampaignOverviewProps {
  brief: any;
}

export const CampaignOverview: React.FC<CampaignOverviewProps> = ({ brief }) => {
  if (!brief) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Campaign Overview</CardTitle>
        <CardDescription>{brief.brand_name} - {brief.niche} Campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><strong>Budget:</strong> ₹{brief.budget.toLocaleString()}</div>
          <div><strong>Timeline:</strong> {brief.timeline}</div>
          <div><strong>Target Creators:</strong> {brief.num_creators}</div>
          <div><strong>Platforms:</strong> {brief.platforms.join(", ")}</div>
        </div>
      </CardContent>
    </Card>
  );
};
