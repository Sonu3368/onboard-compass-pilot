
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  DollarSign,
  Calendar,
  BarChart3
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

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Pending Review',
      value: stats.pendingReview.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '-5%',
      changeType: 'negative' as const
    },
    {
      title: 'Approved',
      value: stats.approved.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+18%',
      changeType: 'positive' as const
    },
    {
      title: 'Active (24h)',
      value: stats.active.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+3%',
      changeType: 'positive' as const
    },
    {
      title: 'Avg Processing Time',
      value: stats.avgProcessingTime,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '-15%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Credit Volume',
      value: formatCurrency(stats.totalCreditLimit),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: '+25%',
      changeType: 'positive' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
