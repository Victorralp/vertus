/**
 * Transaction Search & Filtering Type Definitions
 * 
 * This file contains all TypeScript interfaces and enums for the transaction
 * search and filtering feature.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Transaction type enum
 */
export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  DEPOSIT = 'deposit'
}

/**
 * Transaction status enum
 */
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * Main transaction interface
 */
export interface Transaction {
  txId: string;
  uid: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  description: string;
  merchant?: string;
  category: string;
  createdAt: Timestamp | Date;
  status: TransactionStatus;
}

/**
 * Date range filter interface
 */
export interface DateRangeFilter {
  preset?: 'last7days' | 'last30days' | 'last90days';
  startDate?: Date;
  endDate?: Date;
}

/**
 * Amount range filter interface
 */
export interface AmountRangeFilter {
  min?: number;
  max?: number;
}

/**
 * Complete filter state interface
 */
export interface FilterState {
  dateRange: DateRangeFilter | null;
  amountRange: AmountRangeFilter | null;
  types: TransactionType[];
  accounts: string[];
  categories: string[];
}

/**
 * Sort field enum
 */
export enum SortField {
  DATE = 'createdAt',
  AMOUNT = 'amount',
  MERCHANT = 'merchant'
}

/**
 * Sort direction enum
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * Sort configuration interface
 */
export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

/**
 * Pagination state interface
 */
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  lastVisible: any | null; // DocumentSnapshot type
  hasMore: boolean;
}

/**
 * Pagination configuration for queries
 */
export interface PaginationConfig {
  pageSize: number;
  startAfter?: any; // DocumentSnapshot type
}

/**
 * Account interface for filter dropdown
 */
export interface Account {
  accountId: string;
  accountName: string;
  accountType: 'checking' | 'savings' | 'business';
  balance: number;
}

/**
 * Category interface for filter dropdown
 */
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Default filter state
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  dateRange: null,
  amountRange: null,
  types: [],
  accounts: [],
  categories: []
};

/**
 * Default sort configuration
 */
export const DEFAULT_SORT_CONFIG: SortConfig = {
  field: SortField.DATE,
  direction: SortDirection.DESC
};

/**
 * Default pagination state
 */
export const DEFAULT_PAGINATION_STATE: PaginationState = {
  currentPage: 1,
  pageSize: 50,
  lastVisible: null,
  hasMore: false
};

/**
 * Standard transaction categories
 */
export const TRANSACTION_CATEGORIES: Category[] = [
  { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#10b981' },
  { id: 'utilities', name: 'Utilities', icon: '⚡', color: '#f59e0b' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { id: 'dining', name: 'Dining', icon: '🍽️', color: '#ef4444' },
  { id: 'transportation', name: 'Transportation', icon: '🚗', color: '#3b82f6' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#ec4899' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#06b6d4' },
  { id: 'other', name: 'Other', icon: '📌', color: '#6b7280' }
];
