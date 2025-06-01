
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeedbackData {
  sessionId: string;
  action: 'click' | 'outreach' | 'save' | 'refine_search' | 'view_results';
  creatorId?: string;
  resultsCount?: number;
  sessionDuration?: number;
}

export const useSearchFeedback = () => {
  const [isLoading, setIsLoading] = useState(false);

  const recordFeedback = async (feedback: FeedbackData) => {
    if (!feedback.sessionId) return;
    
    setIsLoading(true);
    try {
      console.log('Recording feedback:', feedback);

      // Record interaction
      if (feedback.creatorId && feedback.action !== 'view_results') {
        await supabase
          .from('search_interactions')
          .insert({
            search_session_id: feedback.sessionId,
            creator_id: feedback.creatorId,
            interaction_type: feedback.action,
          });
      }

      // Update search session with feedback
      const updates: any = {};
      
      if (feedback.action === 'click' || feedback.action === 'outreach' || feedback.action === 'save') {
        updates.user_clicked_results = true;
      }
      
      if (feedback.action === 'refine_search') {
        updates.user_refined_search = true;
      }
      
      if (feedback.resultsCount !== undefined) {
        updates.results_count = feedback.resultsCount;
      }
      
      if (feedback.sessionDuration !== undefined) {
        updates.session_duration_seconds = feedback.sessionDuration;
      }

      // Calculate success score based on user interactions
      let successScore = 0.0;
      if (updates.user_clicked_results) successScore += 0.5;
      if (!updates.user_refined_search) successScore += 0.3; // No refinement needed = good
      if (feedback.resultsCount && feedback.resultsCount > 0) successScore += 0.2;
      
      updates.success_score = Math.min(successScore, 1.0);
      updates.updated_at = new Date().toISOString();

      if (Object.keys(updates).length > 0) {
        await supabase
          .from('search_sessions')
          .update(updates)
          .eq('id', feedback.sessionId);
      }

      // Update query embedding success score if this was a successful interaction
      if (successScore > 0.5) {
        await supabase
          .from('query_embeddings')
          .update({ success_score: successScore })
          .eq('search_session_id', feedback.sessionId);
      }

      console.log('Feedback recorded successfully');
    } catch (error) {
      console.error('Failed to record feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const learnFromSuccess = async (sessionId: string, query: string, filters: any) => {
    if (!sessionId) return;
    
    try {
      // Store successful pattern
      await supabase
        .from('learned_patterns')
        .insert({
          pattern_type: 'successful_query',
          input_text: query,
          output_structure: filters,
          confidence_score: 0.8,
          usage_count: 1,
        });

      console.log('Success pattern learned:', query);
    } catch (error) {
      console.error('Failed to learn from success:', error);
    }
  };

  return {
    recordFeedback,
    learnFromSuccess,
    isLoading
  };
};
