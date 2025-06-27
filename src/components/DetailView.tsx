
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Building, 
  CreditCard, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  FileText,
  Shield,
  Users,
  DollarSign
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

interface DetailViewProps {
  application: Application;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  application,
  onClose,
  onApprove,
  onReject
}) => {
  const [aiVerification, setAiVerification] = useState<any>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(true);

  useEffect(() => {
    // Simulate AI verification process
    const runAIVerification = async () => {
      setIsLoadingAI(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAiVerification({
        gstin: { verified: true, message: "GSTIN Active, Legal Name Matched", score: 95 },
        email: { verified: true, message: "Email domain verified and active", score: 88 },
        creditHistory: { verified: true, message: "No defaults found in credit history", score: 92 },
        businessValidity: { verified: true, message: "Business website active and legitimate", score: 85 },
        financialStability: { verified: true, message: "Financial ratios within acceptable range", score: 78 },
        overallScore: 87
      });
      
      setIsLoadingAI(false);
    };

    runAIVerification();
  }, [application.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      active: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const VerificationItem: React.FC<{ label: string; result: any; icon: React.ReactNode }> = ({ label, result, icon }) => (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-1">
        {result.verified ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          {icon}
          <h4 className="text-sm font-medium text-gray-900">{label}</h4>
          <Badge variant="outline" className="text-xs">
            Score: {result.score}/100
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{result.message}</p>
        <Progress value={result.score} className="mt-2 h-2" />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {application.entityName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-xl">{application.entityName}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getStatusColor(application.status)}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500">MID: {application.mid}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="verification">AI Verification</TabsTrigger>
              <TabsTrigger value="financial">Financial Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>Company Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Entity Name</label>
                        <p className="text-sm text-gray-900 font-medium">{application.entityName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">MID</label>
                        <p className="text-sm text-gray-900 font-medium">{application.mid}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">City</label>
                        <p className="text-sm text-gray-900">{application.city}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Priority</label>
                        <Badge variant="outline" className={
                          application.priority === 'high' ? 'border-red-200 text-red-800' :
                          application.priority === 'medium' ? 'border-yellow-200 text-yellow-800' :
                          'border-green-200 text-green-800'
                        }>
                          {application.priority.charAt(0).toUpperCase() + application.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Website</label>
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
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Contact Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Point of Contact</label>
                      <p className="text-sm text-gray-900 font-medium">{application.pocName}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{application.pocEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{application.pocPhone}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Relationship Manager</label>
                      <p className="text-sm text-gray-900 font-medium">{application.rzpRmName}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Application Submitted</p>
                        <p className="text-xs text-gray-500">{application.submissionDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    {application.approvalDate && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Approved</p>
                          <p className="text-xs text-gray-500">{application.approvalDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>AI-Powered Verification</span>
                    {application.aiScore && (
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        Overall Score: {application.aiScore}/100
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAI ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm text-gray-600">Running automated verification checks...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Overall Verification Score</span>
                          <span className="text-sm font-bold text-green-600">{aiVerification.overallScore}/100</span>
                        </div>
                        <Progress value={aiVerification.overallScore} className="h-3" />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <VerificationItem
                          label="GSTIN Verification"
                          result={aiVerification.gstin}
                          icon={<FileText className="h-4 w-4 text-blue-500" />}
                        />
                        <VerificationItem
                          label="Email Verification"
                          result={aiVerification.email}
                          icon={<Mail className="h-4 w-4 text-green-500" />}
                        />
                        <VerificationItem
                          label="Credit History Check"
                          result={aiVerification.creditHistory}
                          icon={<CreditCard className="h-4 w-4 text-purple-500" />}
                        />
                        <VerificationItem
                          label="Business Validity"
                          result={aiVerification.businessValidity}
                          icon={<Building className="h-4 w-4 text-indigo-500" />}
                        />
                        <VerificationItem
                          label="Financial Stability"
                          result={aiVerification.financialStability}
                          icon={<TrendingUp className="h-4 w-4 text-orange-500" />}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Credit & Spending</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expected Credit Limit</label>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(application.expectedCreditLimit)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estimated Monthly Spends</label>
                      <p className="text-xl font-semibold text-blue-600">{formatCurrency(application.monthlySpends)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-medium text-gray-500">Utilization Ratio</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={(application.monthlySpends / application.expectedCreditLimit) * 100} className="flex-1" />
                        <span className="text-sm font-medium">
                          {((application.monthlySpends / application.expectedCreditLimit) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Risk Assessment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Risk Level</label>
                      <Badge className={
                        application.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                        application.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {application.riskLevel?.charAt(0).toUpperCase() + application.riskLevel?.slice(1)} Risk
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Financial Risk</span>
                        <span className="text-green-600">Low</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Operational Risk</span>
                        <span className="text-green-600">Low</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Compliance Risk</span>
                        <span className="text-yellow-600">Medium</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Document Verification</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Consent Form</p>
                          <p className="text-xs text-gray-500">Uploaded on {application.submissionDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                    
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Additional documents will appear here when uploaded</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {application.status === 'pending' && (onApprove || onReject) && (
            <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
              {onReject && (
                <Button 
                  variant="outline" 
                  onClick={onReject}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
              )}
              {onApprove && (
                <Button 
                  onClick={onApprove}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
