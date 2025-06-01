
import { useState } from 'react';
import { Creator, NegotiationData, DiscoveryState } from '@/types/discovery';

export const useDiscoveryState = () => {
  const [state, setState] = useState<DiscoveryState>({
    searchTerm: '',
    selectedCreator: null,
    outreachModalOpen: false,
    outreachType: "email",
    showFilters: false,
    negotiations: {},
    contractStatuses: {},
    invoiceStatuses: {},
    contractModalOpen: false,
    invoiceModalOpen: false,
  });

  const updateState = (updates: Partial<DiscoveryState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleOutreach = (creator: Creator, type: "email" | "call") => {
    updateState({
      selectedCreator: creator,
      outreachType: type,
      outreachModalOpen: true,
    });
  };

  const handleNegotiationComplete = (creatorId: string, negotiationData: NegotiationData) => {
    updateState({
      negotiations: { ...state.negotiations, [creatorId]: negotiationData },
      contractStatuses: { ...state.contractStatuses, [creatorId]: "none" },
      invoiceStatuses: { ...state.invoiceStatuses, [creatorId]: "none" },
    });
  };

  const handleOpenContract = (creator: Creator) => {
    updateState({
      selectedCreator: creator,
      contractModalOpen: true,
    });
  };

  const handleOpenInvoice = (creator: Creator) => {
    updateState({
      selectedCreator: creator,
      invoiceModalOpen: true,
    });
  };

  const handleContractStatusChange = (creatorId: string, status: "unsigned" | "signed") => {
    updateState({
      contractStatuses: { ...state.contractStatuses, [creatorId]: status },
    });
  };

  const handleInvoiceStatusChange = (creatorId: string, status: "unpaid" | "paid") => {
    updateState({
      invoiceStatuses: { ...state.invoiceStatuses, [creatorId]: status },
    });
  };

  const closeOutreachModal = () => {
    updateState({
      outreachModalOpen: false,
      selectedCreator: null,
    });
  };

  const closeContractModal = () => {
    updateState({
      contractModalOpen: false,
      selectedCreator: null,
    });
  };

  const closeInvoiceModal = () => {
    updateState({
      invoiceModalOpen: false,
      selectedCreator: null,
    });
  };

  return {
    state,
    updateState,
    handleOutreach,
    handleNegotiationComplete,
    handleOpenContract,
    handleOpenInvoice,
    handleContractStatusChange,
    handleInvoiceStatusChange,
    closeOutreachModal,
    closeContractModal,
    closeInvoiceModal,
  };
};
