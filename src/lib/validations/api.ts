/**
 * API-specific Zod Validation Schemas
 * 
 * This file contains validation schemas for API requests and responses,
 * including Cloud Function inputs and outputs.
 */

import { z } from 'zod';

/**
 * Cloud Function Request Schemas
 */

export const generateOTPRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  purpose: z.enum(['login', 'transfer', 'settings']),
});

export const verifyOTPRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  code: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must contain only numbers'),
  purpose: z.enum(['login', 'transfer', 'settings']),
});

export const executeTransferRequestSchema = z.object({
  fromAccountId: z.string().min(1, 'Source account is required'),
  toAccountId: z.string().min(1, 'Destination account is required'),
  amount: z.number().int().positive('Amount must be greater than zero'),
  idempotencyKey: z.string().uuid('Invalid idempotency key'),
  otpVerified: z.boolean(),
});

export const freezeCardRequestSchema = z.object({
  cardId: z.string().min(1, 'Card ID is required'),
  otpVerified: z.boolean(),
});

export const unfreezeCardRequestSchema = z.object({
  cardId: z.string().min(1, 'Card ID is required'),
  otpVerified: z.boolean(),
});

export const createAuditLogRequestSchema = z.object({
  userId: z.string().optional(),
  action: z.string().min(1, 'Action is required'),
  metadata: z.record(z.string(), z.any()),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

/**
 * Cloud Function Response Schemas
 */

export const generateOTPResponseSchema = z.object({
  success: z.boolean(),
  expiresAt: z.number(), // Unix timestamp
  message: z.string().optional(),
});

export const verifyOTPResponseSchema = z.object({
  success: z.boolean(),
  attemptsRemaining: z.number().optional(),
  message: z.string().optional(),
});

export const executeTransferResponseSchema = z.object({
  success: z.boolean(),
  transferId: z.string().optional(),
  transactions: z.array(z.object({
    txId: z.string(),
    accountId: z.string(),
    type: z.enum(['debit', 'credit']),
    amount: z.number(),
  })).optional(),
  message: z.string().optional(),
});

export const cardActionResponseSchema = z.object({
  success: z.boolean(),
  cardId: z.string().optional(),
  status: z.enum(['active', 'frozen']).optional(),
  message: z.string().optional(),
});

export const auditLogResponseSchema = z.object({
  success: z.boolean(),
  logId: z.string().optional(),
  message: z.string().optional(),
});

/**
 * API Error Response Schema
 */

export const apiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.any()).optional(),
});

/**
 * Pagination Schemas
 */

export const paginationRequestSchema = z.object({
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
  orderBy: z.string().optional(),
  orderDirection: z.enum(['asc', 'desc']).optional(),
});

export const paginationResponseSchema = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
  hasMore: z.boolean(),
});

/**
 * Query Parameter Schemas
 */

export const accountQuerySchema = z.object({
  userId: z.string().optional(),
  type: z.enum(['checking', 'savings']).optional(),
  status: z.enum(['active', 'frozen']).optional(),
});

export const transactionQuerySchema = z.object({
  accountId: z.string().optional(),
  userId: z.string().optional(),
  type: z.enum(['debit', 'credit']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().int().nonnegative().optional(),
  maxAmount: z.number().int().positive().optional(),
});

export const transferQuerySchema = z.object({
  userId: z.string().optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().int().nonnegative().optional(),
  maxAmount: z.number().int().positive().optional(),
});

/**
 * Webhook Schemas (for future integrations)
 */

export const webhookPayloadSchema = z.object({
  event: z.string(),
  timestamp: z.number(),
  data: z.record(z.string(), z.any()),
  signature: z.string().optional(),
});

/**
 * Type exports
 */

export type GenerateOTPRequest = z.infer<typeof generateOTPRequestSchema>;
export type VerifyOTPRequest = z.infer<typeof verifyOTPRequestSchema>;
export type ExecuteTransferRequest = z.infer<typeof executeTransferRequestSchema>;
export type FreezeCardRequest = z.infer<typeof freezeCardRequestSchema>;
export type UnfreezeCardRequest = z.infer<typeof unfreezeCardRequestSchema>;
export type CreateAuditLogRequest = z.infer<typeof createAuditLogRequestSchema>;

export type GenerateOTPResponse = z.infer<typeof generateOTPResponseSchema>;
export type VerifyOTPResponse = z.infer<typeof verifyOTPResponseSchema>;
export type ExecuteTransferResponse = z.infer<typeof executeTransferResponseSchema>;
export type CardActionResponse = z.infer<typeof cardActionResponseSchema>;
export type AuditLogResponse = z.infer<typeof auditLogResponseSchema>;

export type APIError = z.infer<typeof apiErrorSchema>;
export type PaginationRequest = z.infer<typeof paginationRequestSchema>;
export type PaginationResponse = z.infer<typeof paginationResponseSchema>;

export type AccountQuery = z.infer<typeof accountQuerySchema>;
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
export type TransferQuery = z.infer<typeof transferQuerySchema>;

export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
