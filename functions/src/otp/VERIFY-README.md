# OTP Verification Cloud Function

## Overview

The `verifyOTP` Cloud Function verifies a 6-digit OTP code for authenticated users. It implements secure verification with expiration checking, attempt limiting, and comprehensive audit logging.

## Implementation Details

### Function Signature

```typescript
verifyOTP(data: VerifyOTPRequest, context: CallableContext): Promise<VerifyOTPResponse>
```

### Request Parameters

```typescript
interface VerifyOTPRequest {
  code: string;      // 6-digit OTP code
  purpose: string;   // 'login' | 'transfer' | 'settings' | 'card_action'
}
```