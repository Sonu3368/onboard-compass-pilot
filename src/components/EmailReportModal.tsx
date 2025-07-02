import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, Clock, FileText, Mail } from 'lucide-react';

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationsData: any[];
}

export const EmailReportModal: React.FC<EmailReportModalProps> = ({
  isOpen,
  onClose,
  applicationsData
}) => {
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [enableScheduling, setEnableScheduling] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmails = (emailString: string): boolean => {
    const emails = emailString.split(',').map(email => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.every(email => emailRegex.test(email));
  };

  const generateReportContent = (template: string) => {
    const today = new Date().toLocaleDateString();
    
    switch (template) {
      case 'daily-summary':
        return {
          subject: `Daily Lead Summary - ${today}`,
          htmlBody: `
            <h2>Daily Lead Summary - ${today}</h2>
            <p>Total Active Applications: ${applicationsData.length}</p>
            <table border="1" style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr>
                  <th>Entity Name</th>
                  <th>MID</th>
                  <th>Status</th>
                  <th>Expected Credit Limit</th>
                </tr>
              </thead>
              <tbody>
                ${applicationsData.slice(0, 10).map(app => `
                  <tr>
                    <td>${app.entityName}</td>
                    <td>${app.mid}</td>
                    <td>${app.status}</td>
                    <td>₹${app.expectedCreditLimit?.toLocaleString() || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `
        };
      
      case 'weekly-overview':
        const totalCreditLimit = applicationsData.reduce((sum, app) => sum + (app.expectedCreditLimit || 0), 0);
        return {
          subject: `Weekly Performance Overview - ${today}`,
          htmlBody: `
            <h2>Weekly Performance Overview</h2>
            <div style="display: flex; gap: 20px; margin: 20px 0;">
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
                <h3>Total Applications</h3>
                <p style="font-size: 24px; font-weight: bold;">${applicationsData.length}</p>
              </div>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px;">
                <h3>Total Credit Limit</h3>
                <p style="font-size: 24px; font-weight: bold;">₹${totalCreditLimit.toLocaleString()}</p>
              </div>
            </div>
          `
        };
      
      case 'full-export':
        return {
          subject: `Full Lead Data Export - ${today}`,
          htmlBody: `
            <h2>Full Lead Data Export</h2>
            <p>Please find the complete lead data attached as a PDF document.</p>
            <p>Export Date: ${today}</p>
            <p>Total Records: ${applicationsData.length}</p>
          `
        };
      
      default:
        return {
          subject: 'Application Report',
          htmlBody: '<p>Application report generated.</p>'
        };
    }
  };

  const handleSendNow = async () => {
    if (!emailRecipients.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter at least one email recipient.',
        variant: 'destructive'
      });
      return;
    }

    if (!validateEmails(emailRecipients)) {
      toast({
        title: 'Invalid Email Format',
        description: 'Please enter valid email addresses separated by commas.',
        variant: 'destructive'
      });
      return;
    }

    if (!emailTemplate) {
      toast({
        title: 'Template Required',
        description: 'Please select a report template.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for sending email
      const reportContent = generateReportContent(emailTemplate);
      const recipients = emailRecipients.split(',').map(email => email.trim());
      
      // In a real implementation, this would call your backend API
      console.log('Sending email report:', {
        recipients,
        subject: reportContent.subject,
        htmlBody: reportContent.htmlBody,
        attachment: fileAttachment,
        data: applicationsData
      });

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Email Sent Successfully!',
        description: `Report sent to ${recipients.length} recipient(s).`
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Email Send Failed',
        description: 'Failed to send email report. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!emailRecipients.trim() || !emailTemplate || !scheduleFrequency || !scheduleTime) {
      toast({
        title: 'Incomplete Configuration',
        description: 'Please fill in all scheduling fields.',
        variant: 'destructive'
      });
      return;
    }

    if (!validateEmails(emailRecipients)) {
      toast({
        title: 'Invalid Email Format',
        description: 'Please enter valid email addresses.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, this would save to your backend/database
      console.log('Saving email schedule:', {
        recipients: emailRecipients.split(',').map(email => email.trim()),
        template: emailTemplate,
        frequency: scheduleFrequency,
        time: scheduleTime
      });

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Schedule Saved Successfully!',
        description: `Automated email schedule has been configured.`
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Schedule Save Failed',
        description: 'Failed to save email schedule. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Report & Scheduling</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient & Content Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Recipient & Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emailRecipients">Send To (comma-separated email addresses)</Label>
                <Textarea
                  id="emailRecipients"
                  placeholder="user1@example.com, user2@example.com, ..."
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="emailTemplate">Select Report Template</Label>
                <Select value={emailTemplate} onValueChange={setEmailTemplate}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily-summary">Daily Lead Summary</SelectItem>
                    <SelectItem value="weekly-overview">Weekly Performance Overview</SelectItem>
                    <SelectItem value="full-export">Full Lead Data Export (PDF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fileAttachment">Attach Additional PDF (Optional)</Label>
                <Input
                  id="fileAttachment"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFileAttachment(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Automated Scheduling Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Automated Scheduling</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableScheduling"
                  checked={enableScheduling}
                  onCheckedChange={(checked) => setEnableScheduling(checked === true)}
                />
                <Label htmlFor="enableScheduling">Enable Automated Sending</Label>
              </div>

              {enableScheduling && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label htmlFor="scheduleFrequency">Frequency</Label>
                    <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select frequency..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly (on Mondays)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="scheduleTime">Time to Send (IST)</Label>
                    <Input
                      id="scheduleTime"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            {enableScheduling && (
              <Button
                variant="secondary"
                onClick={handleSaveSchedule}
                disabled={isLoading}
              >
                <Clock className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Schedule'}
              </Button>
            )}
            
            <Button
              onClick={handleSendNow}
              disabled={isLoading}
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};