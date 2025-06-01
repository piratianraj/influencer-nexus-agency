
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
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Seek partners
            </span>
            <br />
            <span className="text-gray-900">for </span>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
              influencer
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              collaborations.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with your favorite creators and be part of the community. 
            Streamline your influencer marketing campaigns with our comprehensive platform.
          </p>
          
          {user ? (
            <UserDashboard />
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                onClick={() => setAuthModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Subscribe Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setAuthModalOpen(true)}
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300"
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Top Rated Influencer Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Rated Influencer</h3>
            <div className="flex justify-center items-center space-x-4">
              <div className="flex -space-x-2">
                <img className="w-12 h-12 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=e11d48&color=fff" alt="Creator 1" />
                <img className="w-12 h-12 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=Mike+Chen&background=7c3aed&color=fff" alt="Creator 2" />
                <img className="w-12 h-12 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=Emma+Davis&background=2563eb&color=fff" alt="Creator 3" />
                <img className="w-12 h-12 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=Alex+Rivera&background=059669&color=fff" alt="Creator 4" />
                <img className="w-12 h-12 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=Lisa+Wong&background=dc2626&color=fff" alt="Creator 5" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600">20,000 influencers</p>
                <p className="text-lg font-semibold text-gray-900">Show All</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};
