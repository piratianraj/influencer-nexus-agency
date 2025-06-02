
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, FileText, Table } from 'lucide-react';
import { CampaignCreator } from '@/hooks/useCampaignCreators';
import { useToast } from '@/hooks/use-toast';

interface ReportStepProps {
  campaignCreators: CampaignCreator[];
  campaignName: string;
}

export const ReportStep: React.FC<ReportStepProps> = ({ campaignCreators, campaignName }) => {
  const { toast } = useToast();

  const generateCreatorReport = (creator: CampaignCreator) => {
    const reportContent = `
CREATOR CAMPAIGN REPORT

Campaign: ${campaignName}
Creator: ${creator.creator_id}
Report Generated: ${new Date().toLocaleString()}

=== OUTREACH ===
Contact Method: ${creator.contact_method || 'Not contacted'}
Contacted Date: ${creator.contacted_at ? new Date(creator.contacted_at).toLocaleDateString() : 'N/A'}

=== NEGOTIATION ===
Status: ${creator.status}
Agreed Rate: $${creator.agreed_rate?.toLocaleString() || 'Not agreed'}
Deliverables: ${creator.deliverables_count} pieces
Notes: ${creator.negotiation_notes || 'No notes'}

=== CONTRACT ===
Contract Signed: ${creator.contract_signed ? 'Yes' : 'No'}

=== PAYMENT ===
Payment Status: ${creator.payment_status}
Amount Due: $${creator.agreed_rate?.toLocaleString() || '0'}

=== TIMELINE ===
Created: ${new Date(creator.created_at).toLocaleDateString()}
Last Updated: ${new Date(creator.updated_at).toLocaleDateString()}

This is a MOCK REPORT for demonstration purposes only.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${creator.creator_id.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: `Campaign report for ${creator.creator_id} has been downloaded`,
    });
  };

  const generateCampaignSummary = () => {
    const totalCreators = campaignCreators.length;
    const contactedCreators = campaignCreators.filter(c => c.contacted_at).length;
    const contractedCreators = campaignCreators.filter(c => c.contract_signed).length;
    const paidCreators = campaignCreators.filter(c => c.payment_status === 'paid').length;
    const totalBudget = campaignCreators.reduce((sum, c) => sum + (c.agreed_rate || 0), 0);

    const summaryContent = `
CAMPAIGN SUMMARY REPORT

Campaign: ${campaignName}
Report Generated: ${new Date().toLocaleString()}

=== OVERVIEW ===
Total Creators: ${totalCreators}
Contacted: ${contactedCreators}
Contracted: ${contractedCreators}
Paid: ${paidCreators}
Total Budget: $${totalBudget.toLocaleString()}

=== CREATOR BREAKDOWN ===
${campaignCreators.map(creator => `
Creator: ${creator.creator_id}
Status: ${creator.status}
Rate: $${creator.agreed_rate?.toLocaleString() || '0'}
Contract: ${creator.contract_signed ? 'Signed' : 'Unsigned'}
Payment: ${creator.payment_status}
`).join('')}

=== PERFORMANCE METRICS ===
Response Rate: ${totalCreators > 0 ? Math.round((contactedCreators / totalCreators) * 100) : 0}%
Conversion Rate: ${contactedCreators > 0 ? Math.round((contractedCreators / contactedCreators) * 100) : 0}%
Payment Completion: ${contractedCreators > 0 ? Math.round((paidCreators / contractedCreators) * 100) : 0}%

This is a MOCK REPORT for demonstration purposes only.
    `;

    const blob = new Blob([summaryContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Campaign_Summary_${campaignName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Campaign Summary Downloaded",
      description: `Campaign summary report has been downloaded`,
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
          <BarChart3 className="h-5 w-5" />
          Campaign Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <div>
              <h3 className="font-semibold">Campaign Summary Report</h3>
              <p className="text-sm text-gray-600">Complete overview of campaign performance and metrics</p>
            </div>
            <Button onClick={generateCampaignSummary} className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Download Summary
            </Button>
          </div>

          <div>
            <h4 className="font-medium mb-4">Individual Creator Reports</h4>
            <div className="space-y-3">
              {campaignCreators.map((creator) => (
                <div key={creator.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <h5 className="font-medium">{creator.creator_id}</h5>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Rate: ${creator.agreed_rate?.toLocaleString() || '0'}</span>
                        <span>Deliverables: {creator.deliverables_count}</span>
                        <span>Payment: {creator.payment_status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(creator)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateCreatorReport(creator)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
