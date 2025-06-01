
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  total_spend: number;
  total_reach: number;
  total_impressions: number;
  total_engagement: number;
  start_date: string;
  end_date: string;
  influencer_count: number;
  workflow_step: 'campaign-creation' | 'creator-search' | 'outreach' | 'deal-negotiation' | 'contract' | 'payment' | 'report';
  created_at: string;
  updated_at: string;
}

export const useCampaigns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const getMockCampaigns = (): Campaign[] => [
    {
      id: 'mock-1',
      name: 'Summer Fashion Launch',
      description: 'Promoting our new summer collection with fashion influencers',
      status: 'active',
      budget: 15000,
      total_spend: 8500,
      total_reach: 125000,
      total_impressions: 450000,
      total_engagement: 22500,
      start_date: '2024-06-01',
      end_date: '2024-08-31',
      influencer_count: 5,
      workflow_step: 'outreach',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-2',
      name: 'Tech Product Review',
      description: 'Getting reviews for our latest smartphone',
      status: 'draft',
      budget: 25000,
      total_spend: 0,
      total_reach: 0,
      total_impressions: 0,
      total_engagement: 0,
      start_date: '2024-07-15',
      end_date: '2024-09-15',
      influencer_count: 0,
      workflow_step: 'campaign-creation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const fetchCampaigns = async () => {
    if (!user) {
      setCampaigns([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching campaigns from database...');
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          title: "Database Error",
          description: "Failed to fetch campaigns. Using sample data.",
          variant: "destructive"
        });
        setCampaigns(getMockCampaigns());
        return;
      }

      if (!data || data.length === 0) {
        console.log('No campaigns found in database, using mock data');
        setCampaigns(getMockCampaigns());
        toast({
          title: "No Campaigns",
          description: "No campaigns found. Create your first campaign!",
          variant: "default"
        });
        return;
      }

      setCampaigns(data as Campaign[]);
      console.log('Successfully fetched campaigns:', data.length);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Using sample data.",
        variant: "destructive"
      });
      setCampaigns(getMockCampaigns());
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create campaigns.",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          ...campaignData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating campaign:', error);
        toast({
          title: "Error",
          description: "Failed to create campaign. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Campaign Created",
        description: `Campaign "${campaignData.name}" has been created successfully.`,
      });

      await fetchCampaigns();
      return data as Campaign;
    } catch (error) {
      console.error('Unexpected error creating campaign:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the campaign.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating campaign:', error);
        toast({
          title: "Error",
          description: "Failed to update campaign.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Campaign Updated",
        description: "Campaign has been updated successfully.",
      });

      await fetchCampaigns();
      return data as Campaign;
    } catch (error) {
      console.error('Unexpected error updating campaign:', error);
      return null;
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting campaign:', error);
        toast({
          title: "Error",
          description: "Failed to delete campaign.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Campaign Deleted",
        description: "Campaign has been deleted successfully.",
      });

      await fetchCampaigns();
      return true;
    } catch (error) {
      console.error('Unexpected error deleting campaign:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [user]);

  return {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refetch: fetchCampaigns
  };
};
