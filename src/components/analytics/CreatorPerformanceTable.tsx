
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CreatorPerformance {
  id: string;
  name: string;
  username: string;
  platform: string;
  spent: number;
  reach: number;
  engagements: number;
  impressions: number;
  engagementRate: number;
  status: "completed" | "in-progress" | "pending";
}

interface CreatorPerformanceTableProps {
  creatorPerformance: CreatorPerformance[];
}

export const CreatorPerformanceTable: React.FC<CreatorPerformanceTableProps> = ({ creatorPerformance }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Creator Performance</CardTitle>
        <CardDescription>Individual creator metrics and status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Creator</th>
                <th className="text-left p-2">Platform</th>
                <th className="text-left p-2">Spent</th>
                <th className="text-left p-2">Reach</th>
                <th className="text-left p-2">Engagements</th>
                <th className="text-left p-2">Rate</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {creatorPerformance.map((creator) => (
                <tr key={creator.id} className="border-b">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{creator.name}</div>
                      <div className="text-gray-500">{creator.username}</div>
                    </div>
                  </td>
                  <td className="p-2">
                    <Badge variant={creator.platform === "Instagram" ? "default" : "secondary"}>
                      {creator.platform}
                    </Badge>
                  </td>
                  <td className="p-2">₹{creator.spent.toLocaleString()}</td>
                  <td className="p-2">{creator.reach.toLocaleString()}</td>
                  <td className="p-2">{creator.engagements.toLocaleString()}</td>
                  <td className="p-2">{creator.engagementRate}%</td>
                  <td className="p-2">
                    <Badge variant={
                      creator.status === "completed" ? "default" : 
                      creator.status === "in-progress" ? "secondary" : "outline"
                    }>
                      {creator.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
