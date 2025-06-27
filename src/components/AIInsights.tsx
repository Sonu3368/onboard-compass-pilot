
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';

interface Application {
  id: string;
  entityName: string;
  aiScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  status: string;
}

interface AIInsightsProps {
  applications: Application[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ applications }) => {
  const getAverageAIScore = () => {
    const appsWithScores = applications.filter(app => app.aiScore);
    if (appsWithScores.length === 0) return 0;
    const total = appsWithScores.reduce((sum, app) => sum + (app.aiScore || 0), 0);
    return Math.round(total / appsWithScores.length);
  };

  const getRiskDistribution = () => {
    const distribution = { low: 0, medium: 0, high: 0 };
    applications.forEach(app => {
      if (app.riskLevel) {
        distribution[app.riskLevel]++;
      }
    });
    return distribution;
  };

  const getHighRiskApplications = () => {
    return applications.filter(app => app.riskLevel === 'high');
  };

  const avgScore = getAverageAIScore();
  const riskDist = getRiskDistribution();
  const highRiskApps = getHighRiskApplications();

  return (
    <div className="space-y-6">
      {/* AI Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>AI Scoring Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{avgScore}/100</div>
                <p className="text-sm text-gray-600">Average AI Score</p>
              </div>
              <Progress value={avgScore} className="h-3" />
              <div className="text-xs text-gray-500 text-center">
                Based on {applications.length} applications
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Risk Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Low Risk</span>
                </div>
                <Badge className="bg-green-100 text-green-800">{riskDist.low}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Medium Risk</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">{riskDist.medium}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">High Risk</span>
                </div>
                <Badge className="bg-red-100 text-red-800">{riskDist.high}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Applications Alert */}
      {highRiskApps.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span>High Risk Applications Require Attention</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {highRiskApps.map(app => (
                <div key={app.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{app.entityName}</p>
                    <p className="text-sm text-gray-600">AI Score: {app.aiScore || 'N/A'}/100</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">High Risk</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>AI Insights & Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Approval Rate Optimization</h4>
              <p className="text-sm text-blue-800">
                Applications with AI scores above 80 have a 95% approval rate. Consider fast-tracking high-scoring applications.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Processing Efficiency</h4>
              <p className="text-sm text-green-800">
                Automated verification is reducing manual review time by 65%. Continue to refine AI models for better accuracy.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Risk Management</h4>
              <p className="text-sm text-yellow-800">
                {riskDist.high > 0 ? `${riskDist.high} high-risk applications detected. ` : ''}
                Consider implementing additional verification steps for applications with risk scores above 70.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
