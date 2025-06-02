
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBrandBriefAnalysis } from '@/hooks/useBrandBriefAnalysis';
import { Header } from '@/components/Header';
import { BriefUploadSection } from '@/components/brand-brief/BriefUploadSection';
import { PerformanceMetrics } from '@/components/brand-brief/PerformanceMetrics';
import BriefSummary from '@/components/BriefSummary';
import InfluencerRecommendations from '@/components/InfluencerRecommendations';

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
            <BriefUploadSection
              briefText={briefText}
              setBriefText={setBriefText}
              uploadedFile={uploadedFile}
              onFileUpload={handleFileUpload}
              onAnalyzeBrief={handleAnalyzeBrief}
              isAnalyzing={isAnalyzing}
            />

            {performanceMetrics && (
              <PerformanceMetrics metrics={performanceMetrics} />
            )}

            {briefAnalysis && (
              <BriefSummary analysis={briefAnalysis} />
            )}

            {influencerRecommendations && influencerRecommendations.length > 0 && (
              <InfluencerRecommendations influencers={influencerRecommendations} />
            )}

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
