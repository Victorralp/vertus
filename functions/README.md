# Firebase Cloud Functions - Digital Banking Platform

This directory contains all Firebase Cloud Functions for the Digital Banking Platform. These functions handle privileged server-side operations that cannot be performed directly from the client.

## Directory Structure

```
functions/
├── src/
│   ├── index.ts              # Main entry point - exports all functions
│   ├── otp/                  # OTP generation and verification
│   │   ├── generate.ts       # Generate OTP codes
│   │   ├── verify.ts         # Verify OTP codes
│   │   └── send-email.ts     # Send OTP via email
│   ├── transfers/            # Transfer operations
│   │   └── execute.ts        # Execute internal transfers
│   ├── audit/                # Audit logging
│   │   └── log.ts            # Log security events
│   └── utils/                # Shared utilities
│       ├── rate-limit.ts     # Rate limiting functionality
│       └── validation.ts     # Input validation helpers
├── lib/                      # Compiled JavaScript output
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Available Functions

### OTP Functions (Coming in Task 2.2-2.4)
- **generateOTP**: Creates a 6-digit OTP code with 5-minute expiration
- **verifyOTP**: Validates OTP codes with attempt limiting
- **sendOTPEmail**: Sends OTP codes via email using Nodemailer

### Transfer Functions (Coming in Task 2.5)
- **executeTransfer**: Executes internal account transfers atomically

### Audit Functions (Coming in Task 2.6)
- **logAuditEvent**: Records security-relevant events

### Utility Functions
- **Rate Limiting**: Prevents abuse with configurable limits
- **Validation**: Input validation and security checks

## Dependencies

- **firebase-admin**: Firebase Admin SDK for privileged operations
- **firebase-functions**: Firebase Cloud Functions SDK
- **bcrypt**: Password and OTP hashing
- **nodemailer**: Email sending functionality

## Development Scripts

```bash
# Build TypeScript to JavaScript
npm run build

# Build and watch for changes
npm run build:watch

# Build and start Firebase emulators
npm run serve

# Open Firebase Functions shell
npm run shell

# Deploy functions to Firebase
npm run deploy

# View function logs
npm run logs
```

## Configuration

### TypeScript Configuration
The `tsconfig.json` is configured with:
- Strict mode enabled for type safety
- CommonJS module system for Node.js compatibility
- ES2017 target for modern JavaScript features
- Source maps for debugging

### Environment Variables
Functions use Firebase configuration automatically. Additional environment variables can be set using:
```bash
firebase functions:config:set smtp.host="smtp.example.com"
```

## Security Features

### Rate Limiting
All sensitive operations are rate-limited to prevent abuse:
- OTP Generation: 5 requests per user per hour
- OTP Verification: 5 attempts per OTP
- Auth Attempts: 5 attempts per IP per 15 minutes
- Transfer Requests: 10 requests per user per hour

### Input Validation
All functions validate inputs before processing:
- Email format validation
- OTP code format (6 digits)
- Transfer amount validation (positive integers)
- Account ownership verification
- Sufficient balance checks

### Audit Logging
All security-relevant actions are logged:
- Authentication attempts (success and failure)
- OTP generation and verification
- Transfer execution
- Password changes
- 2FA toggles
- Card actions

## Testing

Functions can be tested locally using Firebase Emulators:

```bash
# Start emulators
npm run serve

# In another terminal, test functions
curl http://localhost:5001/PROJECT_ID/us-central1/healthCheck
```

## Deployment

Deploy functions to Firebase:

```bash
# Deploy all functions
npm run deploy

# Deploy specific function
firebase deploy --only functions:generateOTP
```

## Error Handling

All functions implement comprehensive error handling:
- Validation errors return 400 with descriptive messages
- Authentication errors return 401
- Authorization errors return 403
- Not found errors return 404
- Server errors return 500 with sanitized messages

## Rate Limit Presets

The following rate limit configurations are available:

| Operation | Max Attempts | Time Window |
|-----------|--------------|-------------|
| OTP Generation | 5 | 1 hour |
| OTP Verification | 5 | 5 minutes |
| Auth Attempts | 5 | 15 minutes |
| Transfer Requests | 10 | 1 hour |

## Next Steps

1. Implement OTP generation function (Task 2.2)
2. Implement OTP verification function (Task 2.3)
3. Implement email sending with Nodemailer (Task 2.4)
4. Implement transfer execution function (Task 2.5)
5. Implement audit logging function (Task 2.6)
6. Write unit tests for all functions (Task 2.8)

## Notes

- All functions use Firebase Admin SDK for privileged operations
- Functions are deployed to us-central1 region by default
- Local development uses Firebase Emulators
- Production deployment requires Firebase project configuration
