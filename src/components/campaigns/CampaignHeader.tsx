
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CampaignHeaderProps {
  onCreateCampaign: () => void;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({ onCreateCampaign }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
      <Button onClick={onCreateCampaign} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create Campaign
      </Button>
    </div>
  );
};
