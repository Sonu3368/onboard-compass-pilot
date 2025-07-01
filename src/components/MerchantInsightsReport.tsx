
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, RefreshCw } from 'lucide-react';

interface MerchantProfile {
  name: string;
  pgStatus: string;
  vintageInMonths: number;
  businessType: string;
  amActiveDays: number;
  amSettlements: number;
  businessSegment: string;
}

interface AggregateData {
  monthlyGMV: { year: string; month: string; gmv: number }[];
  averageSettlements: number;
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
      pgStatus: Math.random() > 0.3 ? 'Live' : 'Inactive',
      vintageInMonths: Math.floor(Math.random() * 60) + 12, // 12-72 months
      businessType: ['Private_Limited', 'Proprietorship', 'Partnership', 'LLP'][Math.floor(Math.random() * 4)],
      amActiveDays: Math.floor(Math.random() * 30) + 1, // 1-30 days
      amSettlements: Math.floor(Math.random() * 5000000) + 5000000, // 50L to 1Cr
      businessSegment: ['B2B', 'B2C', 'SME', 'Enterprise'][Math.floor(Math.random() * 4)]
    };

    // Mock Aggregate Transaction Data (Last 6 months)
    const months = [
      { year: '2025', month: 'January' },
      { year: '2025', month: 'February' },
      { year: '2025', month: 'March' },
      { year: '2025', month: 'April' },
      { year: '2025', month: 'May' },
      { year: '2025', month: 'June' }
    ];
    
    const monthlyGMV = months.map(({ year, month }) => ({
      year,
      month,
      gmv: Math.floor(Math.random() * 2000000) + 7000000 // 70L to 90L per month
    }));

    const totalSettlements = monthlyGMV.reduce((sum, data) => sum + data.gmv, 0);
    const averageSettlements = Math.floor(totalSettlements / monthlyGMV.length);

    const mockAggregateData: AggregateData = {
      monthlyGMV,
      averageSettlements
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600">🏢</div>
              <span className="text-2xl font-bold text-gray-800">Razorpay</span>
              <span className="text-2xl font-bold text-orange-500">X</span>
            </div>
          </div>
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
        
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Registered Address: Ground Floor, SJR Cyber, Hosur Road, Adugodi, Bangalore 560030
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Generating Merchant Insights Report...</p>
              <p className="text-xs text-gray-500 mt-1">Fetching data for MID: {mid}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Report Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Merchant Insights Report
              </h1>
            </div>

            {/* Merchant Profile Section */}
            {merchantProfile && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2">
                  Merchant Profile
                </h2>
                
                <div className="overflow-hidden border border-gray-300">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-300">
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700 w-1/3">Date</td>
                        <td className="px-4 py-3 text-gray-900">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">MID</td>
                        <td className="px-4 py-3 text-gray-900 font-mono">{mid}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Name</td>
                        <td className="px-4 py-3 text-gray-900">{merchantProfile.name}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">PG Status</td>
                        <td className="px-4 py-3 text-gray-900">{merchantProfile.pgStatus}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Vintage in Months</td>
                        <td className="px-4 py-3 text-gray-900">{merchantProfile.vintageInMonths}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Business Type</td>
                        <td className="px-4 py-3 text-gray-900">{merchantProfile.businessType}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">AM Active Days</td>
                        <td className="px-4 py-3 text-gray-900">{merchantProfile.amActiveDays}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">AM Settlements</td>
                        <td className="px-4 py-3 text-gray-900">{formatNumber(merchantProfile.amSettlements)}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Segment</td>
                        <td className="px-4 py-3 text-gray-900">{merchantProfile.businessSegment}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Merchant Aggregate Data Section */}
            {aggregateData && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2">
                  Merchant Aggregate Data
                </h2>
                
                <p className="text-sm text-gray-700 mb-4">
                  Please find below the aggregate settlements for the last 6 months:
                </p>
                
                <div className="overflow-hidden border border-gray-300">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-300">Year of Trxn</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-300">Month of Trxn</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700 border-b border-gray-300">Net GMV(Settlements)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aggregateData.monthlyGMV.map((data, index) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="px-4 py-3 text-gray-900">{data.year}</td>
                          <td className="px-4 py-3 text-gray-900">{data.month}</td>
                          <td className="px-4 py-3 text-right text-gray-900">{formatNumber(data.gmv)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-medium">
                        <td className="px-4 py-3 text-gray-900" colSpan={2}>Last 6 Months Avg Settlements</td>
                        <td className="px-4 py-3 text-right text-gray-900">{formatNumber(aggregateData.averageSettlements)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Report Footer */}
            <div className="mt-8 pt-4">
              <p className="text-sm text-gray-600 font-medium">
                Note: This is a system generated report
              </p>
              {lastGenerated && (
                <p className="text-xs text-gray-500 mt-2">
                  Generated on: {lastGenerated.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
