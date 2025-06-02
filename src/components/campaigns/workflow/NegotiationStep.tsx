
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { HandHeart, DollarSign, Package } from 'lucide-react';
import { CampaignCreator } from '@/hooks/useCampaignCreators';
import { useToast } from '@/hooks/use-toast';

interface NegotiationStepProps {
  campaignCreators: CampaignCreator[];
  onUpdateCreator: (id: string, updates: Partial<CampaignCreator>) => Promise<CampaignCreator | null>;
}

export const NegotiationStep: React.FC<NegotiationStepProps> = ({ campaignCreators, onUpdateCreator }) => {
  const [selectedCreator, setSelectedCreator] = useState<CampaignCreator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [negotiationData, setNegotiationData] = useState({
    agreedRate: '',
    deliverablesCount: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleNegotiationUpdate = async (creator: CampaignCreator, status: string, rate?: number) => {
    const updates: Partial<CampaignCreator> = {
      status: status as CampaignCreator['status']
    };

    if (rate) {
      updates.agreed_rate = rate;
    }

    if (negotiationData.deliverablesCount) {
      updates.deliverables_count = parseInt(negotiationData.deliverablesCount);
    }

    if (negotiationData.notes) {
      updates.negotiation_notes = negotiationData.notes;
    }

    await onUpdateCreator(creator.id, updates);
    
    setIsModalOpen(false);
    setNegotiationData({ agreedRate: '', deliverablesCount: '', notes: '' });
    
    toast({
      title: "Negotiation Updated",
      description: `Updated negotiation status for ${creator.creator_id}`,
    });
  };

  const getStatusBadge = (creator: CampaignCreator) => {
    const statusColors = {
      selected: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      negotiating: 'bg-yellow-100 text-yellow-800',
      contracted: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[creator.status]}>
        {creator.status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HandHeart className="h-5 w-5" />
          Deal Negotiation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaignCreators.map((creator) => (
            <div key={creator.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-medium">{creator.creator_id}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {creator.agreed_rate && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${creator.agreed_rate.toLocaleString()}
                      </div>
                    )}
                    {creator.deliverables_count && (
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {creator.deliverables_count} deliverables
                      </div>
                    )}
                  </div>
                  {creator.negotiation_notes && (
                    <p className="text-xs text-gray-400 mt-1">{creator.negotiation_notes}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(creator)}
                
                <Dialog open={isModalOpen && selectedCreator?.id === creator.id} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCreator(creator);
                        setNegotiationData({
                          agreedRate: creator.agreed_rate?.toString() || '',
                          deliverablesCount: creator.deliverables_count?.toString() || '',
                          notes: creator.negotiation_notes || ''
                        });
                      }}
                    >
                      Negotiate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Negotiate with {creator.creator_id}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Agreed Rate ($)</label>
                          <Input
                            type="number"
                            value={negotiationData.agreedRate}
                            onChange={(e) => setNegotiationData(prev => ({ ...prev, agreedRate: e.target.value }))}
                            placeholder="Enter agreed rate"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Deliverables Count</label>
                          <Input
                            type="number"
                            value={negotiationData.deliverablesCount}
                            onChange={(e) => setNegotiationData(prev => ({ ...prev, deliverablesCount: e.target.value }))}
                            placeholder="Number of deliverables"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Negotiation Notes</label>
                        <Textarea
                          value={negotiationData.notes}
                          onChange={(e) => setNegotiationData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Add notes about the negotiation..."
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNegotiationUpdate(creator, 'negotiating', parseFloat(negotiationData.agreedRate) || undefined)}
                          >
                            Ongoing
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNegotiationUpdate(creator, 'contacted', parseFloat(negotiationData.agreedRate) || undefined)}
                          >
                            Pending
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleNegotiationUpdate(creator, 'contracted', parseFloat(negotiationData.agreedRate) || undefined)}
                          >
                            Agreed
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
