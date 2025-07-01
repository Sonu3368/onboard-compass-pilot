
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Mail, FileText, AlertTriangle } from 'lucide-react';
import { EmailVerificationResult } from '@/services/emailVerificationService';

interface EmailVerificationDisplayProps {
  verificationResult: EmailVerificationResult | null;
  targetEmail: string;
  isProcessing: boolean;
}

export const EmailVerificationDisplay: React.FC<EmailVerificationDisplayProps> = ({
  verificationResult,
  targetEmail,
  isProcessing
}) => {
  if (isProcessing) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Processing Email Verification...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 text-sm">
            Extracting text from consent document and verifying email address...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!verificationResult) {
    return null;
  }

  const { extracted_emails, target_email_match, reasoning } = verificationResult;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <span>Email Verification Results</span>
          {target_email_match ? (
            <Badge className="bg-green-100 text-green-800">✓ VERIFIED</Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">❌ FAILED</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          {target_email_match ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
          )}
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">Target Email Verification</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Target:</strong> {targetEmail}
            </p>
            <p className="text-sm text-gray-600">{reasoning}</p>
          </div>
        </div>

        {extracted_emails.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Extracted Email Addresses</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {extracted_emails.map((email, index) => (
                <Badge
                  key={index}
                  variant={email.toLowerCase() === targetEmail.toLowerCase() ? "default" : "secondary"}
                  className={email.toLowerCase() === targetEmail.toLowerCase() ? "bg-green-100 text-green-800" : ""}
                >
                  {email}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!target_email_match && extracted_emails.length === 0 && (
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800">
                <strong>No Email Addresses Found:</strong> The consent document may not contain any readable email addresses, or the document quality may be insufficient for text extraction.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
