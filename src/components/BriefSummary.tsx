
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, HelpCircle } from 'lucide-react';

interface BriefAnalysis {
  brand_name: string;
  target_audience: string;
  campaign_goals: string[];
  budget_range: string;
  timeline: string;
  preferred_platforms: string[];
  content_style: string;
  key_requirements: string[];
  questions: string[];
  summary: string;
}

interface BriefSummaryProps {
  analysis: BriefAnalysis;
}

const BriefSummary = ({ analysis }: BriefSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Brief Analysis Summary
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your brand brief
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Brand Details</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Brand:</strong> {analysis.brand_name}</div>
              <div><strong>Budget:</strong> {analysis.budget_range}</div>
              <div><strong>Timeline:</strong> {analysis.timeline}</div>
              <div><strong>Content Style:</strong> {analysis.content_style}</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Target Audience</h4>
            <p className="text-sm text-gray-600">{analysis.target_audience}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Campaign Goals</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.campaign_goals.map((goal, index) => (
              <Badge key={index} variant="secondary">{goal}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Preferred Platforms</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.preferred_platforms.map((platform, index) => (
              <Badge key={index} variant="outline">{platform}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Key Requirements</h4>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {analysis.key_requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold mb-2 text-blue-800">AI Summary</h4>
          <p className="text-sm text-blue-700">{analysis.summary}</p>
        </div>

        {analysis.questions.length > 0 && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold mb-2 text-yellow-800 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Clarification Questions
            </h4>
            <ul className="text-sm text-yellow-700 list-disc list-inside">
              {analysis.questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BriefSummary;
