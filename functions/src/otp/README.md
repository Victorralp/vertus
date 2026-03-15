# OTP Functions

This directory contains Cloud Functions for OTP (One-Time Password) generation and verification.

## Functions

### generateOTP

Generates a 6-digit OTP code for the authenticated user.

**Features:**
- Generates a random 6-digit numeric code
- Hashes the code with bcrypt (10 salt rounds) before storage
- Stores OTP in Firestore with 5-minute expiration
- Implements rate limiting (5 requests per user per hour)
- Sends OTP via email (placeholder in development)
- Logs audit event for security tracking

**Request:**
```typescript
{
  purpose: string // 'login' | 'transfer' | 'settings' | 'card_action'
}
```

**Response:**
```typescript
{
  success: boolean
  expiresAt: string // ISO 8601 timestamp
  message?: string
}
```

**Rate Limiting:**
- Maximum 5 OTP generation requests per user per hour
- Rate limit resets after 1 hour
- Returns error with reset time if limit exceeded

**Security:**
- Requires authentication (Firebase Auth)
- OTP code is hashed with bcrypt before storage
- OTP expires after 5 minutes
- Maximum 5 verification attempts per OTP
- Audit logging for all OTP generation events

**Testing with Firebase Emulator:**

1. Start the Firebase emulators:
```bash
firebase emulators:start
```

2. Call the function from your frontend or using curl:
```bash
curl -X POST \
  http://localhost:5001/YOUR_PROJECT_ID/us-central1/generateOTP \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ID_TOKEN' \
  -d '{
    "data": {
      "purpose": "login"
    }
  }'
```

3. Check the console output for the OTP code (in development mode)

**Error Handling:**
- `Unauthenticated`: User must be signed in
- `Invalid OTP purpose`: Purpose must be one of the valid values
- `Rate limit exceeded`: Too many requests, wait until reset time
- `User not found`: User document doesn't exist in Firestore
- `Internal error`: Generic error for unexpected failures

## Implementation Status

- [x] Task 2.2: generateOTP - Implemented
- [ ] Task 2.3: verifyOTP - To be implemented
- [ ] Task 2.4: sendOTPEmail - To be implemented (currently using console.log)

## Database Schema

### otps Collection

```typescript
{
  otpId: string           // Auto-generated document ID
  uid: string             // User ID
  codeHash: string        // Bcrypt hash of 6-digit code
  purpose: string         // 'login' | 'transfer' | 'settings' | 'card_action'
  attempts: number        // Failed verification attempts (starts at 0)
  maxAttempts: number     // Maximum allowed attempts (5)
  expiresAt: Timestamp    // Expiration time (5 minutes from creation)
  used: boolean           // Whether OTP has been successfully used
  createdAt: Timestamp    // Creation timestamp
}
```

### rateLimits Collection

```typescript
{
  key: string            // Document ID: 'otp_gen_{userId}'
  count: number          // Number of requests in current window
  resetAt: Timestamp     // When the rate limit window resets
}
```

### auditLogs Collection

```typescript
{
  logId: string          // Auto-generated document ID
  uid: string            // User ID
  action: string         // 'otp_generated'
  metadata: {
    purpose: string      // OTP purpose
    otpId: string        // Reference to OTP document
  }
  createdAt: Timestamp   // Log timestamp
}
```

## Next Steps

1. Implement `verifyOTP` function (Task 2.3)
2. Implement `sendOTPEmail` function with Nodemailer (Task 2.4)
3. Add comprehensive unit tests
4. Add property-based tests for OTP generation logic
