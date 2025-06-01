
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface FilterOptions {
  platform: string[];
  followers: { min: number; max: number };
  engagement: { min: number; max: number };
  location: string[];
  niche: string[];
  priceRange: { min: number; max: number };
  verified: boolean | null;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'];
  const niches = ['Fitness', 'Fashion', 'Food', 'Travel', 'Tech', 'Lifestyle', 'Business'];
  const locations = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'];

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platform.includes(platform)
      ? filters.platform.filter(p => p !== platform)
      : [...filters.platform, platform];
    onFiltersChange({ ...filters, platform: newPlatforms });
  };

  const handleNicheToggle = (niche: string) => {
    const newNiches = filters.niche.includes(niche)
      ? filters.niche.filter(n => n !== niche)
      : [...filters.niche, niche];
    onFiltersChange({ ...filters, niche: newNiches });
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.location.includes(location)
      ? filters.location.filter(l => l !== location)
      : [...filters.location, location];
    onFiltersChange({ ...filters, location: newLocations });
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-white">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Advanced Filters</h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset All
        </Button>
      </div>

      {/* Platform Filter */}
      <div>
        <Label className="text-sm font-medium">Platforms</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => handlePlatformToggle(platform)}
              className={`px-3 py-1 text-sm rounded-full border ${
                filters.platform.includes(platform)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Followers Range */}
      <div>
        <Label className="text-sm font-medium">Follower Count</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="number"
            placeholder="Min followers"
            value={filters.followers.min || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              followers: { ...filters.followers, min: parseInt(e.target.value) || 0 }
            })}
          />
          <Input
            type="number"
            placeholder="Max followers"
            value={filters.followers.max || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              followers: { ...filters.followers, max: parseInt(e.target.value) || 0 }
            })}
          />
        </div>
      </div>

      {/* Engagement Rate */}
      <div>
        <Label className="text-sm font-medium">Engagement Rate (%)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="number"
            placeholder="Min %"
            value={filters.engagement.min || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              engagement: { ...filters.engagement, min: parseFloat(e.target.value) || 0 }
            })}
          />
          <Input
            type="number"
            placeholder="Max %"
            value={filters.engagement.max || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              engagement: { ...filters.engagement, max: parseFloat(e.target.value) || 0 }
            })}
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium">Price Range ($)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="number"
            placeholder="Min price"
            value={filters.priceRange.min || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              priceRange: { ...filters.priceRange, min: parseInt(e.target.value) || 0 }
            })}
          />
          <Input
            type="number"
            placeholder="Max price"
            value={filters.priceRange.max || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              priceRange: { ...filters.priceRange, max: parseInt(e.target.value) || 0 }
            })}
          />
        </div>
      </div>

      {/* Niche Filter */}
      <div>
        <Label className="text-sm font-medium">Niche</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {niches.map(niche => (
            <button
              key={niche}
              onClick={() => handleNicheToggle(niche)}
              className={`px-3 py-1 text-sm rounded-full border ${
                filters.niche.includes(niche)
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
              }`}
            >
              {niche}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <Label className="text-sm font-medium">Location</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {locations.map(location => (
            <button
              key={location}
              onClick={() => handleLocationToggle(location)}
              className={`px-3 py-1 text-sm rounded-full border ${
                filters.location.includes(location)
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Filter */}
      <div>
        <Label className="text-sm font-medium">Verification Status</Label>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onFiltersChange({ ...filters, verified: null })}
            className={`px-3 py-1 text-sm rounded border ${
              filters.verified === null
                ? 'bg-gray-500 text-white border-gray-500'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFiltersChange({ ...filters, verified: true })}
            className={`px-3 py-1 text-sm rounded border ${
              filters.verified === true
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            Verified Only
          </button>
          <button
            onClick={() => onFiltersChange({ ...filters, verified: false })}
            className={`px-3 py-1 text-sm rounded border ${
              filters.verified === false
                ? 'bg-gray-500 text-white border-gray-500'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            Unverified Only
          </button>
        </div>
      </div>
    </div>
  );
};
