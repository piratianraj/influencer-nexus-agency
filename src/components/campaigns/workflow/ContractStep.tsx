
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Check, Clock } from 'lucide-react';
import { CampaignCreator } from '@/hooks/useCampaignCreators';
import { useToast } from '@/hooks/use-toast';

interface ContractStepProps {
  campaignCreators: CampaignCreator[];
  onUpdateCreator: (id: string, updates: Partial<CampaignCreator>) => Promise<void>;
}

export const ContractStep: React.FC<ContractStepProps> = ({ campaignCreators, onUpdateCreator }) => {
  const [selectedCreator, setSelectedCreator] = useState<CampaignCreator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateContract = async (creator: CampaignCreator) => {
    setIsGenerating(true);
    
    // Simulate contract generation
    setTimeout(() => {
      const contractContent = `
CONTRACT AGREEMENT

This agreement is between Brand Agency and ${creator.creator_id}

DELIVERABLES:
- ${creator.deliverables_count} content pieces
- Total Value: $${creator.agreed_rate?.toLocaleString()}
- Delivery Window: 30 days from signing

TERMS:
- Payment due within 30 days of delivery
- Content must meet brand guidelines
- Creator retains rights to content after campaign

This is a MOCK CONTRACT for demonstration purposes only.
Generated on: ${new Date().toLocaleDateString()}
      `;

      const blob = new Blob([contractContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Contract_${creator.creator_id.replace(/\s+/g, '_')}_${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsGenerating(false);
      setIsModalOpen(false);
      
      toast({
        title: "Contract Generated",
        description: `Contract created and downloaded for ${creator.creator_id}`,
      });
    }, 1500);
  };

  const handleContractStatusUpdate = async (creator: CampaignCreator, signed: boolean) => {
    await onUpdateCreator(creator.id, {
      contract_signed: signed
    });
    
    toast({
      title: signed ? "Contract Signed" : "Contract Unsigned",
      description: `Contract status updated for ${creator.creator_id}`,
    });
  };

  const getContractStatus = (creator: CampaignCreator) => {
    if (creator.contract_signed) {
      return <Badge className="bg-green-100 text-green-800">Signed</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Unsigned</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contract Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaignCreators.filter(creator => creator.agreed_rate).map((creator) => (
            <div key={creator.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-medium">{creator.creator_id}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Rate: ${creator.agreed_rate?.toLocaleString()}</span>
                    <span>Deliverables: {creator.deliverables_count}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getContractStatus(creator)}
                
                <Dialog open={isModalOpen && selectedCreator?.id === creator.id} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCreator(creator)}
                    >
                      Manage Contract
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contract for {creator.creator_id}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Agreement Summary</h4>
                        <div className="text-sm space-y-1">
                          <div>Creator: {creator.creator_id}</div>
                          <div>Rate: ${creator.agreed_rate?.toLocaleString()}</div>
                          <div>Deliverables: {creator.deliverables_count}</div>
                          <div>Status: {creator.contract_signed ? 'Signed' : 'Unsigned'}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button 
                          onClick={() => handleGenerateContract(creator)} 
                          disabled={isGenerating}
                          className="w-full flex items-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <Clock className="h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Generate & Download Contract
                            </>
                          )}
                        </Button>

                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleContractStatusUpdate(creator, true)}
                            className="flex-1 flex items-center gap-2"
                            disabled={creator.contract_signed}
                          >
                            <Check className="h-4 w-4" />
                            Mark as Signed
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleContractStatusUpdate(creator, false)}
                            className="flex-1"
                            disabled={!creator.contract_signed}
                          >
                            Mark as Unsigned
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
