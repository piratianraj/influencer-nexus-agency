
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'brand' | 'creator';
  avatar?: string;
  company?: string;
  industry?: string;
  createdAt: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  guestId: string | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string, type: 'brand' | 'creator') => Promise<{ error?: string }>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate or get guest session ID
  const getGuestSessionId = () => {
    let sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guest_session_id', sessionId);
    }
    return sessionId;
  };

  // Create or update guest user in database
  const ensureGuestUser = async (sessionId: string) => {
    try {
      const { data: existingGuest } = await supabase
        .from('guest_users')
        .select('id')
        .eq('session_id', sessionId)
        .single();

      if (existingGuest) {
        // Update last_active
        await supabase
          .from('guest_users')
          .update({ last_active: new Date().toISOString() })
          .eq('session_id', sessionId);
        return existingGuest.id;
      } else {
        // Create new guest user
        const { data: newGuest } = await supabase
          .from('guest_users')
          .insert({ session_id: sessionId })
          .select('id')
          .single();
        return newGuest?.id;
      }
    } catch (error) {
      console.error('Error managing guest user:', error);
      return null;
    }
  };

  // Fetch user profile from profiles table
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        return {
          id: profile.id,
          email: profile.email || '',
          name: profile.name,
          type: profile.user_type as 'brand' | 'creator',
          avatar: profile.avatar_url || undefined,
          company: profile.company || undefined,
          industry: profile.industry || undefined,
          createdAt: profile.created_at,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          // User is authenticated, fetch their profile
          const profile = await fetchUserProfile(session.user.id);
          if (mounted) {
            setUser(profile);
            setGuestId(null);
            // Clear guest session when user logs in
            localStorage.removeItem('guest_session_id');
          }
        } else {
          // No authenticated user, set up guest tracking
          if (mounted) {
            setUser(null);
            const sessionId = getGuestSessionId();
            const guestUserId = await ensureGuestUser(sessionId);
            if (mounted) {
              setGuestId(guestUserId);
            }
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (!session) {
        // No authenticated user, set up guest
        const sessionId = getGuestSessionId();
        ensureGuestUser(sessionId).then(guestUserId => {
          if (mounted) {
            setGuestId(guestUserId);
            setIsLoading(false);
          }
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signup = async (email: string, password: string, name: string, type: 'brand' | 'creator'): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            user_type: type,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        return { error: error.message };
      }
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const loginAsGuest = async () => {
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      
      // Set up guest session
      const sessionId = getGuestSessionId();
      const guestUserId = await ensureGuestUser(sessionId);
      setGuestId(guestUserId);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error setting up guest session:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    // Guest session will be set up automatically in the auth state change listener
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ error?: string }> => {
    if (!user || !session) {
      return { error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          company: updates.company,
          industry: updates.industry,
          user_type: updates.type,
          avatar_url: updates.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return {};
    } catch (error) {
      return { error: 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      guestId, 
      login, 
      signup, 
      loginAsGuest, 
      logout, 
      isLoading,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
