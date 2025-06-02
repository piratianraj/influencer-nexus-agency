import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckCircle, Circle, ArrowRight, Plus, Search, MessageCircle, FileText, CreditCard, BarChart3, Phone, Mail, Download, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCampaignCreators } from '@/hooks/useCampaignCreators';

interface Creator {
  id: string;
  name: string;
  status: string;
  contact_method?: string;
  agreed_rate?: number;
  contract_signed: boolean;
  payment_status: string;
}

interface EnhancedWorkflowGuideProps {
  campaignId: string;
  currentStep?: string;
  onStepUpdate?: (stepId: string) => void;
  onEdit?: () => void;
}

export const EnhancedWorkflowGuide: React.FC<EnhancedWorkflowGuideProps> = ({ 
  campaignId,
  currentStep = 'campaign-creation',
  onStepUpdate,
  onEdit
}) => {
  const { campaignCreators, updateCampaignCreator } = useCampaignCreators(campaignId);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const steps = [
    {
      id: 'campaign-creation',
      title: 'Campaign Creation',
      description: 'Define your campaign goals, budget, and target audience',
      icon: <Plus className="h-5 w-5" />,
      status: currentStep === 'campaign-creation' ? 'current' : 'completed',
      route: '/campaigns',
      action: 'Edit Campaign'
    },
    {
      id: 'creator-search',
      title: 'Creator Search',
      description: 'Find and filter creators that match your campaign requirements',
      icon: <Search className="h-5 w-5" />,
      status: currentStep === 'creator-search' ? 'current' : currentStep === 'campaign-creation' ? 'pending' : 'completed',
      route: `/discovery?campaignId=${campaignId}`,
      action: 'Find Creators'
    },
    {
      id: 'outreach',
      title: 'Outreach',
      description: 'Contact creators via email or phone to discuss collaboration',
      icon: <MessageCircle className="h-5 w-5" />,
      status: currentStep === 'outreach' ? 'current' : ['campaign-creation', 'creator-search'].includes(currentStep) ? 'pending' : 'completed',
      action: 'Start Outreach'
    },
    {
      id: 'deal-negotiation',
      title: 'Deal Negotiation',
      description: 'Negotiate terms, deliverables, and pricing with creators',
      icon: <ArrowRight className="h-5 w-5" />,
      status: currentStep === 'deal-negotiation' ? 'current' : ['campaign-creation', 'creator-search', 'outreach'].includes(currentStep) ? 'pending' : 'completed',
      action: 'Negotiate Terms'
    },
    {
      id: 'contract',
      title: 'Contract',
      description: 'Generate and sign contracts with selected creators',
      icon: <FileText className="h-5 w-5" />,
      status: currentStep === 'contract' ? 'current' : ['campaign-creation', 'creator-search', 'outreach', 'deal-negotiation'].includes(currentStep) ? 'pending' : 'completed',
      action: 'Create Contract'
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Process payments and manage invoices for creators',
      icon: <CreditCard className="h-5 w-5" />,
      status: currentStep === 'payment' ? 'current' : currentStep === 'report' ? 'completed' : 'pending',
      action: 'Process Payment'
    },
    {
      id: 'report',
      title: 'Report',
      description: 'Analyze campaign performance and generate insights',
      icon: <BarChart3 className="h-5 w-5" />,
      status: currentStep === 'report' ? 'current' : 'pending',
      action: 'View Report'
    }
  ];

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;

  const getStepIcon = (step: any) => {
    if (step.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (step.status === 'current') {
      return <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-white"></div>
      </div>;
    } else {
      return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepColor = (step: any) => {
    if (step.status === 'completed') return 'border-green-200 bg-green-50';
    if (step.status === 'current') return 'border-blue-200 bg-blue-50';
    return 'border-gray-200 bg-gray-50';
  };

  const handleOutreach = async (creatorId: string, method: 'email' | 'call') => {
    await updateCampaignCreator(creatorId, {
      contact_method: method,
      contacted_at: new Date().toISOString(),
      status: 'contacted'
    });
  };

  const handleNegotiationUpdate = async (creatorId: string, status: string, rate?: number) => {
    await updateCampaignCreator(creatorId, {
      status: status as any,
      agreed_rate: rate,
      negotiation_notes: `Status updated to ${status}${rate ? ` with rate $${rate}` : ''}`
    });
  };

  const handleContractUpdate = async (creatorId: string, signed: boolean) => {
    await updateCampaignCreator(creatorId, {
      contract_signed: signed,
      status: signed ? 'contracted' : 'negotiating'
    });
  };

  const handlePaymentUpdate = async (creatorId: string, status: string) => {
    await updateCampaignCreator(creatorId, {
      payment_status: status as any
    });
  };

  const handleDownloadReport = (creatorId: string) => {
    // Mock report download
    const creator = campaignCreators.find(c => c.id === creatorId);
    console.log(`Downloading report for ${creator?.creator_id}`);
  };

  const renderStepActions = (step: any) => {
    switch (step.id) {
      case 'creator-search':
        return (
          <div className="mt-4 space-y-2">
            <Link to={`/discovery?campaignId=${campaignId}`}>
              <Button size="sm" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Add More Creators
              </Button>
            </Link>
          </div>
        );

      case 'outreach':
        return (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Contact Creators:</h4>
            {campaignCreators.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">{creator.creator_id}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOutreach(creator.id, 'email')}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOutreach(creator.id, 'call')}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'deal-negotiation':
        return (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Negotiation Status:</h4>
            {campaignCreators.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">{creator.creator_id}</span>
                <Select onValueChange={(value) => handleNegotiationUpdate(creator.id, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={creator.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negotiating">Ongoing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contracted">Negotiated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );

      case 'contract':
        return (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Contract Status:</h4>
            {campaignCreators.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">{creator.creator_id}</span>
                <Select onValueChange={(value) => handleContractUpdate(creator.id, value === 'signed')}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={creator.contract_signed ? 'Signed' : 'Unsigned'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unsigned">Unsigned</SelectItem>
                    <SelectItem value="signed">Signed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );

      case 'payment':
        return (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Payment Status:</h4>
            {campaignCreators.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">{creator.creator_id}</span>
                <Select onValueChange={(value) => handlePaymentUpdate(creator.id, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={creator.payment_status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );

      case 'report':
        return (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Download Reports:</h4>
            {campaignCreators.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm">{creator.creator_id}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadReport(creator.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Campaign Workflow Guide
          <Badge variant="outline">{completedSteps}/{steps.length} Complete</Badge>
        </CardTitle>
        <CardDescription>
          Follow this guided workflow to complete your campaign from start to finish
        </CardDescription>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${getStepColor(step)}`}
              onClick={() => {
                setExpandedStep(expandedStep === step.id ? null : step.id);
                if (onStepUpdate) onStepUpdate(step.id);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      {index + 1}
                    </span>
                    {getStepIcon(step)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={
                      step.status === 'completed' ? 'bg-green-100 text-green-800' :
                      step.status === 'current' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {step.status}
                  </Badge>
                  {step.status !== 'pending' && step.route && (
                    step.action === 'Edit Campaign' && onEdit ? (
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                        {step.action}
                      </Button>
                    ) : (
                      <Link to={step.route} onClick={e => e.stopPropagation()}>
                        <Button size="sm" variant="outline">
                          {step.action}
                        </Button>
                      </Link>
                    )
                  )}
                </div>
              </div>
              
              {expandedStep === step.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {renderStepActions(step)}
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <h4 className="font-medium mb-2">What to do in this step:</h4>
                    <ul className="space-y-1 list-disc list-inside">
                      {step.id === 'campaign-creation' && (
                        <>
                          <li>Set campaign objectives and KPIs</li>
                          <li>Define target audience and demographics</li>
                          <li>Allocate budget and timeline</li>
                        </>
                      )}
                      {step.id === 'creator-search' && (
                        <>
                          <li>Use filters to find relevant creators</li>
                          <li>Review creator profiles and engagement rates</li>
                          <li>Save potential creators to your shortlist</li>
                        </>
                      )}
                      {step.id === 'outreach' && (
                        <>
                          <li>Send personalized outreach messages</li>
                          <li>Schedule calls with interested creators</li>
                          <li>Present campaign brief and requirements</li>
                        </>
                      )}
                      {step.id === 'deal-negotiation' && (
                        <>
                          <li>Discuss deliverables and content requirements</li>
                          <li>Negotiate pricing and payment terms</li>
                          <li>Agree on posting schedule and deadlines</li>
                        </>
                      )}
                      {step.id === 'contract' && (
                        <>
                          <li>Generate contracts with agreed terms</li>
                          <li>Send contracts for creator review and signature</li>
                          <li>Store signed contracts securely</li>
                        </>
                      )}
                      {step.id === 'payment' && (
                        <>
                          <li>Create invoices for completed deliverables</li>
                          <li>Process payments according to agreed terms</li>
                          <li>Track payment status and confirmations</li>
                        </>
                      )}
                      {step.id === 'report' && (
                        <>
                          <li>Analyze campaign performance metrics</li>
                          <li>Generate comprehensive reports</li>
                          <li>Identify insights for future campaigns</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
