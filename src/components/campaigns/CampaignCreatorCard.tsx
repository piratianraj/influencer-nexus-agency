
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Trash2, MapPin, Users } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CampaignCreator } from '@/hooks/useCampaignCreators';

interface CampaignCreatorCardProps {
  creator: CampaignCreator;
  onRemove?: (campaignCreatorId: string) => void;
}

export const CampaignCreatorCard: React.FC<CampaignCreatorCardProps> = ({ creator, onRemove }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatusColor = (status: CampaignCreator['status']) => {
    const colors = {
      selected: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      negotiating: 'bg-yellow-100 text-yellow-800',
      contracted: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: CampaignCreator['payment_status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name?.split(' ').map(n => n[0]).join('') || 'C'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{creator.name}</CardTitle>
              <p className="text-sm text-gray-500">@{creator.handle || creator.creator_id.slice(0, 8)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(creator.status)}>
              {creator.status}
            </Badge>
            {onRemove && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Creator</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {creator.name} from this campaign? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onRemove(creator.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          {creator.platform && (
            <Badge variant="outline">{creator.platform}</Badge>
          )}
          {creator.country && (
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-3 w-3" />
              {creator.country}
            </div>
          )}
        </div>

        {creator.niche && (
          <div className="flex flex-wrap gap-1">
            {creator.niche.split(',').map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {creator.followers && (
            <div className="flex justify-between">
              <span className="text-gray-600">Followers:</span>
              <span className="font-medium flex items-center gap-1">
                <Users className="h-3 w-3" />
                {formatNumber(creator.followers)}
              </span>
            </div>
          )}
          {creator.engagement_rate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Engagement:</span>
              <span className="font-medium">{creator.engagement_rate}%</span>
            </div>
          )}
          {creator.agreed_rate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Rate:</span>
              <span className="font-medium">${creator.agreed_rate.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Payment:</span>
            <Badge className={getPaymentStatusColor(creator.payment_status)} variant="outline">
              {creator.payment_status}
            </Badge>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="text-xs text-gray-500">
            Deliverables: {creator.deliverables_count}
            {creator.contract_signed && (
              <span className="ml-2 text-green-600">✓ Contract Signed</span>
            )}
          </div>
          <div className="flex gap-1">
            {creator.email && (
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <Mail className="h-3 w-3" />
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <Phone className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
