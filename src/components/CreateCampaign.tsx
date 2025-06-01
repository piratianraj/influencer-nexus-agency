import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, DollarSign, Target, Users } from 'lucide-react';

interface Campaign {
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  total_spend: number;
  total_reach: number;
  total_impressions: number;
  total_engagement: number;
  start_date: string;
  end_date: string;
  influencer_count: number;
}

interface CreateCampaignProps {
  onBack: () => void;
  onSubmit: (campaign: Omit<Campaign, 'id'>) => void;
  prefilledData?: any;
}

export const CreateCampaign: React.FC<CreateCampaignProps> = ({ onBack, onSubmit, prefilledData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as Campaign['status'],
    budget: '',
    start_date: '',
    end_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const campaign: Omit<Campaign, 'id'> = {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      budget: parseFloat(formData.budget) || 0,
      total_spend: 0,
      total_reach: 0,
      total_impressions: 0,
      total_engagement: 0,
      start_date: formData.start_date,
      end_date: formData.end_date,
      influencer_count: 0
    };

    onSubmit(campaign);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">Set up your influencer marketing campaign</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Campaign Details
              </CardTitle>
              <CardDescription>
                Basic information about your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter campaign name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your campaign goals and target audience"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="status">Campaign Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Budget and Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget & Timeline
              </CardTitle>
              <CardDescription>
                Set your campaign budget and schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="budget">Total Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  placeholder="Enter total budget"
                  min="0"
                  step="100"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleChange('start_date', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleChange('end_date', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Campaign Presets
              </CardTitle>
              <CardDescription>
                Quick setup options for common campaign types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="p-4 h-auto flex flex-col items-start"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      name: 'Product Launch Campaign',
                      description: 'Launch a new product with targeted influencer content',
                      budget: '25000',
                      status: 'draft'
                    }));
                  }}
                >
                  <div className="font-semibold mb-1">Product Launch</div>
                  <div className="text-sm text-gray-600">New product introduction</div>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="p-4 h-auto flex flex-col items-start"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      name: 'Brand Awareness Campaign',
                      description: 'Increase brand visibility and reach new audiences',
                      budget: '50000',
                      status: 'draft'
                    }));
                  }}
                >
                  <div className="font-semibold mb-1">Brand Awareness</div>
                  <div className="text-sm text-gray-600">Expand brand reach</div>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="p-4 h-auto flex flex-col items-start"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      name: 'Seasonal Campaign',
                      description: 'Seasonal promotion with relevant influencers',
                      budget: '35000',
                      status: 'draft'
                    }));
                  }}
                >
                  <div className="font-semibold mb-1">Seasonal</div>
                  <div className="text-sm text-gray-600">Holiday or seasonal content</div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name}>
              Create Campaign
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
