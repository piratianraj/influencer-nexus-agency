import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import OutreachModal from "@/components/OutreachModal";
import NegotiationSummary from "@/components/NegotiationSummary";
import ContractModal from "@/components/ContractModal";
import InvoiceModal from "@/components/InvoiceModal";

interface Creator {
  id: string;
  username: string;
  name: string;
  profile_picture_url: string;
  platform: "Instagram" | "YouTube";
  followers_count: number;
  follows_count: number;
  media_count: number;
  biography: string;
  average_engagement_rate: number;
  niche: string;
  last_30_day_growth_percent: number;
  avg_30_day_views: number;
  avg_30_day_likes: number;
  avg_30_day_shares: number;
  language: string;
  avg_watch_time_seconds: number;
}

interface Brief {
  brief_id: string;
  brand_name: string;
  raw_text: string;
  budget: number;
  timeline: string;
  num_creators: number;
  follower_range_min: number;
  follower_range_max: number;
  niche: string;
  platforms: string[];
  geography: string;
  created_at: string;
}

const Discovery = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [expandedCreator, setExpandedCreator] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [outreachModal, setOutreachModal] = useState<{
    isOpen: boolean;
    creator: Creator | null;
    type: "email" | "call";
  }>({ isOpen: false, creator: null, type: "email" });
  const [negotiations, setNegotiations] = useState<Record<string, any>>({});
  const [contracts, setContracts] = useState<Record<string, "none" | "unsigned" | "signed">>({});
  const [invoices, setInvoices] = useState<Record<string, "none" | "unpaid" | "paid">>({});
  const [contractModal, setContractModal] = useState<{
    isOpen: boolean;
    creatorId: string | null;
  }>({ isOpen: false, creatorId: null });
  const [invoiceModal, setInvoiceModal] = useState<{
    isOpen: boolean;
    creatorId: string | null;
  }>({ isOpen: false, creatorId: null });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load brief from localStorage
    const storedBrief = localStorage.getItem('currentBrief');
    if (!storedBrief) {
      toast({
        title: "No brief found",
        description: "Please upload a brief first.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    const parsedBrief = JSON.parse(storedBrief);
    setBrief(parsedBrief);
    
    // Load and filter creators
    loadCreators(parsedBrief);
  }, []);

  const loadCreators = async (currentBrief: Brief) => {
    setIsLoading(true);
    try {
      // Mock creator data - in real app this would come from your backend
      const mockCreators: Creator[] = [
        {
          id: "1",
          username: "@fitnessjourney_raj",
          name: "Raj Kumar",
          profile_picture_url: "/placeholder.svg",
          platform: "Instagram",
          followers_count: 85000,
          follows_count: 1200,
          media_count: 450,
          biography: "Fitness coach helping people transform their lives 💪 📧 raj.fitness@gmail.com",
          average_engagement_rate: 4.2,
          niche: "fitness",
          last_30_day_growth_percent: 8.5,
          avg_30_day_views: 25000,
          avg_30_day_likes: 3500,
          avg_30_day_shares: 180,
          language: "Hindi",
          avg_watch_time_seconds: 45
        },
        {
          id: "2",
          username: "@techreviewsindia",
          name: "Priya Sharma",
          profile_picture_url: "/placeholder.svg",
          platform: "YouTube",
          followers_count: 120000,
          follows_count: 800,
          media_count: 320,
          biography: "Tech reviews and tutorials in Hindi/English 📱 Contact: techpriya@gmail.com | +91 9876543210",
          average_engagement_rate: 6.8,
          niche: "tech",
          last_30_day_growth_percent: 12.3,
          avg_30_day_views: 45000,
          avg_30_day_likes: 4200,
          avg_30_day_shares: 350,
          language: "Hindi, English",
          avg_watch_time_seconds: 180
        },
        {
          id: "3",
          username: "@yogawithmeera",
          name: "Meera Patel",
          profile_picture_url: "/placeholder.svg",
          platform: "Instagram",
          followers_count: 65000,
          follows_count: 900,
          media_count: 380,
          biography: "Yoga instructor & wellness coach 🧘‍♀️ Daily yoga tips | meera.yoga@hotmail.com",
          average_engagement_rate: 5.1,
          niche: "fitness",
          last_30_day_growth_percent: 6.2,
          avg_30_day_views: 18000,
          avg_30_day_likes: 2800,
          avg_30_day_shares: 150,
          language: "English",
          avg_watch_time_seconds: 35
        },
        {
          id: "4",
          username: "@foodie_mumbai",
          name: "Arjun Singh",
          profile_picture_url: "/placeholder.svg",
          platform: "Instagram",
          followers_count: 95000,
          follows_count: 1500,
          media_count: 520,
          biography: "Mumbai food blogger 🍛 Restaurant reviews & recipes | arjun.food@gmail.com | 9988776655",
          average_engagement_rate: 3.9,
          niche: "food",
          last_30_day_growth_percent: 10.1,
          avg_30_day_views: 22000,
          avg_30_day_likes: 3200,
          avg_30_day_shares: 200,
          language: "Hindi, English",
          avg_watch_time_seconds: 50
        }
      ];

      // Filter creators based on brief criteria
      const filteredCreators = mockCreators
        .filter(creator => 
          creator.followers_count >= currentBrief.follower_range_min &&
          creator.followers_count <= currentBrief.follower_range_max &&
          creator.niche === currentBrief.niche
        )
        .sort((a, b) => b.average_engagement_rate - a.average_engagement_rate)
        .slice(0, 15);

      setCreators(filteredCreators);
      
      if (filteredCreators.length === 0) {
        toast({
          title: "No creators found",
          description: "Try adjusting your criteria or expanding the follower range.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error loading creators",
        description: "Failed to load creator recommendations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractContactInfo = (biography: string) => {
    const emailMatch = biography.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = biography.match(/\+?91[\s-]?\d{10}|\d{10}/);
    
    return {
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null
    };
  };

  const handleOpenOutreach = (creator: Creator, type: "email" | "call") => {
    setOutreachModal({
      isOpen: true,
      creator,
      type
    });
  };

  const handleCloseOutreach = () => {
    setOutreachModal({
      isOpen: false,
      creator: null,
      type: "email"
    });
  };

  const handleNegotiationComplete = (creatorId: string, negotiationData: any) => {
    setNegotiations(prev => ({
      ...prev,
      [creatorId]: negotiationData
    }));
  };

  const handleGenerateContract = (creatorId: string) => {
    const creator = creators.find(c => c.id === creatorId);
    const negotiation = negotiations[creatorId];
    
    if (!creator || !negotiation) return;

    // Mock contract generation
    const contractData = `Contract_${creator.username}_${Date.now()}.pdf`;
    console.log("Generating contract:", contractData);
    
    toast({
      title: "Contract Generated",
      description: `Contract stub created for ${creator.name}`,
    });

    // Update negotiation with contract status
    setNegotiations(prev => ({
      ...prev,
      [creatorId]: {
        ...prev[creatorId],
        contract_status: "unsigned",
        contract_generated_at: new Date().toISOString()
      }
    }));
  };

  const handleOpenContract = (creatorId: string) => {
    setContractModal({
      isOpen: true,
      creatorId
    });
  };

  const handleCloseContract = () => {
    setContractModal({
      isOpen: false,
      creatorId: null
    });
  };

  const handleContractStatusChange = (creatorId: string, status: "unsigned" | "signed") => {
    setContracts(prev => ({
      ...prev,
      [creatorId]: status
    }));
  };

  const handleOpenInvoice = (creatorId: string) => {
    setInvoiceModal({
      isOpen: true,
      creatorId
    });
  };

  const handleCloseInvoice = () => {
    setInvoiceModal({
      isOpen: false,
      creatorId: null
    });
  };

  const handleInvoiceStatusChange = (creatorId: string, status: "unpaid" | "paid") => {
    setInvoices(prev => ({
      ...prev,
      [creatorId]: status
    }));
  };

  const getCreatorStatus = (creatorId: string) => {
    const negotiation = negotiations[creatorId];
    if (!negotiation) return "Not Contacted";
    if (negotiation.status === "completed") return "Negotiation Complete";
    return "In Progress";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading Creator Recommendations...</h1>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Brief Summary */}
        {brief && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Campaign Brief Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><strong>Budget:</strong> ₹{brief.budget.toLocaleString()}</div>
                <div><strong>Timeline:</strong> {brief.timeline}</div>
                <div><strong>Creators Needed:</strong> {brief.num_creators}</div>
                <div><strong>Niche:</strong> {brief.niche}</div>
                <div><strong>Follower Range:</strong> {brief.follower_range_min.toLocaleString()} - {brief.follower_range_max.toLocaleString()}</div>
                <div><strong>Platforms:</strong> {brief.platforms.join(", ")}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Recommended Creators ({creators.length})</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            New Brief
          </Button>
        </div>

        {/* Creator Grid */}
        <div className="grid gap-6">
          {creators.map((creator) => {
            const contactInfo = extractContactInfo(creator.biography);
            const isExpanded = expandedCreator === creator.id;
            const negotiation = negotiations[creator.id];
            const status = getCreatorStatus(creator.id);
            const contractStatus = contracts[creator.id] || "none";
            const invoiceStatus = invoices[creator.id] || "none";
            
            return (
              <Card key={creator.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={creator.profile_picture_url} 
                        alt={creator.name}
                        className="w-16 h-16 rounded-full bg-gray-200"
                      />
                      <div>
                        <CardTitle className="text-xl">{creator.name}</CardTitle>
                        <CardDescription className="text-lg font-medium">
                          {creator.username}
                        </CardDescription>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={creator.platform === "Instagram" ? "default" : "secondary"}>
                            {creator.platform}
                          </Badge>
                          <Badge variant="outline">{creator.niche}</Badge>
                          <Badge variant="outline">{creator.language}</Badge>
                          <Badge 
                            variant={status === "Negotiation Complete" ? "default" : status === "In Progress" ? "secondary" : "outline"}
                          >
                            {status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {creator.average_engagement_rate}%
                      </div>
                      <div className="text-sm text-gray-500">Engagement Rate</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{creator.followers_count.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{creator.avg_30_day_views.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Avg Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{creator.last_30_day_growth_percent}%</div>
                      <div className="text-sm text-gray-500">30d Growth</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{creator.biography}</p>

                  {isExpanded && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                      <h4 className="font-semibold">Detailed Metrics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Media Count:</strong> {creator.media_count}</div>
                        <div><strong>Following:</strong> {creator.follows_count.toLocaleString()}</div>
                        <div><strong>Avg Likes:</strong> {creator.avg_30_day_likes.toLocaleString()}</div>
                        <div><strong>Avg Shares:</strong> {creator.avg_30_day_shares}</div>
                        <div><strong>Watch Time:</strong> {creator.avg_watch_time_seconds}s</div>
                      </div>
                      
                      {(contactInfo.email || contactInfo.phone) && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="font-medium mb-2">Contact Information</h5>
                          {contactInfo.email && (
                            <div className="text-sm"><strong>Email:</strong> {contactInfo.email}</div>
                          )}
                          {contactInfo.phone && (
                            <div className="text-sm"><strong>Phone:</strong> {contactInfo.phone}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show negotiation summary if completed */}
                  {negotiation && negotiation.status === "completed" && (
                    <NegotiationSummary
                      negotiation={negotiation}
                      creatorName={creator.name}
                      onOpenContract={() => handleOpenContract(creator.id)}
                      onOpenInvoice={() => handleOpenInvoice(creator.id)}
                      contractStatus={contractStatus}
                      invoiceStatus={invoiceStatus}
                    />
                  )}

                  <div className="flex space-x-3 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setExpandedCreator(isExpanded ? null : creator.id)}
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => handleOpenOutreach(creator, "email")}
                      disabled={!!negotiation}
                    >
                      Contact
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => handleOpenOutreach(creator, "call")}
                      disabled={!!negotiation}
                    >
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {creators.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No creators found</h2>
            <p className="text-gray-500 mb-4">Try adjusting your criteria or expanding the follower range.</p>
            <Button onClick={() => navigate('/')}>Create New Brief</Button>
          </div>
        )}
      </div>

      {/* Contract Modal */}
      {contractModal.creatorId && (
        <ContractModal
          isOpen={contractModal.isOpen}
          onClose={handleCloseContract}
          creatorName={creators.find(c => c.id === contractModal.creatorId)?.name || ""}
          negotiationData={negotiations[contractModal.creatorId]}
          contractStatus={contracts[contractModal.creatorId] || "none"}
          onStatusChange={(status) => handleContractStatusChange(contractModal.creatorId!, status)}
        />
      )}

      {/* Invoice Modal */}
      {invoiceModal.creatorId && (
        <InvoiceModal
          isOpen={invoiceModal.isOpen}
          onClose={handleCloseInvoice}
          creatorName={creators.find(c => c.id === invoiceModal.creatorId)?.name || ""}
          negotiationData={negotiations[invoiceModal.creatorId]}
          invoiceStatus={invoices[invoiceModal.creatorId] || "none"}
          onStatusChange={(status) => handleInvoiceStatusChange(invoiceModal.creatorId!, status)}
          contractSigned={contracts[invoiceModal.creatorId] === "signed"}
        />
      )}

      {/* OutreachModal */}
      {outreachModal.isOpen && (
        <OutreachModal
          isOpen={outreachModal.isOpen}
          onClose={handleCloseOutreach}
          creator={outreachModal.creator}
          type={outreachModal.type}
          onNegotiationComplete={handleNegotiationComplete}
        />
      )}
    </div>
  );
};

export default Discovery;
