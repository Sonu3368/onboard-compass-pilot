import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Bell, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3,
  Calendar,
  Settings,
  Mail
} from 'lucide-react';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationTable } from './ApplicationTable';
import { DetailView } from './DetailView';
import { DashboardStats } from './DashboardStats';
import { useToast } from '@/hooks/use-toast';
import { EmailReportModal } from './EmailReportModal';

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
  // Legacy field mappings
  pocName?: string;
  pocEmail?: string;
  pocPhone?: string;
}

export const OnboardingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Initialize with empty data
  useEffect(() => {
    setNotifications(0);
  }, []);

  const filteredApplications = applications.filter(app =>
    app.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.mid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.rzpRmName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simulate automated data verification
  const performAutomatedVerification = async (application: Application) => {
    setIsVerifying(true);
    toast({
      title: 'Automated Verification Started',
      description: `Starting verification for ${application.entityName}...`,
    });

    // Simulate API calls for verification
    await new Promise(resolve => setTimeout(resolve, 3000));

    const updatedApp = {
      ...application,
      verificationStatus: 'completed' as const,
      aiScore: Math.floor(Math.random() * 30) + 70,
      riskLevel: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)]
    };

    setApplications(prev => 
      prev.map(app => app.id === application.id ? updatedApp : app)
    );

    setIsVerifying(false);
    toast({
      title: 'Verification Complete',
      description: `${application.entityName} has been verified and moved to Internal Review.`,
    });

    return updatedApp;
  };

  const handleApplicationSubmit = async (newApplicationData: Partial<Application>) => {
    console.log('Submitting comprehensive application data:', newApplicationData);
    
    const application: Application = {
      id: Date.now().toString(),
      status: 'pending',
      submissionDate: new Date(),
      priority: 'medium',
      verificationStatus: 'pending',
      // Map new fields to legacy fields for compatibility
      pocName: newApplicationData.merchantPocName,
      pocEmail: newApplicationData.merchantPocEmail,
      pocPhone: newApplicationData.merchantPocPhone,
      ...newApplicationData as Application
    };
    
    setApplications(prev => [...prev, application]);
    setIsFormOpen(false);
    
    toast({
      title: 'Application Submitted Successfully!',
      description: `Application for ${application.entityName} (${application.applicationId}) has been submitted and will undergo automated verification.`,
    });

    // Start automated verification
    await performAutomatedVerification(application);
  };

  const handleApproval = (id: string) => {
    const application = applications.find(app => app.id === id);
    if (!application) return;

    const approvedApp = { 
      ...application, 
      status: 'approved' as const, 
      approvalDate: new Date() 
    };

    // Update applications state
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? approvedApp : app
      )
    );

    // Add to active applications (will be filtered by date)
    toast({
      title: 'Application Approved',
      description: `${application.entityName} has been approved and added to Active Applications and Onboarding Tracker.`,
    });
  };

  const handleRejection = (id: string) => {
    const application = applications.find(app => app.id === id);
    if (!application) return;

    setApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: 'rejected' as const }
          : app
      )
    );

    toast({
      title: 'Application Rejected',
      description: `${application?.entityName} application has been rejected.`,
      variant: 'destructive',
    });
  };

  const getPendingReviewApplications = () => {
    return applications.filter(app => 
      app.status === 'pending' && 
      app.verificationStatus === 'completed'
    );
  };

  const getActiveApplications = () => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return applications.filter(app => 
      app.status === 'approved' && 
      app.approvalDate && 
      app.approvalDate.getTime() > oneDayAgo.getTime()
    );
  };

  const getOnboardingTrackerApplications = () => {
    return applications.filter(app => app.status === 'approved');
  };

  const dashboardStats = {
    totalApplications: applications.length,
    pendingReview: getPendingReviewApplications().length,
    approved: applications.filter(app => app.status === 'approved').length,
    active: getActiveApplications().length,
    avgProcessingTime: '2.5 days',
    totalCreditLimit: applications.reduce((sum, app) => sum + (app.expectedCreditLimit || 0), 0),
    monthlyGMV: applications.reduce((sum, app) => sum + (app.monthlySpends || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Corporate Onboarding Dashboard</h1>
                  <p className="text-xs text-gray-500">Comprehensive Client Management System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
              
              <Button 
                onClick={() => setIsEmailModalOpen(true)}
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Report / Email
              </Button>
              
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications}
                  </Badge>
                )}
              </Button>
              
              <Avatar>
                <AvatarFallback>
                  AD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="internal-review" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Internal Review ({getPendingReviewApplications().length})</span>
            </TabsTrigger>
            <TabsTrigger value="active-applications" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Active Applications ({getActiveApplications().length})</span>
            </TabsTrigger>
            <TabsTrigger value="onboarding-tracker" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Onboarding Tracker ({getOnboardingTrackerApplications().length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats stats={dashboardStats} />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setIsFormOpen(true)}
                    className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm">Submit New Application</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('internal-review')}
                    className="h-20"
                  >
                    <div className="text-center">
                      <Clock className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm">Review Pending ({getPendingReviewApplications().length})</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('onboarding-tracker')}
                    className="h-20"
                  >
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm">Track Progress</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <ApplicationTable 
                  applications={applications.slice(0, 5)}
                  onView={(app) => {
                    setSelectedApplication(app);
                    setIsDetailViewOpen(true);
                  }}
                  showActions={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internal-review" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Internal Review & Decisioning</h2>
                <p className="text-gray-600">Applications that have completed automated verification</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {getPendingReviewApplications().length} Pending Review
              </Badge>
            </div>
            
            {isVerifying && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-800">Automated verification in progress...</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <ApplicationTable 
              applications={getPendingReviewApplications()}
              onView={(app) => {
                setSelectedApplication(app);
                setIsDetailViewOpen(true);
              }}
              onApprove={handleApproval}
              onReject={handleRejection}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="active-applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Active Applications</h2>
                <p className="text-gray-600">Recently approved applications (shown for 24 hours)</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {getActiveApplications().length} Active
              </Badge>
            </div>
            <ApplicationTable 
              applications={getActiveApplications()}
              onView={(app) => {
                setSelectedApplication(app);
                setIsDetailViewOpen(true);
              }}
              showActions={false}
            />
          </TabsContent>

          <TabsContent value="onboarding-tracker" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Onboarding Tracker</h2>
                <p className="text-gray-600">All approved applications - permanent record</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {getOnboardingTrackerApplications().length} Total Onboarded
              </Badge>
            </div>
            <ApplicationTable 
              applications={getOnboardingTrackerApplications()}
              onView={(app) => {
                setSelectedApplication(app);
                setIsDetailViewOpen(true);
              }}
              showActions={false}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <ApplicationForm
          onSubmit={handleApplicationSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {isDetailViewOpen && selectedApplication && (
        <DetailView
          application={selectedApplication}
          onClose={() => setIsDetailViewOpen(false)}
          onApprove={() => {
            handleApproval(selectedApplication.id);
            setIsDetailViewOpen(false);
          }}
          onReject={() => {
            handleRejection(selectedApplication.id);
            setIsDetailViewOpen(false);
          }}
        />
      )}

      {isEmailModalOpen && (
        <EmailReportModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          applicationsData={activeTab === 'active-applications' ? getActiveApplications() : applications}
        />
      )}
    </div>
  );
};
