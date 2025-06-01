
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface BriefAnalysis {
  missing: string[];
  extracted: {
    budget?: number;
    timeline?: string;
    num_creators?: number;
    follower_range_min?: number;
    follower_range_max?: number;
    niche?: string;
  };
  prompt?: string;
}

const Index = () => {
  const [briefText, setBriefText] = useState("");
  const [analysis, setAnalysis] = useState<BriefAnalysis | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [completedBrief, setCompletedBrief] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const analyzeBrief = async () => {
    setIsLoading(true);
    try {
      // Simulate LLM analysis
      const mockAnalysis: BriefAnalysis = {
        missing: ["budget", "timeline", "num_creators"],
        extracted: {
          niche: "fitness", // Simulated extraction
          follower_range_min: 10000,
          follower_range_max: 100000
        },
        prompt: "What budget are you allocating for this campaign? (Please specify in INR)"
      };
      
      setAnalysis(mockAnalysis);
      toast({
        title: "Brief analyzed",
        description: "Please answer the missing information to proceed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze brief. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = () => {
    if (!analysis || !currentAnswer.trim()) return;

    const updatedAnalysis = { ...analysis };
    const currentMissing = updatedAnalysis.missing[0];
    
    // Store the answer
    if (currentMissing === "budget") {
      updatedAnalysis.extracted.budget = parseInt(currentAnswer.replace(/[^\d]/g, ""));
    } else if (currentMissing === "timeline") {
      updatedAnalysis.extracted.timeline = currentAnswer;
    } else if (currentMissing === "num_creators") {
      updatedAnalysis.extracted.num_creators = parseInt(currentAnswer);
    }

    // Remove the answered question
    updatedAnalysis.missing = updatedAnalysis.missing.slice(1);

    // Set next prompt
    if (updatedAnalysis.missing.length > 0) {
      const nextMissing = updatedAnalysis.missing[0];
      if (nextMissing === "timeline") {
        updatedAnalysis.prompt = "What is your campaign timeline? (e.g., '1 Aug 2025 - 31 Aug 2025')";
      } else if (nextMissing === "num_creators") {
        updatedAnalysis.prompt = "How many creators do you want to work with?";
      }
    }

    if (updatedAnalysis.missing.length === 0) {
      // All fields complete - create final brief
      const finalBrief = {
        brief_id: `brief_${Date.now()}`,
        brand_name: "Sample Agency",
        raw_text: briefText,
        ...updatedAnalysis.extracted,
        platforms: ["Instagram", "YouTube"],
        geography: "India",
        created_at: new Date().toISOString()
      };
      
      setCompletedBrief(finalBrief);
      localStorage.setItem('currentBrief', JSON.stringify(finalBrief));
      
      toast({
        title: "Brief completed!",
        description: "Redirecting to creator discovery..."
      });
      
      setTimeout(() => navigate('/discovery'), 1500);
    } else {
      setAnalysis(updatedAnalysis);
    }
    
    setCurrentAnswer("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Influencer Marketing Platform</h1>
          <p className="text-xl text-gray-600">Streamline your influencer discovery and outreach</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload Brand Brief</CardTitle>
            <CardDescription>
              Paste your campaign brief below. Our AI will extract key information and ask for any missing details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="brief">Campaign Brief</Label>
              <Textarea
                id="brief"
                placeholder="Paste your brand brief here... Include details about your campaign goals, target audience, budget, timeline, etc."
                value={briefText}
                onChange={(e) => setBriefText(e.target.value)}
                rows={6}
                className="mt-2"
              />
            </div>
            
            <Button 
              onClick={analyzeBrief} 
              disabled={!briefText.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? "Analyzing..." : "Analyze Brief"}
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Complete Your Brief</CardTitle>
              <CardDescription>
                We've extracted some information, but need a few more details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Show extracted information */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Extracted Niche:</span>
                  <span className="ml-2">{analysis.extracted.niche || "Not detected"}</span>
                </div>
                <div>
                  <span className="font-medium">Follower Range:</span>
                  <span className="ml-2">
                    {analysis.extracted.follower_range_min?.toLocaleString()} - {analysis.extracted.follower_range_max?.toLocaleString()}
                  </span>
                </div>
              </div>

              {analysis.missing.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">{analysis.prompt}</Label>
                  <Input
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                  />
                  <Button onClick={submitAnswer} disabled={!currentAnswer.trim()}>
                    Submit Answer ({analysis.missing.length} questions remaining)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {completedBrief && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Brief Completed! ✓</CardTitle>
              <CardDescription className="text-green-700">
                All information collected. Redirecting to creator discovery...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Budget:</strong> ₹{completedBrief.budget?.toLocaleString()}</div>
                <div><strong>Timeline:</strong> {completedBrief.timeline}</div>
                <div><strong>Creators Needed:</strong> {completedBrief.num_creators}</div>
                <div><strong>Niche:</strong> {completedBrief.niche}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
