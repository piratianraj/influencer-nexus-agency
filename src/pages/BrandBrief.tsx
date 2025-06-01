
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, FileText, Brain, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBrandBriefAnalysis } from '@/hooks/useBrandBriefAnalysis';
import BriefSummary from '@/components/BriefSummary';
import InfluencerRecommendations from '@/components/InfluencerRecommendations';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';

const BrandBrief = () => {
  const navigate = useNavigate();
  const [briefText, setBriefText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { 
    analyzeBrief, 
    isAnalyzing, 
    briefAnalysis, 
    influencerRecommendations,
    performanceMetrics
  } = useBrandBriefAnalysis();
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.type === 'application/pdf') {
        setUploadedFile(file);
        
        // Read text file content
        if (file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (e) => {
            setBriefText(e.target?.result as string);
          };
          reader.readAsText(file);
        }
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a .txt or .pdf file",
          variant: "destructive"
        });
      }
    }
  };

  const handleAnalyzeBrief = async () => {
    if (!briefText.trim()) {
      toast({
        title: "No brief content",
        description: "Please upload a file or type your brand brief",
        variant: "destructive"
      });
      return;
    }

    await analyzeBrief(briefText);
  };

  const handleProceedToDiscovery = () => {
    // Pass brief analysis data to Discovery page via navigation state
    navigate('/discovery', { 
      state: { 
        fromBrief: true, 
        briefAnalysis,
        influencerRecommendations 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Header />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center gap-2 hover:bg-white/50 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered Brand Brief Analysis
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Upload your brand brief to get intelligent influencer recommendations using advanced AI analysis
            </p>
          </div>

          <div className="space-y-6">
            {/* Upload Section */}
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  Brand Brief Input
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Upload a document or type your brand brief directly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Upload Brand Brief (Optional)</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileUpload}
                    className="mt-2"
                  />
                  {uploadedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {uploadedFile.name} uploaded
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="brief-text">Brand Brief Content</Label>
                  <Textarea
                    id="brief-text"
                    value={briefText}
                    onChange={(e) => setBriefText(e.target.value)}
                    placeholder="Describe your brand, target audience, campaign goals, budget, timeline, preferred platforms, content style, and any specific requirements..."
                    rows={8}
                    className="mt-2"
                  />
                </div>

                <Button 
                  onClick={handleAnalyzeBrief}
                  disabled={isAnalyzing || !briefText.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            {performanceMetrics && (
              <Card className="bg-green-50/70 backdrop-blur-sm border border-green-200/50 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-green-800">Analysis Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{performanceMetrics.total_creators_in_db}</div>
                      <div className="text-sm text-green-700">Total Creators</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{performanceMetrics.vector_filtered}</div>
                      <div className="text-sm text-blue-700">AI Pre-filtered</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{performanceMetrics.final_matches}</div>
                      <div className="text-sm text-purple-700">Final High-Quality Matches</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    AI optimization improved matching efficiency by {Math.round((1 - performanceMetrics.vector_filtered / performanceMetrics.total_creators_in_db) * 100)}%
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Analysis Results */}
            {briefAnalysis && (
              <BriefSummary analysis={briefAnalysis} />
            )}

            {/* Influencer Recommendations */}
            {influencerRecommendations && influencerRecommendations.length > 0 && (
              <InfluencerRecommendations influencers={influencerRecommendations} />
            )}

            {/* Next Step Button */}
            {briefAnalysis && (
              <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Ready to Find Your Perfect Creators?</h3>
                  <p className="text-gray-600 mb-6">
                    Your brand brief has been analyzed with AI optimization. Now let's discover more creators.
                  </p>
                  <Button 
                    onClick={handleProceedToDiscovery}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Discover More Creators
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandBrief;
