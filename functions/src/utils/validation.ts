/**
 * Validation Utility
 * 
 * Provides common validation functions for Cloud Functions.
 * Ensures data integrity and security before processing requests.
 */

import * as admin from 'firebase-admin';

/**
 * Validate that a user is authenticated
 * 
 * @param context - Firebase callable function context
 * @throws Error if user is not authenticated
 */
export function requireAuth(context: any): string {
  if (!context.auth) {
    throw new Error('Unauthenticated: User must be signed in');
  }
  return context.auth.uid;
}

/**
 * Validate email format
 * 
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate OTP code format (6 digits)
 * 
 * @param code - OTP code to validate
 * @returns true if valid, false otherwise
 */
export function isValidOTPCode(code: string): boolean {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(code);
}

/**
 * Validate transfer amount
 * 
 * @param amount - Amount to validate (in cents)
 * @returns true if valid, false otherwise
 */
export function isValidAmount(amount: number): boolean {
  return typeof amount === 'number' && amount > 0 && Number.isInteger(amount);
}

/**
 * Validate account ID format
 * 
 * @param accountId - Account ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidAccountId(accountId: string): boolean {
  return typeof accountId === 'string' && accountId.length > 0;
}

/**
 * Validate that an account belongs to a specific user
 * 
 * @param accountId - Account ID to check
 * @param userId - User ID to verify ownership
 * @returns Promise resolving to true if account belongs to user
 * @throws Error if account doesn't exist or doesn't belong to user
 */
export async function validateAccountOwnership(
  accountId: string,
  userId: string
): Promise<boolean> {
  const db = admin.firestore();
  const accountDoc = await db.collection('accounts').doc(accountId).get();

  if (!accountDoc.exists) {
    throw new Error(`Account not found: ${accountId}`);
  }

  const accountData = accountDoc.data();
  if (accountData?.uid !== userId) {
    throw new Error('Unauthorized: Account does not belong to user');
  }

  return true;
}

/**
 * Validate sufficient balance for a transfer
 * 
 * @param accountId - Source account ID
 * @param amount - Transfer amount (in cents)
 * @returns Promise resolving to true if sufficient balance
 * @throws Error if insufficient balance
 */
export async function validateSufficientBalance(
  accountId: string,
  amount: number
): Promise<boolean> {
  const db = admin.firestore();
  const accountDoc = await db.collection('accounts').doc(accountId).get();

  if (!accountDoc.exists) {
    throw new Error(`Account not found: ${accountId}`);
  }

  const accountData = accountDoc.data();
  const balance = accountData?.balance || 0;

  if (balance < amount) {
    throw new Error(
      `Insufficient balance: Available ${balance}, Required ${amount}`
    );
  }

  return true;
}

/**
 * Validate idempotency key format
 * 
 * @param key - Idempotency key to validate
 * @returns true if valid, false otherwise
 */
export function isValidIdempotencyKey(key: string): boolean {
  return typeof key === 'string' && key.length > 0 && key.length <= 255;
}

/**
 * Sanitize user input to prevent injection attacks
 * 
 * @param input - User input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  // Remove any HTML tags and trim whitespace
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Validate OTP purpose
 * 
 * @param purpose - OTP purpose to validate
 * @returns true if valid, false otherwise
 */
export function isValidOTPPurpose(purpose: string): boolean {
  const validPurposes = ['login', 'transfer', 'settings', 'card_action'];
  return validPurposes.includes(purpose);
}

/**
 * Check if user has admin role
 * 
 * @param userId - User ID to check
 * @returns Promise resolving to true if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const db = admin.firestore();
  const userDoc = await db.collection('users').doc(userId).get();

  if (!userDoc.exists) {
    return false;
  }

  const userData = userDoc.data();
  return userData?.role === 'admin';
}

/**
 * Validate request data against required fields
 * 
 * @param data - Request data object
 * @param requiredFields - Array of required field names
 * @throws Error if any required field is missing
 */
export function validateRequiredFields(
  data: any,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields: ${missingFields.join(', ')}`
    );
  }
}
