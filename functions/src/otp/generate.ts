/**
 * OTP Generation Cloud Function
 * 
 * Generates a 6-digit OTP code, hashes it with bcrypt, stores it in Firestore
 * with a 5-minute TTL, sends it via email, and logs an audit event.
 * 
 * Rate limiting: Maximum 5 OTP generation requests per user per hour.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import { checkRateLimit, RateLimitPresets } from '../utils/rate-limit';
import { requireAuth, isValidOTPPurpose, validateRequiredFields } from '../utils/validation';
import { sendOTPEmail as sendEmail } from '../utils/email';

interface GenerateOTPRequest {
  purpose: string; // 'login' | 'transfer' | 'settings' | 'card_action'
}

interface GenerateOTPResponse {
  success: boolean;
  expiresAt: string;
  message?: string;
}

/**
 * Generate a 6-digit OTP code
 */
function generateOTPCode(): string {
  // Generate a random 6-digit number
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

/**
 * Hash OTP code with bcrypt
 */
async function hashOTPCode(code: string): Promise<string> {
  const saltRounds = 10;
  const hash = await bcrypt.hash(code, saltRounds);
  return hash;
}

/**
 * Store OTP in Firestore with 5-minute TTL
 */
async function storeOTP(
  userId: string,
  codeHash: string,
  purpose: string
): Promise<{ otpId: string; expiresAt: admin.firestore.Timestamp }> {
  const db = admin.firestore();
  const now = admin.firestore.Timestamp.now();
  const expiresAt = new admin.firestore.Timestamp(
    now.seconds + 5 * 60, // 5 minutes
    now.nanoseconds
  );

  const otpData = {
    uid: userId,
    codeHash,
    purpose,
    attempts: 0,
    maxAttempts: 5,
    expiresAt,
    used: false,
    createdAt: now,
  };

  const otpRef = await db.collection('otps').add(otpData);

  return {
    otpId: otpRef.id,
    expiresAt,
  };
}

/**
 * Log audit event for OTP generation
 */
async function logOTPGenerationAudit(
  userId: string,
  purpose: string,
  otpId: string
): Promise<void> {
  const db = admin.firestore();
  
  await db.collection('auditLogs').add({
    uid: userId,
    action: 'otp_generated',
    metadata: {
      purpose,
      otpId,
    },
    createdAt: admin.firestore.Timestamp.now(),
  });
}

/**
 * Get user email for sending OTP
 */
async function getUserEmail(userId: string): Promise<string> {
  const db = admin.firestore();
  const userDoc = await db.collection('users').doc(userId).get();
  
  if (!userDoc.exists) {
    throw new Error('User not found');
  }
  
  const userData = userDoc.data();
  if (!userData?.email) {
    throw new Error('User email not found');
  }
  
  return userData.email;
}

/**
 * Send OTP via email using the email service module
 */
async function sendOTPEmail(
  email: string,
  code: string,
  purpose: string
): Promise<void> {
  // Call the email service module to send the OTP
  await sendEmail({
    to: email,
    otpCode: code,
    purpose,
    expiresInMinutes: 5,
  });
}

/**
 * Generate OTP Cloud Function
 * 
 * Callable function that generates an OTP code for the authenticated user.
 */
export const generateOTP = functions.https.onCall(
  {
    cors: ['http://localhost:3000', 'https://vertexcu.com', 'https://www.vertexcu.com'],
  },
  async (data: GenerateOTPRequest, context): Promise<GenerateOTPResponse> => {
    try {
      // 1. Validate authentication
      const userId = requireAuth(context);

      // 2. Validate required fields
      validateRequiredFields(data, ['purpose']);

      // 3. Validate OTP purpose
      if (!isValidOTPPurpose(data.purpose)) {
        throw new Error(
          'Invalid OTP purpose. Must be one of: login, transfer, settings, card_action'
        );
      }

      // 4. Check rate limiting (5 requests per user per hour)
      const rateLimitKey = `otp_gen_${userId}`;
      const rateLimit = await checkRateLimit(
        rateLimitKey,
        RateLimitPresets.OTP_GENERATION
      );

      if (rateLimit.exceeded) {
        const resetTime = new Date(rateLimit.resetAt).toLocaleTimeString();
        throw new Error(
          `Rate limit exceeded. Please try again after ${resetTime}`
        );
      }

      // 5. Generate 6-digit OTP code
      const otpCode = generateOTPCode();

      // 6. Hash OTP with bcrypt
      const codeHash = await hashOTPCode(otpCode);

      // 7. Store OTP in Firestore with 5-minute TTL
      const { otpId, expiresAt } = await storeOTP(userId, codeHash, data.purpose);

      // 8. Get user email
      const userEmail = await getUserEmail(userId);

      // 9. Send OTP via email
      await sendOTPEmail(userEmail, otpCode, data.purpose);

      // 10. Log audit event
      await logOTPGenerationAudit(userId, data.purpose, otpId);

      // 11. Return success response
      return {
        success: true,
        expiresAt: expiresAt.toDate().toISOString(),
        message: `OTP sent to ${userEmail}. Valid for 5 minutes.`,
      };
    } catch (error: any) {
      console.error('Error generating OTP:', error);
      
      // Return user-friendly error message
      throw new functions.https.HttpsError(
        'internal',
        error.message || 'Failed to generate OTP. Please try again.'
      );
    }
  }
);
