
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import OutreachModal from '@/components/OutreachModal';
import { AdvancedFilters, FilterOptions } from '@/components/AdvancedFilters';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  location: string;
  niche: string[];
  platforms: string[];
  followers: number;
  engagement: number;
  rates: {
    post: number;
    story: number;
  };
  verified: boolean;
}

const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1552058544-f9e820c93e56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    location: 'Los Angeles, CA',
    niche: ['Fitness', 'Lifestyle'],
    platforms: ['Instagram', 'TikTok'],
    followers: 500000,
    engagement: 4.5,
    rates: {
      post: 1500,
      story: 500,
    },
    verified: true,
  },
  {
    id: '2',
    name: 'Mike Williams',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd8a72f9d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    location: 'New York, NY',
    niche: ['Tech', 'Gadgets'],
    platforms: ['YouTube', 'Twitter'],
    followers: 750000,
    engagement: 3.8,
    rates: {
      post: 2000,
      story: 750,
    },
    verified: false,
  },
  {
    id: '3',
    name: 'Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    location: 'London, UK',
    niche: ['Fashion', 'Beauty'],
    platforms: ['Instagram', 'Blog'],
    followers: 300000,
    engagement: 5.2,
    rates: {
      post: 1200,
      story: 400,
    },
    verified: true,
  },
  {
    id: '4',
    name: 'David Brown',
    avatar: 'https://images.unsplash.com/photo-1534528741702-a0cfae562c9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    location: 'Sydney, AU',
    niche: ['Travel', 'Adventure'],
    platforms: ['Instagram', 'YouTube'],
    followers: 600000,
    engagement: 4.0,
    rates: {
      post: 1800,
      story: 600,
    },
    verified: true,
  },
];

const Discovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [outreachModalOpen, setOutreachModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    followers: { min: 0, max: 0 },
    engagement: { min: 0, max: 0 },
    location: [],
    niche: [],
    priceRange: { min: 0, max: 0 },
    verified: null,
  });

  const resetFilters = () => {
    setFilters({
      platform: [],
      followers: { min: 0, max: 0 },
      engagement: { min: 0, max: 0 },
      location: [],
      niche: [],
      priceRange: { min: 0, max: 0 },
      verified: null,
    });
  };

  const applyFilters = (creators: Creator[]) => {
    return creators.filter(creator => {
      // Platform filter
      if (filters.platform.length > 0 && !filters.platform.some(p => creator.platforms.includes(p))) {
        return false;
      }
      
      // Followers filter
      if (filters.followers.min > 0 && creator.followers < filters.followers.min) return false;
      if (filters.followers.max > 0 && creator.followers > filters.followers.max) return false;
      
      // Engagement filter
      if (filters.engagement.min > 0 && creator.engagement < filters.engagement.min) return false;
      if (filters.engagement.max > 0 && creator.engagement > filters.engagement.max) return false;
      
      // Niche filter
      if (filters.niche.length > 0 && !filters.niche.some(n => creator.niche.includes(n))) {
        return false;
      }
      
      // Location filter
      if (filters.location.length > 0 && !filters.location.includes(creator.location)) {
        return false;
      }
      
      // Price filter
      if (filters.priceRange.min > 0 && creator.rates.post < filters.priceRange.min) return false;
      if (filters.priceRange.max > 0 && creator.rates.post > filters.priceRange.max) return false;
      
      // Verified filter
      if (filters.verified !== null && creator.verified !== filters.verified) return false;
      
      return true;
    });
  };

  const filteredCreators = applyFilters(mockCreators.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.niche.some(n => n.toLowerCase().includes(searchTerm.toLowerCase()))
  ));

  const handleOutreach = (creator: Creator) => {
    setSelectedCreator(creator);
    setOutreachModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-gray-900">InfluencerHub</Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link to="/discovery" className="text-blue-600 font-medium">Discovery</Link>
              <Link to="/analytics" className="text-gray-700 hover:text-blue-600 font-medium">Analytics</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Creators</h1>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search creators by name or niche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Active Filters Display */}
          {(filters.platform.length > 0 || filters.niche.length > 0 || filters.location.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.platform.map(platform => (
                <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                  {platform}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters({
                      ...filters, 
                      platform: filters.platform.filter(p => p !== platform)
                    })}
                  />
                </Badge>
              ))}
              {filters.niche.map(niche => (
                <Badge key={niche} variant="secondary" className="flex items-center gap-1">
                  {niche}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters({
                      ...filters, 
                      niche: filters.niche.filter(n => n !== niche)
                    })}
                  />
                </Badge>
              ))}
              {filters.location.map(location => (
                <Badge key={location} variant="secondary" className="flex items-center gap-1">
                  {location}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters({
                      ...filters, 
                      location: filters.location.filter(l => l !== location)
                    })}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <AdvancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
              />
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <Card key={creator.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {creator.name}
                          {creator.verified && <span className="text-blue-500">✓</span>}
                        </CardTitle>
                        <CardDescription>{creator.location}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {creator.niche.map(n => (
                        <Badge key={n} variant="secondary" className="text-xs">{n}</Badge>
                      ))}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Followers:</span>
                        <span className="font-medium">{creator.followers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engagement:</span>
                        <span className="font-medium">{creator.engagement}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rate/Post:</span>
                        <span className="font-medium">${creator.rates.post}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {creator.platforms.map(platform => (
                        <Badge key={platform} variant="outline" className="text-xs">{platform}</Badge>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => handleOutreach(creator)} 
                      className="w-full"
                    >
                      Contact Creator
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCreators.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No creators found matching your criteria</p>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <OutreachModal
        creator={selectedCreator}
        isOpen={outreachModalOpen}
        onClose={() => {
          setOutreachModalOpen(false);
          setSelectedCreator(null);
        }}
      />
    </div>
  );
};

export default Discovery;
