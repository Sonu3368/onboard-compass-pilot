
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  CreditCard,
  Building,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface Application {
  id: string;
  entityName: string;
  mid: string;
  rzpRmName: string;
  pocName: string;
  pocEmail: string;
  pocPhone: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  submissionDate: Date;
  approvalDate?: Date;
  expectedCreditLimit: number;
  monthlySpends: number;
  businessWebsite: string;
  city: string;
  priority: 'high' | 'medium' | 'low';
  aiScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
}

interface ApplicationTableProps {
  applications: Application[];
  onView: (application: Application) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onView,
  onApprove,
  onReject,
  showActions = false
}) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      active: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <Badge variant="outline" className={variants[priority as keyof typeof variants]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getRiskBadge = (riskLevel?: string) => {
    if (!riskLevel) return null;
    
    const variants = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[riskLevel as keyof typeof variants]}>
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-500 text-center">No applications match your current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-indigo-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <AvatarInitials>{application.entityName.substring(0, 2).toUpperCase()}</AvatarInitials>
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{application.entityName}</h3>
                      {getStatusBadge(application.status)}
                      {getPriorityBadge(application.priority)}
                      {getRiskBadge(application.riskLevel)}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <CreditCard className="h-4 w-4" />
                        <span>{application.mid}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{application.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{application.submissionDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Point of Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-medium">{application.pocName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{application.pocEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{application.pocPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Financial Details</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Credit Limit: </span>
                        <span className="font-medium">{formatCurrency(application.expectedCreditLimit)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Monthly Spends: </span>
                        <span className="font-medium">{formatCurrency(application.monthlySpends)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">RM & AI Score</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">RM: </span>
                        <span className="font-medium">{application.rzpRmName}</span>
                      </div>
                      {application.aiScore && (
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">AI Score: {application.aiScore}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a 
                      href={application.businessWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      {application.businessWebsite}
                    </a>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(application)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Button>

                    {showActions && application.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onApprove?.(application.id)}
                          className="flex items-center space-x-1 text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReject?.(application.id)}
                          className="flex items-center space-x-1 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
