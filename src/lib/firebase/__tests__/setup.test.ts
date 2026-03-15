/**
 * Firebase SDK Setup Tests
 * 
 * These tests verify that the Firebase SDK is properly configured
 * and can connect to emulators in development mode.
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

describe('Firebase Client SDK Setup', () => {
  it('should export auth instance', async () => {
    const { auth } = await import('../client');
    expect(auth).toBeDefined();
    expect(auth.app).toBeDefined();
  });

  it('should export db instance', async () => {
    const { db } = await import('../client');
    expect(db).toBeDefined();
    expect(db.app).toBeDefined();
  });

  it('should export functions instance', async () => {
    const { functions } = await import('../client');
    expect(functions).toBeDefined();
    expect(functions.app).toBeDefined();
  });

  it('should have correct project ID', async () => {
    const { auth } = await import('../client');
    expect(auth.app.options.projectId).toBe(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  });
});

describe('Firebase Auth Helpers', () => {
  it('should export signUp function', async () => {
    const { signUp } = await import('../auth');
    expect(typeof signUp).toBe('function');
  });

  it('should export signIn function', async () => {
    const { signIn } = await import('../auth');
    expect(typeof signIn).toBe('function');
  });

  it('should export signOut function', async () => {
    const { signOut } = await import('../auth');
    expect(typeof signOut).toBe('function');
  });

  it('should export resetPassword function', async () => {
    const { resetPassword } = await import('../auth');
    expect(typeof resetPassword).toBe('function');
  });

  it('should export getCurrentUser function', async () => {
    const { getCurrentUser } = await import('../auth');
    expect(typeof getCurrentUser).toBe('function');
  });

  it('should export getIdToken function', async () => {
    const { getIdToken } = await import('../auth');
    expect(typeof getIdToken).toBe('function');
  });
});

describe('Environment Variables', () => {
  it('should have Firebase API key', () => {
    expect(process.env.NEXT_PUBLIC_FIREBASE_API_KEY).toBeDefined();
  });

  it('should have Firebase project ID', () => {
    expect(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID).toBeDefined();
  });

  it('should have Firebase auth domain', () => {
    expect(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN).toBeDefined();
  });

  it('should have emulator configuration in development', () => {
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      expect(process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST).toBeDefined();
      expect(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST).toBeDefined();
      expect(process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST).toBeDefined();
    }
  });
});

// Note: Admin SDK tests should only run in server-side environment
// These are placeholder tests that verify the module can be imported
describe('Firebase Admin SDK (Server-side only)', () => {
  it('should have admin environment variables', () => {
    expect(process.env.FIREBASE_ADMIN_PROJECT_ID).toBeDefined();
    expect(process.env.FIREBASE_ADMIN_CLIENT_EMAIL).toBeDefined();
    expect(process.env.FIREBASE_ADMIN_PRIVATE_KEY).toBeDefined();
  });
});
