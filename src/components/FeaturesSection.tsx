
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Users, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const FeaturesSection = () => {
  const { toast } = useToast();

  const handleComingSoonClick = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is currently under development and will be available soon!",
    });
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link to="/campaigns">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform transition-transform">
              <CardHeader>
                <Users className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Campaign Management</CardTitle>
                <CardDescription>
                  Create and manage influencer marketing campaigns from start to finish
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
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
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track all your campaigns with real-time analytics and performance metrics
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform transition-transform"
            onClick={handleComingSoonClick}
          >
            <CardHeader>
              <Bell className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Smart Notifications</CardTitle>
              <CardDescription>
                Stay updated with real-time notifications for applications, payments, and more
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};
