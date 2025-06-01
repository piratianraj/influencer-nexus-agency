
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Users, Bell, BarChart3 } from 'lucide-react';
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Platform Features
          </span>
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Everything you need to run successful influencer marketing campaigns
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/campaigns">
            <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 transform bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">Campaign Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Create and manage influencer marketing campaigns from start to finish
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link to="/discovery">
            <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 transform bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">Advanced Search</CardTitle>
                <CardDescription className="text-gray-600">
                  Find creators with detailed filters for platform, followers, engagement, and more
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link to="/analytics">
            <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 transform bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">Analytics Dashboard</CardTitle>
                <CardDescription className="text-gray-600">
                  Track all your campaigns with real-time analytics and performance metrics
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Card 
            className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 transform bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden"
            onClick={handleComingSoonClick}
          >
            <CardHeader className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">Smart Notifications</CardTitle>
              <CardDescription className="text-gray-600">
                Stay updated with real-time notifications for applications, payments, and more
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};
