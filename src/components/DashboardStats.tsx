
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  CreditCard,
  Target,
  Activity
} from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalApplications: number;
    pendingReview: number;
    approved: number;
    active: number;
    avgProcessingTime: string;
    totalCreditLimit: number;
    monthlyGMV: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCrores = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  };

  const approvalRate = stats.totalApplications > 0 
    ? ((stats.approved + stats.active) / stats.totalApplications) * 100 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Total Applications</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{stats.totalApplications}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Progress value={75} className="flex-1 h-2" />
            <p className="text-xs text-blue-600">+12% this month</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-700">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900">{stats.pendingReview}</div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="text-xs text-amber-600">Avg: {stats.avgProcessingTime}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Active/Approved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{stats.approved + stats.active}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Progress value={approvalRate} className="flex-1 h-2" />
            <p className="text-xs text-green-600">{approvalRate.toFixed(0)}% approval rate</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">Monthly GMV</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{formatCrores(stats.monthlyGMV)}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Activity className="h-3 w-3 text-purple-600" />
            <p className="text-xs text-purple-600">+18% growth</p>
          </div>
        </CardContent>
      </Card>

      {/* Additional detailed stats row */}
      <Card className="md:col-span-2 bg-gradient-to-br from-slate-50 to-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-slate-600" />
            <span>Credit Portfolio</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total Credit Limit</div>
              <div className="text-xl font-bold text-gray-900">{formatCrores(stats.totalCreditLimit)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Utilization Rate</div>
              <div className="text-xl font-bold text-gray-900">68%</div>
            </div>
          </div>
          <Progress value={68} className="mt-3 h-2" />
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-gradient-to-br from-rose-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-rose-600" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">SLA Compliance</div>
              <div className="text-xl font-bold text-gray-900">94%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Quality Score</div>
              <div className="text-xl font-bold text-gray-900">8.7/10</div>
            </div>
          </div>
          <div className="flex space-x-2 mt-3">
            <Progress value={94} className="flex-1 h-2" />
            <Progress value={87} className="flex-1 h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
