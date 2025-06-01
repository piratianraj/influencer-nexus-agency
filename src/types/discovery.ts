
export interface Creator {
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
}

export interface NegotiationData {
  contact_method: "email" | "call";
  agreed_price: number;
  deliverables_count: number;
  availability_window: string;
  follow_up_flag: boolean;
  parsed_summary: string;
  contacted_at: string;
  status: string;
}

export interface DiscoveryState {
  searchTerm: string;
  selectedCreator: Creator | null;
  outreachModalOpen: boolean;
  outreachType: "email" | "call";
  showFilters: boolean;
  negotiations: Record<string, NegotiationData>;
  contractStatuses: Record<string, "none" | "unsigned" | "signed">;
  invoiceStatuses: Record<string, "none" | "unpaid" | "paid">;
  contractModalOpen: boolean;
  invoiceModalOpen: boolean;
}
