/**
 * Form-specific Zod Validation Schemas
 * 
 * This file contains validation schemas specifically designed for form inputs
 * with user-friendly error messages and client-side validation rules.
 */

import { z } from 'zod';

/**
 * Transfer Form Schema
 * Used in the transfer form component with amount in dollars (not cents)
 */
export const transferFormSchema = z.object({
  fromAccountId: z.string().min(1, 'Please select a source account'),
  toAccountId: z.string().min(1, 'Please select a destination account'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be greater than zero',
    })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) <= 10000000, {
      message: 'Amount cannot exceed $10,000,000',
    })
    .refine((val) => {
      const parsed = parseFloat(val);
      return !isNaN(parsed) && /^\d+(\.\d{1,2})?$/.test(val);
    }, {
      message: 'Amount must have at most 2 decimal places',
    }),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
}).refine((data) => data.fromAccountId !== data.toAccountId, {
  message: 'Source and destination accounts must be different',
  path: ['toAccountId'],
});

/**
 * Profile Update Form Schema
 */
export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string().email('Invalid email address'),
});

/**
 * Security Settings Form Schema
 */
export const securitySettingsSchema = z.object({
  mfaEnabled: z.boolean(),
  totpEnabled: z.boolean(),
});

/**
 * Contact Form Schema (for marketing site)
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

/**
 * Search/Filter Form Schemas
 */

export const transactionFilterSchema = z.object({
  accountId: z.string().optional(),
  type: z.enum(['debit', 'credit', 'all']).optional(),
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(),   // ISO date string
  minAmount: z.string().optional(),
  maxAmount: z.string().optional(),
});

export const transferFilterSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'all']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.string().optional(),
  maxAmount: z.string().optional(),
});

/**
 * Type exports
 */

export type TransferFormInput = z.infer<typeof transferFormSchema>;
export type ProfileFormInput = z.infer<typeof profileFormSchema>;
export type SecuritySettingsInput = z.infer<typeof securitySettingsSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
export type TransferFilterInput = z.infer<typeof transferFilterSchema>;
