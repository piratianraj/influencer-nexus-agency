
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
}

export const useCreatorData = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const generateAvatarUrl = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=96`;
  };

  const calculatePostRate = (followers: number, engagement: number) => {
    const baseRate = Math.floor(followers / 1000) * 2;
    const engagementMultiplier = engagement / 5;
    return Math.max(Math.floor(baseRate * engagementMultiplier), 100);
  };

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creator database')
        .select('*');

      if (error) {
        console.error('Error fetching creators:', error);
        toast({
          title: "Error",
          description: "Failed to fetch creators from database",
          variant: "destructive"
        });
        return;
      }

      const transformedCreators: Creator[] = data.map((creator: any) => {
        const niches = creator.niche ? creator.niche.split(',').map((n: string) => n.trim()) : [];
        const platforms = creator.platform ? [creator.platform] : [];
        const followers = creator.followers || 0;
        const engagement = creator.engagement_rate || 0;
        
        return {
          id: creator.id || Math.random().toString(),
          name: creator.name || 'Unknown Creator',
          username: creator.handle || '@unknown',
          avatar: generateAvatarUrl(creator.name || 'Unknown'),
          location: creator.country || 'Unknown',
          niche: niches,
          platforms: platforms,
          followers: followers,
          engagement: engagement,
          rates: {
            post: calculatePostRate(followers, engagement),
            story: Math.floor(calculatePostRate(followers, engagement) * 0.3)
          },
          verified: Math.random() > 0.5
        };
      });

      setCreators(transformedCreators);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  return { creators, loading, refetch: fetchCreators };
};
