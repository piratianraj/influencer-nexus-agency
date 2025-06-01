
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Brain, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBrandBriefAnalysis } from '@/hooks/useBrandBriefAnalysis';
import BriefSummary from '@/components/BriefSummary';
import InfluencerRecommendations from '@/components/InfluencerRecommendations';

const BrandBrief = () => {
  const [briefText, setBriefText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { analyzeBrief, isAnalyzing, briefAnalysis, influencerRecommendations } = useBrandBriefAnalysis();
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Brand Brief Analysis</h1>
          <p className="text-gray-600">
            Upload your brand brief or describe your campaign to get AI-powered influencer recommendations
          </p>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Brand Brief Input
              </CardTitle>
              <CardDescription>
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
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Brief...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Brief & Find Influencers
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {briefAnalysis && (
            <BriefSummary analysis={briefAnalysis} />
          )}

          {/* Influencer Recommendations */}
          {influencerRecommendations && influencerRecommendations.length > 0 && (
            <InfluencerRecommendations influencers={influencerRecommendations} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandBrief;
