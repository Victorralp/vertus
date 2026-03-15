/**
 * Firebase Admin SDK Configuration
 * 
 * This file initializes the Firebase Admin SDK for server-side operations.
 * It should only be imported in server-side code (API routes, server components, middleware).
 * 
 * IMPORTANT: This file should NEVER be imported in client-side code.
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment variables
 */
let adminApp: App;

if (!getApps().length) {
  // Check if we're using emulators
  const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

  if (useEmulator) {
    // For emulator, we can use a simpler initialization
    adminApp = initializeApp({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'digital-banking-platform-demo',
    });

    // Set emulator hosts for Admin SDK
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

    console.log('🔧 Firebase Admin SDK connected to emulators');
  } else {
    // For production, use service account credentials
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!privateKey || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PROJECT_ID) {
      throw new Error(
        'Firebase Admin SDK credentials are missing. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY environment variables.'
      );
    }

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    console.log('✅ Firebase Admin SDK initialized for production');
  }
} else {
  adminApp = getApps()[0];
}

// Initialize Firebase Admin services
const adminAuth: Auth = getAuth(adminApp);
const adminDb: Firestore = getFirestore(adminApp);

// Configure Firestore settings
adminDb.settings({
  ignoreUndefinedProperties: true,
});

/**
 * Verify Firebase ID token from client
 * @param idToken - Firebase ID token from client
 * @returns Decoded token with user information
 */
export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Get user by UID
 * @param uid - User ID
 * @returns User record
 */
export async function getUserByUid(uid: string) {
  try {
    const userRecord = await adminAuth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('User not found');
  }
}

/**
 * Get user by email
 * @param email - User email
 * @returns User record
 */
export async function getUserByEmail(email: string) {
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw new Error('User not found');
  }
}

/**
 * Set custom user claims (e.g., admin role)
 * @param uid - User ID
 * @param claims - Custom claims object
 */
export async function setCustomUserClaims(uid: string, claims: object) {
  try {
    await adminAuth.setCustomUserClaims(uid, claims);
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new Error('Failed to set custom claims');
  }
}

/**
 * Delete user account
 * @param uid - User ID
 */
export async function deleteUser(uid: string) {
  try {
    await adminAuth.deleteUser(uid);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

// Export Firebase Admin services
export { adminApp, adminAuth, adminDb };

// Export Firebase Admin types for convenience
export type { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
export type { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
