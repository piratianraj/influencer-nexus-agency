
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface UserFlowState {
  isNewUser: boolean;
  isReturningUser: boolean;
  isGuest: boolean;
  hasCompletedBrief: boolean;
  hasCampaigns: boolean;
}

export const useUserFlow = () => {
  const { user } = useAuth();
  const [flowState, setFlowState] = useState<UserFlowState>({
    isNewUser: false,
    isReturningUser: false,
    isGuest: true,
    hasCompletedBrief: false,
    hasCampaigns: false
  });

  useEffect(() => {
    if (user) {
      // Check if user has existing data (simplified logic)
      const hasCompletedBrief = localStorage.getItem(`brief_completed_${user.id}`) === 'true';
      const hasCampaigns = localStorage.getItem(`has_campaigns_${user.id}`) === 'true';
      
      setFlowState({
        isNewUser: !hasCompletedBrief && !hasCampaigns,
        isReturningUser: hasCompletedBrief || hasCampaigns,
        isGuest: false,
        hasCompletedBrief,
        hasCampaigns
      });
    } else {
      setFlowState({
        isNewUser: false,
        isReturningUser: false,
        isGuest: true,
        hasCompletedBrief: false,
        hasCampaigns: false
      });
    }
  }, [user]);

  const markBriefCompleted = () => {
    if (user) {
      localStorage.setItem(`brief_completed_${user.id}`, 'true');
      setFlowState(prev => ({ ...prev, hasCompletedBrief: true, isNewUser: false, isReturningUser: true }));
    }
  };

  const markCampaignCreated = () => {
    if (user) {
      localStorage.setItem(`has_campaigns_${user.id}`, 'true');
      setFlowState(prev => ({ ...prev, hasCampaigns: true, isNewUser: false, isReturningUser: true }));
    }
  };

  return {
    ...flowState,
    markBriefCompleted,
    markCampaignCreated
  };
};
