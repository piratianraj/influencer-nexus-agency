
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceMetricsData {
  total_creators_in_db: number;
  vector_filtered: number;
  final_matches: number;
}

interface PerformanceMetricsProps {
  metrics: PerformanceMetricsData;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  return (
    <Card className="bg-green-50/70 backdrop-blur-sm border border-green-200/50 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-green-800">Analysis Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{metrics.total_creators_in_db}</div>
            <div className="text-sm text-green-700">Total Creators</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{metrics.vector_filtered}</div>
            <div className="text-sm text-blue-700">AI Pre-filtered</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{metrics.final_matches}</div>
            <div className="text-sm text-purple-700">Final High-Quality Matches</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          AI optimization improved matching efficiency by {Math.round((1 - metrics.vector_filtered / metrics.total_creators_in_db) * 100)}%
        </p>
      </CardContent>
    </Card>
  );
};
