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
  // Enhanced creator details from creator database
  name?: string;
  handle?: string;
  email?: string;
  platform?: string;
  followers?: number;
  engagement_rate?: number;
  niche?: string;
  country?: string;
  avatar?: string;
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
      
      // Join campaign_creators with creator database to get full creator details
      const { data, error } = await supabase
        .from('campaign_creators')
        .select(`
          *,
          campaigns!inner(user_id),
          creator_database!creator_id(
            name,
            handle,
            email,
            platform,
            followers,
            engagement_rate,
            niche,
            country
          )
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

      const enrichedCreators = data?.map(item => ({
        id: item.id,
        campaign_id: item.campaign_id,
        creator_id: item.creator_id,
        status: item.status as CampaignCreator['status'],
        agreed_rate: item.agreed_rate,
        deliverables_count: item.deliverables_count,
        contact_method: item.contact_method as CampaignCreator['contact_method'],
        contacted_at: item.contacted_at,
        negotiation_notes: item.negotiation_notes,
        contract_signed: item.contract_signed,
        payment_status: item.payment_status as CampaignCreator['payment_status'],
        created_at: item.created_at,
        updated_at: item.updated_at,
        // Enhanced creator details
        name: item.creator_database?.name || `Creator ${item.creator_id.slice(0, 8)}`,
        handle: item.creator_database?.handle,
        email: item.creator_database?.email,
        platform: item.creator_database?.platform,
        followers: item.creator_database?.followers,
        engagement_rate: item.creator_database?.engagement_rate,
        niche: item.creator_database?.niche,
        country: item.creator_database?.country,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.creator_id}`
      })) || [];

      setCampaignCreators(enrichedCreators);
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

  const removeCreatorFromCampaign = async (campaignCreatorId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('campaign_creators')
        .delete()
        .eq('id', campaignCreatorId);

      if (error) {
        console.error('Error removing creator from campaign:', error);
        toast({
          title: "Error",
          description: "Failed to remove creator from campaign.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Creator Removed",
        description: "Creator has been removed from the campaign.",
      });

      await fetchCampaignCreators();
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
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
    removeCreatorFromCampaign,
    updateCampaignCreator,
    refetch: fetchCampaignCreators
  };
};
