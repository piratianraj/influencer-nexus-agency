
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, X, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import OutreachModal from '@/components/OutreachModal';
import NegotiationSummary from '@/components/NegotiationSummary';
import ContractModal from '@/components/ContractModal';
import InvoiceModal from '@/components/InvoiceModal';
import { AdvancedFilters, FilterOptions } from '@/components/AdvancedFilters';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Creator {
  id: string;
  name: string;
  username: string;
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

interface NegotiationData {
  contact_method: "email" | "call";
  agreed_price: number;
  deliverables_count: number;
  availability_window: string;
  follow_up_flag: boolean;
  parsed_summary: string;
  contacted_at: string;
  status: string;
}

const Discovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [outreachModalOpen, setOutreachModalOpen] = useState(false);
  const [outreachType, setOutreachType] = useState<"email" | "call">("email");
  const [showFilters, setShowFilters] = useState(false);
  const [negotiations, setNegotiations] = useState<Record<string, NegotiationData>>({});
  const [contractStatuses, setContractStatuses] = useState<Record<string, "none" | "unsigned" | "signed">>({});
  const [invoiceStatuses, setInvoiceStatuses] = useState<Record<string, "none" | "unpaid" | "paid">>({});
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    followers: { min: 0, max: 0 },
    engagement: { min: 0, max: 0 },
    location: [],
    niche: [],
    priceRange: { min: 0, max: 0 },
    verified: null,
  });

  const generateAvatarUrl = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=96`;
  };

  const calculatePostRate = (followers: number, engagement: number) => {
    // Simple rate calculation based on followers and engagement
    const baseRate = Math.floor(followers / 1000) * 2;
    const engagementMultiplier = engagement / 5;
    return Math.max(Math.floor(baseRate * engagementMultiplier), 100);
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creator database')
        .select('*');

      if (error) {
        console.error('Error fetching creators:', error);
        toast({
          title: "Error",
          description: "Failed to fetch creators from database",
          variant: "destructive"
        });
        return;
      }

      // Transform database data to match the UI interface
      const transformedCreators: Creator[] = data.map((creator: any) => {
        const niches = creator.niche ? creator.niche.split(',').map((n: string) => n.trim()) : [];
        const platforms = creator.platform ? [creator.platform] : [];
        const followers = creator.followers || 0;
        const engagement = creator.engagement_rate || 0;
        
        return {
          id: creator.id || Math.random().toString(),
          name: creator.name || 'Unknown Creator',
          username: creator.handle || '@unknown',
          avatar: generateAvatarUrl(creator.name || 'Unknown'),
          location: creator.country || 'Unknown',
          niche: niches,
          platforms: platforms,
          followers: followers,
          engagement: engagement,
          rates: {
            post: calculatePostRate(followers, engagement),
            story: Math.floor(calculatePostRate(followers, engagement) * 0.3)
          },
          verified: Math.random() > 0.5 // Random verification status for demo
        };
      });

      setCreators(transformedCreators);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const filteredCreators = applyFilters(creators.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.niche.some(n => n.toLowerCase().includes(searchTerm.toLowerCase()))
  ));

  const handleOutreach = (creator: Creator, type: "email" | "call") => {
    setSelectedCreator(creator);
    setOutreachType(type);
    setOutreachModalOpen(true);
  };

  const handleNegotiationComplete = (creatorId: string, negotiationData: NegotiationData) => {
    setNegotiations(prev => ({ ...prev, [creatorId]: negotiationData }));
    setContractStatuses(prev => ({ ...prev, [creatorId]: "none" }));
    setInvoiceStatuses(prev => ({ ...prev, [creatorId]: "none" }));
  };

  const handleOpenContract = (creator: Creator) => {
    setSelectedCreator(creator);
    setContractModalOpen(true);
  };

  const handleOpenInvoice = (creator: Creator) => {
    setSelectedCreator(creator);
    setInvoiceModalOpen(true);
  };

  const handleContractStatusChange = (creatorId: string, status: "unsigned" | "signed") => {
    setContractStatuses(prev => ({ ...prev, [creatorId]: status }));
  };

  const handleInvoiceStatusChange = (creatorId: string, status: "unpaid" | "paid") => {
    setInvoiceStatuses(prev => ({ ...prev, [creatorId]: status }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading creators...</p>
        </div>
      </div>
    );
  }

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
                <div key={creator.id} className="space-y-4">
                  <Card className="hover:shadow-lg transition-shadow">
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
                      
                      {!negotiations[creator.id] ? (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleOutreach(creator, "email")} 
                            className="flex-1"
                            size="sm"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                          <Button 
                            onClick={() => handleOutreach(creator, "call")} 
                            variant="outline"
                            className="flex-1"
                            size="sm"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>

                  {/* Negotiation Summary */}
                  {negotiations[creator.id] && (
                    <NegotiationSummary
                      negotiation={negotiations[creator.id]}
                      creatorName={creator.name}
                      onOpenContract={() => handleOpenContract(creator)}
                      onOpenInvoice={() => handleOpenInvoice(creator)}
                      contractStatus={contractStatuses[creator.id] || "none"}
                      invoiceStatus={invoiceStatuses[creator.id] || "none"}
                    />
                  )}
                </div>
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
        type={outreachType}
        onNegotiationComplete={handleNegotiationComplete}
      />

      {selectedCreator && negotiations[selectedCreator.id] && (
        <>
          <ContractModal
            isOpen={contractModalOpen}
            onClose={() => {
              setContractModalOpen(false);
              setSelectedCreator(null);
            }}
            creatorName={selectedCreator.name}
            negotiationData={negotiations[selectedCreator.id]}
            contractStatus={contractStatuses[selectedCreator.id] || "none"}
            onStatusChange={(status) => handleContractStatusChange(selectedCreator.id, status)}
          />

          <InvoiceModal
            isOpen={invoiceModalOpen}
            onClose={() => {
              setInvoiceModalOpen(false);
              setSelectedCreator(null);
            }}
            creatorName={selectedCreator.name}
            negotiationData={negotiations[selectedCreator.id]}
            invoiceStatus={invoiceStatuses[selectedCreator.id] || "none"}
            onStatusChange={(status) => handleInvoiceStatusChange(selectedCreator.id, status)}
            contractSigned={contractStatuses[selectedCreator.id] === "signed"}
          />
        </>
      )}
    </div>
  );
};

export default Discovery;
