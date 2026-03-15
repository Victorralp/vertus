/**
 * ExportService
 * 
 * Handles CSV and PDF export generation for transactions.
 * All processing is done client-side.
 */

import { Transaction } from '@/lib/types/transactions';

export class ExportService {
  /**
   * Export transactions to CSV format
   */
  exportToCSV(transactions: Transaction[], filename?: string): void {
    try {
      // Generate CSV content
      const headers = ['Date', 'Merchant', 'Description', 'Amount', 'Type', 'Category', 'Account'];
      const rows = transactions.map(tx => [
        this.formatDate(tx.createdAt),
        this.escapeCSV(tx.merchant || ''),
        this.escapeCSV(tx.description),
        this.formatAmount(tx.amount),
        tx.type,
        tx.category,
        tx.accountId
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const finalFilename = filename || this.generateFilename('csv');
      this.downloadBlob(blob, finalFilename);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      throw new Error('Unable to generate CSV export');
    }
  }

  /**
   * Export transactions to PDF format
   * Note: This is a simplified implementation. For production, consider using jsPDF library
   */
  exportToPDF(transactions: Transaction[], filename?: string): void {
    try {
      // For now, we'll create a simple HTML-based PDF
      // In production, use jsPDF or similar library
      const htmlContent = this.generatePDFHTML(transactions);
      
      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const finalFilename = filename || this.generateFilename('html'); // Change to 'pdf' when using jsPDF
      this.downloadBlob(blob, finalFilename);
      
      // Note: User will need to print to PDF from browser
      console.log('PDF export: Please use browser Print > Save as PDF');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      throw new Error('Unable to generate PDF export');
    }
  }

  /**
   * Generate filename with timestamp
   */
  generateFilename(format: string): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `transactions_${year}-${month}-${day}.${format}`;
  }

  /**
   * Format date for export
   */
  private formatDate(date: Date | any): string {
    const d = date instanceof Date ? date : date.toDate();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format amount with currency symbol
   */
  private formatAmount(amount: number): string {
    const absAmount = Math.abs(amount) / 100; // Convert cents to dollars
    return `$${absAmount.toFixed(2)}`;
  }

  /**
   * Escape CSV special characters
   */
  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Generate HTML content for PDF
   */
  private generatePDFHTML(transactions: Transaction[]): string {
    const rows = transactions.map(tx => `
      <tr>
        <td>${this.formatDate(tx.createdAt)}</td>
        <td>${tx.merchant || ''}</td>
        <td>${tx.description}</td>
        <td>${this.formatAmount(tx.amount)}</td>
        <td>${tx.type}</td>
        <td>${tx.category}</td>
        <td>${tx.accountId}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transaction Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Transaction Export</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p>Total Transactions: ${transactions.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Account</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        
        <div class="footer">
          <p>NexusBank - Digital Banking Platform</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Download blob as file
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const exportService = new ExportService();
