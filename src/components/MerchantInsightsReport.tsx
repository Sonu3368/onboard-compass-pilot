
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Calendar, TrendingUp, Building, RefreshCw } from 'lucide-react';

interface MerchantProfile {
  name: string;
  pgStatus: string;
  vintageInMonths: number;
  businessType: string;
  amActiveDays: number;
  amGMV: number;
  businessSegment: string;
}

interface AggregateData {
  monthlyGMV: { month: string; gmv: number }[];
  averageGMV: number;
  totalGMV: number;
}

interface MerchantInsightsReportProps {
  mid: string;
  entityName: string;
}

export const MerchantInsightsReport: React.FC<MerchantInsightsReportProps> = ({ mid, entityName }) => {
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  const [aggregateData, setAggregateData] = useState<AggregateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const generateMockData = () => {
    // Mock Merchant Profile Data
    const mockProfile: MerchantProfile = {
      name: entityName,
      pgStatus: Math.random() > 0.3 ? 'Active' : 'Inactive',
      vintageInMonths: Math.floor(Math.random() * 60) + 12, // 12-72 months
      businessType: ['E-commerce', 'Retail', 'B2B Services', 'SAAS', 'Manufacturing'][Math.floor(Math.random() * 5)],
      amActiveDays: Math.floor(Math.random() * 30) + 1, // 1-30 days
      amGMV: Math.floor(Math.random() * 5000000) + 100000, // 1L to 50L
      businessSegment: ['SME', 'Enterprise', 'Startup', 'Traditional'][Math.floor(Math.random() * 4)]
    };

    // Mock Aggregate Transaction Data (Last 6 months)
    const months = ['Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025'];
    const monthlyGMV = months.map(month => ({
      month,
      gmv: Math.floor(Math.random() * 2000000) + 500000 // 5L to 25L per month
    }));

    const totalGMV = monthlyGMV.reduce((sum, data) => sum + data.gmv, 0);
    const averageGMV = totalGMV / monthlyGMV.length;

    const mockAggregateData: AggregateData = {
      monthlyGMV,
      averageGMV,
      totalGMV
    };

    return { mockProfile, mockAggregateData };
  };

  const generateReport = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { mockProfile, mockAggregateData } = generateMockData();
    
    setMerchantProfile(mockProfile);
    setAggregateData(mockAggregateData);
    setLastGenerated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    generateReport();
  }, [mid, entityName]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Merchant Insights Report (MTR)</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {lastGenerated && (
              <span className="text-sm text-gray-500">
                Generated: {lastGenerated.toLocaleString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={generateReport}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh MTR
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Generating Merchant Insights Report...</p>
              <p className="text-xs text-gray-500 mt-1">Fetching data for MID: {mid}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                📊 MERCHANT INSIGHTS REPORT
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Report Date:</span>
                  <span className="ml-2 text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">MID:</span>
                  <span className="ml-2 text-gray-900 font-mono">{mid}</span>
                </div>
              </div>
            </div>

            {/* Merchant Profile */}
            {merchantProfile && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>Merchant Profile</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{merchantProfile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PG Status:</span>
                      <Badge className={merchantProfile.pgStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {merchantProfile.pgStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vintage:</span>
                      <span className="font-medium">{merchantProfile.vintageInMonths} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Type:</span>
                      <span className="font-medium">{merchantProfile.businessType}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">AM Active Days:</span>
                      <span className="font-medium">{merchantProfile.amActiveDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AM GMV:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(merchantProfile.amGMV)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Segment:</span>
                      <Badge variant="outline">{merchantProfile.businessSegment}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aggregate Transaction Data */}
            {aggregateData && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Merchant Aggregate Transaction Data</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium">Total GMV (6 months)</div>
                    <div className="text-2xl font-bold text-blue-800">{formatNumber(aggregateData.totalGMV)}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-sm text-green-600 font-medium">Average GMV</div>
                    <div className="text-2xl font-bold text-green-800">{formatNumber(aggregateData.averageGMV)}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-sm text-purple-600 font-medium">Growth Trend</div>
                    <div className="text-2xl font-bold text-purple-800">
                      {aggregateData.monthlyGMV[5].gmv > aggregateData.monthlyGMV[0].gmv ? '📈' : '📉'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800">Monthly GMV Breakdown:</h5>
                  <div className="space-y-2">
                    {aggregateData.monthlyGMV.map((data, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">{data.month}</span>
                        <span className="font-medium">{formatCurrency(data.gmv)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Report Footer */}
            <div className="bg-gray-50 p-4 rounded-lg border text-center">
              <p className="text-xs text-gray-500">
                📄 This report is auto-generated based on merchant transaction data and profile information.
                <br />
                For detailed analysis, please contact the analytics team.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
