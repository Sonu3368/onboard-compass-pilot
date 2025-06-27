
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, FileText } from 'lucide-react';

interface ApplicationFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    entityName: '',
    entityType: '',
    mid: '',
    businessAddress: '',
    city: '',
    businessWebsite: '',
    natureOfBusiness: '',
    businessVintage: '',
    annualTurnover: '',
    rzpRmName: '',
    rzpRmPhone: '',
    pocName: '',
    pocPhone: '',
    pocEmail: '',
    expectedCreditLimit: '',
    monthlySpends: '',
    internationalSpends: '',
    lowerMccSpends: '',
    appointmentDate: '',
    sourceOfAppointment: '',
    spocRemarks: ''
  });

  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setConsentFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert string numbers to actual numbers
    const processedData = {
      ...formData,
      annualTurnover: Number(formData.annualTurnover),
      expectedCreditLimit: Number(formData.expectedCreditLimit),
      monthlySpends: Number(formData.monthlySpends),
      internationalSpends: Number(formData.internationalSpends),
      lowerMccSpends: Number(formData.lowerMccSpends),
      consentFile
    };

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onSubmit(processedData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-xl font-semibold">New Client Onboarding Application</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entityName">Entity Name *</Label>
                  <Input
                    id="entityName"
                    value={formData.entityName}
                    onChange={(e) => handleInputChange('entityName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mid">MID *</Label>
                  <Input
                    id="mid"
                    value={formData.mid}
                    onChange={(e) => handleInputChange('mid', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entityType">Entity Type *</Label>
                  <Select onValueChange={(value) => handleInputChange('entityType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proprietorship">Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="pvt-ltd">Private Limited</SelectItem>
                      <SelectItem value="llp">LLP</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessWebsite">Business Website *</Label>
                  <Input
                    id="businessWebsite"
                    type="url"
                    value={formData.businessWebsite}
                    onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessVintage">Business Vintage *</Label>
                  <Input
                    id="businessVintage"
                    placeholder="e.g., 3 years"
                    value={formData.businessVintage}
                    onChange={(e) => handleInputChange('businessVintage', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address *</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualTurnover">Annual Turnover (INR) *</Label>
                  <Input
                    id="annualTurnover"
                    type="number"
                    value={formData.annualTurnover}
                    onChange={(e) => handleInputChange('annualTurnover', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectedCreditLimit">Expected Credit Limit *</Label>
                  <Input
                    id="expectedCreditLimit"
                    type="number"
                    value={formData.expectedCreditLimit}
                    onChange={(e) => handleInputChange('expectedCreditLimit', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthlySpends">Estimated Monthly Spends (INR) *</Label>
                  <Input
                    id="monthlySpends"
                    type="number"
                    value={formData.monthlySpends}
                    onChange={(e) => handleInputChange('monthlySpends', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="internationalSpends">% International Spends *</Label>
                  <Input
                    id="internationalSpends"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.internationalSpends}
                    onChange={(e) => handleInputChange('internationalSpends', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Point of Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Point of Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pocName">POC Name *</Label>
                  <Input
                    id="pocName"
                    value={formData.pocName}
                    onChange={(e) => handleInputChange('pocName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pocPhone">POC Phone *</Label>
                  <Input
                    id="pocPhone"
                    type="tel"
                    value={formData.pocPhone}
                    onChange={(e) => handleInputChange('pocPhone', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pocEmail">POC Email *</Label>
                  <Input
                    id="pocEmail"
                    type="email"
                    value={formData.pocEmail}
                    onChange={(e) => handleInputChange('pocEmail', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rzpRmName">RZP RM Name *</Label>
                  <Input
                    id="rzpRmName"
                    value={formData.rzpRmName}
                    onChange={(e) => handleInputChange('rzpRmName', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Documents</h3>
              <div className="space-y-2">
                <Label htmlFor="consent">Upload Consent Form *</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="consent"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    required
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                  />
                  {consentFile && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <FileText className="h-4 w-4" />
                      <span>{consentFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
