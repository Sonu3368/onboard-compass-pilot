import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VerificationStatus } from './VerificationStatus';
import { MerchantInsightsReport } from './MerchantInsightsReport';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Building, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Clock,
  Users,
  DollarSign,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface Application {
  id: string;
  applicationId?: string;
  entityName: string;
  entityType?: string;
  mid: string;
  businessAddress?: string;
  city: string;
  businessWebsite: string;
  natureOfBusiness?: string;
  businessVintage?: string;
  annualTurnover?: number;
  rzpRmName: string;
  rzpRmPhone?: string;
  merchantPocName?: string;
  merchantPocEmail?: string;
  merchantPocPhone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  submissionDate: Date;
  approvalDate?: Date;
  expectedCreditLimit: number;
  monthlySpends: number;
  internationalSpends?: number;
  lowerMccSpends?: number;
  appointmentDate?: string;
  sourceOfAppointment?: string;
  spocRemarks?: string;
  priority: 'high' | 'medium' | 'low';
  aiScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  consentFile?: string;
  // New comprehensive fields
  mtrAvailable?: string;
  yesBankRelationship?: string;
  yblCreditLimit?: number;
  natureOfUnderwriting?: string;
  securityType?: string;
  policy?: string;
  gmv?: number;
  alternateNumber?: string;
  verificationStatus?: 'pending' | 'completed' | 'failed';
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
  const [verificationResults, setVerificationResults] = useState<any>(null);
  const [isLoadingVerification, setIsLoadingVerification] = useState(true);

  useEffect(() => {
    // Simulate comprehensive verification process
    const runVerification = async () => {
      setIsLoadingVerification(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock verification results
      const mockResults = {
        gstin: {
          verified: Math.random() > 0.2,
          status: Math.random() > 0.2 ? 'verified' : 'failed',
          message: Math.random() > 0.2 ? "GSTIN Active, Legal Name Matched" : "GSTIN verification failed or inactive",
          details: Math.random() > 0.2 ? `Legal Name: ${application.entityName}, Last GST Filing: ${new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}` : "Unable to verify GSTIN details",
          lastUpdated: new Date().toLocaleString()
        },
        email: {
          verified: Math.random() > 0.15,
          status: Math.random() > 0.15 ? 'verified' : 'failed', 
          message: Math.random() > 0.15 ? "Email domain verified and active" : "Email verification failed",
          details: Math.random() > 0.15 ? "Domain reputation: Good, MX records found" : "Domain issues detected",
          lastUpdated: new Date().toLocaleString()
        },
        amgmv: {
          verified: Math.random() > 0.25,
          status: Math.random() > 0.25 ? 'verified' : 'failed',
          message: Math.random() > 0.25 ? "AMGMV data pulled and verified" : "AMGMV data mismatch or unavailable",
          details: Math.random() > 0.25 ? `Pulled AMGMV: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Math.random() * 5000000 + 1000000)}, MTR Available: ${application.mtrAvailable}` : "MTR data inconsistency detected",
          lastUpdated: new Date().toLocaleString()
        },
        credit: {
          verified: Math.random() > 0.3,
          status: Math.random() > 0.3 ? 'verified' : 'failed',
          message: Math.random() > 0.3 ? "No defaults found in credit history" : "Credit issues detected",
          details: Math.random() > 0.3 ? "Clean credit history, no outstanding dues" : "Past defaults or pending dues found",
          lastUpdated: new Date().toLocaleString()
        }
      };

      // Determine overall status
      const allVerified = Object.values(mockResults).every(result => result.verified);
      const overallStatus = allVerified ? 'approved' : 'flagged';

      setVerificationResults({ ...mockResults, overallStatus });
      setIsLoadingVerification(false);
    };

    runVerification();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-y-auto">
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
                {application.applicationId && (
                  <span className="text-sm text-gray-500">Ref: {application.applicationId}</span>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="verification">
                Verification
                {verificationResults?.overallStatus === 'flagged' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-red-500" />
                )}
              </TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="mtr">MTR Report</TabsTrigger>
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
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Entity Name</label>
                        <p className="text-sm text-gray-900 font-medium">{application.entityName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">MID</label>
                          <p className="text-sm text-gray-900 font-medium">{application.mid}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Entity Type</label>
                          <p className="text-sm text-gray-900">{application.entityType || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Address</label>
                        <p className="text-sm text-gray-900">{application.businessAddress || 'N/A'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">City</label>
                          <p className="text-sm text-gray-900">{application.city}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Business Vintage</label>
                          <p className="text-sm text-gray-900">{application.businessVintage || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nature of Business</label>
                        <p className="text-sm text-gray-900">{application.natureOfBusiness || 'N/A'}</p>
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
                      {application.mtrAvailable && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">MTR Available</label>
                          <Badge className={application.mtrAvailable === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {application.mtrAvailable}
                          </Badge>
                        </div>
                      )}
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
                      <label className="text-sm font-medium text-gray-500">RZP RM (Sales POC)</label>
                      <p className="text-sm text-gray-900 font-medium">{application.rzpRmName}</p>
                      {application.rzpRmPhone && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{application.rzpRmPhone}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Merchant Point of Contact</label>
                      <p className="text-sm text-gray-900 font-medium">{application.merchantPocName || 'N/A'}</p>
                      <div className="space-y-1 mt-1">
                        {application.merchantPocEmail && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{application.merchantPocEmail}</span>
                          </div>
                        )}
                        {application.merchantPocPhone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{application.merchantPocPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {application.alternateNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Alternate Number</label>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{application.alternateNumber}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Banking & Additional Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Banking Relationship & Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {application.yesBankRelationship && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">YES Bank Relationship</label>
                        <Badge className={application.yesBankRelationship === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {application.yesBankRelationship}
                        </Badge>
                      </div>
                    )}
                    {application.yblCreditLimit && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">YBL Credit Limit Sanctioned</label>
                        <p className="text-sm text-gray-900 font-medium">{formatCurrency(application.yblCreditLimit)}</p>
                      </div>
                    )}
                    {application.natureOfUnderwriting && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nature of Underwriting</label>
                        <p className="text-sm text-gray-900">{application.natureOfUnderwriting}</p>
                      </div>
                    )}
                    {application.securityType && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Security Type</label>
                        <Badge variant="outline">{application.securityType}</Badge>
                      </div>
                    )}
                    {application.policy && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Policy</label>
                        <p className="text-sm text-gray-900">{application.policy}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Timeline & Appointment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>Timeline & Appointment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                    {application.appointmentDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Appointment Date</label>
                        <p className="text-sm text-gray-900">{new Date(application.appointmentDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {application.sourceOfAppointment && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Source of Appointment</label>
                        <p className="text-sm text-gray-900">{application.sourceOfAppointment}</p>
                      </div>
                    )}
                    {application.spocRemarks && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">SPOC Remarks</label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{application.spocRemarks}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="verification" className="space-y-6">
              {isLoadingVerification ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Running comprehensive automated verification...</p>
                  </div>
                </div>
              ) : verificationResults ? (
                <VerificationStatus
                  gstinVerification={verificationResults.gstin}
                  emailVerification={verificationResults.email}
                  amgmvVerification={verificationResults.amgmv}
                  creditVerification={verificationResults.credit}
                  overallStatus={verificationResults.overallStatus}
                />
              ) : null}
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Credit & Spending Details</span>
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
                    {application.gmv && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Gross Monthly Value (GMV)</label>
                        <p className="text-lg font-semibold text-purple-600">{formatCurrency(application.gmv)}</p>
                      </div>
                    )}
                    {application.annualTurnover && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Annual Turnover</label>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(application.annualTurnover)}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {application.internationalSpends !== undefined && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">International Spends</label>
                          <p className="text-sm text-gray-900 font-medium">{application.internationalSpends}%</p>
                        </div>
                      )}
                      {application.lowerMccSpends !== undefined && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Lower MCC Spends</label>
                          <p className="text-sm text-gray-900 font-medium">{application.lowerMccSpends}%</p>
                        </div>
                      )}
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

            <TabsContent value="mtr" className="space-y-6">
              <MerchantInsightsReport mid={application.mid} entityName={application.entityName} />
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
                    {application.consentFile ? (
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
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No consent form uploaded</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {application.status === 'pending' && (onApprove || onReject) && (
            <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
              <Button 
                variant="outline"
                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
              >
                <Clock className="h-4 w-4 mr-2" />
                Awaiting Information
              </Button>
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
                  disabled={verificationResults?.overallStatus === 'flagged'}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {verificationResults?.overallStatus === 'approved' ? 'Single-Click Approve' : 'Approve Application'}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
