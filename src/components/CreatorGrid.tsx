
import React from 'react';
import CreatorCard from './CreatorCard';
import NegotiationSummary from './NegotiationSummary';

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location: string;
  niche: string[];
  platforms: string[];
  followers: number;
  engagement: number;
  rates: {
    post: number;
    story: number;
  };
  verified: boolean;
  isSelected?: boolean;
}

interface NegotiationData {
  contact_method: "email" | "call";
  agreed_price: number;
  deliverables_count: number;
  availability_window: string;
  follow_up_flag: boolean;
  parsed_summary: string;
  contacted_at: string;
  status: string;
}

interface CreatorGridProps {
  creators: Creator[];
  negotiations: Record<string, NegotiationData>;
  contractStatuses: Record<string, "none" | "unsigned" | "signed">;
  invoiceStatuses: Record<string, "none" | "unpaid" | "paid">;
  onOutreach: (creator: Creator, type: "email" | "call") => void;
  onOpenContract: (creator: Creator) => void;
  onOpenInvoice: (creator: Creator) => void;
  onCreatorSelect?: (creatorId: string) => void;
}

const CreatorGrid = ({ 
  creators, 
  negotiations, 
  contractStatuses, 
  invoiceStatuses, 
  onOutreach, 
  onOpenContract, 
  onOpenInvoice,
  onCreatorSelect
}: CreatorGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <div key={creator.id} className="space-y-4">
          <CreatorCard
            creator={creator}
            hasNegotiation={!!negotiations[creator.id]}
            onOutreach={onOutreach}
            onCreatorSelect={onCreatorSelect}
          />

          {negotiations[creator.id] && (
            <NegotiationSummary
              negotiation={negotiations[creator.id]}
              creatorName={creator.name}
              onOpenContract={() => onOpenContract(creator)}
              onOpenInvoice={() => onOpenInvoice(creator)}
              contractStatus={contractStatuses[creator.id] || "none"}
              invoiceStatus={invoiceStatuses[creator.id] || "none"}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CreatorGrid;
