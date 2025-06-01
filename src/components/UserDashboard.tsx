
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, CreditCard, BarChart3, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentSetup } from '@/components/PaymentSetup';
import { Button } from '@/components/ui/button';

export const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  if (!user) return null;

  const handleCreateCampaign = () => {
    navigate('/campaigns?create=true');
  };

  return (
    <>
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-xl mb-8">
        <h3 className="text-2xl font-bold mb-6">
          Welcome back, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{user.name}</span>!
        </h3>
        
        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/campaigns">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Users className="h-5 w-5 mr-2" />
              My Campaigns
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline"
            onClick={handleCreateCampaign}
            className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Campaign
          </Button>
        </div>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/discovery">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">Find Creators</h4>
                <p className="text-sm text-gray-600">Discover perfect influencers</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/analytics">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">Analytics</h4>
                <p className="text-sm text-gray-600">Track performance</p>
              </CardContent>
            </Card>
          </Link>
          
          <Card 
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl"
            onClick={() => setPaymentModalOpen(true)}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-1">Payments</h4>
              <p className="text-sm text-gray-600">Manage transactions</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentSetup 
        isOpen={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)} 
      />
    </>
  );
};
