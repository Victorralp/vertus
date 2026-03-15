/**
 * FilterManager Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { FilterManager } from '../filterManager';
import { Transaction, FilterState, TransactionType, TransactionStatus } from '@/lib/types/transactions';
import { Timestamp } from 'firebase/firestore';

const filterManager = new FilterManager();

// Helper to create test transaction
const createTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  txId: 'tx-123',
  uid: 'user-123',
  accountId: 'acc-123',
  amount: 10000, // $100.00
  type: TransactionType.DEBIT,
  description: 'Test transaction',
  merchant: 'Test Merchant',
  category: 'groceries',
  createdAt: Timestamp.fromDate(new Date('2024-01-15')),
  status: TransactionStatus.COMPLETED,
  ...overrides
});

describe('FilterManager', () => {
  describe('applyFilters', () => {
    it('should return all transactions when no filters are active', () => {
      const transactions = [
        createTransaction(),
        createTransaction({ txId: 'tx-456' })
      ];

      const filters: FilterState = {
        dateRange: null,
        amountRange: null,
        types: [],
        accounts: [],
        categories: []
      };

      const result = filterManager.applyFilters(transactions, filters);
      expect(result).toHaveLength(2);
    });

    it('should filter by transaction type', () => {
      const transactions = [
        createTransaction({ type: TransactionType.DEBIT }),
        createTransaction({ txId: 'tx-456', type: TransactionType.CREDIT })
      ];

      const filters: FilterState = {
        dateRange: null,
        amountRange: null,
        types: [TransactionType.DEBIT],
        accounts: [],
        categories: []
      };

      const result = filterManager.applyFilters(transactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(TransactionType.DEBIT);
    });

    it('should filter by amount range', () => {
      const transactions = [
        createTransaction({ amount: 5000 }),  // $50
        createTransaction({ txId: 'tx-456', amount: 15000 }), // $150
        createTransaction({ txId: 'tx-789', amount: 25000 })  // $250
      ];

      const filters: FilterState = {
        dateRange: null,
        amountRange: { min: 100, max: 200 },
        types: [],
        accounts: [],
        categories: []
      };

      const result = filterManager.applyFilters(transactions, filters);
      expect(result).toHaveLength(1);
      expect(result[0].amount).toBe(15000);
    });
  });

  describe('validateFilters', () => {
    it('should validate correct filters', () => {
      const filters: FilterState = {
        dateRange: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31')
        },
        amountRange: { min: 0, max: 1000 },
        types: [],
        accounts: [],
        categories: []
      };

      const result = filterManager.validateFilters(filters);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid date range', () => {
      const filters: FilterState = {
        dateRange: {
          startDate: new Date('2024-01-31'),
          endDate: new Date('2024-01-01')
        },
        amountRange: null,
        types: [],
        accounts: [],
        categories: []
      };

      const result = filterManager.validateFilters(filters);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('End date must be after start date');
    });
  });

  describe('getActiveFilterCount', () => {
    it('should count active filters correctly', () => {
      const filters: FilterState = {
        dateRange: { preset: 'last30days' },
        amountRange: { min: 0, max: 100 },
        types: [TransactionType.DEBIT],
        accounts: [],
        categories: []
      };

      const count = filterManager.getActiveFilterCount(filters);
      expect(count).toBe(3);
    });
  });
});
