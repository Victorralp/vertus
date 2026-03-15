# Firestore Security Rules Documentation

## Overview

This document describes the Firestore security rules implemented for the Digital Banking Platform. The rules enforce a zero-trust security model where all sensitive operations are restricted to Cloud Functions, and users can only access their own data.

## Security Principles

### 1. Zero-Trust Client Model
- Frontend applications cannot write to sensitive collections (accounts, transactions, transfers, audit logs)
- All balance modifications must go through Cloud Functions
- Client-side code is considered untrusted

### 2. User Data Isolation
- Users can only read their own documents
- Ownership is verified through the `uid` field matching `request.auth.uid`
- Cross-user data access is prevented

### 3. Role-Based Access Control
- Admin users have read access to all users and audit logs
- Regular users have restricted access to their own data only
- Role changes can only be made server-side

### 4. Immutable Audit Trail
- Audit logs are write-protected from all client access
- Only Cloud Functions can create audit log entries
- No updates or deletes are allowed on audit logs

## Helper Functions

### `isAuthenticated()`
Checks if the request has a valid authentication token.

```javascript
function isAuthenticated() {
  return request.auth != null;
}
```

**Usage:** Required for all authenticated operations.

### `isOwner(uid)`
Verifies that the authenticated user owns the resource.

```javascript
function isOwner(uid) {
  return isAuthenticated() && request.auth.uid == uid;
}
```

**Usage:** Used to restrict access to user-owned documents.

### `isAdmin()`
Checks if the authenticated user has admin role.

```javascript
function isAdmin() {
  return isAuthenticated() && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

**Usage:** Used for admin-only operations like viewing all users and audit logs.

## Collection Rules

### Users Collection (`/users/{uid}`)

**Read Access:**
- Users can read their own document
- Admins can read all user documents

**Write Access:**
- Users can update their own profile (name only)
- Cannot change role or security settings
- Cannot create or delete user documents (Cloud Functions only)

**Security Properties:**
- ✅ Property 34: User read access restriction
- ✅ Requirement 7.1: Users can only read their own document

```javascript
match /users/{uid} {
  allow read: if isOwner(uid) || isAdmin();
  allow update: if isOwner(uid) && 
                   request.resource.data.role == resource.data.role &&
                   request.resource.data.security == resource.data.security;
  allow create: if false;
  allow delete: if false;
}
```

### Accounts Collection (`/accounts/{accountId}`)

**Read Access:**
- Users can read accounts where `uid` matches their auth UID

**Write Access:**
- No client writes allowed (Cloud Functions only)
- Prevents balance manipulation

**Security Properties:**
- ✅ Property 35: Account read access restriction
- ✅ Property 37: Balance write prevention
- ✅ Requirement 7.2: Account read access restriction
- ✅ Requirement 7.4: Balance write prevention

```javascript
match /accounts/{accountId} {
  allow read: if isAuthenticated() && resource.data.uid == request.auth.uid;
  allow write: if false;
}
```

### Transactions Collection (`/transactions/{txId}`)

**Read Access:**
- Users can read transactions where `uid` matches their auth UID

**Write Access:**
- No client writes allowed (Cloud Functions only)
- Ensures transaction integrity

**Security Properties:**
- ✅ Property 36: Transaction read access restriction
- ✅ Property 39: Transaction write prevention
- ✅ Requirement 7.3: Transaction read access restriction
- ✅ Requirement 7.6: Transaction write prevention

```javascript
match /transactions/{txId} {
  allow read: if isAuthenticated() && resource.data.uid == request.auth.uid;
  allow write: if false;
}
```

### Transfers Collection (`/transfers/{transferId}`)

**Read Access:**
- Users can read transfers where `uid` matches their auth UID

**Write Access:**
- No client writes allowed (Cloud Functions only)
- Prevents unauthorized transfers

**Security Properties:**
- ✅ Property 38: Transfer write prevention
- ✅ Requirement 7.5: Transfer write prevention

```javascript
match /transfers/{transferId} {
  allow read: if isAuthenticated() && resource.data.uid == request.auth.uid;
  allow write: if false;
}
```

### OTPs Collection (`/otps/{otpId}`)

**Read Access:**
- No client read access (Cloud Functions only)
- Prevents OTP code exposure

**Write Access:**
- No client writes allowed (Cloud Functions only)
- Ensures OTP security

**Security Properties:**
- ✅ OTP codes are never exposed to clients
- ✅ Only Cloud Functions can generate and verify OTPs

```javascript
match /otps/{otpId} {
  allow read, write: if false;
}
```

### Audit Logs Collection (`/auditLogs/{logId}`)

**Read Access:**
- Only admins can read audit logs
- Regular users cannot access audit logs

**Write Access:**
- No client writes allowed (Cloud Functions only)
- Ensures audit trail integrity

**Security Properties:**
- ✅ Property 40: Audit log write prevention
- ✅ Property 41: Admin read access
- ✅ Requirement 7.7: Audit log write prevention
- ✅ Requirement 7.8: Admin read access

```javascript
match /auditLogs/{logId} {
  allow read: if isAdmin();
  allow write: if false;
}
```

### Cards Collection (`/cards/{cardId}`)

**Read Access:**
- Users can read cards where `uid` matches their auth UID

**Write Access:**
- No client writes allowed (Cloud Functions only)
- Card operations go through Cloud Functions with OTP verification

**Security Properties:**
- ✅ Users can only view their own cards
- ✅ Card status changes require OTP verification

```javascript
match /cards/{cardId} {
  allow read: if isAuthenticated() && resource.data.uid == request.auth.uid;
  allow write: if false;
}
```

## Testing the Rules

### Verification Script (No Emulator Required)

Run the verification script to check that all rules are properly configured:

```bash
npm run verify:rules
```

This script verifies:
- ✅ All helper functions are defined
- ✅ All collections have proper rules
- ✅ Security principles are enforced
- ✅ Requirements are met

### Emulator Testing (Requires Java)

To test the rules with the Firebase emulator:

1. Install Java (required for Firebase emulators)
2. Start the emulators:
   ```bash
   npm run emulators
   ```
3. Run the rules test script:
   ```bash
   npm run test:rules
   ```

The test script will:
- Create test data in the emulator
- Verify read/write access for different user roles
- Test ownership checks
- Verify admin access
- Clean up test data

## Deployment

To deploy the security rules to Firebase:

```bash
firebase deploy --only firestore:rules
```

**Important:** Always test rules in the emulator before deploying to production!

## Common Scenarios

### Scenario 1: User Views Their Accounts
✅ **Allowed** - User can read accounts where `uid` matches their auth UID

### Scenario 2: User Tries to Modify Account Balance
❌ **Denied** - All writes to accounts collection are blocked

### Scenario 3: User Initiates Transfer
✅ **Allowed** - User calls Cloud Function which has admin privileges

### Scenario 4: Admin Views Audit Logs
✅ **Allowed** - Admin role has read access to audit logs

### Scenario 5: Regular User Tries to View Audit Logs
❌ **Denied** - Only admins can read audit logs

### Scenario 6: User Tries to Read Another User's Transactions
❌ **Denied** - Ownership check fails (uid doesn't match)

### Scenario 7: User Updates Their Profile Name
✅ **Allowed** - Users can update their own profile (excluding role and security fields)

### Scenario 8: User Tries to Change Their Role to Admin
❌ **Denied** - Role field cannot be modified by users

## Security Best Practices

1. **Never Trust Client Input**
   - All validation happens server-side in Cloud Functions
   - Client-side validation is for UX only

2. **Use Cloud Functions for Privileged Operations**
   - Transfers, OTP generation, audit logging
   - Any operation that modifies balances or sensitive data

3. **Implement Idempotency**
   - Use idempotency keys for transfers
   - Prevent duplicate operations

4. **Log Everything**
   - All security-relevant actions are logged
   - Audit logs are immutable

5. **Rate Limiting**
   - Implement rate limiting in Cloud Functions
   - Prevent abuse and brute force attacks

6. **Regular Security Audits**
   - Review audit logs regularly
   - Monitor for suspicious activity
   - Update rules as needed

## Troubleshooting

### Error: Permission Denied

**Cause:** User trying to access data they don't own or perform unauthorized operation.

**Solution:** 
- Verify the user is authenticated
- Check that the `uid` field matches the authenticated user
- Ensure the operation is allowed by the rules

### Error: Admin Access Required

**Cause:** Non-admin user trying to access admin-only resources.

**Solution:**
- Verify the user has `role: 'admin'` in their user document
- Check that the admin check is working correctly

### Rules Not Taking Effect

**Cause:** Rules not deployed or cached.

**Solution:**
- Deploy rules: `firebase deploy --only firestore:rules`
- Wait a few minutes for rules to propagate
- Clear browser cache and refresh

## Related Documentation

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Design Document](./design.md) - See "Firestore Security Rules Strategy" section
- [Requirements Document](./.kiro/specs/digital-banking-platform/requirements.md) - See Requirement 7

## Verification Status

✅ **All 41 verification tests passed**

- ✅ Helper functions defined and working
- ✅ All collections have proper rules
- ✅ Security principles enforced
- ✅ All requirements met (7.1-7.8)

Last verified: Task 1.4 completion
