
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Calendar } from 'lucide-react';
import { CampaignCreator } from '@/hooks/useCampaignCreators';
import { useToast } from '@/hooks/use-toast';

interface PaymentStepProps {
  campaignCreators: CampaignCreator[];
  onUpdateCreator: (id: string, updates: Partial<CampaignCreator>) => Promise<void>;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ campaignCreators, onUpdateCreator }) => {
  const [selectedCreator, setSelectedCreator] = useState<CampaignCreator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: '',
    date: ''
  });
  const { toast } = useToast();

  const handlePaymentStatusUpdate = async (creator: CampaignCreator, status: string) => {
    await onUpdateCreator(creator.id, {
      payment_status: status as CampaignCreator['payment_status']
    });
    
    toast({
      title: "Payment Status Updated",
      description: `Payment status updated to ${status} for ${creator.creator_id}`,
    });
  };

  const getPaymentBadge = (creator: CampaignCreator) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[creator.payment_status]}>
        {creator.payment_status}
      </Badge>
    );
  };

  const generateInvoice = (creator: CampaignCreator) => {
    const invoiceContent = `
INVOICE

Invoice #: INV-${Date.now()}
Date: ${new Date().toLocaleDateString()}

Bill To:
${creator.creator_id}

Description: Content Creation Services
Campaign: Brand Campaign
Deliverables: ${creator.deliverables_count} pieces
Rate: $${creator.agreed_rate?.toLocaleString()}

Total Amount Due: $${creator.agreed_rate?.toLocaleString()}

Payment Terms: Net 30 days
Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

This is a MOCK INVOICE for demonstration purposes only.
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${creator.creator_id.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Invoice Generated",
      description: `Invoice created and downloaded for ${creator.creator_id}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaignCreators.filter(creator => creator.contract_signed).map((creator) => (
            <div key={creator.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-medium">{creator.creator_id}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${creator.agreed_rate?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getPaymentBadge(creator)}
                
                <Dialog open={isModalOpen && selectedCreator?.id === creator.id} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCreator(creator);
                        setPaymentData({
                          amount: creator.agreed_rate?.toString() || '',
                          method: '',
                          date: new Date().toISOString().split('T')[0]
                        });
                      }}
                    >
                      Manage Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Payment for {creator.creator_id}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Payment Details</h4>
                        <div className="text-sm space-y-1">
                          <div>Creator: {creator.creator_id}</div>
                          <div>Amount: ${creator.agreed_rate?.toLocaleString()}</div>
                          <div>Status: {creator.payment_status}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Amount ($)</label>
                          <Input
                            type="number"
                            value={paymentData.amount}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Payment Date</label>
                          <Input
                            type="date"
                            value={paymentData.date}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Payment Method</label>
                        <Select value={paymentData.method} onValueChange={(value) => setPaymentData(prev => ({ ...prev, method: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="check">Check</SelectItem>
                            <SelectItem value="stripe">Stripe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={() => generateInvoice(creator)}
                          variant="outline"
                          className="w-full"
                        >
                          Generate Invoice
                        </Button>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePaymentStatusUpdate(creator, 'pending')}
                          >
                            Pending
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePaymentStatusUpdate(creator, 'paid')}
                          >
                            Mark Paid
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handlePaymentStatusUpdate(creator, 'overdue')}
                          >
                            Overdue
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
