
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
      console.log('Fetching creators from database...');
      
      const { data, error } = await supabase
        .from('creator database')
        .select('*');

      console.log('Database response:', { data, error, count: data?.length || 0 });

      if (error) {
        console.error('Error fetching creators:', error);
        toast({
          title: "Database Error",
          description: `Failed to fetch creators: ${error.message}`,
          variant: "destructive"
        });
        
        // Fallback to mock data if database fails
        setCreators(getMockCreators());
        return;
      }

      if (!data || data.length === 0) {
        console.log('No creators found in database, using mock data');
        setCreators(getMockCreators());
        toast({
          title: "No Data",
          description: "No creators found in database. Using sample data.",
          variant: "default"
        });
        return;
      }

      const transformedCreators: Creator[] = data.map((creator: any) => {
        const niches = creator.niche ? creator.niche.split(',').map((n: string) => n.trim()) : ['general'];
        const platforms = creator.platform ? [creator.platform] : ['Instagram'];
        const followers = creator.followers || Math.floor(Math.random() * 100000) + 10000;
        const engagement = creator.engagement_rate || Math.floor(Math.random() * 10) + 1;
        
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

      console.log('Transformed creators:', transformedCreators.length);
      setCreators(transformedCreators);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Using sample data.",
        variant: "destructive"
      });
      setCreators(getMockCreators());
    } finally {
      setLoading(false);
    }
  };

  const getMockCreators = (): Creator[] => [
    {
      id: '1',
      name: 'Alex Johnson',
      username: '@alexfit',
      avatar: generateAvatarUrl('Alex Johnson'),
      location: 'United States',
      niche: ['fitness', 'health'],
      platforms: ['Instagram', 'YouTube'],
      followers: 125000,
      engagement: 4.8,
      rates: { post: 500, story: 150 },
      verified: true
    },
    {
      id: '2',
      name: 'Sarah Chen',
      username: '@sarahtech',
      avatar: generateAvatarUrl('Sarah Chen'),
      location: 'Canada',
      niche: ['tech', 'gadgets'],
      platforms: ['YouTube', 'TikTok'],
      followers: 89000,
      engagement: 6.2,
      rates: { post: 350, story: 100 },
      verified: false
    },
    {
      id: '3',
      name: 'Mike Style',
      username: '@mikestyle',
      avatar: generateAvatarUrl('Mike Style'),
      location: 'United Kingdom',
      niche: ['fashion', 'lifestyle'],
      platforms: ['Instagram'],
      followers: 67000,
      engagement: 5.4,
      rates: { post: 280, story: 80 },
      verified: true
    },
    {
      id: '4',
      name: 'Emma Food',
      username: '@emmafood',
      avatar: generateAvatarUrl('Emma Food'),
      location: 'Australia',
      niche: ['food', 'cooking'],
      platforms: ['TikTok'],
      followers: 45000,
      engagement: 7.1,
      rates: { post: 200, story: 60 },
      verified: false
    },
    {
      id: '5',
      name: 'David Travel',
      username: '@davidtravel',
      avatar: generateAvatarUrl('David Travel'),
      location: 'Germany',
      niche: ['travel', 'adventure'],
      platforms: ['YouTube'],
      followers: 95000,
      engagement: 5.8,
      rates: { post: 400, story: 120 },
      verified: true
    }
  ];

  useEffect(() => {
    fetchCreators();
  }, []);

  return { creators, loading, refetch: fetchCreators };
};
