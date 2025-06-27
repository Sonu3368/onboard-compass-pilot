
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  BarChart3,
  Users,
  DollarSign
} from 'lucide-react';

interface Application {
  id: string;
  entityName: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  aiScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  expectedCreditLimit: number;
  monthlySpends: number;
}

interface AIInsightsProps {
  applications: Application[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ applications }) => {
  const totalApplications = applications.length;
  const avgAiScore = applications.reduce((sum, app) => sum + (app.aiScore || 0), 0) / totalApplications;
  const highRiskApps = applications.filter(app => app.riskLevel === 'high').length;
  const approvalRate = ((applications.filter(app => app.status === 'approved' || app.status === 'active').length) / totalApplications) * 100;

  const insights = [
    {
      title: "High-Quality Applications",
      description: "87% of applications this month have an AI score above 75, indicating strong creditworthiness.",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      trend: "up",
      value: "87%"
    },
    {
      title: "Risk Distribution Optimization",
      description: "Risk assessment shows 78% low-risk applications, enabling faster processing.",
      icon: <Target className="h-5 w-5 text-blue-500" />,
      trend: "stable",
      value: "78%"
    },
    {
      title: "Processing Efficiency",
      description: "AI-assisted verification reduced average processing time by 35%.",
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      trend: "up",
      value: "35%"
    },
    {
      title: "Credit Utilization Patterns",
      description: "Average credit utilization ratio is 45%, indicating healthy spending patterns.",
      icon: <BarChart3 className="h-5 w-5 text-orange-500" />,
      trend: "stable",
      value: "45%"
    }
  ];

  const riskDistribution = {
    low: applications.filter(app => app.riskLevel === 'low').length,
    medium: applications.filter(app => app.riskLevel === 'medium').length,
    high: applications.filter(app => app.riskLevel === 'high').length
  };

  const scoreDistribution = {
    excellent: applications.filter(app => (app.aiScore || 0) >= 90).length,
    good: applications.filter(app => (app.aiScore || 0) >= 75 && (app.aiScore || 0) < 90).length,
    average: applications.filter(app => (app.aiScore || 0) >= 60 && (app.aiScore || 0) < 75).length,
    below: applications.filter(app => (app.aiScore || 0) < 60).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h2>
          <p className="text-gray-600">Advanced analytics and recommendations for your onboarding process</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Avg AI Score</p>
                <p className="text-2xl font-bold text-blue-900">{avgAiScore.toFixed(1)}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Approval Rate</p>
                <p className="text-2xl font-bold text-green-900">{approvalRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">High Risk Apps</p>
                <p className="text-2xl font-bold text-amber-900">{highRiskApps}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Total Volume</p>
                <p className="text-2xl font-bold text-purple-900">{totalApplications}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>AI-Generated Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.value}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>Risk Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Low Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{riskDistribution.low}</span>
                  <div className="w-24">
                    <Progress value={(riskDistribution.low / totalApplications) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Medium Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{riskDistribution.medium}</span>
                  <div className="w-24">
                    <Progress value={(riskDistribution.medium / totalApplications) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">High Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{riskDistribution.high}</span>
                  <div className="w-24">
                    <Progress value={(riskDistribution.high / totalApplications) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>AI Score Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{scoreDistribution.excellent}</p>
                <p className="text-sm text-green-700">Excellent (90+)</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{scoreDistribution.good}</p>
                <p className="text-sm text-blue-700">Good (75-89)</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{scoreDistribution.average}</p>
                <p className="text-sm text-yellow-700">Average (60-74)</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{scoreDistribution.below}</p>
                <p className="text-sm text-red-700">Below Average (&lt;60)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span>AI Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Prioritize High-Score Applications</p>
                <p className="text-xs text-blue-600 mt-1">Focus on applications with AI scores above 85 for faster processing</p>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">Optimize Credit Limits</p>
                <p className="text-xs text-green-600 mt-1">Consider increasing limits for low-risk, high-volume merchants</p>
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-800">Review Medium-Risk Applications</p>
                <p className="text-xs text-amber-600 mt-1">Manual review recommended for applications scoring 60-75</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
