/**
 * FilterManager Service
 * 
 * Manages filter state and applies filter logic to transactions.
 * Provides validation, serialization, and filter counting utilities.
 */

import {
  Transaction,
  FilterState,
  ValidationResult,
  DateRangeFilter,
  AmountRangeFilter,
  TransactionType
} from '@/lib/types/transactions';

export class FilterManager {
  /**
   * Apply all active filters to a transaction array
   * Uses AND logic - transactions must match ALL criteria
   */
  applyFilters(transactions: Transaction[], filters: FilterState): Transaction[] {
    let filtered = [...transactions];

    // Apply date range filter
    if (filters.dateRange) {
      filtered = this.filterByDateRange(filtered, filters.dateRange);
    }

    // Apply amount range filter
    if (filters.amountRange) {
      filtered = this.filterByAmountRange(filtered, filters.amountRange);
    }

    // Apply type filter (OR logic within types)
    if (filters.types.length > 0) {
      filtered = filtered.filter(tx => filters.types.includes(tx.type));
    }

    // Apply account filter (OR logic within accounts)
    if (filters.accounts.length > 0) {
      filtered = filtered.filter(tx => filters.accounts.includes(tx.accountId));
    }

    // Apply category filter (OR logic within categories)
    if (filters.categories.length > 0) {
      filtered = filtered.filter(tx => filters.categories.includes(tx.category));
    }

    return filtered;
  }

  /**
   * Filter transactions by date range
   */
  private filterByDateRange(
    transactions: Transaction[],
    dateRange: DateRangeFilter
  ): Transaction[] {
    const { startDate, endDate, preset } = dateRange;

    // Calculate dates from preset if provided
    let start: Date | undefined = startDate;
    let end: Date | undefined = endDate;

    if (preset) {
      const now = new Date();
      end = now;

      switch (preset) {
        case 'last7days':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last30days':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last90days':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    return transactions.filter(tx => {
      const txDate = tx.createdAt instanceof Date 
        ? tx.createdAt 
        : tx.createdAt.toDate();

      if (start && txDate < start) return false;
      if (end && txDate > end) return false;
      return true;
    });
  }

  /**
   * Filter transactions by amount range
   */
  private filterByAmountRange(
    transactions: Transaction[],
    amountRange: AmountRangeFilter
  ): Transaction[] {
    const { min, max } = amountRange;

    return transactions.filter(tx => {
      const amount = Math.abs(tx.amount);
      if (min !== undefined && amount < min) return false;
      if (max !== undefined && amount > max) return false;
      return true;
    });
  }

  /**
   * Validate filter values
   */
  validateFilters(filters: FilterState): ValidationResult {
    const errors: string[] = [];

    // Validate date range
    if (filters.dateRange) {
      const { startDate, endDate } = filters.dateRange;
      if (startDate && endDate && startDate > endDate) {
        errors.push('End date must be after start date');
      }
    }

    // Validate amount range
    if (filters.amountRange) {
      const { min, max } = filters.amountRange;
      
      if (min !== undefined && min < 0) {
        errors.push('Minimum amount must be positive');
      }
      
      if (max !== undefined && max < 0) {
        errors.push('Maximum amount must be positive');
      }
      
      if (min !== undefined && max !== undefined && min > max) {
        errors.push('Maximum amount must be greater than minimum amount');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get count of active filters
   */
  getActiveFilterCount(filters: FilterState): number {
    let count = 0;

    if (filters.dateRange) count++;
    if (filters.amountRange) count++;
    if (filters.types.length > 0) count++;
    if (filters.accounts.length > 0) count++;
    if (filters.categories.length > 0) count++;

    return count;
  }

  /**
   * Serialize filter state to string for storage
   */
  serializeFilters(filters: FilterState): string {
    try {
      const serializable = {
        ...filters,
        dateRange: filters.dateRange ? {
          ...filters.dateRange,
          startDate: filters.dateRange.startDate?.toISOString(),
          endDate: filters.dateRange.endDate?.toISOString()
        } : null
      };
      return JSON.stringify(serializable);
    } catch (error) {
      console.error('Failed to serialize filters:', error);
      return '';
    }
  }

  /**
   * Deserialize filter state from string
   */
  deserializeFilters(serialized: string): FilterState | null {
    try {
      const parsed = JSON.parse(serialized);
      
      return {
        ...parsed,
        dateRange: parsed.dateRange ? {
          ...parsed.dateRange,
          startDate: parsed.dateRange.startDate 
            ? new Date(parsed.dateRange.startDate) 
            : undefined,
          endDate: parsed.dateRange.endDate 
            ? new Date(parsed.dateRange.endDate) 
            : undefined
        } : null
      };
    } catch (error) {
      console.error('Failed to deserialize filters:', error);
      return null;
    }
  }
}

// Export singleton instance
export const filterManager = new FilterManager();
