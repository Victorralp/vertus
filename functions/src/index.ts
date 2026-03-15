/**
 * Cloud Functions for Digital Banking Platform
 * 
 * This file exports all Firebase Cloud Functions for the application.
 * 
 * Available Functions:
 * - OTP Functions: generateOTP, verifyOTP, sendOTPEmail
 * - Transfer Functions: executeTransfer
 * - Audit Functions: logAuditEvent
 * 
 * All functions use Firebase Admin SDK for privileged operations.
 */

import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export utility functions for use in other function modules
export * from './utils/rate-limit';
export * from './utils/validation';

// OTP Functions
export { generateOTP } from './otp/generate';
export { verifyOTP } from './otp/verify';
// export { sendOTPEmail } from './otp/send-email'; // To be implemented in Task 2.4

// Transfer Functions (to be implemented in Task 2.5)
// export { executeTransfer } from './transfers/execute';

// Audit Functions (to be implemented in Task 2.6)
// export { logAuditEvent } from './audit/log';

// Bill Payment Functions
export { addPayee } from './billPayments/addPayee';
export { getPayees } from './billPayments/getPayees';
export { schedulePayment } from './billPayments/schedulePayment';
export { cancelPayment } from './billPayments/cancelPayment';
export { getPaymentHistory } from './billPayments/getPaymentHistory';
export { processBillPayments } from './billPayments/processBillPayments';

/**
 * Health check function for testing deployment
 */
import * as functions from 'firebase-functions';

export const healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Firebase Functions for Digital Banking Platform',
    timestamp: new Date().toISOString(),
  });
});
