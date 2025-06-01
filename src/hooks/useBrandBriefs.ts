
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface BrandBrief {
  id: string;
  title: string;
  content: string;
  analysis_result?: any;
  recommendations?: any;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useBrandBriefs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [brandBriefs, setBrandBriefs] = useState<BrandBrief[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrandBriefs = async () => {
    if (!user) {
      setBrandBriefs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching brand briefs from database...');
      
      const { data, error } = await supabase
        .from('brand_briefs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching brand briefs:', error);
        toast({
          title: "Database Error",
          description: "Failed to fetch brand briefs.",
          variant: "destructive"
        });
        return;
      }

      setBrandBriefs(data as BrandBrief[]);
      console.log('Successfully fetched brand briefs:', data.length);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching brand briefs.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBrandBrief = async (briefData: { title: string; content: string }) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create brand briefs.",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('brand_briefs')
        .insert([{
          ...briefData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating brand brief:', error);
        toast({
          title: "Error",
          description: "Failed to create brand brief. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Brand Brief Created",
        description: `Brand brief "${briefData.title}" has been created successfully.`,
      });

      await fetchBrandBriefs();
      return data as BrandBrief;
    } catch (error) {
      console.error('Unexpected error creating brand brief:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the brand brief.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateBrandBrief = async (id: string, updates: Partial<BrandBrief>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('brand_briefs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating brand brief:', error);
        toast({
          title: "Error",
          description: "Failed to update brand brief.",
          variant: "destructive"
        });
        return null;
      }

      await fetchBrandBriefs();
      return data as BrandBrief;
    } catch (error) {
      console.error('Unexpected error updating brand brief:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchBrandBriefs();
  }, [user]);

  return {
    brandBriefs,
    loading,
    createBrandBrief,
    updateBrandBrief,
    refetch: fetchBrandBriefs
  };
};
