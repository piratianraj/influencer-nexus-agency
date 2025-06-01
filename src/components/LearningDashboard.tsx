
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Search, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LearningStats {
  totalSearches: number;
  successfulSearches: number;
  learnedPatterns: number;
  averageSuccessScore: number;
  topQueries: Array<{ query: string; count: number }>;
}

const LearningDashboard = () => {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLearningStats = async () => {
      try {
        // Get total searches
        const { count: totalSearches } = await supabase
          .from('search_sessions')
          .select('*', { count: 'exact', head: true });

        // Get successful searches (success_score > 0.5)
        const { count: successfulSearches } = await supabase
          .from('search_sessions')
          .select('*', { count: 'exact', head: true })
          .gt('success_score', 0.5);

        // Get learned patterns count
        const { count: learnedPatterns } = await supabase
          .from('learned_patterns')
          .select('*', { count: 'exact', head: true });

        // Get average success score
        const { data: avgData } = await supabase
          .from('search_sessions')
          .select('success_score');

        const averageSuccessScore = avgData && avgData.length > 0
          ? avgData.reduce((sum, row) => sum + (row.success_score || 0), 0) / avgData.length
          : 0;

        // Get top queries
        const { data: topQueriesData } = await supabase
          .from('search_sessions')
          .select('user_query')
          .gt('success_score', 0.7)
          .limit(10);

        const queryCount: { [key: string]: number } = {};
        topQueriesData?.forEach(row => {
          const query = row.user_query.toLowerCase();
          queryCount[query] = (queryCount[query] || 0) + 1;
        });

        const topQueries = Object.entries(queryCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([query, count]) => ({ query, count }));

        setStats({
          totalSearches: totalSearches || 0,
          successfulSearches: successfulSearches || 0,
          learnedPatterns: learnedPatterns || 0,
          averageSuccessScore,
          topQueries
        });
      } catch (error) {
        console.error('Failed to fetch learning stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningStats();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Learning Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const successRate = stats.totalSearches > 0 
    ? Math.round((stats.successfulSearches / stats.totalSearches) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Learning Dashboard
          </CardTitle>
          <CardDescription>
            Track how the AI is learning and improving from user interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{stats.totalSearches}</div>
              <div className="text-sm text-blue-600">Total Searches</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{successRate}%</div>
              <div className="text-sm text-green-600">Success Rate</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{stats.learnedPatterns}</div>
              <div className="text-sm text-purple-600">Learned Patterns</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">
                {Math.round(stats.averageSuccessScore * 100)}%
              </div>
              <div className="text-sm text-orange-600">Avg. Quality</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.topQueries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Successful Query Patterns</CardTitle>
            <CardDescription>
              Queries that consistently produce good results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topQueries.map((query, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{query.query}</span>
                  <Badge variant="secondary">{query.count} times</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningDashboard;
