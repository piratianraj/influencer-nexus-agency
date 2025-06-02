
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus } from 'lucide-react';

interface BottomActionBarProps {
  selectedCreatorsCount: number;
  isAddingToCampaign: boolean;
  onCreateCampaign: () => void;
  onAddToCampaign: () => void;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  selectedCreatorsCount,
  isAddingToCampaign,
  onCreateCampaign,
  onAddToCampaign
}) => {
  if (selectedCreatorsCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-2xl rounded-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">
              {selectedCreatorsCount} creator{selectedCreatorsCount !== 1 ? 's' : ''} selected
            </span>
            <Button 
              onClick={isAddingToCampaign ? onAddToCampaign : onCreateCampaign}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full"
            >
              {isAddingToCampaign ? (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add to Campaign
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
