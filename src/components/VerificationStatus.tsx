
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Shield, FileText, Mail, CreditCard, Building } from 'lucide-react';

interface VerificationResult {
  verified: boolean;
  status: 'verified' | 'failed' | 'pending';
  message: string;
  details?: string;
  lastUpdated?: string;
}

interface VerificationStatusProps {
  gstinVerification: VerificationResult;
  emailVerification: VerificationResult;
  amgmvVerification: VerificationResult;
  creditVerification: VerificationResult;
  overallStatus: 'approved' | 'pending' | 'flagged';
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  gstinVerification,
  emailVerification,
  amgmvVerification,
  creditVerification,
  overallStatus
}) => {
  const getStatusIcon = (status: string, verified: boolean) => {
    if (status === 'pending') return <Clock className="h-5 w-5 text-yellow-500" />;
    if (verified) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = (status: string, verified: boolean) => {
    if (status === 'pending') return <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>;
    if (verified) return <Badge className="bg-green-100 text-green-800">✓ VERIFIED</Badge>;
    return <Badge className="bg-red-100 text-red-800">❌ FAILED</Badge>;
  };

  const VerificationItem: React.FC<{
    title: string;
    icon: React.ReactNode;
    result: VerificationResult;
  }> = ({ title, icon, result }) => (
    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex-shrink-0 mt-1">
        {getStatusIcon(result.status, result.verified)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <h4 className="font-medium text-gray-900">{title}</h4>
          </div>
          {getStatusBadge(result.status, result.verified)}
        </div>
        <p className="text-sm text-gray-600 mb-1">{result.message}</p>
        {result.details && (
          <p className="text-xs text-gray-500">{result.details}</p>
        )}
        {result.lastUpdated && (
          <p className="text-xs text-gray-400 mt-1">Last updated: {result.lastUpdated}</p>
        )}
      </div>
    </div>
  );

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'flagged': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Automated Verification Status</span>
          </CardTitle>
          <Badge className={`${getOverallStatusColor()} font-semibold`}>
            {overallStatus.toUpperCase()}
            {overallStatus === 'approved' && ' - READY FOR UNDERWRITER'}
            {overallStatus === 'flagged' && ' - MANUAL REVIEW REQUIRED'}
            {overallStatus === 'pending' && ' - VERIFICATION IN PROGRESS'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <VerificationItem
          title="GSTIN Verification"
          icon={<FileText className="h-4 w-4 text-blue-500" />}
          result={gstinVerification}
        />
        
        <VerificationItem
          title="Email Verification"
          icon={<Mail className="h-4 w-4 text-green-500" />}
          result={emailVerification}
        />
        
        <VerificationItem
          title="AMGMV KYC Check"
          icon={<Building className="h-4 w-4 text-purple-500" />}
          result={amgmvVerification}
        />
        
        <VerificationItem
          title="Credit History Check"
          icon={<CreditCard className="h-4 w-4 text-orange-500" />}
          result={creditVerification}
        />

        {overallStatus === 'approved' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Straight-Through Process Eligible</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              All automated checks passed. This application is ready for single-click approval.
            </p>
          </div>
        )}

        {overallStatus === 'flagged' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">Manual Review Required</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              One or more automated checks failed. Please review the details above before making a decision.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
