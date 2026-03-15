/**
 * Check Deposit Data Models
 * 
 * Defines TypeScript interfaces and Zod schemas for check deposit functionality.
 */

import { z } from 'zod';
import * as admin from 'firebase-admin';

/**
 * Check Deposit Interface
 */
export interface CheckDeposit {
  depositId: string;
  uid: string;
  accountId: string;
  amount: number;              // In cents (from OCR or user input)
  checkNumber: string;         // From OCR
  checkDate: admin.firestore.Timestamp;
  status: 'pending_review' | 'approved' | 'rejected' | 'completed';
  frontImageUrl: string;       // Cloud Storage URL
  backImageUrl: string;        // Cloud Storage URL
  ocrData: {
    amount?: number;
    checkNumber?: string;
    date?: string;
    routingNumber?: string;
    accountNumber?: string;
    confidence: number;        // OCR confidence score (0-1)
  };
  holdUntil: admin.firestore.Timestamp;  // When funds become available
  rejectionReason?: string;
  createdAt: admin.firestore.Timestamp;
  approvedAt?: admin.firestore.Timestamp;
  completedAt?: admin.firestore.Timestamp;
}

/**
 * Image Quality Check Result
 */
export interface ImageQualityCheck {
  isValid: boolean;
  issues: string[];            // e.g., ['blur', 'low_brightness', 'corners_missing']
  metrics: {
    resolution: { width: number; height: number };
    brightness?: number;       // 0-255
    sharpness?: number;        // Laplacian variance
    aspectRatio: number;
  };
}

/**
 * Zod Validation Schemas
 */

export const uploadCheckSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  // Note: File validation happens separately in multer/busboy
});

export const confirmDepositSchema = z.object({
  depositId: z.string().min(1, 'Deposit ID is required'),
  amount: z.number().int().positive('Amount must be a positive integer'),
  checkNumber: z.string().min(1, 'Check number is required'),
  checkDate: z.string().datetime('Invalid date format'),
});

export const approveDepositSchema = z.object({
  depositId: z.string().min(1, 'Deposit ID is required'),
});

export const rejectDepositSchema = z.object({
  depositId: z.string().min(1, 'Deposit ID is required'),
  reason: z.string().min(1, 'Rejection reason is required'),
});

export const depositHistorySchema = z.object({
  limit: z.number().int().min(1).max(100).optional(),
  startAfter: z.string().optional(),
  status: z.enum(['pending_review', 'approved', 'rejected', 'completed']).optional(),
});
