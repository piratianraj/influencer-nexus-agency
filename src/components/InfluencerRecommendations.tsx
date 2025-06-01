
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, TrendingUp, Mail, Phone } from 'lucide-react';

interface InfluencerRecommendation {
  id: string;
  name: string;
  username: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  niche: string[];
  match_score: number;
  match_reasons: string[];
  estimated_rate: number;
}

interface InfluencerRecommendationsProps {
  influencers: InfluencerRecommendation[];
}

const InfluencerRecommendations = ({ influencers }: InfluencerRecommendationsProps) => {
  const generateAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=96`;
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Recommended Influencers ({influencers.length})
        </CardTitle>
        <CardDescription>
          AI-selected influencers based on your brand brief analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {influencers.map((influencer) => (
            <Card key={influencer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={generateAvatarUrl(influencer.name)} 
                        alt={influencer.name} 
                      />
                      <AvatarFallback>
                        {influencer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm">{influencer.name}</CardTitle>
                      <CardDescription className="text-xs">{influencer.username}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    className={`text-xs ${getMatchScoreColor(influencer.match_score)}`}
                  >
                    {influencer.match_score}% match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {influencer.followers.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {influencer.engagement_rate}%
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {influencer.niche.slice(0, 2).map((niche, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {niche}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs">
                    {influencer.platform}
                  </Badge>
                </div>

                <div className="text-xs">
                  <div className="font-semibold mb-1">Why this influencer:</div>
                  <ul className="text-gray-600">
                    {influencer.match_reasons.slice(0, 2).map((reason, index) => (
                      <li key={index}>• {reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs font-semibold text-green-600">
                  Est. Rate: ${influencer.estimated_rate}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluencerRecommendations;
