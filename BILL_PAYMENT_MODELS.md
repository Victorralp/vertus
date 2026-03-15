# Bill Payment System - Data Models and Validation

This document describes the data models and validation schemas implemented for the Bill Payment System feature.

## Overview

The Bill Payment System allows users to:
- Save payees (bill payment recipients)
- Schedule one-time and recurring bill payments
- Track payment history and status
- Manage payment schedules

## Data Models

### Payee Interface

Represents a bill payment recipient saved by the user.

**Firestore Path**: `/users/{uid}/payees/{payeeId}`

```typescript
interface Payee {
  payeeId: string;              // Auto-generated
  uid: string;                  // Owner user ID
  name: string;                 // Payee display name
  accountNumber: string;        // Encrypted account number
  routingNumber: string;        // Bank routing number (9 digits)
  address?: string;             // Payee address (optional)
  category: string;             // Category (utilities, rent, etc.)
  createdAt: Timestamp;         // Creation timestamp
  updatedAt: Timestamp;         // Last update timestamp
}
```

**Categories**:
- `utilities` - Electric, gas, water, internet, etc.
- `rent` - Rent payments
- `credit_card` - Credit card payments
- `insurance` - Insurance premiums
- `loan` - Loan payments
- `subscription` - Subscription services
- `other` - Other payment types

### BillPayment Interface

Represents a scheduled or completed bill payment.

**Firestore Path**: `/users/{uid}/billPayments/{paymentId}`

```typescript
interface BillPayment {
  paymentId: string;            // Auto-generated
  uid: string;                  // User ID
  payeeId: string;              // Reference to payee
  fromAccountId: string;        // Source account
  amount: number;               // Amount in cents
  scheduledDate: Timestamp;     // When to process
  status: BillPaymentStatus;    // Payment status
  recurring: boolean;           // Is this recurring?
  recurrenceRule?: {            // If recurring
    frequency: RecurrenceFrequency;
    dayOfMonth?: number;        // For monthly (1-31)
    dayOfWeek?: number;         // For weekly (0-6, 0=Sunday)
    endDate?: Timestamp;        // When to stop (optional)
  };
  memo?: string;                // Payment memo (optional)
  confirmationNumber?: string;  // After processing
  failureReason?: string;       // If failed
  createdAt: Timestamp;         // Creation timestamp
  processedAt?: Timestamp;      // Processing timestamp
}
```

**Payment Statuses**:
- `scheduled` - Payment is scheduled for future processing
- `processing` - Payment is currently being processed
- `completed` - Payment completed successfully
- `failed` - Payment failed (see failureReason)
- `cancelled` - Payment was cancelled by user

**Recurrence Frequencies**:
- `weekly` - Every week (requires dayOfWeek)
- `biweekly` - Every two weeks
- `monthly` - Every month (requires dayOfMonth)
- `quarterly` - Every three months

## Validation Schemas

### Payee Validation

```typescript
const payeeSchema = z.object({
  name: z.string().min(1).max(100),
  accountNumber: z.string().min(1).max(50),
  routingNumber: z.string()
    .regex(/^\d{9}$/)
    .refine(validateRoutingNumber),
  address: z.string().max(200).optional(),
  category: z.enum([
    'utilities', 'rent', 'credit_card', 
    'insurance', 'loan', 'subscription', 'other'
  ]),
});
```

**Routing Number Validation**:
- Must be exactly 9 digits
- Must pass checksum validation using the ABA routing number algorithm

### Bill Payment Validation

```typescript
const billPaymentSchema = z.object({
  payeeId: z.string().min(1),
  fromAccountId: z.string().min(1),
  amount: z.number()
    .positive()
    .int()
    .max(1000000000), // $10 million max
  scheduledDate: z.date()
    .refine(date => date > new Date()),
  recurring: z.boolean().default(false),
  recurrenceRule: recurrenceRuleSchema.optional(),
  memo: z.string().max(200).optional(),
}).refine(data => {
  // If recurring, recurrenceRule is required
  if (data.recurring && !data.recurrenceRule) {
    return false;
  }
  return true;
});
```

### Recurrence Rule Validation

```typescript
const recurrenceRuleSchema = z.object({
  frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly']),
  dayOfMonth: z.number().int().min(1).max(31).optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  endDate: z.date().optional(),
}).refine(data => {
  // Monthly requires dayOfMonth
  if (data.frequency === 'monthly' && !data.dayOfMonth) {
    return false;
  }
  // Weekly requires dayOfWeek
  if (data.frequency === 'weekly' && data.dayOfWeek === undefined) {
    return false;
  }
  return true;
});
```

## Firestore Security Rules

The following security rules have been added to protect the bill payment collections:

```javascript
// Payees collection (subcollection under users)
match /users/{uid}/payees/{payeeId} {
  allow read: if isOwner(uid);
  allow write: if false; // Cloud Functions only
}

// Bill Payments collection (subcollection under users)
match /users/{uid}/billPayments/{paymentId} {
  allow read: if isOwner(uid);
  allow write: if false; // Cloud Functions only
}
```

**Security Notes**:
- Users can only read their own payees and payments
- All write operations must go through Cloud Functions to ensure:
  - Account number encryption
  - Balance validation
  - Transaction creation
  - Audit logging

## Usage Examples

### Creating a Payee

```typescript
import { payeeSchema } from '@/lib/validations';

const payeeInput = {
  name: 'Electric Company',
  accountNumber: '1234567890',
  routingNumber: '021000021', // JP Morgan Chase
  address: '123 Main St, City, State 12345',
  category: 'utilities',
};

// Validate input
const result = payeeSchema.safeParse(payeeInput);
if (!result.success) {
  console.error('Validation errors:', result.error.errors);
  return;
}

// Send to API endpoint (to be implemented)
// POST /api/billPayments/addPayee
```

### Scheduling a One-Time Payment

```typescript
import { billPaymentSchema } from '@/lib/validations';

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);

const paymentInput = {
  payeeId: 'payee_123',
  fromAccountId: 'account_456',
  amount: 15000, // $150.00 in cents
  scheduledDate: futureDate,
  recurring: false,
  memo: 'Monthly electric bill',
};

// Validate input
const result = billPaymentSchema.safeParse(paymentInput);
if (!result.success) {
  console.error('Validation errors:', result.error.errors);
  return;
}

// Send to API endpoint (to be implemented)
// POST /api/billPayments/schedulePayment
```

### Scheduling a Recurring Monthly Payment

```typescript
import { billPaymentSchema } from '@/lib/validations';

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);

const paymentInput = {
  payeeId: 'payee_123',
  fromAccountId: 'account_456',
  amount: 15000, // $150.00 in cents
  scheduledDate: futureDate,
  recurring: true,
  recurrenceRule: {
    frequency: 'monthly',
    dayOfMonth: 15, // Process on the 15th of each month
  },
  memo: 'Monthly electric bill - auto-pay',
};

// Validate input
const result = billPaymentSchema.safeParse(paymentInput);
if (!result.success) {
  console.error('Validation errors:', result.error.errors);
  return;
}

// Send to API endpoint (to be implemented)
// POST /api/billPayments/schedulePayment
```

## Routing Number Validation

The system validates US bank routing numbers using the ABA routing number checksum algorithm:

```typescript
import { validateRoutingNumber } from '@/lib/validations';

// Valid routing numbers
validateRoutingNumber('021000021'); // true - JP Morgan Chase
validateRoutingNumber('026009593'); // true - Bank of America
validateRoutingNumber('111000025'); // true - Wells Fargo

// Invalid routing numbers
validateRoutingNumber('123456789'); // false - Invalid checksum
validateRoutingNumber('12345678');  // false - Too short
validateRoutingNumber('abcdefghi'); // false - Non-numeric
```

## Type Exports

All types and validation schemas are exported from their respective modules:

```typescript
// Types
import type {
  Payee,
  BillPayment,
  PayeeClient,
  BillPaymentClient,
  BillPaymentStatus,
  RecurrenceFrequency,
  PayeeCategory,
} from '@/lib/types';

// Validation schemas and types
import {
  payeeSchema,
  billPaymentSchema,
  recurrenceRuleSchema,
  validateRoutingNumber,
  type PayeeInput,
  type BillPaymentInput,
  type RecurrenceRuleInput,
} from '@/lib/validations';
```

## Next Steps

The following tasks will build on these data models:

1. **Task 1.2**: Implement payee management API endpoints
   - POST /api/billPayments/addPayee
   - GET /api/billPayments/payees
   - Account number encryption

2. **Task 1.3**: Implement bill payment scheduling
   - POST /api/billPayments/schedulePayment
   - Balance checking
   - Recurring payment setup

3. **Task 1.4**: Implement payment cancellation
   - POST /api/billPayments/cancelPayment

4. **Task 1.5**: Create bill payment history endpoint
   - GET /api/billPayments/history

5. **Task 1.6**: Implement background payment processing
   - Cloud Function: processBillPayments
   - Scheduled daily execution
   - Transaction creation
   - Notification sending

## Files Modified

- `src/lib/types/index.ts` - Added Payee and BillPayment interfaces
- `src/lib/validations/index.ts` - Added validation schemas
- `firestore.rules` - Added security rules for new collections
- `src/lib/examples/billPaymentExamples.ts` - Usage examples

## Testing

For testing examples and validation demonstrations, see:
- `src/lib/examples/billPaymentExamples.ts`

## References

- [Requirements Document](.kiro/specs/complete-banking-features/requirements.md) - Requirement 1
- [Design Document](.kiro/specs/complete-banking-features/design.md) - Section 1
- [ABA Routing Number Format](https://en.wikipedia.org/wiki/ABA_routing_transit_number)
