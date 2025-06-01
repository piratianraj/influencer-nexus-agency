
import React from 'react';
import OutreachModal from '@/components/OutreachModal';
import ContractModal from '@/components/ContractModal';
import InvoiceModal from '@/components/InvoiceModal';
import { Creator, NegotiationData } from '@/types/discovery';

interface DiscoveryModalsProps {
  selectedCreator: Creator | null;
  outreachModalOpen: boolean;
  outreachType: "email" | "call";
  contractModalOpen: boolean;
  invoiceModalOpen: boolean;
  negotiations: Record<string, NegotiationData>;
  contractStatuses: Record<string, "none" | "unsigned" | "signed">;
  invoiceStatuses: Record<string, "none" | "unpaid" | "paid">;
  onCloseOutreach: () => void;
  onCloseContract: () => void;
  onCloseInvoice: () => void;
  onNegotiationComplete: (creatorId: string, negotiationData: NegotiationData) => void;
  onContractStatusChange: (creatorId: string, status: "unsigned" | "signed") => void;
  onInvoiceStatusChange: (creatorId: string, status: "unpaid" | "paid") => void;
}

const DiscoveryModals = ({
  selectedCreator,
  outreachModalOpen,
  outreachType,
  contractModalOpen,
  invoiceModalOpen,
  negotiations,
  contractStatuses,
  invoiceStatuses,
  onCloseOutreach,
  onCloseContract,
  onCloseInvoice,
  onNegotiationComplete,
  onContractStatusChange,
  onInvoiceStatusChange,
}: DiscoveryModalsProps) => {
  return (
    <>
      <OutreachModal
        creator={selectedCreator}
        isOpen={outreachModalOpen}
        onClose={onCloseOutreach}
        type={outreachType}
        onNegotiationComplete={onNegotiationComplete}
      />

      {selectedCreator && negotiations[selectedCreator.id] && (
        <>
          <ContractModal
            isOpen={contractModalOpen}
            onClose={onCloseContract}
            creatorName={selectedCreator.name}
            negotiationData={negotiations[selectedCreator.id]}
            contractStatus={contractStatuses[selectedCreator.id] || "none"}
            onStatusChange={(status) => onContractStatusChange(selectedCreator.id, status)}
          />

          <InvoiceModal
            isOpen={invoiceModalOpen}
            onClose={onCloseInvoice}
            creatorName={selectedCreator.name}
            negotiationData={negotiations[selectedCreator.id]}
            invoiceStatus={invoiceStatuses[selectedCreator.id] || "none"}
            onStatusChange={(status) => onInvoiceStatusChange(selectedCreator.id, status)}
            contractSigned={contractStatuses[selectedCreator.id] === "signed"}
          />
        </>
      )}
    </>
  );
};

export default DiscoveryModals;
