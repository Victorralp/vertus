/**
 * TypeScript Type Definitions for Digital Banking Platform
 * 
 * This file contains all data model interfaces based on the Firestore schema
 * defined in the design document.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * User Interface
 * Represents a user in the system with authentication and security settings
 */
export interface User {
  uid: string;                    // Firebase Auth UID
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  security: {
    emailVerified: boolean;
    mfaEnabled: boolean;
    totpEnabled: boolean;
    totpSecret?: string;          // Encrypted TOTP secret
  };
  identity?: {
    ssnLast4: string;
    ssnMasked: string;
    ssnProvidedAt: Timestamp;
  };
}

/**
 * Account Interface
 * Represents a financial account (checking or savings)
 */
export interface Account {
  accountId: string;              // Auto-generated
  uid: string;                    // Owner user ID
  type: 'checking' | 'savings';
  balance: number;                // In cents to avoid floating point
  currency: string;               // ISO 4217 code (e.g., 'USD')
  accountNumber: string;          // Masked display number
  status: 'active' | 'frozen';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Transaction Interface
 * Represents a debit or credit operation on an account
 */
export interface Transaction {
  txId: string;                   // Auto-generated
  uid: string;                    // Owner user ID
  accountId: string;              // Related account
  type: 'debit' | 'credit';
  amount: number;                 // In cents, always positive
  description: string;
  relatedTransferId?: string;     // Link to transfer that created this
  createdAt: Timestamp;
}

/**
 * Transfer Interface
 * Represents a movement of funds between two accounts
 */
export interface Transfer {
  transferId: string;             // Auto-generated
  uid: string;                    // User who initiated
  fromAccountId: string;
  toAccountId: string;
  amount: number;                 // In cents
  status: 'pending' | 'completed' | 'failed';
  idempotencyKey: string;         // Unique key for deduplication
  createdAt: Timestamp;
  completedAt?: Timestamp;
  failureReason?: string;
}

/**
 * OTP Interface
 * Represents a one-time password for verification
 */
export interface OTP {
  otpId: string;                  // Auto-generated
  uid: string;                    // User ID
  codeHash: string;               // Bcrypt hash of 6-digit code
  purpose: string;                // 'login' | 'transfer' | 'settings'
  attempts: number;               // Failed verification attempts
  maxAttempts: number;            // Default 5
  expiresAt: Timestamp;           // 5 minutes from creation
  used: boolean;                  // Invalidated after successful use
  createdAt: Timestamp;
}

/**
 * AuditLog Interface
 * Represents a security-relevant action in the system
 */
export interface AuditLog {
  logId: string;                  // Auto-generated
  uid?: string;                   // User ID (if applicable)
  action: string;                 // Action type (e.g., 'login_success', 'transfer_executed')
  metadata: {                     // Action-specific data
    [key: string]: any;
  };
  ip?: string;                    // Client IP address
  userAgent?: string;             // Client user agent
  createdAt: Timestamp;
}

/**
 * Card Interface
 * Represents a virtual card linked to an account
 */
export interface Card {
  cardId: string;                 // Auto-generated
  uid: string;                    // Owner user ID
  accountId: string;              // Linked account
  cardNumber: string;             // Encrypted full number
  last4: string;                  // Last 4 digits for display
  type: 'virtual';
  status: 'active' | 'frozen';
  expirationMonth: number;
  expirationYear: number;
  createdAt: Timestamp;
}

/**
 * Payee Interface
 * Represents a bill payment recipient saved by the user
 */
export interface Payee {
  payeeId: string;                // Auto-generated
  uid: string;                    // Owner user ID
  name: string;                   // Payee display name
  accountNumber: string;          // Encrypted account number
  routingNumber: string;          // Bank routing number
  address?: string;               // Payee address
  category: string;               // e.g., 'utilities', 'rent', 'credit_card'
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * BillPayment Interface
 * Represents a scheduled or completed bill payment
 */
export interface BillPayment {
  paymentId: string;              // Auto-generated
  uid: string;                    // User ID
  payeeId: string;                // Reference to payee
  fromAccountId: string;          // Source account
  amount: number;                 // In cents
  scheduledDate: Timestamp;       // When to process
  status: 'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled';
  recurring: boolean;             // Is this recurring?
  recurrenceRule?: {              // If recurring
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
    dayOfMonth?: number;          // For monthly (1-31)
    dayOfWeek?: number;           // For weekly (0-6)
    endDate?: Timestamp;          // When to stop
  };
  memo?: string;                  // Payment memo
  confirmationNumber?: string;    // After processing
  failureReason?: string;         // If failed
  createdAt: Timestamp;
  processedAt?: Timestamp;
}

/**
 * Type aliases for common use cases
 */
export type AccountType = 'checking' | 'savings';
export type AccountStatus = 'active' | 'frozen';
export type TransactionType = 'debit' | 'credit';
export type TransferStatus = 'pending' | 'completed' | 'failed';
export type CardStatus = 'active' | 'frozen';
export type UserRole = 'user' | 'admin';
export type OTPPurpose = 'login' | 'transfer' | 'settings';
export type BillPaymentStatus = 'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type RecurrenceFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
export type PayeeCategory = 'utilities' | 'rent' | 'credit_card' | 'insurance' | 'loan' | 'subscription' | 'other';

/**
 * Client-side types (without Firestore Timestamp)
 * These are used in the frontend where Timestamps are converted to Date objects
 */
export interface UserClient extends Omit<User, 'createdAt' | 'lastLoginAt'> {
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AccountClient extends Omit<Account, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionClient extends Omit<Transaction, 'createdAt'> {
  createdAt: Date;
}

export interface TransferClient extends Omit<Transfer, 'createdAt' | 'completedAt'> {
  createdAt: Date;
  completedAt?: Date;
}

export interface OTPClient extends Omit<OTP, 'createdAt' | 'expiresAt'> {
  createdAt: Date;
  expiresAt: Date;
}

export interface AuditLogClient extends Omit<AuditLog, 'createdAt'> {
  createdAt: Date;
}

export interface CardClient extends Omit<Card, 'createdAt'> {
  createdAt: Date;
}

export interface PayeeClient extends Omit<Payee, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
}

export interface BillPaymentClient extends Omit<BillPayment, 'createdAt' | 'scheduledDate' | 'processedAt' | 'recurrenceRule'> {
  createdAt: Date;
  scheduledDate: Date;
  processedAt?: Date;
  recurrenceRule?: {
    frequency: RecurrenceFrequency;
    dayOfMonth?: number;
    dayOfWeek?: number;
    endDate?: Date;
  };
}

/**
 * Export transaction filtering types
 */
export * from './transactions';
