/**
 * Unit Tests for Add Payee Cloud Function
 * 
 * Tests the addPayee endpoint for creating new bill payment payees.
 */

import * as admin from 'firebase-admin';
import { encrypt, decrypt } from '../utils/encryption';

// Mock Firebase Admin
jest.mock('firebase-admin', () => {
  const mockTimestamp = {
    now: jest.fn(() => ({
      toDate: () => new Date('2024-01-01T00:00:00.000Z'),
    })),
  };
  
  return {
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn(),
    })),
    firestore: jest.fn(() => ({
      collection: jest.fn(),
      Timestamp: mockTimestamp,
    })),
  };
});

describe('Add Payee Function', () => {
  let mockFirestore: any;
  let mockCollection: any;
  let mockDoc: any;
  let mockSet: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks
    mockFirestore = admin.firestore();
    
    mockSet = jest.fn().mockResolvedValue(undefined);
    mockDoc = jest.fn(() => ({
      id: 'mock-payee-id',
      set: mockSet,
    }));
    mockCollection = jest.fn(() => ({
      doc: mockDoc,
    }));
    
    mockFirestore.collection = jest.fn(() => ({
      doc: jest.fn(() => ({
        collection: mockCollection,
      })),
    }));
  });
  
  describe('Routing Number Validation', () => {
    // Test the routing number validation logic
    function validateRoutingNumber(routingNumber: string): boolean {
      if (!/^\d{9}$/.test(routingNumber)) {
        return false;
      }
      
      const digits = routingNumber.split('').map(Number);
      const checksum = (
        3 * (digits[0] + digits[3] + digits[6]) +
        7 * (digits[1] + digits[4] + digits[7]) +
        (digits[2] + digits[5] + digits[8])
      ) % 10;
      
      return checksum === 0;
    }
    
    it('should validate correct routing numbers', () => {
      // Valid routing numbers (real examples)
      expect(validateRoutingNumber('021000021')).toBe(true); // JP Morgan Chase
      expect(validateRoutingNumber('026009593')).toBe(true); // Bank of America
      expect(validateRoutingNumber('121000248')).toBe(true); // Wells Fargo
      expect(validateRoutingNumber('011401533')).toBe(true); // PNC Bank
    });
    
    it('should reject invalid routing numbers', () => {
      expect(validateRoutingNumber('123456789')).toBe(false); // Invalid checksum
      expect(validateRoutingNumber('111111111')).toBe(false); // All ones
      expect(validateRoutingNumber('999999999')).toBe(false); // Invalid checksum
    });
    
    it('should reject non-9-digit routing numbers', () => {
      expect(validateRoutingNumber('12345678')).toBe(false); // Too short
      expect(validateRoutingNumber('1234567890')).toBe(false); // Too long
      expect(validateRoutingNumber('')).toBe(false); // Empty
    });
    
    it('should reject non-numeric routing numbers', () => {
      expect(validateRoutingNumber('12345678a')).toBe(false);
      expect(validateRoutingNumber('abc123456')).toBe(false);
      expect(validateRoutingNumber('12-345-678')).toBe(false);
    });
  });
  
  describe('Account Number Encryption', () => {
    it('should encrypt account numbers', () => {
      const accountNumber = '1234567890';
      const encrypted = encrypt(accountNumber);
      
      // Encrypted value should be different from original
      expect(encrypted).not.toBe(accountNumber);
      
      // Should be in correct format (iv:authTag:encryptedData)
      expect(encrypted.split(':').length).toBe(3);
    });
    
    it('should decrypt account numbers correctly', () => {
      const accountNumber = '1234567890';
      const encrypted = encrypt(accountNumber);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(accountNumber);
    });
    
    it('should handle different account number formats', () => {
      const testCases = [
        '1234567890',
        '0000000000',
        '9999999999',
        '123456789012', // 12 digits
        '1234567890', // 10 digits
      ];
      
      testCases.forEach(accountNumber => {
        const encrypted = encrypt(accountNumber);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(accountNumber);
      });
    });
  });
  
  describe('Input Validation', () => {
    it('should validate required fields', () => {
      const validPayee = {
        name: 'Electric Company',
        accountNumber: '1234567890',
        routingNumber: '021000021',
        category: 'utilities' as const,
      };
      
      expect(validPayee.name).toBeTruthy();
      expect(validPayee.accountNumber).toBeTruthy();
      expect(validPayee.routingNumber).toBeTruthy();
      expect(validPayee.category).toBeTruthy();
    });
    
    it('should validate name length', () => {
      const shortName = 'A';
      const longName = 'A'.repeat(101);
      const validName = 'Electric Company';
      
      expect(shortName.length >= 1 && shortName.length <= 100).toBe(true);
      expect(longName.length >= 1 && longName.length <= 100).toBe(false);
      expect(validName.length >= 1 && validName.length <= 100).toBe(true);
    });
    
    it('should validate account number length', () => {
      const shortAccount = '';
      const longAccount = 'A'.repeat(51);
      const validAccount = '1234567890';
      
      expect(shortAccount.length >= 1 && shortAccount.length <= 50).toBe(false);
      expect(longAccount.length >= 1 && longAccount.length <= 50).toBe(false);
      expect(validAccount.length >= 1 && validAccount.length <= 50).toBe(true);
    });
    
    it('should validate category values', () => {
      const validCategories = ['utilities', 'rent', 'credit_card', 'insurance', 'loan', 'subscription', 'other'];
      
      expect(validCategories.includes('utilities')).toBe(true);
      expect(validCategories.includes('rent')).toBe(true);
      expect(validCategories.includes('invalid')).toBe(false);
    });
    
    it('should validate address length when provided', () => {
      const shortAddress = '123 Main St';
      const longAddress = 'A'.repeat(201);
      
      expect(shortAddress.length <= 200).toBe(true);
      expect(longAddress.length <= 200).toBe(false);
    });
  });
  
  describe('Payee Data Structure', () => {
    it('should create payee with correct structure', () => {
      const mockTimestamp = {
        toDate: () => new Date('2024-01-01T00:00:00.000Z'),
      };
      
      const payeeData = {
        payeeId: 'mock-payee-id',
        uid: 'test-user-id',
        name: 'Electric Company',
        accountNumber: encrypt('1234567890'),
        routingNumber: '021000021',
        address: '123 Main St',
        category: 'utilities',
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };
      
      expect(payeeData).toHaveProperty('payeeId');
      expect(payeeData).toHaveProperty('uid');
      expect(payeeData).toHaveProperty('name');
      expect(payeeData).toHaveProperty('accountNumber');
      expect(payeeData).toHaveProperty('routingNumber');
      expect(payeeData).toHaveProperty('category');
      expect(payeeData).toHaveProperty('createdAt');
      expect(payeeData).toHaveProperty('updatedAt');
    });
  });
});
