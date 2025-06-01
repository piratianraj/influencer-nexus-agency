
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, CheckCircle, Circle } from 'lucide-react';

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
  isSelected?: boolean;
}

interface CreatorCardProps {
  creator: Creator;
  hasNegotiation: boolean;
  onOutreach: (creator: Creator, type: "email" | "call") => void;
  onCreatorSelect?: (creatorId: string) => void;
}

const CreatorCard = ({ creator, hasNegotiation, onOutreach, onCreatorSelect }: CreatorCardProps) => {
  const handleCardClick = () => {
    if (onCreatorSelect) {
      onCreatorSelect(creator.id);
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow relative ${creator.isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {onCreatorSelect && (
        <div 
          className="absolute top-3 right-3 cursor-pointer z-10" 
          onClick={handleCardClick}
        >
          {creator.isSelected ? (
            <CheckCircle className="h-6 w-6 text-blue-600 bg-white rounded-full" />
          ) : (
            <Circle className="h-6 w-6 text-gray-400 hover:text-blue-600 bg-white rounded-full" />
          )}
        </div>
      )}
      
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
              onClick={(e) => {
                e.stopPropagation();
                onOutreach(creator, "email");
              }} 
              className="flex-1"
              size="sm"
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onOutreach(creator, "call");
              }} 
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
