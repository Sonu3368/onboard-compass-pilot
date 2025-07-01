
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, BarChart3, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AnalysisResult {
  analysis: string;
  taskModule: string;
  timestamp: Date;
}

export const BusinessAnalysisEngine: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const corePrompt = `You are a Senior Business Analyst specializing in Merchant Portfolio Management and Growth Strategy. I am providing you with a database file containing merchant data.

Your analysis must be based on the following columns:

**Identifiers:** parent_id, merchant_id

**Business Profile:** business_name, business_type_bin, business_category, business_Subcategory, business_registered_city, business_registered_state

**Financial Metrics:**
- amgmv_l6_m: Average Monthly Gross Merchandise Volume over the last 6 months
- combined_amgmv_l6_m: Combined AMGMV (likely includes parent/related accounts)
- count_mids: Count of Merchant IDs associated with the parent
- amgmv_range: A predefined bucket for the AMGMV
- CA AMB in Lac: Current Account Average Monthly Balance in Lakhs
- MTR: Merchant Transaction Rate or a similar fee percentage

**Credit/Limit Data:** calculated_limit, proposed_limit, proposed_limit_range

**Account Management:** owner_role, managed_status, team_name, account_manager

**Contact Information:** contact_name, contact_email, contact_mobile

**Product Adoption Flags:** Sbm customer (likely a specific product), Payroll User

**Activity Flag:** Part of last month base

Please structure your output clearly using Markdown, including headings, bullet points, and tables for easy interpretation. Conclude with a summary of your key findings.`;

  const taskModules = {
    overview: {
      name: "High-Level Business Overview",
      icon: BarChart3,
      description: "Comprehensive portfolio composition and financial health analysis",
      prompt: `Generate a comprehensive business overview of the entire merchant portfolio. Your analysis should summarize:

**Portfolio Composition:** Break down the portfolio by business_category, business_registered_state, and managed_status.

**Financial Health:** Provide summary statistics (average, median, total) for key financial metrics like combined_amgmv_l6_m and CA AMB in Lac.

**Top Performers:** Identify the top 10 merchants by combined_amgmv_l6_m.

**Product Penetration:** Calculate the adoption rate percentage for Sbm customer and Payroll User.

**Key Insights:** State 3-5 critical observations a business leader should know about the portfolio.`
    },
    crossSell: {
      name: "Cross-Sell & Up-Sell Opportunities",
      icon: TrendingUp,
      description: "Identify highest-potential growth opportunities",
      prompt: `Act as a growth strategist. Your goal is to identify the highest-potential cross-sell and up-sell opportunities within this dataset. Your analysis must:

**Identify Payroll Candidates:** List the top 15 merchants who are NOT Payroll Users but have a high combined_amgmv_l6_m (e.g., in the top 20%) and/or a high CA AMB in Lac. Provide their name, AMGMV, and account manager.

**Identify SBM Candidates:** List the top 15 merchants who are NOT Sbm customers but are in a valuable amgmv_range and have a designated account_manager.

**Create Actionable Talking Points:** For the top 5 payroll candidates, suggest a concise, data-driven talking point for the account manager (e.g., 'Based on your strong monthly volume of [AMGMV], our Payroll service could streamline your operations.').`
    },
    segmentation: {
      name: "Customer Segmentation Analysis",
      icon: Users,
      description: "Create strategic merchant personas and tiers",
      prompt: `Perform a strategic customer segmentation based on the provided data. Your goal is to create meaningful merchant personas or tiers.

**Define Segments:** Propose 3-4 distinct merchant segments. Base your segmentation on a combination of combined_amgmv_l6_m, managed_status, and CA AMB in Lac. Name each segment (e.g., 'Tier 1: High-Value Managed', 'Tier 2: High-Potential Unmanaged', 'Tier 3: SMB Core').

**Profile Each Segment:** For each segment you define, provide a detailed profile including:
- Average combined_amgmv_l6_m
- Common business_categorys
- Product penetration for Payroll User and Sbm customer
- The number of merchants in that segment

**Strategic Recommendations:** Suggest one key strategic action for each segment (e.g., 'For Tier 2, assign an inside sales rep to nurture them towards managed status.').`
    },
    riskReview: {
      name: "Risk & Limit Review Analysis",
      icon: AlertTriangle,
      description: "Identify merchants requiring credit limit or health review",
      prompt: `Act as a risk analyst. Your objective is to identify merchants who may require a review of their credit limits or business health.

**Flag Limit Discrepancies:** Identify all merchants where the proposed_limit is more than 25% higher or lower than the calculated_limit. Present this in a table with merchant_id, business_name, calculated_limit, proposed_limit, and the percentage difference.

**Identify High-Risk Indicators:** List merchants that exhibit a combination of potentially risky traits, such as:
- A high proposed_limit but a low or declining amgmv_l6_m
- A low CA AMB in Lac relative to their amgmv_range

**Prioritize for Review:** Create a prioritized 'Top 10 Watchlist' of merchants that the risk team should review first, and state the primary reason for each.`
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setSelectedFile(file);
    } else {
      alert('Please upload a CSV or Excel file.');
    }
  };

  const handleAnalysis = async () => {
    if (!selectedFile || !selectedModule) {
      alert('Please select both a file and analysis module.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis (in production, this would call your AI service)
    try {
      const fullPrompt = `${corePrompt}\n\nYour task is to: ${taskModules[selectedModule as keyof typeof taskModules].prompt}`;
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis result
      const mockAnalysis = `# ${taskModules[selectedModule as keyof typeof taskModules].name}

## Executive Summary
Based on the merchant portfolio data analysis, here are the key findings:

### Portfolio Composition
- **Total Merchants Analyzed:** 1,247
- **Primary Business Categories:** E-commerce (34%), Retail (28%), Services (22%), Manufacturing (16%)
- **Geographic Distribution:** Maharashtra (31%), Karnataka (18%), Delhi (15%), Others (36%)

### Financial Performance
- **Average Monthly GMV:** ₹12.4 Lakhs
- **Total Portfolio Value:** ₹154.7 Crores
- **Top 10% Contributors:** Generate 68% of total volume

### Product Adoption
- **Payroll Users:** 23% adoption rate
- **SBM Customers:** 41% adoption rate
- **Cross-product Usage:** 67% use multiple products

### Key Recommendations
1. **Focus on Tier 1 merchants** with GMV >₹50L for premium services
2. **Target non-payroll users** in high-volume segments
3. **Expand SBM adoption** in manufacturing sector
4. **Review credit limits** for 47 flagged accounts

*Analysis completed on ${new Date().toLocaleString()}*`;

      setAnalysisResult({
        analysis: mockAnalysis,
        taskModule: taskModules[selectedModule as keyof typeof taskModules].name,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span>AI-Powered Business Analysis Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Upload Merchant Data File
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                <span>Choose File</span>
              </label>
              {selectedFile && (
                <Badge variant="secondary">
                  {selectedFile.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Task Module Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Analysis Module
            </label>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger>
                <SelectValue placeholder="Choose analysis type..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(taskModules).map(([key, module]) => {
                  const IconComponent = module.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{module.name}</div>
                          <div className="text-xs text-gray-500">{module.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Analysis Button */}
          <Button 
            onClick={handleAnalysis}
            disabled={!selectedFile || !selectedModule || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Analyzing Data...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Results: {analysisResult.taskModule}</span>
              <Badge variant="outline">
                {analysisResult.timestamp.toLocaleString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Textarea
                value={analysisResult.analysis}
                readOnly
                className="min-h-96 font-mono text-sm bg-white"
              />
            </div>
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm">
                Export as PDF
              </Button>
              <Button variant="outline" size="sm">
                Copy to Clipboard
              </Button>
              <Button variant="outline" size="sm">
                Share Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
