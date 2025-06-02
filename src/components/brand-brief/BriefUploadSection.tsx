
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Brain, Loader2 } from 'lucide-react';

interface BriefUploadSectionProps {
  briefText: string;
  setBriefText: (text: string) => void;
  uploadedFile: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyzeBrief: () => void;
  isAnalyzing: boolean;
}

export const BriefUploadSection: React.FC<BriefUploadSectionProps> = ({
  briefText,
  setBriefText,
  uploadedFile,
  onFileUpload,
  onAnalyzeBrief,
  isAnalyzing
}) => {
  return (
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
            onChange={onFileUpload}
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
          onClick={onAnalyzeBrief}
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
  );
};
