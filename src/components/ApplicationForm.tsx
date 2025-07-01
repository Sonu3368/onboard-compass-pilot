
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApplicationFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    timestamp: new Date().toISOString(),
    rzpRmName: '',
    rzpRmPhone: '',
    mid: '',
    entityName: '',
    entityType: '',
    businessAddress: '',
    city: '',
    businessWebsite: '',
    mtrAvailable: '',
    natureOfBusiness: '',
    businessVintage: '',
    annualTurnover: '',
    merchantPocName: '',
    merchantPocPhone: '',
    merchantPocEmail: '',
    yesBankRelationship: '',
    yblCreditLimit: '',
    expectedCreditLimit: '',
    natureOfUnderwriting: '',
    securityType: '',
    monthlySpends: '',
    internationalSpends: '',
    lowerMccSpends: '',
    policy: '',
    gmv: '',
    alternateNumber: '',
    spocRemarks: '',
    appointmentDate: '',
    sourceOfAppointment: ''
  });

  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a PDF or image file (JPG, JPEG, PNG)',
          variant: 'destructive'
        });
        return;
      }
      setConsentFile(file);
      if (errors.consentFile) {
        setErrors(prev => ({ ...prev, consentFile: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    const requiredFields = [
      'rzpRmName', 'rzpRmPhone', 'mid', 'entityName', 'entityType', 'businessAddress', 
      'city', 'businessWebsite', 'mtrAvailable', 'natureOfBusiness', 'businessVintage',
      'annualTurnover', 'merchantPocName', 'merchantPocPhone', 'merchantPocEmail',
      'yesBankRelationship', 'expectedCreditLimit', 'natureOfUnderwriting', 'securityType',
      'monthlySpends', 'internationalSpends', 'lowerMccSpends', 'policy', 'gmv',
      'alternateNumber', 'appointmentDate', 'sourceOfAppointment'
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Phone number validation (10 digits)
    const phonePattern = /^\d{10}$/;
    if (formData.rzpRmPhone && !phonePattern.test(formData.rzpRmPhone)) {
      newErrors.rzpRmPhone = 'Please enter a valid 10-digit phone number';
    }
    if (formData.merchantPocPhone && !phonePattern.test(formData.merchantPocPhone)) {
      newErrors.merchantPocPhone = 'Please enter a valid 10-digit phone number';
    }
    if (formData.alternateNumber && !phonePattern.test(formData.alternateNumber)) {
      newErrors.alternateNumber = 'Please enter a valid 10-digit phone number';
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.merchantPocEmail && !emailPattern.test(formData.merchantPocEmail)) {
      newErrors.merchantPocEmail = 'Please enter a valid email address';
    }

    // URL validation
    if (formData.businessWebsite && !formData.businessWebsite.startsWith('http')) {
      newErrors.businessWebsite = 'Please enter a valid URL (starting with http:// or https://)';
    }

    // Percentage validation (0-100)
    const internationalSpends = Number(formData.internationalSpends);
    const lowerMccSpends = Number(formData.lowerMccSpends);
    
    if (internationalSpends < 0 || internationalSpends > 100) {
      newErrors.internationalSpends = 'Please enter a percentage between 0 and 100';
    }
    if (lowerMccSpends < 0 || lowerMccSpends > 100) {
      newErrors.lowerMccSpends = 'Please enter a percentage between 0 and 100';
    }

    // Consent file validation
    if (!consentFile) {
      newErrors.consentFile = 'Please upload the consent file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix all errors before submitting',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert string numbers to actual numbers and add file
      const processedData = {
        ...formData,
        annualTurnover: Number(formData.annualTurnover),
        expectedCreditLimit: Number(formData.expectedCreditLimit),
        monthlySpends: Number(formData.monthlySpends),
        internationalSpends: Number(formData.internationalSpends),
        lowerMccSpends: Number(formData.lowerMccSpends),
        gmv: Number(formData.gmv),
        yblCreditLimit: formData.yblCreditLimit ? Number(formData.yblCreditLimit) : null,
        consentFile,
        applicationId: `APP-${Date.now()}`, // Generate unique application ID
        submissionDate: new Date()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Application Submitted Successfully!',
        description: `Your reference number is ${processedData.applicationId}. We are now verifying your details and will update you shortly.`,
      });

      onSubmit(processedData);
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormField = (id: string, label: string, type: string = 'text', options?: string[], isTextarea: boolean = false, isRequired: boolean = true) => {
    const hasError = !!errors[id];
    
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className={hasError ? 'text-red-600' : ''}>
          {label} {isRequired && '*'}
        </Label>
        {type === 'select' ? (
          <Select onValueChange={(value) => handleInputChange(id, value)} value={formData[id as keyof typeof formData]}>
            <SelectTrigger className={hasError ? 'border-red-500' : ''}>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : isTextarea ? (
          <Textarea
            id={id}
            value={formData[id as keyof typeof formData]}
            onChange={(e) => handleInputChange(id, e.target.value)}
            rows={3}
            className={hasError ? 'border-red-500' : ''}
          />
        ) : (
          <Input
            id={id}
            type={type}
            value={formData[id as keyof typeof formData]}
            onChange={(e) => handleInputChange(id, e.target.value)}
            className={hasError ? 'border-red-500' : ''}
            placeholder={type === 'tel' ? '10-digit phone number' : type === 'email' ? 'example@domain.com' : ''}
          />
        )}
        {hasError && (
          <div className="flex items-center space-x-1 text-red-600 text-sm">
            <AlertCircle className="h-3 w-3" />
            <span>{errors[id]}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-xl font-semibold">New Corporate Client Onboarding Application</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Timestamp - Auto-populated */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Application Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timestamp</Label>
                  <Input value={new Date(formData.timestamp).toLocaleString()} disabled className="bg-gray-100" />
                </div>
              </div>
            </div>

            {/* Sales POC Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">RZP Sales POC Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField('rzpRmName', 'RZP RM (Sales POC) Name')}
                {renderFormField('rzpRmPhone', 'RZP RM (Sales POC) Phone Number', 'tel')}
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField('mid', 'MID')}
                {renderFormField('entityName', 'Entity Name')}
                {renderFormField('entityType', 'Entity Type', 'select', ['Proprietorship', 'Partnership', 'Pvt Ltd', 'LLP', 'Other'])}
                {renderFormField('city', 'City')}
                {renderFormField('businessWebsite', 'Business Website', 'url')}
                {renderFormField('mtrAvailable', 'MTR Available?', 'select', ['Yes', 'No'])}
                {renderFormField('natureOfBusiness', 'Nature of Business')}
                {renderFormField('businessVintage', 'Business Vintage')}
              </div>
              {renderFormField('businessAddress', 'Business Address', 'text', undefined, true)}
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField('annualTurnover', 'Annual Turnover (INR)', 'number')}
                {renderFormField('expectedCreditLimit', 'Expected Credit Limit Required', 'number')}
                {renderFormField('monthlySpends', 'Estimated Monthly Spends in Cr', 'number')}
                {renderFormField('internationalSpends', '% Breakup of International Spends', 'number')}
                {renderFormField('lowerMccSpends', '% Breakup of Lower MCC Spends', 'number')}
                {renderFormField('gmv', 'Gross Monthly Value (GMV)', 'number')}
                {renderFormField('natureOfUnderwriting', 'Nature of Underwriting')}
                {renderFormField('securityType', 'Unsecured / Secured?', 'select', ['Unsecured', 'Secured'])}
                {renderFormField('policy', 'Policy')}
              </div>
            </div>

            {/* Banking Relationship */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Banking Relationship</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField('yesBankRelationship', 'Does the merchant have an existing banking relationship with YES Bank?', 'select', ['Yes', 'No'])}
                {formData.yesBankRelationship === 'Yes' && renderFormField('yblCreditLimit', 'YBL Lending Credit Limit Sanctioned', 'number', undefined, false, false)}
              </div>
            </div>

            {/* Point of Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Merchant Point of Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField('merchantPocName', 'Merchant POC Name with Designation')}
                {renderFormField('merchantPocPhone', 'Merchant POC Phone Number', 'tel')}
                {renderFormField('merchantPocEmail', 'Merchant POC Email ID', 'email')}
                {renderFormField('alternateNumber', 'Alternate One Number', 'tel')}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField('appointmentDate', 'Appointment Date', 'date')}
                {renderFormField('sourceOfAppointment', 'Source of Appointment')}
              </div>
              {renderFormField('spocRemarks', 'SPOC Remarks', 'text', undefined, true, false)}
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Documents</h3>
              <div className="space-y-2">
                <Label htmlFor="consent" className={errors.consentFile ? 'text-red-600' : ''}>
                  Upload Consent *
                </Label>
                <div className="space-y-2">
                  <Input
                    id="consent"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className={`file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 ${errors.consentFile ? 'border-red-500' : ''}`}
                  />
                  {errors.consentFile && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.consentFile}</span>
                    </div>
                  )}
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
                    Submitting Application...
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
