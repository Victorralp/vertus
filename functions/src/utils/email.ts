/**
 * Email Service Module
 * 
 * Handles sending emails via SMTP using Nodemailer.
 * Falls back to console logging in development when SMTP is not configured.
 */

import * as nodemailer from 'nodemailer';

/**
 * Email configuration interface
 */
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * OTP email parameters interface
 */
export interface OTPEmailParams {
  to: string;
  otpCode: string;
  purpose: string;
  expiresInMinutes: number;
}

/**
 * Get SMTP configuration from environment variables
 */
function getSMTPConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // If any required config is missing, return null
  if (!host || !port || !user || !pass) {
    return null;
  }

  return {
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  };
}

/**
 * Generate HTML email template for OTP
 */
function generateOTPEmailHTML(otpCode: string, purpose: string, expiresInMinutes: number): string {
  const purposeDescriptions: Record<string, string> = {
    login: 'sign in to your Vertex account',
    transfer: 'complete your transfer',
    settings: 'update your account settings',
    card_action: 'complete your card action',
  };

  const purposeDescription = purposeDescriptions[purpose] || 'complete your action';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Vertex verification code</title>
  <style>
    body { margin:0; padding:0; font-family: 'Inter', Arial, sans-serif; background-color:#0b1220; }
  </style>
</head>
<body style="margin:0; padding:0; font-family:'Inter', Arial, sans-serif; background-color:#0b1220;">
  <table role="presentation" style="width:100%; border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" style="width:100%; max-width:600px; border-collapse:collapse; background-color:#0f172a; border:1px solid #1f2937; border-radius:16px; box-shadow:0 15px 40px rgba(0,0,0,0.35);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 36px 20px 36px; text-align:center; background:linear-gradient(135deg,#0ea5e9 0%,#10b981 60%,#0f172a 100%); border-radius:15px 15px 0 0;">
              <h1 style="margin:0; color:#0b1220; font-size:26px; font-weight:800; letter-spacing:-0.5px;">Vertex Credit Union</h1>
              <p style="margin:8px 0 0 0; color:#0b1220; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; font-weight:700;">Secure Verification</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding:32px 36px 36px 36px; color:#e5e7eb; font-size:16px; line-height:1.6;">
              <h2 style="margin:0 0 12px 0; color:#e0f2fe; font-size:22px;">Your verification code</h2>
              <p style="margin:0 0 18px 0; color:#cbd5e1;">Use this code to ${purposeDescription}:</p>

              <div style="background-color:#0b1220; border:1px solid #1f2937; border-radius:12px; padding:26px; text-align:center; box-shadow:inset 0 0 0 1px rgba(14,165,233,0.15);">
                <div style="font-size:40px; font-weight:800; color:#67e8f9; letter-spacing:10px; font-family:'SFMono-Regular','JetBrains Mono',Menlo,Consolas,monospace;">
                  ${otpCode}
                </div>
                <p style="margin:14px 0 0 0; font-size:14px; color:#94a3b8;">Expires in ${expiresInMinutes} minutes.</p>
              </div>

              <div style="margin:22px 0; padding:14px 16px; border-radius:10px; background:linear-gradient(135deg,rgba(16,185,129,0.12),rgba(14,165,233,0.12)); border:1px solid rgba(14,165,233,0.25); color:#cbd5e1; font-size:14px;">
                <strong style="color:#a5f3fc;">Security tip:</strong> never share this code. Vertex will never ask for it by phone, SMS, or chat.
              </div>

              <p style="margin:0; color:#94a3b8; font-size:13px;">If you didn’t request this, you can safely ignore this email or contact support.</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:18px 24px; text-align:center; background-color:#0b1220; border-top:1px solid #1f2937; border-radius:0 0 15px 15px;">
              <p style="margin:0; color:#64748b; font-size:12px;">Vertex Credit Union · 200 Market St, Suite 500 · San Francisco, CA 94105</p>
              <p style="margin:6px 0 0 0; color:#475569; font-size:11px;">You’re receiving this because security verification is enabled on your account.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email for OTP (fallback)
 */
function generateOTPEmailText(otpCode: string, purpose: string, expiresInMinutes: number): string {
  const purposeDescriptions: Record<string, string> = {
    login: 'sign in to your Vertex account',
    transfer: 'complete your transfer',
    settings: 'update your account settings',
    card_action: 'complete your card action',
  };

  const purposeDescription = purposeDescriptions[purpose] || 'complete your action';

  return `
Vertex Credit Union - Verification Code

Use this code to ${purposeDescription}:

${otpCode}

This code will expire in ${expiresInMinutes} minutes.

SECURITY NOTICE: Never share this code with anyone. Vertex will never ask for your verification code by phone, SMS, or chat.

If you didn't request this code, please ignore this email or contact our support team immediately.

Vertex Credit Union · 200 Market St, Suite 500 · San Francisco, CA 94105
© ${new Date().getFullYear()} Vertex Credit Union. All rights reserved.
  `.trim();
}

/**
 * Send OTP email via SMTP
 * 
 * @param params - Email parameters including recipient, OTP code, purpose, and expiration
 * @throws Error if email sending fails
 */
export async function sendOTPEmail(params: OTPEmailParams): Promise<void> {
  const { to, otpCode, purpose, expiresInMinutes } = params;

  // Validate email address format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    throw new Error('Invalid email address provided.');
  }

  // Get SMTP configuration
  const smtpConfig = getSMTPConfig();

  // If SMTP is not configured, fall back to console logging
  if (!smtpConfig) {
    console.warn('SMTP configuration not found. Falling back to console logging.');
    console.log('='.repeat(50));
    console.log('OTP EMAIL (Development Mode)');
    console.log('='.repeat(50));
    console.log(`To: ${to}`);
    console.log(`Purpose: ${purpose}`);
    console.log(`OTP Code: ${otpCode}`);
    console.log(`Expires: ${expiresInMinutes} minutes from now`);
    console.log('='.repeat(50));
    return;
  }

  // Create transporter with SMTP configuration
  let transporter: nodemailer.Transporter;
  try {
    transporter = nodemailer.createTransport(smtpConfig);
  } catch (error: any) {
    console.error('Failed to create email transporter:', error);
    throw new Error('Failed to connect to email server. Please try again later.');
  }

  // Get sender email from environment or use default
  const fromEmail = process.env.SMTP_FROM || 'Vertex Credit Union <no-reply@vertexcu.com>';

  // Generate email content
  const htmlContent = generateOTPEmailHTML(otpCode, purpose, expiresInMinutes);
  const textContent = generateOTPEmailText(otpCode, purpose, expiresInMinutes);

  // Send email
  try {
    await transporter.sendMail({
      from: fromEmail,
      to,
      subject: 'Your Vertex verification code (expires in 5 minutes)',
      text: textContent,
      html: htmlContent,
    });

    console.log(`OTP email sent successfully to ${to}`);
  } catch (error: any) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
}
