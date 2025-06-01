
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BriefAnalysis {
  brand_name: string;
  target_audience: string;
  campaign_goals: string[];
  budget_range: string;
  timeline: string;
  preferred_platforms: string[];
  content_style: string;
  key_requirements: string[];
  questions: string[];
  summary: string;
}

interface InfluencerRecommendation {
  id: string;
  name: string;
  username: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  niche: string[];
  match_score: number;
  match_reasons: string[];
  estimated_rate: number;
}

export const useBrandBriefAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [briefAnalysis, setBriefAnalysis] = useState<BriefAnalysis | null>(null);
  const [influencerRecommendations, setInfluencerRecommendations] = useState<InfluencerRecommendation[]>([]);
  const { toast } = useToast();

  const analyzeBrief = async (briefText: string) => {
    setIsAnalyzing(true);
    try {
      console.log('Analyzing brand brief:', briefText);
      
      const { data, error } = await supabase.functions.invoke('analyze-brand-brief', {
        body: { briefText }
      });

      if (error) {
        console.error('Brief analysis error:', error);
        toast({
          title: "Analysis Error",
          description: "Failed to analyze your brand brief. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Brief analysis result:', data);
      
      if (data.analysis) {
        setBriefAnalysis(data.analysis);
      }
      
      if (data.recommendations) {
        setInfluencerRecommendations(data.recommendations);
      }

      toast({
        title: "Analysis Complete",
        description: `Found ${data.recommendations?.length || 0} matching influencers`,
      });

    } catch (error) {
      console.error('Unexpected analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeBrief,
    isAnalyzing,
    briefAnalysis,
    influencerRecommendations
  };
};
