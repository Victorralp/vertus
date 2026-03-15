/**
 * Property-Based Tests for Email Service
 * 
 * Tests email sending functionality using fast-check for property-based testing.
 */

import * as fc from 'fast-check';
import * as nodemailer from 'nodemailer';
import { sendOTPEmail, OTPEmailParams } from './email';

// Mock nodemailer
jest.mock('nodemailer');

describe('Email Service - Property-Based Tests', () => {
  let mockTransporter: any;
  let mockSendMail: jest.Mock;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Setup SMTP environment variables
    process.env.SMTP_HOST = 'smtp.test.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test@test.com';
    process.env.SMTP_PASS = 'testpass';
    process.env.SMTP_FROM = 'NexusBank <noreply@nexusbank.com>';

    // Create mock sendMail function
    mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });

    // Create mock transporter
    mockTransporter = {
      sendMail: mockSendMail,
    };

    // Mock nodemailer.createTransport
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  /**
   * Property 1: Email sending integration
   * **Validates: Requirements 1.1**
   * 
   * For any valid OTP code, purpose, and recipient email, when the Email_Service 
   * sends an OTP email, it should call Nodemailer with the correct SMTP configuration 
   * and email parameters.
   */
  describe('Property 1: Email sending integration', () => {
    it('should call Nodemailer with correct SMTP configuration and email parameters for any valid inputs', async () => {
      // Define generators for valid inputs
      const otpCodeArbitrary = fc.string({ minLength: 4, maxLength: 8 }).filter(s => /^\d+$/.test(s));
      const purposeArbitrary = fc.constantFrom('login', 'transfer', 'settings', 'card_action');
      const emailArbitrary = fc.emailAddress();
      const expiresInMinutesArbitrary = fc.integer({ min: 1, max: 60 });

      await fc.assert(
        fc.asyncProperty(
          otpCodeArbitrary,
          purposeArbitrary,
          emailArbitrary,
          expiresInMinutesArbitrary,
          async (otpCode, purpose, email, expiresInMinutes) => {
            // Reset mocks for each iteration
            jest.clearAllMocks();

            // Prepare email parameters
            const params: OTPEmailParams = {
              to: email,
              otpCode,
              purpose,
              expiresInMinutes,
            };

            // Call sendOTPEmail
            await sendOTPEmail(params);

            // Verify nodemailer.createTransport was called with correct SMTP config
            expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
            expect(nodemailer.createTransport).toHaveBeenCalledWith({
              host: 'smtp.test.com',
              port: 587,
              secure: false, // false for port 587
              auth: {
                user: 'test@test.com',
                pass: 'testpass',
              },
            });

            // Verify sendMail was called with correct parameters
            expect(mockSendMail).toHaveBeenCalledTimes(1);
            const sendMailArgs = mockSendMail.mock.calls[0][0];

            // Verify email parameters
            expect(sendMailArgs.from).toBe('NexusBank <noreply@nexusbank.com>');
            expect(sendMailArgs.to).toBe(email);
            expect(sendMailArgs.subject).toBe('Your NexusBank Verification Code');

            // Verify email content contains OTP code and expiration time
            expect(sendMailArgs.html).toContain(otpCode);
            expect(sendMailArgs.html).toContain(expiresInMinutes.toString());
            expect(sendMailArgs.text).toContain(otpCode);
            expect(sendMailArgs.text).toContain(expiresInMinutes.toString());
          }
        ),
        { numRuns: 10 } // Reduced for faster test execution
      );
    });

    it('should handle port 465 with secure=true', async () => {
      // Update environment to use port 465
      process.env.SMTP_PORT = '465';

      const otpCodeArbitrary = fc.string({ minLength: 6, maxLength: 6 }).filter(s => /^\d+$/.test(s));
      const purposeArbitrary = fc.constantFrom('login', 'transfer');
      const emailArbitrary = fc.emailAddress();
      const expiresInMinutesArbitrary = fc.integer({ min: 5, max: 10 });

      await fc.assert(
        fc.asyncProperty(
          otpCodeArbitrary,
          purposeArbitrary,
          emailArbitrary,
          expiresInMinutesArbitrary,
          async (otpCode, purpose, email, expiresInMinutes) => {
            // Reset mocks for each iteration
            jest.clearAllMocks();

            const params: OTPEmailParams = {
              to: email,
              otpCode,
              purpose,
              expiresInMinutes,
            };

            await sendOTPEmail(params);

            // Verify secure is true for port 465
            expect(nodemailer.createTransport).toHaveBeenCalledWith({
              host: 'smtp.test.com',
              port: 465,
              secure: true, // true for port 465
              auth: {
                user: 'test@test.com',
                pass: 'testpass',
              },
            });
          }
        ),
        { numRuns: 10 } // Reduced for faster test execution
      );
    });

    it('should reject invalid email addresses', async () => {
      // Generator for invalid email addresses
      const invalidEmailArbitrary = fc.oneof(
        fc.constant('not-an-email'),
        fc.constant('missing@domain'),
        fc.constant('@nodomain.com'),
        fc.constant('spaces in@email.com'),
        fc.constant(''),
      );

      const otpCodeArbitrary = fc.string({ minLength: 6, maxLength: 6 }).filter(s => /^\d+$/.test(s));
      const purposeArbitrary = fc.constantFrom('login', 'transfer');
      const expiresInMinutesArbitrary = fc.integer({ min: 5, max: 10 });

      await fc.assert(
        fc.asyncProperty(
          otpCodeArbitrary,
          purposeArbitrary,
          invalidEmailArbitrary,
          expiresInMinutesArbitrary,
          async (otpCode, purpose, invalidEmail, expiresInMinutes) => {
            const params: OTPEmailParams = {
              to: invalidEmail,
              otpCode,
              purpose,
              expiresInMinutes,
            };

            // Should throw error for invalid email
            await expect(sendOTPEmail(params)).rejects.toThrow('Invalid email address provided.');

            // Verify nodemailer was not called
            expect(nodemailer.createTransport).not.toHaveBeenCalled();
            expect(mockSendMail).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 10 } // Reduced for faster test execution
      );
    });
  });
});
