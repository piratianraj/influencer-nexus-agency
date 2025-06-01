import React from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp, Users, DollarSign, Eye, Heart, Share } from "lucide-react";

interface CampaignMetrics {
  totalSpent: number;
  totalReach: number;
  totalEngagements: number;
  totalImpressions: number;
  averageEngagementRate: number;
  roi: number;
  creatorsContacted: number;
  creatorsSignedUp: number;
  contractsSigned: number;
  invoicesPaid: number;
}

interface CreatorPerformance {
  id: string;
  name: string;
  username: string;
  platform: string;
  spent: number;
  reach: number;
  engagements: number;
  impressions: number;
  engagementRate: number;
  status: "completed" | "in-progress" | "pending";
}

const Analytics = () => {
  const [brief, setBrief] = useState<any>(null);
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [creatorPerformance, setCreatorPerformance] = useState<CreatorPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    setIsLoading(true);
    
    // Load brief
    const storedBrief = localStorage.getItem('currentBrief');
    if (storedBrief) {
      setBrief(JSON.parse(storedBrief));
    }

    // Mock analytics data
    const mockMetrics: CampaignMetrics = {
      totalSpent: 245000,
      totalReach: 850000,
      totalEngagements: 42500,
      totalImpressions: 1200000,
      averageEngagementRate: 5.2,
      roi: 3.4,
      creatorsContacted: 12,
      creatorsSignedUp: 8,
      contractsSigned: 6,
      invoicesPaid: 4
    };

    const mockCreatorPerformance: CreatorPerformance[] = [
      {
        id: "1",
        name: "Raj Kumar",
        username: "@fitnessjourney_raj",
        platform: "Instagram",
        spent: 58000,
        reach: 180000,
        engagements: 8500,
        impressions: 220000,
        engagementRate: 4.7,
        status: "completed"
      },
      {
        id: "2",
        name: "Priya Sharma",
        username: "@techreviewsindia",
        platform: "YouTube",
        spent: 120000,
        reach: 450000,
        engagements: 28000,
        impressions: 580000,
        engagementRate: 6.2,
        status: "completed"
      },
      {
        id: "3",
        name: "Meera Patel",
        username: "@yogawithmeera",
        platform: "Instagram",
        spent: 67000,
        reach: 220000,
        engagements: 6000,
        impressions: 400000,
        engagementRate: 2.7,
        status: "in-progress"
      }
    ];

    setMetrics(mockMetrics);
    setCreatorPerformance(mockCreatorPerformance);
    setIsLoading(false);
  };

  const handleExportReport = () => {
    // Mock CSV export
    const csvData = `Campaign Analytics Report
Generated: ${new Date().toLocaleString()}

Campaign Summary:
Total Spent: ₹${metrics?.totalSpent.toLocaleString()}
Total Reach: ${metrics?.totalReach.toLocaleString()}
Total Engagements: ${metrics?.totalEngagements.toLocaleString()}
ROI: ${metrics?.roi}x

Creator Performance:
${creatorPerformance.map(creator => 
  `${creator.name},${creator.platform},₹${creator.spent},${creator.reach},${creator.engagements},${creator.engagementRate}%`
).join('\n')}`;

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Campaign_Analytics_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Analytics report has been downloaded as CSV",
    });
  };

  const platformData = creatorPerformance.reduce((acc, creator) => {
    const existing = acc.find(item => item.platform === creator.platform);
    if (existing) {
      existing.reach += creator.reach;
      existing.spent += creator.spent;
    } else {
      acc.push({
        platform: creator.platform,
        reach: creator.reach,
        spent: creator.spent
      });
    }
    return acc;
  }, [] as { platform: string; reach: number; spent: number }[]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading Analytics...</h1>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 hover:bg-white/50 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">View insights and performance metrics for your campaigns</p>
        </div>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Campaign Analytics</h1>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate('/discovery')}>
                Back to Discovery
              </Button>
              <Button onClick={handleExportReport}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Campaign Summary */}
          {brief && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Campaign Overview</CardTitle>
                <CardDescription>{brief.brand_name} - {brief.niche} Campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><strong>Budget:</strong> ₹{brief.budget.toLocaleString()}</div>
                  <div><strong>Timeline:</strong> {brief.timeline}</div>
                  <div><strong>Target Creators:</strong> {brief.num_creators}</div>
                  <div><strong>Platforms:</strong> {brief.platforms.join(", ")}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{metrics?.totalSpent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {brief && `${((metrics?.totalSpent || 0) / brief.budget * 100).toFixed(1)}% of budget`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalReach.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Unique users reached
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagements</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalEngagements.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics?.averageEngagementRate}% avg rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.roi}x</div>
                <p className="text-xs text-muted-foreground">
                  Return on investment
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Platform Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Reach by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ platform, reach }) => `${platform}: ${reach.toLocaleString()}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="reach"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Creator Performance Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Creator Performance</CardTitle>
                <CardDescription>Engagement rate by creator</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={creatorPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="username" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagementRate" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Creator Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Creator Performance</CardTitle>
              <CardDescription>Individual creator metrics and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Creator</th>
                      <th className="text-left p-2">Platform</th>
                      <th className="text-left p-2">Spent</th>
                      <th className="text-left p-2">Reach</th>
                      <th className="text-left p-2">Engagements</th>
                      <th className="text-left p-2">Rate</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creatorPerformance.map((creator) => (
                      <tr key={creator.id} className="border-b">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{creator.name}</div>
                            <div className="text-gray-500">{creator.username}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant={creator.platform === "Instagram" ? "default" : "secondary"}>
                            {creator.platform}
                          </Badge>
                        </td>
                        <td className="p-2">₹{creator.spent.toLocaleString()}</td>
                        <td className="p-2">{creator.reach.toLocaleString()}</td>
                        <td className="p-2">{creator.engagements.toLocaleString()}</td>
                        <td className="p-2">{creator.engagementRate}%</td>
                        <td className="p-2">
                          <Badge variant={
                            creator.status === "completed" ? "default" : 
                            creator.status === "in-progress" ? "secondary" : "outline"
                          }>
                            {creator.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Status Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Campaign Status</CardTitle>
              <CardDescription>Overall progress and pipeline status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics?.creatorsContacted}</div>
                  <div className="text-sm text-gray-500">Creators Contacted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{metrics?.creatorsSignedUp}</div>
                  <div className="text-sm text-gray-500">Signed Up</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{metrics?.contractsSigned}</div>
                  <div className="text-sm text-gray-500">Contracts Signed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{metrics?.invoicesPaid}</div>
                  <div className="text-sm text-gray-500">Invoices Paid</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
