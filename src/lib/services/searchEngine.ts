/**
 * SearchEngine Service
 * 
 * Handles text-based search across transaction fields.
 * Provides case-insensitive search with query normalization.
 */

import { Transaction } from '@/lib/types/transactions';

export class SearchEngine {
  /**
   * Search transactions by text query
   * Searches across merchant name, description, and transaction ID
   * Case-insensitive matching
   */
  search(transactions: Transaction[], query: string): Transaction[] {
    if (!query || query.trim() === '') {
      return transactions;
    }

    const normalizedQuery = this.normalizeQuery(query);

    return transactions.filter(tx => {
      const merchant = (tx.merchant || '').toLowerCase();
      const description = tx.description.toLowerCase();
      const txId = tx.txId.toLowerCase();

      return (
        merchant.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        txId.includes(normalizedQuery)
      );
    });
  }

  /**
   * Highlight matching text in search results
   * Returns HTML string with <mark> tags around matches
   */
  highlightMatches(text: string, query: string): string {
    if (!query || query.trim() === '') {
      return text;
    }

    const normalizedQuery = this.normalizeQuery(query);
    const regex = new RegExp(`(${this.escapeRegex(normalizedQuery)})`, 'gi');
    
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Normalize search query
   * Converts to lowercase and trims whitespace
   */
  normalizeQuery(query: string): string {
    return query.toLowerCase().trim();
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Export singleton instance
export const searchEngine = new SearchEngine();
