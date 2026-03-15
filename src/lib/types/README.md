# TypeScript Types and Validation Schemas

This directory contains all TypeScript type definitions and Zod validation schemas for the Digital Banking Platform.

## Structure

### Types (`/types`)

- **`index.ts`**: Core data model interfaces matching the Firestore schema
  - User, Account, Transaction, Transfer, OTP, AuditLog, Card interfaces
  - Client-side type variants (with Date instead of Timestamp)
  - Type aliases for common use cases

- **`constants.ts`**: Application-wide constants
  - Account, transaction, and transfer constants
  - OTP configuration values
  - Audit log action types
  - Error codes and messages
  - Route definitions
  - Storage keys

- **`guards.ts`**: Type guards and converters
  - Runtime type checking functions
  - Firestore ↔ Client type converters
  - Validation helpers
  - Error type guards

### Validations (`/validations`)

- **`index.ts`**: Core validation schemas
  - Authentication schemas (sign up, sign in, password reset)
  - OTP schemas
  - Transfer schemas
  - Account schemas
  - User profile schemas
  - Helper validation functions

- **`forms.ts`**: Form-specific validation schemas
  - Transfer form (with dollar amounts)
  - Profile update form
  - Security settings form
  - Contact form
  - Filter/search forms

- **`api.ts`**: API-specific validation schemas
  - Cloud Function request/response schemas
  - Pagination schemas
  - Query parameter schemas
  - Webhook schemas
  - Error response schemas

## Usage Examples

### Using Types

```typescript
import type { Account, AccountClient } from '@/lib/types';
import { convertAccountToClient } from '@/lib/types/guards';

// Firestore document
const firestoreAccount: Account = {
  accountId: '123',
  uid: 'user123',
  type: 'checking',
  balance: 100000, // in cents
  currency: 'USD',
  accountNumber: '1234567890',
  status: 'active',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

// Convert to client-side type
const clientAccount: AccountClient = convertAccountToClient(firestoreAccount);
```

### Using Validation Schemas

```typescript
import { signUpSchema, type SignUpInput } from '@/lib/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function SignUpForm() {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpInput) => {
    // data is fully typed and validated
    console.log(data.email, data.password, data.name);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

### Using Constants

```typescript
import { ACCOUNT_TYPES, OTP_EXPIRY_MINUTES, ERROR_CODES } from '@/lib/types/constants';

// Use constants instead of magic strings
const accountType = ACCOUNT_TYPES.CHECKING;
const expiryTime = Date.now() + (OTP_EXPIRY_MINUTES * 60 * 1000);

if (error.code === ERROR_CODES.INSUFFICIENT_BALANCE) {
  // Handle insufficient balance error
}
```

### Using Type Guards

```typescript
import { isAccountType, isValidAmount, isDefined } from '@/lib/types/guards';

function processAccount(type: string, amount: number | null) {
  if (!isAccountType(type)) {
    throw new Error('Invalid account type');
  }

  if (!isDefined(amount) || !isValidAmount(amount)) {
    throw new Error('Invalid amount');
  }

  // type is now AccountType
  // amount is now number (not null)
}
```

## Best Practices

1. **Always use types from this directory** instead of defining inline types
2. **Use Zod schemas for all form and API validation** to ensure type safety
3. **Use constants** instead of magic strings/numbers
4. **Use type guards** for runtime type checking
5. **Convert Firestore types to client types** when passing data to components
6. **Export type aliases** from validation schemas using `z.infer<>`

## Adding New Types

When adding new types:

1. Add the interface to `types/index.ts`
2. Add a client variant if it contains Timestamps
3. Add converters to `types/guards.ts`
4. Add validation schemas to `validations/index.ts` or appropriate file
5. Add constants to `types/constants.ts` if needed
6. Export type aliases from validation schemas

## Testing

All types and schemas should be tested:

```typescript
import { signUpSchema } from '@/lib/validations';

// Valid data
const validData = {
  email: 'test@example.com',
  password: 'Password123!',
  name: 'John Doe',
  confirmPassword: 'Password123!',
};

const result = signUpSchema.safeParse(validData);
expect(result.success).toBe(true);

// Invalid data
const invalidData = { ...validData, email: 'invalid' };
const invalidResult = signUpSchema.safeParse(invalidData);
expect(invalidResult.success).toBe(false);
```
