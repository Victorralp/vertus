/**
 * OTP Verification Cloud Function
 * 
 * Verifies a 6-digit OTP code by:
 * - Retrieving the OTP from Firestore
 * - Checking expiration (5 minutes)
 * - Verifying the code with bcrypt
 * - Tracking attempt count (max 5)
 * - Invalidating the OTP on success
 * - Logging audit events
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import { requireAuth, isValidOTPCode, validateRequiredFields } from '../utils/validation';

interface VerifyOTPRequest {
  code: string;      // 6-digit OTP code
  purpose: string;   // 'login' | 'transfer' | 'settings' | 'card_action'
}

interface VerifyOTPResponse {
  success: boolean;
  attemptsRemaining?: number;
  message?: string;
}

interface OTPRecord {
  uid: string;
  codeHash: string;
  purpose: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: admin.firestore.Timestamp;
  used: boolean;
  createdAt: admin.firestore.Timestamp;
}

/**
 * Retrieve OTP record from Firestore
 * Finds the most recent unused OTP for the user with matching purpose
 */
async function retrieveOTP(
  userId: string,
  purpose: string
): Promise<{ otpId: string; otpData: OTPRecord } | null> {
  const db = admin.firestore();
  
  // Query for the most recent unused OTP with matching purpose
  const otpQuery = await db
    .collection('otps')
    .where('uid', '==', userId)
    .where('purpose', '==', purpose)
    .where('used', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  if (otpQuery.empty) {
    return null;
  }

  const otpDoc = otpQuery.docs[0];
  return {
    otpId: otpDoc.id,
    otpData: otpDoc.data() as OTPRecord,
  };
}

/**
 * Check if OTP has expired (5 minutes)
 */
function isOTPExpired(expiresAt: admin.firestore.Timestamp): boolean {
  const now = admin.firestore.Timestamp.now();
  return expiresAt.toMillis() < now.toMillis();
}

/**
 * Verify OTP code with bcrypt
 */
async function verifyOTPCode(code: string, codeHash: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(code, codeHash);
    return isMatch;
  } catch (error) {
    console.error('Error comparing OTP codes:', error);
    return false;
  }
}

/**
 * Increment OTP attempt counter
 */
async function incrementAttempts(otpId: string): Promise<number> {
  const db = admin.firestore();
  const otpRef = db.collection('otps').doc(otpId);

  await otpRef.update({
    attempts: admin.firestore.FieldValue.increment(1),
  });

  // Get updated attempts count
  const updatedDoc = await otpRef.get();
  const updatedData = updatedDoc.data() as OTPRecord;
  return updatedData.attempts;
}

/**
 * Invalidate OTP after successful verification
 */
async function invalidateOTP(otpId: string): Promise<void> {
  const db = admin.firestore();
  const otpRef = db.collection('otps').doc(otpId);

  await otpRef.update({
    used: true,
  });
}

/**
 * Log audit event for OTP verification
 */
async function logOTPVerificationAudit(
  userId: string,
  purpose: string,
  success: boolean,
  otpId: string,
  reason?: string
): Promise<void> {
  const db = admin.firestore();
  
  await db.collection('auditLogs').add({
    uid: userId,
    action: success ? 'otp_verification_success' : 'otp_verification_failed',
    metadata: {
      purpose,
      otpId,
      reason: reason || (success ? 'Code verified successfully' : 'Invalid code'),
    },
    createdAt: admin.firestore.Timestamp.now(),
  });
}

/**
 * Verify OTP Cloud Function
 * 
 * Callable function that verifies an OTP code for the authenticated user.
 */
export const verifyOTP = functions.https.onCall(
  {
    cors: ['http://localhost:3000', 'https://vertexcu.com', 'https://www.vertexcu.com'],
  },
  async (data: VerifyOTPRequest, context): Promise<VerifyOTPResponse> => {
    try {
      // 1. Validate authentication
      const userId = requireAuth(context);

      // 2. Validate required fields
      validateRequiredFields(data, ['code', 'purpose']);

      // 3. Validate OTP code format (6 digits)
      if (!isValidOTPCode(data.code)) {
        throw new Error('Invalid OTP code format. Must be 6 digits.');
      }

      // 4. Retrieve OTP record from Firestore
      const otpRecord = await retrieveOTP(userId, data.purpose);

      if (!otpRecord) {
        await logOTPVerificationAudit(
          userId,
          data.purpose,
          false,
          'unknown',
          'No OTP found for this purpose'
        );
        throw new Error(
          'No valid OTP found. Please request a new OTP.'
        );
      }

      const { otpId, otpData } = otpRecord;

      // 5. Check if OTP has expired (5 minutes)
      if (isOTPExpired(otpData.expiresAt)) {
        await logOTPVerificationAudit(
          userId,
          data.purpose,
          false,
          otpId,
          'OTP expired'
        );
        throw new Error(
          'OTP has expired. Please request a new OTP.'
        );
      }

      // 6. Check if max attempts exceeded
      if (otpData.attempts >= otpData.maxAttempts) {
        await logOTPVerificationAudit(
          userId,
          data.purpose,
          false,
          otpId,
          'Maximum attempts exceeded'
        );
        throw new Error(
          'Maximum verification attempts exceeded. Please request a new OTP.'
        );
      }

      // 7. Verify code with bcrypt
      const isCodeValid = await verifyOTPCode(data.code, otpData.codeHash);

      if (!isCodeValid) {
        // Increment attempt counter
        const newAttempts = await incrementAttempts(otpId);
        const attemptsRemaining = otpData.maxAttempts - newAttempts;

        await logOTPVerificationAudit(
          userId,
          data.purpose,
          false,
          otpId,
          `Invalid code - ${attemptsRemaining} attempts remaining`
        );

        if (attemptsRemaining <= 0) {
          throw new Error(
            'Invalid OTP code. Maximum attempts exceeded. Please request a new OTP.'
          );
        }

        return {
          success: false,
          attemptsRemaining,
          message: `Invalid OTP code. ${attemptsRemaining} attempt${
            attemptsRemaining === 1 ? '' : 's'
          } remaining.`,
        };
      }

      // 8. Invalidate OTP on success
      await invalidateOTP(otpId);

      // 9. Log successful verification audit event
      await logOTPVerificationAudit(
        userId,
        data.purpose,
        true,
        otpId
      );

      // 10. Return success response
      return {
        success: true,
        message: 'OTP verified successfully.',
      };
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      // Return user-friendly error message
      throw new functions.https.HttpsError(
        'internal',
        error.message || 'Failed to verify OTP. Please try again.'
      );
    }
  }
);
