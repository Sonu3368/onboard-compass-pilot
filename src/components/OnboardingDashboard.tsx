
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
  Settings
} from 'lucide-react';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationTable } from './ApplicationTable';
import { DetailView } from './DetailView';
import { NotificationCenter } from './NotificationCenter';
import { DashboardStats } from './DashboardStats';
import { AIInsights } from './AIInsights';
import { useToast } from '@/hooks/use-toast';

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

export const OnboardingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const { toast } = useToast();

  // Mock data generation
  useEffect(() => {
    const mockApplications: Application[] = [
      {
        id: '1',
        entityName: 'TechCorp Solutions Ltd',
        mid: 'MID001234',
        rzpRmName: 'Rajesh Kumar',
        pocName: 'Amit Sharma',
        pocEmail: 'amit@techcorp.com',
        pocPhone: '+91-9876543210',
        status: 'pending',
        submissionDate: new Date('2024-01-15'),
        expectedCreditLimit: 5000000,
        monthlySpends: 2500000,
        businessWebsite: 'https://techcorp.com',
        city: 'Mumbai',
        priority: 'high',
        aiScore: 85,
        riskLevel: 'low'
      },
      {
        id: '2',
        entityName: 'Digital Marketing Pro',
        mid: 'MID005678',
        rzpRmName: 'Priya Singh',
        pocName: 'Rohit Verma',
        pocEmail: 'rohit@digitalmp.com',
        pocPhone: '+91-9123456789',
        status: 'approved',
        submissionDate: new Date('2024-01-10'),
        approvalDate: new Date('2024-01-12'),
        expectedCreditLimit: 2000000,
        monthlySpends: 1200000,
        businessWebsite: 'https://digitalmp.com',
        city: 'Bangalore',
        priority: 'medium',
        aiScore: 78,
        riskLevel: 'low'
      },
      {
        id: '3',
        entityName: 'E-commerce Ventures',
        mid: 'MID009012',
        rzpRmName: 'Suresh Patel',
        pocName: 'Neha Gupta',
        pocEmail: 'neha@ecomventures.com',
        pocPhone: '+91-9988776655',
        status: 'active',
        submissionDate: new Date('2024-01-05'),
        approvalDate: new Date('2024-01-08'),
        expectedCreditLimit: 8000000,
        monthlySpends: 4500000,
        businessWebsite: 'https://ecomventures.com',
        city: 'Delhi',
        priority: 'high',
        aiScore: 92,
        riskLevel: 'low'
      }
    ];
    setApplications(mockApplications);
    setNotifications(3);
  }, []);

  const filteredApplications = applications.filter(app =>
    app.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.mid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.rzpRmName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplicationSubmit = (newApplication: Partial<Application>) => {
    const application: Application = {
      id: Date.now().toString(),
      status: 'pending',
      submissionDate: new Date(),
      priority: 'medium',
      aiScore: Math.floor(Math.random() * 30) + 70,
      riskLevel: 'low',
      ...newApplication as Application
    };
    
    setApplications(prev => [...prev, application]);
    setIsFormOpen(false);
    toast({
      title: 'Application Submitted',
      description: `Application for ${application.entityName} has been submitted successfully.`,
    });
  };

  const handleApproval = (id: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: 'approved', approvalDate: new Date() }
          : app
      )
    );
    toast({
      title: 'Application Approved',
      description: 'The application has been approved successfully.',
    });
  };

  const handleRejection = (id: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: 'rejected' }
          : app
      )
    );
    toast({
      title: 'Application Rejected',
      description: 'The application has been rejected.',
      variant: 'destructive',
    });
  };

  const dashboardStats = {
    totalApplications: applications.length,
    pendingReview: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    active: applications.filter(app => app.status === 'active').length,
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
                  <h1 className="text-xl font-bold text-gray-900">Corporate Onboarding</h1>
                  <p className="text-xs text-gray-500">Advanced Dashboard</p>
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
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Pending ({dashboardStats.pendingReview})</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Active ({dashboardStats.active})</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>AI Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats stats={dashboardStats} />
            <ApplicationTable 
              applications={filteredApplications}
              onView={(app) => {
                setSelectedApplication(app);
                setIsDetailViewOpen(true);
              }}
              onApprove={handleApproval}
              onReject={handleRejection}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Pending Review</h2>
              <Badge variant="secondary" className="text-sm">
                {applications.filter(app => app.status === 'pending').length} Applications
              </Badge>
            </div>
            <ApplicationTable 
              applications={applications.filter(app => app.status === 'pending')}
              onView={(app) => {
                setSelectedApplication(app);
                setIsDetailViewOpen(true);
              }}
              onApprove={handleApproval}
              onReject={handleRejection}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Active Applications</h2>
              <Badge variant="secondary" className="text-sm">
                {applications.filter(app => app.status === 'active' || app.status === 'approved').length} Applications
              </Badge>
            </div>
            <ApplicationTable 
              applications={applications.filter(app => app.status === 'active' || app.status === 'approved')}
              onView={(app) => {
                setSelectedApplication(app);
                setIsDetailViewOpen(true);
              }}
              showActions={false}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Application Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-semibold">15 Applications</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="text-xs text-gray-500">25% increase from last month</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Processing Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Time</span>
                      <span className="font-semibold">2.5 Days</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <div className="text-xs text-gray-500">15% faster than target</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AIInsights applications={applications} />
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
    </div>
  );
};
