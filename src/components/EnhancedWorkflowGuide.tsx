
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight, Plus, Search, MessageCircle, FileText, CreditCard, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCampaignCreators } from '@/hooks/useCampaignCreators';
import { OutreachStep } from './campaigns/workflow/OutreachStep';
import { NegotiationStep } from './campaigns/workflow/NegotiationStep';
import { ContractStep } from './campaigns/workflow/ContractStep';
import { PaymentStep } from './campaigns/workflow/PaymentStep';
import { ReportStep } from './campaigns/workflow/ReportStep';

interface EnhancedWorkflowGuideProps {
  campaignId: string;
  campaignName?: string;
  currentStep?: string;
  onStepUpdate?: (stepId: string) => void;
  onEdit?: () => void;
}

export const EnhancedWorkflowGuide: React.FC<EnhancedWorkflowGuideProps> = ({ 
  campaignId,
  campaignName = "Campaign",
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

  const renderStepContent = (step: any) => {
    switch (step.id) {
      case 'creator-search':
        return (
          <div className="mt-4">
            <Link to={`/discovery?campaignId=${campaignId}`}>
              <Button size="sm" className="w-full">
                Add More Creators ({campaignCreators.length} added)
              </Button>
            </Link>
          </div>
        );

      case 'outreach':
        return campaignCreators.length > 0 ? (
          <OutreachStep 
            campaignCreators={campaignCreators} 
            onUpdateCreator={updateCampaignCreator} 
          />
        ) : (
          <div className="mt-4 text-center text-gray-500">
            No creators added yet. Add creators first.
          </div>
        );

      case 'deal-negotiation':
        return campaignCreators.length > 0 ? (
          <NegotiationStep 
            campaignCreators={campaignCreators} 
            onUpdateCreator={updateCampaignCreator} 
          />
        ) : (
          <div className="mt-4 text-center text-gray-500">
            No creators to negotiate with yet.
          </div>
        );

      case 'contract':
        return campaignCreators.filter(c => c.agreed_rate).length > 0 ? (
          <ContractStep 
            campaignCreators={campaignCreators} 
            onUpdateCreator={updateCampaignCreator} 
          />
        ) : (
          <div className="mt-4 text-center text-gray-500">
            Complete negotiations first to generate contracts.
          </div>
        );

      case 'payment':
        return campaignCreators.filter(c => c.contract_signed).length > 0 ? (
          <PaymentStep 
            campaignCreators={campaignCreators} 
            onUpdateCreator={updateCampaignCreator} 
          />
        ) : (
          <div className="mt-4 text-center text-gray-500">
            Signed contracts required before processing payments.
          </div>
        );

      case 'report':
        return campaignCreators.length > 0 ? (
          <ReportStep 
            campaignCreators={campaignCreators} 
            campaignName={campaignName}
          />
        ) : (
          <div className="mt-4 text-center text-gray-500">
            No campaign data to report yet.
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
                  {renderStepContent(step)}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
