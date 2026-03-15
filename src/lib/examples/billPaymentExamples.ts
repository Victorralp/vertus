/**
 * Example usage of Bill Payment data models and validation schemas
 * 
 * This file demonstrates how to use the Payee and BillPayment interfaces
 * along with their validation schemas.
 */

import { Timestamp } from 'firebase/firestore';
import type { Payee, BillPayment } from '../types';
import {
  payeeSchema,
  billPaymentSchema,
  validateRoutingNumber,
  type PayeeInput,
  type BillPaymentInput,
} from '../validations';

/**
 * Example: Creating a Payee
 */
export function createPayeeExample(): PayeeInput {
  const payeeInput: PayeeInput = {
    name: 'Electric Company',
    accountNumber: '1234567890',
    routingNumber: '021000021', // JP Morgan Chase routing number
    address: '123 Main St, City, State 12345',
    category: 'utilities',
  };

  // Validate the input
  const result = payeeSchema.safeParse(payeeInput);
  
  if (!result.success) {
    console.error('Validation errors:', result.error.errors);
    throw new Error('Invalid payee data');
  }

  return result.data;
}

/**
 * Example: Creating a one-time bill payment
 */
export function createOneTimePaymentExample(): BillPaymentInput {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7); // Schedule for 7 days from now

  const paymentInput: BillPaymentInput = {
    payeeId: 'payee_123',
    fromAccountId: 'account_456',
    amount: 15000, // $150.00 in cents
    scheduledDate: futureDate,
    recurring: false,
    memo: 'Monthly electric bill',
  };

  // Validate the input
  const result = billPaymentSchema.safeParse(paymentInput);
  
  if (!result.success) {
    console.error('Validation errors:', result.error.errors);
    throw new Error('Invalid payment data');
  }

  return result.data;
}

/**
 * Example: Creating a recurring monthly bill payment
 */
export function createRecurringPaymentExample(): BillPaymentInput {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const paymentInput: BillPaymentInput = {
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

  // Validate the input
  const result = billPaymentSchema.safeParse(paymentInput);
  
  if (!result.success) {
    console.error('Validation errors:', result.error.errors);
    throw new Error('Invalid payment data');
  }

  return result.data;
}

/**
 * Example: Creating a recurring weekly bill payment
 */
export function createWeeklyPaymentExample(): BillPaymentInput {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const paymentInput: BillPaymentInput = {
    payeeId: 'payee_789',
    fromAccountId: 'account_456',
    amount: 5000, // $50.00 in cents
    scheduledDate: futureDate,
    recurring: true,
    recurrenceRule: {
      frequency: 'weekly',
      dayOfWeek: 1, // Monday (0 = Sunday, 1 = Monday, etc.)
    },
    memo: 'Weekly subscription payment',
  };

  // Validate the input
  const result = billPaymentSchema.safeParse(paymentInput);
  
  if (!result.success) {
    console.error('Validation errors:', result.error.errors);
    throw new Error('Invalid payment data');
  }

  return result.data;
}

/**
 * Example: Validating a routing number
 */
export function validateRoutingNumberExample() {
  const validRoutingNumbers = [
    '021000021', // JP Morgan Chase
    '026009593', // Bank of America
    '111000025', // Wells Fargo
  ];

  const invalidRoutingNumbers = [
    '123456789', // Invalid checksum
    '12345678',  // Too short
    'abcdefghi', // Non-numeric
  ];

  console.log('Valid routing numbers:');
  validRoutingNumbers.forEach(rn => {
    console.log(`  ${rn}: ${validateRoutingNumber(rn)}`);
  });

  console.log('\nInvalid routing numbers:');
  invalidRoutingNumbers.forEach(rn => {
    console.log(`  ${rn}: ${validateRoutingNumber(rn)}`);
  });
}

/**
 * Example: Complete Payee document structure (as stored in Firestore)
 */
export function getPayeeDocumentExample(): Payee {
  return {
    payeeId: 'payee_abc123',
    uid: 'user_xyz789',
    name: 'Electric Company',
    accountNumber: 'encrypted_account_number_here', // This would be encrypted in production
    routingNumber: '021000021',
    address: '123 Main St, City, State 12345',
    category: 'utilities',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

/**
 * Example: Complete BillPayment document structure (as stored in Firestore)
 */
export function getBillPaymentDocumentExample(): BillPayment {
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 7);

  return {
    paymentId: 'payment_def456',
    uid: 'user_xyz789',
    payeeId: 'payee_abc123',
    fromAccountId: 'account_456',
    amount: 15000,
    scheduledDate: Timestamp.fromDate(scheduledDate),
    status: 'scheduled',
    recurring: true,
    recurrenceRule: {
      frequency: 'monthly',
      dayOfMonth: 15,
    },
    memo: 'Monthly electric bill',
    createdAt: Timestamp.now(),
  };
}

/**
 * Example: Payee categories
 */
export const PAYEE_CATEGORIES = [
  'utilities',
  'rent',
  'credit_card',
  'insurance',
  'loan',
  'subscription',
  'other',
] as const;

/**
 * Example: Bill payment statuses
 */
export const BILL_PAYMENT_STATUSES = [
  'scheduled',
  'processing',
  'completed',
  'failed',
  'cancelled',
] as const;

/**
 * Example: Recurrence frequencies
 */
export const RECURRENCE_FREQUENCIES = [
  'weekly',
  'biweekly',
  'monthly',
  'quarterly',
] as const;
