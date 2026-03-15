/**
 * Zod Validation Schemas for Digital Banking Platform
 * 
 * This file contains all validation schemas for forms and API validation.
 * These schemas ensure data integrity and provide type-safe validation.
 */

import { z } from 'zod';

/**
 * Authentication Schemas
 */

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * OTP Schemas
 */

export const otpVerificationSchema = z.object({
  code: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
  purpose: z.enum(['login', 'transfer', 'settings']),
});

export const otpGenerationSchema = z.object({
  purpose: z.enum(['login', 'transfer', 'settings']),
});

/**
 * Transfer Schemas
 */

export const transferSchema = z.object({
  fromAccountId: z.string().min(1, 'Source account is required'),
  toAccountId: z.string().min(1, 'Destination account is required'),
  amount: z
    .number()
    .positive('Amount must be greater than zero')
    .int('Amount must be a whole number (in cents)')
    .max(1000000000, 'Amount exceeds maximum limit'), // $10 million in cents
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  idempotencyKey: z.string().uuid('Invalid idempotency key'),
}).refine((data) => data.fromAccountId !== data.toAccountId, {
  message: 'Source and destination accounts must be different',
  path: ['toAccountId'],
});

/**
 * Account Schemas
 */

export const accountSchema = z.object({
  type: z.enum(['checking', 'savings']),
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code').default('USD'),
});

/**
 * User Profile Schemas
 */

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
});

/**
 * Card Schemas
 */

export const cardActionSchema = z.object({
  cardId: z.string().min(1, 'Card ID is required'),
  action: z.enum(['freeze', 'unfreeze']),
});

/**
 * Admin Schemas
 */

export const auditLogFilterSchema = z.object({
  userId: z.string().optional(),
  action: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
});

export const userFilterSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  emailVerified: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
});

/**
 * Bill Payment Schemas
 */

export const payeeSchema = z.object({
  name: z.string().min(1, 'Payee name is required').max(100, 'Payee name must be less than 100 characters'),
  accountNumber: z.string().min(1, 'Account number is required').max(50, 'Account number must be less than 50 characters'),
  routingNumber: z.string().regex(/^\d{9}$/, 'Routing number must be exactly 9 digits').refine(validateRoutingNumber, {
    message: 'Invalid routing number checksum',
  }),
  address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  category: z.enum(['utilities', 'rent', 'credit_card', 'insurance', 'loan', 'subscription', 'other']),
});

export const recurrenceRuleSchema = z.object({
  frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly']),
  dayOfMonth: z.number().int().min(1).max(31).optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  endDate: z.date().optional(),
}).refine((data) => {
  // If frequency is monthly, dayOfMonth is required
  if (data.frequency === 'monthly' && !data.dayOfMonth) {
    return false;
  }
  // If frequency is weekly, dayOfWeek is required
  if (data.frequency === 'weekly' && data.dayOfWeek === undefined) {
    return false;
  }
  return true;
}, {
  message: 'Monthly frequency requires dayOfMonth, weekly frequency requires dayOfWeek',
});

export const billPaymentSchema = z.object({
  payeeId: z.string().min(1, 'Payee is required'),
  fromAccountId: z.string().min(1, 'Source account is required'),
  amount: z
    .number()
    .positive('Amount must be greater than zero')
    .int('Amount must be a whole number (in cents)')
    .max(1000000000, 'Amount exceeds maximum limit'), // $10 million in cents
  scheduledDate: z.date().refine((date) => date > new Date(), {
    message: 'Scheduled date must be in the future',
  }),
  recurring: z.boolean().default(false),
  recurrenceRule: recurrenceRuleSchema.optional(),
  memo: z.string().max(200, 'Memo must be less than 200 characters').optional(),
}).refine((data) => {
  // If recurring is true, recurrenceRule is required
  if (data.recurring && !data.recurrenceRule) {
    return false;
  }
  return true;
}, {
  message: 'Recurring payments require a recurrence rule',
  path: ['recurrenceRule'],
});

export const cancelPaymentSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
});

export const paymentHistorySchema = z.object({
  limit: z.number().int().positive().max(100).default(50),
  startAfter: z.string().optional(),
  status: z.enum(['scheduled', 'processing', 'completed', 'failed', 'cancelled']).optional(),
});

/**
 * Type exports for use in components
 */

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type OTPVerificationInput = z.infer<typeof otpVerificationSchema>;
export type OTPGenerationInput = z.infer<typeof otpGenerationSchema>;
export type TransferInput = z.infer<typeof transferSchema>;
export type AccountInput = z.infer<typeof accountSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CardActionInput = z.infer<typeof cardActionSchema>;
export type AuditLogFilterInput = z.infer<typeof auditLogFilterSchema>;
export type UserFilterInput = z.infer<typeof userFilterSchema>;
export type PayeeInput = z.infer<typeof payeeSchema>;
export type RecurrenceRuleInput = z.infer<typeof recurrenceRuleSchema>;
export type BillPaymentInput = z.infer<typeof billPaymentSchema>;
export type CancelPaymentInput = z.infer<typeof cancelPaymentSchema>;
export type PaymentHistoryInput = z.infer<typeof paymentHistorySchema>;

/**
 * Helper validation functions
 */

/**
 * Validates a US routing number (9 digits)
 */
export function validateRoutingNumber(routingNumber: string): boolean {
  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(routingNumber)) {
    return false;
  }
  
  // Validate using routing number checksum algorithm
  const digits = routingNumber.split('').map(Number);
  const checksum = (
    3 * (digits[0] + digits[3] + digits[6]) +
    7 * (digits[1] + digits[4] + digits[7]) +
    (digits[2] + digits[5] + digits[8])
  ) % 10;
  
  return checksum === 0;
}

/**
 * Validates an amount in cents
 */
export const validateAmount = (amount: number): boolean => {
  return amount > 0 && Number.isInteger(amount) && amount <= 1000000000;
};

/**
 * Validates an account number format
 */
export const validateAccountNumber = (accountNumber: string): boolean => {
  // Account numbers should be 10-12 digits
  return /^\d{10,12}$/.test(accountNumber);
};

/**
 * Validates a card number (last 4 digits)
 */
export const validateLast4 = (last4: string): boolean => {
  return /^\d{4}$/.test(last4);
};

/**
 * Validates currency code (ISO 4217)
 */
export const validateCurrency = (currency: string): boolean => {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  return validCurrencies.includes(currency.toUpperCase());
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

/**
 * Formats amount from cents to dollars
 */
export const formatAmount = (cents: number): string => {
  return (cents / 100).toFixed(2);
};

/**
 * Parses amount from dollars to cents
 */
export const parseAmount = (dollars: string): number => {
  const parsed = parseFloat(dollars);
  if (isNaN(parsed)) {
    throw new Error('Invalid amount');
  }
  return Math.round(parsed * 100);
};
