
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentSetup } from '@/components/PaymentSetup';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-lg font-semibold mb-4">Welcome back, {user.name}!</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/campaigns">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-semibold">Campaigns</h4>
                <p className="text-sm text-gray-600">Manage campaigns</p>
              </CardContent>
            </Card>
          </Link>
          
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
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h4 className="font-semibold">Payments</h4>
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
