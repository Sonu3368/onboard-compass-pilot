
// Email verification service using AI-powered text extraction
export interface EmailVerificationResult {
  extracted_emails: string[];
  target_email_match: boolean;
  reasoning: string;
}

export class EmailVerificationService {
  private static extractEmailsFromText(text: string): string[] {
    // Enhanced email regex pattern
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailRegex) || [];
    
    // Remove duplicates and return unique emails
    return [...new Set(emails)];
  }

  private static normalizeEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    return `${localPart}@${domain.toLowerCase()}`;
  }

  public static async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.type === 'application/pdf') {
        // For PDF files, we'll simulate OCR extraction
        // In production, you'd use a real OCR service like Google Cloud Vision
        const reader = new FileReader();
        reader.onload = () => {
          // Simulate extracted text from PDF
          const simulatedText = `
            Corporate Consent Form
            
            We hereby consent to the processing of our application for corporate credit facilities.
            
            Primary Contact: John Doe
            Email: ${Math.random() > 0.5 ? 'john.doe@company.com' : 'contact@business.org'}
            
            Alternative Contact: Jane Smith  
            Email: jane.smith@company.com
            
            Finance Department: finance@company.com
            Support Team: support@company.com
            
            This consent is valid for processing our application and related communications.
            
            Signed: Authorized Representative
            Date: ${new Date().toLocaleDateString()}
          `;
          resolve(simulatedText);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      } else {
        // For image files, simulate OCR
        const reader = new FileReader();
        reader.onload = () => {
          const simulatedText = `
            CONSENT DOCUMENT
            
            Business Name: ABC Corporation
            Contact Email: business@company.com
            
            We authorize the processing of our credit application.
            
            Additional contacts:
            - admin@company.com
            - operations@company.com
            
            This document serves as our official consent.
          `;
          resolve(simulatedText);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }
    });
  }

  public static async verifyEmailAgainstConsent(
    consentFileText: string,
    targetEmail: string
  ): Promise<EmailVerificationResult> {
    // Extract all emails from the consent document
    const extractedEmails = this.extractEmailsFromText(consentFileText);
    
    // Normalize emails for comparison
    const normalizedTarget = this.normalizeEmail(targetEmail);
    const normalizedExtracted = extractedEmails.map(email => this.normalizeEmail(email));
    
    // Check if target email exists in extracted emails
    const targetEmailMatch = normalizedExtracted.includes(normalizedTarget);
    
    let reasoning: string;
    if (targetEmailMatch) {
      reasoning = `The target email '${targetEmail}' was found among the extracted emails from the consent document.`;
    } else {
      reasoning = `The target email '${targetEmail}' was not found in the consent document. Extracted emails: ${extractedEmails.join(', ') || 'none found'}.`;
    }

    return {
      extracted_emails: extractedEmails,
      target_email_match: targetEmailMatch,
      reasoning
    };
  }

  public static async processConsentFile(
    file: File,
    merchantPocEmail: string
  ): Promise<EmailVerificationResult> {
    try {
      // Extract text from the uploaded file
      const extractedText = await this.extractTextFromFile(file);
      
      // Verify email against consent document
      const verificationResult = await this.verifyEmailAgainstConsent(
        extractedText,
        merchantPocEmail
      );

      return verificationResult;
    } catch (error) {
      console.error('Error processing consent file:', error);
      return {
        extracted_emails: [],
        target_email_match: false,
        reasoning: 'Error processing consent file or extracting text.'
      };
    }
  }
}
