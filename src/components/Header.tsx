import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { UserProfile } from '@/components/UserProfile';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { PaymentSetup } from '@/components/PaymentSetup';

export const Header = () => {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">
            {/* Left: Logo */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">InfluencerHub</h1>
            </div>
            {/* Center: Navigation */}
            <nav className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link to="/campaigns" className="text-gray-700 hover:text-blue-600 font-medium">Campaigns</Link>
              <Link to="/discovery" className="text-gray-700 hover:text-blue-600 font-medium">Discovery</Link>
              <Link to="/analytics" className="text-gray-700 hover:text-blue-600 font-medium">Analytics</Link>
            </nav>
            {/* Right: User actions */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {user ? (
                <>
                  <NotificationDropdown />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPaymentModalOpen(true)}
                  >
                    <CreditCard className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setProfileModalOpen(true)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                  <Button variant="outline" onClick={logout} size="sm">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={() => setAuthModalOpen(true)}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      <UserProfile 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
      <PaymentSetup 
        isOpen={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)} 
      />
    </>
  );
};
