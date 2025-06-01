
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

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

interface CreatorCardProps {
  creator: Creator;
  hasNegotiation: boolean;
  onOutreach: (creator: Creator, type: "email" | "call") => void;
}

const CreatorCard = ({ creator, hasNegotiation, onOutreach }: CreatorCardProps) => {
  return (
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
        
        {!hasNegotiation && (
          <div className="flex gap-2">
            <Button 
              onClick={() => onOutreach(creator, "email")} 
              className="flex-1"
              size="sm"
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            <Button 
              onClick={() => onOutreach(creator, "call")} 
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatorCard;
