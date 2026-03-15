/**
 * Firebase Authentication Helper Functions
 * 
 * This file provides utility functions for authentication operations
 * using the Firebase client SDK.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './client';

async function sendCustomVerificationEmail(email?: string | null) {
  if (!email) return;
  try {
    await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  } catch (err) {
    console.warn('Custom verification email skipped:', err);
  }
}

/**
 * Sign up a new user with email and password
 * @param email - User email
 * @param password - User password
 * @param displayName - Optional display name
 * @returns UserCredential
 */
export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    // Send branded verification email via our SMTP route (non-blocking best effort)
    await sendCustomVerificationEmail(userCredential.user.email);
    
    return userCredential;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign in an existing user with email and password
 * @param email - User email
 * @param password - User password
 * @returns UserCredential
 */
export async function signIn(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

/**
 * Send email verification to current user
 * @param user - Firebase user object
 */
export async function sendVerificationEmail(user: User): Promise<void> {
  try {
    await sendCustomVerificationEmail(user.email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

/**
 * Send password reset email
 * @param email - User email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Get current user
 * @returns Current user or null
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Get ID token for current user
 * @param forceRefresh - Force token refresh
 * @returns ID token string
 */
export async function getIdToken(forceRefresh: boolean = false): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) return null;
  
  try {
    const token = await user.getIdToken(forceRefresh);
    return token;
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
}

/**
 * Check if user's email is verified
 * @param user - Firebase user object
 * @returns True if email is verified
 */
export function isEmailVerified(user: User | null): boolean {
  return user?.emailVerified ?? false;
}

/**
 * Convert Firebase auth error codes to user-friendly messages
 * @param errorCode - Firebase error code
 * @returns User-friendly error message
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please sign in again.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
}

/**
 * Wait for auth state to be initialized
 * @returns Promise that resolves when auth is ready
 */
export function waitForAuthInit(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
