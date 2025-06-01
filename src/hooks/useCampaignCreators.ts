
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CampaignCreator {
  id: string;
  campaign_id: string;
  creator_id: string;
  status: 'selected' | 'contacted' | 'negotiating' | 'contracted' | 'completed' | 'cancelled';
  agreed_rate?: number;
  deliverables_count: number;
  contact_method?: 'email' | 'call';
  contacted_at?: string;
  negotiation_notes?: string;
  contract_signed: boolean;
  payment_status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  updated_at: string;
}

export const useCampaignCreators = (campaignId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaignCreators, setCampaignCreators] = useState<CampaignCreator[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaignCreators = async () => {
    if (!user || !campaignId) {
      setCampaignCreators([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching campaign creators for campaign:', campaignId);
      
      const { data, error } = await supabase
        .from('campaign_creators')
        .select(`
          *,
          campaigns!inner(user_id)
        `)
        .eq('campaign_id', campaignId)
        .eq('campaigns.user_id', user.id);

      if (error) {
        console.error('Error fetching campaign creators:', error);
        toast({
          title: "Database Error",
          description: "Failed to fetch campaign creators.",
          variant: "destructive"
        });
        return;
      }

      setCampaignCreators(data?.map(item => ({
        id: item.id,
        campaign_id: item.campaign_id,
        creator_id: item.creator_id,
        status: item.status,
        agreed_rate: item.agreed_rate,
        deliverables_count: item.deliverables_count,
        contact_method: item.contact_method,
        contacted_at: item.contacted_at,
        negotiation_notes: item.negotiation_notes,
        contract_signed: item.contract_signed,
        payment_status: item.payment_status,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching campaign creators.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCreatorToCampaign = async (creatorId: string, campaignId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('campaign_creators')
        .insert([{
          campaign_id: campaignId,
          creator_id: creatorId,
          status: 'selected',
          deliverables_count: 1,
          contract_signed: false,
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding creator to campaign:', error);
        toast({
          title: "Error",
          description: "Failed to add creator to campaign.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Creator Added",
        description: "Creator has been added to the campaign successfully.",
      });

      await fetchCampaignCreators();
      return data as CampaignCreator;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };

  const updateCampaignCreator = async (id: string, updates: Partial<CampaignCreator>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('campaign_creators')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating campaign creator:', error);
        toast({
          title: "Error",
          description: "Failed to update campaign creator.",
          variant: "destructive"
        });
        return null;
      }

      await fetchCampaignCreators();
      return data as CampaignCreator;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchCampaignCreators();
  }, [user, campaignId]);

  return {
    campaignCreators,
    loading,
    addCreatorToCampaign,
    updateCampaignCreator,
    refetch: fetchCampaignCreators
  };
};
