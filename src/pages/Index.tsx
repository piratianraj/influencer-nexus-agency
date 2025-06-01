
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, Bell, User, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { UserProfile } from '@/components/UserProfile';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { PaymentSetup } from '@/components/PaymentSetup';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const { toast } = useToast();

  const handleComingSoonClick = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is currently under development and will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">InfluencerHub</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link to="/discovery" className="text-gray-700 hover:text-blue-600 font-medium">Discovery</Link>
              <Link to="/analytics" className="text-gray-700 hover:text-blue-600 font-medium">Analytics</Link>
            </nav>

            <div className="flex items-center space-x-4">
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

      {/* Hero Section */}
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
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
              <h3 className="text-lg font-semibold mb-4">Welcome back, {user.name}!</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/discovery">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Search className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold">Find Creators</h4>
                      <p className="text-sm text-gray-600">Discover perfect influencers</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/analytics">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-semibold">Campaign Analytics</h4>
                      <p className="text-sm text-gray-600">Track performance</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Card 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setPaymentModalOpen(true)}
                >
                  <CardContent className="p-4 text-center">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-semibold">Payments</h4>
                    <p className="text-sm text-gray-600">Manage transactions</p>
                  </CardContent>
                </Card>
              </div>
            </div>
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

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/discovery">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform transition-transform">
                <CardHeader>
                  <Search className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Advanced Search</CardTitle>
                  <CardDescription>
                    Find creators with detailed filters for platform, followers, engagement, and more
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link to="/analytics">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform transition-transform">
                <CardHeader>
                  <Users className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Campaign Management</CardTitle>
                  <CardDescription>
                    Track all your campaigns from outreach to completion with real-time updates
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform transition-transform"
              onClick={handleComingSoonClick}
            >
              <CardHeader>
                <Bell className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Smart Notifications</CardTitle>
                <CardDescription>
                  Stay updated with real-time notifications for applications, payments, and more
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform transition-transform"
              onClick={handleComingSoonClick}
            >
              <CardHeader>
                <CreditCard className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Process payments securely with built-in escrow and automated disbursements
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Modals */}
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
    </div>
  );
};

export default Index;
