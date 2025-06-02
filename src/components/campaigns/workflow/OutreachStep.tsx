
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MessageSquare, Clock } from 'lucide-react';
import { CampaignCreator } from '@/hooks/useCampaignCreators';
import { useToast } from '@/hooks/use-toast';

interface OutreachStepProps {
  campaignCreators: CampaignCreator[];
  onUpdateCreator: (id: string, updates: Partial<CampaignCreator>) => Promise<void>;
}

export const OutreachStep: React.FC<OutreachStepProps> = ({ campaignCreators, onUpdateCreator }) => {
  const [selectedCreator, setSelectedCreator] = useState<CampaignCreator | null>(null);
  const [outreachType, setOutreachType] = useState<'email' | 'call'>('email');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOutreach = async (creator: CampaignCreator, method: 'email' | 'call') => {
    if (method === 'email') {
      const subject = `Collaboration Opportunity - Campaign`;
      const body = message || `Hi ${creator.creator_id},\n\nWe'd love to collaborate with you on our upcoming campaign. Are you interested in discussing this opportunity?\n\nBest regards,\nYour Brand Team`;
      
      const mailtoLink = `mailto:${creator.creator_id}@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
    } else {
      // For call functionality - would integrate with Twilio in production
      toast({
        title: "Call Initiated",
        description: `Call functionality would dial ${creator.creator_id} here`,
      });
    }

    // Update creator status
    await onUpdateCreator(creator.id, {
      contact_method: method,
      contacted_at: new Date().toISOString(),
      status: 'contacted'
    });

    setIsModalOpen(false);
    setMessage('');
    
    toast({
      title: "Outreach Sent",
      description: `${method === 'email' ? 'Email' : 'Call'} initiated for ${creator.creator_id}`,
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
          <MessageSquare className="h-5 w-5" />
          Creator Outreach
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaignCreators.map((creator) => (
            <div key={creator.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-medium">{creator.creator_id}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {creator.contacted_at && (
                      <>
                        <Clock className="h-3 w-3" />
                        Contacted {new Date(creator.contacted_at).toLocaleDateString()}
                      </>
                    )}
                    {creator.contact_method && (
                      <span>via {creator.contact_method}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(creator)}
                
                <Dialog open={isModalOpen && selectedCreator?.id === creator.id} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCreator(creator)}
                    >
                      Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact {creator.creator_id}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Contact Method</label>
                        <Select value={outreachType} onValueChange={(value: 'email' | 'call') => setOutreachType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="call">Phone Call</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {outreachType === 'email' && (
                        <div>
                          <label className="text-sm font-medium">Message (Optional)</label>
                          <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Customize your outreach message..."
                            rows={4}
                          />
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => handleOutreach(creator, outreachType)}
                          className="flex items-center gap-2"
                        >
                          {outreachType === 'email' ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                          {outreachType === 'email' ? 'Send Email' : 'Make Call'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                          Cancel
                        </Button>
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
