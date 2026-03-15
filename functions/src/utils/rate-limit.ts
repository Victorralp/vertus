/**
 * Rate Limiting Utility
 * 
 * Provides rate limiting functionality for Cloud Functions to prevent abuse.
 * Uses in-memory counters with Firestore fallback for distributed enforcement.
 */

import * as admin from 'firebase-admin';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

interface RateLimitRecord {
  count: number;
  resetAt: admin.firestore.Timestamp;
}

/**
 * Check if a rate limit has been exceeded
 * 
 * @param key - Unique identifier for the rate limit (e.g., userId, IP address)
 * @param config - Rate limit configuration
 * @returns Object with exceeded flag and remaining attempts
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<{ exceeded: boolean; remaining: number; resetAt: Date }> {
  const db = admin.firestore();
  const rateLimitRef = db.collection('rateLimits').doc(key);

  try {
    const doc = await rateLimitRef.get();
    const now = admin.firestore.Timestamp.now();

    if (!doc.exists) {
      // First request - create new rate limit record
      const resetAt = new admin.firestore.Timestamp(
        now.seconds + Math.floor(config.windowMs / 1000),
        now.nanoseconds
      );

      await rateLimitRef.set({
        count: 1,
        resetAt,
      });

      return {
        exceeded: false,
        remaining: config.maxAttempts - 1,
        resetAt: resetAt.toDate(),
      };
    }

    const data = doc.data() as RateLimitRecord;

    // Check if window has expired
    if (data.resetAt.toMillis() < now.toMillis()) {
      // Window expired - reset counter
      const resetAt = new admin.firestore.Timestamp(
        now.seconds + Math.floor(config.windowMs / 1000),
        now.nanoseconds
      );

      await rateLimitRef.set({
        count: 1,
        resetAt,
      });

      return {
        exceeded: false,
        remaining: config.maxAttempts - 1,
        resetAt: resetAt.toDate(),
      };
    }

    // Window still active - check if limit exceeded
    if (data.count >= config.maxAttempts) {
      return {
        exceeded: true,
        remaining: 0,
        resetAt: data.resetAt.toDate(),
      };
    }

    // Increment counter
    await rateLimitRef.update({
      count: admin.firestore.FieldValue.increment(1),
    });

    return {
      exceeded: false,
      remaining: config.maxAttempts - data.count - 1,
      resetAt: data.resetAt.toDate(),
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow the request (fail open)
    return {
      exceeded: false,
      remaining: config.maxAttempts,
      resetAt: new Date(Date.now() + config.windowMs),
    };
  }
}

/**
 * Reset a rate limit for a specific key
 * 
 * @param key - Unique identifier for the rate limit
 */
export async function resetRateLimit(key: string): Promise<void> {
  const db = admin.firestore();
  const rateLimitRef = db.collection('rateLimits').doc(key);

  try {
    await rateLimitRef.delete();
  } catch (error) {
    console.error('Rate limit reset error:', error);
  }
}

/**
 * Common rate limit configurations
 */
export const RateLimitPresets = {
  OTP_GENERATION: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  OTP_VERIFICATION: {
    maxAttempts: 5,
    windowMs: 5 * 60 * 1000, // 5 minutes
  },
  AUTH_ATTEMPTS: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  TRANSFER_REQUESTS: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};
