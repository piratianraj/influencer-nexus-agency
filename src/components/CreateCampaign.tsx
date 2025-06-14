
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, DollarSign, Target, Users } from 'lucide-react';
import { useCampaigns, Campaign } from '@/hooks/useCampaigns';

interface CreateCampaignProps {
  onClose: () => void;
  onSuccess: () => void;
  editingCampaign?: Campaign | null;
}

export const CreateCampaign: React.FC<CreateCampaignProps> = ({ 
  onClose, 
  onSuccess, 
  editingCampaign 
}) => {
  const { createCampaign, updateCampaign } = useCampaigns();
  const [formData, setFormData] = useState({
    name: editingCampaign?.name || '',
    description: editingCampaign?.description || '',
    status: editingCampaign?.status || 'draft' as Campaign['status'],
    budget: editingCampaign?.budget?.toString() || '',
    start_date: editingCampaign?.start_date || '',
    end_date: editingCampaign?.end_date || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const campaignData = {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      budget: parseFloat(formData.budget) || 0,
      total_spend: editingCampaign?.total_spend || 0,
      total_reach: editingCampaign?.total_reach || 0,
      total_impressions: editingCampaign?.total_impressions || 0,
      total_engagement: editingCampaign?.total_engagement || 0,
      start_date: formData.start_date,
      end_date: formData.end_date,
      influencer_count: editingCampaign?.influencer_count || 0,
      workflow_step: editingCampaign?.workflow_step || 'campaign-creation' as const
    };

    let result;
    if (editingCampaign) {
      result = await updateCampaign(editingCampaign.id, campaignData);
    } else {
      result = await createCampaign(campaignData);
    }

    if (result) {
      onSuccess();
    }
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
            onClick={onClose}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
          </h1>
          <p className="text-gray-600 mt-2">
            {editingCampaign ? 'Update your campaign details' : 'Set up your influencer marketing campaign'}
          </p>
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

          {/* Campaign Presets - only show for new campaigns */}
          {!editingCampaign && (
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
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name}>
              {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
