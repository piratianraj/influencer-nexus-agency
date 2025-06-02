
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Plus, UserPlus } from 'lucide-react';

interface DiscoveryPageHeaderProps {
  onBack: () => void;
  isAddingToCampaign: boolean;
  briefData?: any;
  selectedCreatorsCount: number;
  onCreateCampaign: () => void;
  onAddToCampaign: () => void;
}

export const DiscoveryPageHeader: React.FC<DiscoveryPageHeaderProps> = ({
  onBack,
  isAddingToCampaign,
  briefData,
  selectedCreatorsCount,
  onCreateCampaign,
  onAddToCampaign
}) => {
  return (
    <div className="mb-8">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 flex items-center gap-2 hover:bg-white/50 rounded-xl"
      >
        <ArrowLeft className="h-4 w-4" />
        Back{isAddingToCampaign ? ' to Campaign' : ''}
      </Button>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isAddingToCampaign ? 'Add Creators to Campaign' : 'Discover Creators'}
            </span>
          </h1>
          {briefData?.fromBrief && (
            <p className="text-gray-600">
              Showing creators based on your brand brief analysis
            </p>
          )}
          {isAddingToCampaign && (
            <p className="text-gray-600">
              Select creators to add to your campaign workflow
            </p>
          )}
        </div>

        {selectedCreatorsCount > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">{selectedCreatorsCount} creator{selectedCreatorsCount !== 1 ? 's' : ''} selected</span>
                <Button 
                  onClick={isAddingToCampaign ? onAddToCampaign : onCreateCampaign}
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
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
        )}
      </div>
    </div>
  );
};
