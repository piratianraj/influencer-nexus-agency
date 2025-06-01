
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
  semantic_similarity?: number;
}

interface PerformanceMetrics {
  total_creators_in_db: number;
  vector_filtered: number;
  final_matches: number;
}

export const useBrandBriefAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [briefAnalysis, setBriefAnalysis] = useState<BriefAnalysis | null>(null);
  const [influencerRecommendations, setInfluencerRecommendations] = useState<InfluencerRecommendation[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const { toast } = useToast();

  const analyzeBrief = async (briefText: string, useRAG: boolean = true) => {
    setIsAnalyzing(true);
    try {
      console.log('Analyzing brand brief with AI optimization:', briefText);
      
      const functionName = useRAG ? 'rag-brand-brief-analysis' : 'analyze-brand-brief';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { briefText }
      });

      if (error) {
        console.error('Brief analysis error:', error);
        
        // If RAG analysis fails, fallback to original method
        if (useRAG) {
          console.log('AI optimization failed, falling back to standard analysis...');
          toast({
            title: "Using Standard Analysis",
            description: "AI optimization unavailable, using standard analysis method.",
            variant: "default"
          });
          return await analyzeBrief(briefText, false);
        }
        
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

      if (data.performance) {
        setPerformanceMetrics(data.performance);
      }

      const recommendationCount = data.recommendations?.length || 0;
      const cacheStatus = data.cached ? ' (from cache)' : '';
      const performanceInfo = data.performance ? 
        ` Processed ${data.performance.vector_filtered} pre-filtered creators from ${data.performance.total_creators_in_db} total.` : '';

      toast({
        title: `Analysis Complete${cacheStatus}`,
        description: `Found ${recommendationCount} high-quality matches.${performanceInfo}`,
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
    influencerRecommendations,
    performanceMetrics
  };
};
