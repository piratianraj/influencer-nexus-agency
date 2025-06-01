
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { UserDashboard } from '@/components/UserDashboard';

export const HeroSection = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect Brands with 
            <span className="text-blue-600"> Influencers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your influencer marketing campaigns with our comprehensive platform
          </p>
          
          {user ? (
            <UserDashboard />
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setAuthModalOpen(true)}>
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>
            </div>
          )}
        </div>
      </section>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};
