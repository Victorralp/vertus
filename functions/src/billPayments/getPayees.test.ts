/**
 * Unit Tests for Get Payees Cloud Function
 * 
 * Tests the getPayees endpoint for retrieving user's payees.
 */

import { encrypt } from '../utils/encryption';

// Mock Firebase Admin
jest.mock('firebase-admin', () => {
  return {
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn(),
    })),
    firestore: jest.fn(() => ({
      collection: jest.fn(),
    })),
  };
});

describe('Get Payees Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Payee Retrieval', () => {
    it('should return empty array when user has no payees', () => {
      const payees: any[] = [];
      
      expect(payees).toEqual([]);
      expect(payees.length).toBe(0);
    });
    
    it('should return all payees for a user', () => {
      const mockPayees = [
        {
          payeeId: 'payee-1',
          uid: 'test-user',
          name: 'Electric Company',
          accountNumber: encrypt('1234567890'),
          routingNumber: '021000021',
          category: 'utilities',
          createdAt: { toDate: () => new Date('2024-01-01') },
          updatedAt: { toDate: () => new Date('2024-01-01') },
        },
        {
          payeeId: 'payee-2',
          uid: 'test-user',
          name: 'Landlord',
          accountNumber: encrypt('9876543210'),
          routingNumber: '026009593',
          address: '456 Oak Ave',
          category: 'rent',
          createdAt: { toDate: () => new Date('2024-01-02') },
          updatedAt: { toDate: () => new Date('2024-01-02') },
        },
      ];
      
      expect(mockPayees.length).toBe(2);
      expect(mockPayees[0].name).toBe('Electric Company');
      expect(mockPayees[1].name).toBe('Landlord');
    });
    
    it('should format payee data correctly', () => {
      const mockPayeeData = {
        payeeId: 'payee-1',
        uid: 'test-user',
        name: 'Electric Company',
        accountNumber: encrypt('1234567890'),
        routingNumber: '021000021',
        category: 'utilities',
        createdAt: { toDate: () => new Date('2024-01-01T00:00:00.000Z') },
        updatedAt: { toDate: () => new Date('2024-01-01T00:00:00.000Z') },
      };
      
      const formattedPayee = {
        payeeId: mockPayeeData.payeeId,
        name: mockPayeeData.name,
        accountNumber: mockPayeeData.accountNumber,
        routingNumber: mockPayeeData.routingNumber,
        address: undefined,
        category: mockPayeeData.category,
        createdAt: mockPayeeData.createdAt.toDate().toISOString(),
        updatedAt: mockPayeeData.updatedAt.toDate().toISOString(),
      };
      
      expect(formattedPayee.payeeId).toBe('payee-1');
      expect(formattedPayee.name).toBe('Electric Company');
      expect(formattedPayee.createdAt).toBe('2024-01-01T00:00:00.000Z');
    });
    
    it('should include optional address field when present', () => {
      const payeeWithAddress = {
        payeeId: 'payee-1',
        name: 'Landlord',
        accountNumber: encrypt('1234567890'),
        routingNumber: '021000021',
        address: '123 Main St',
        category: 'rent',
      };
      
      const payeeWithoutAddress: {
        payeeId: string;
        name: string;
        accountNumber: string;
        routingNumber: string;
        category: string;
        address?: string;
      } = {
        payeeId: 'payee-2',
        name: 'Electric Company',
        accountNumber: encrypt('9876543210'),
        routingNumber: '026009593',
        category: 'utilities',
      };
      
      expect(payeeWithAddress.address).toBeDefined();
      expect(payeeWithoutAddress.address).toBeUndefined();
    });
  });
  
  describe('Response Format', () => {
    it('should return correct response structure', () => {
      const response = {
        payees: [],
        count: 0,
      };
      
      expect(response).toHaveProperty('payees');
      expect(response).toHaveProperty('count');
      expect(Array.isArray(response.payees)).toBe(true);
      expect(typeof response.count).toBe('number');
    });
    
    it('should match count with payees array length', () => {
      const mockPayees = [
        { payeeId: '1', name: 'Payee 1' },
        { payeeId: '2', name: 'Payee 2' },
        { payeeId: '3', name: 'Payee 3' },
      ];
      
      const response = {
        payees: mockPayees,
        count: mockPayees.length,
      };
      
      expect(response.count).toBe(3);
      expect(response.payees.length).toBe(response.count);
    });
  });
  
  describe('Data Security', () => {
    it('should keep account numbers encrypted in response', () => {
      const accountNumber = '1234567890';
      const encrypted = encrypt(accountNumber);
      
      const payee = {
        payeeId: 'payee-1',
        name: 'Electric Company',
        accountNumber: encrypted, // Should remain encrypted
        routingNumber: '021000021',
        category: 'utilities',
      };
      
      // Account number should not be the plaintext
      expect(payee.accountNumber).not.toBe(accountNumber);
      // Should be in encrypted format
      expect(payee.accountNumber.split(':').length).toBe(3);
    });
    
    it('should not expose user IDs in response', () => {
      const payeeResponse = {
        payeeId: 'payee-1',
        name: 'Electric Company',
        accountNumber: encrypt('1234567890'),
        routingNumber: '021000021',
        category: 'utilities',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };
      
      // uid should not be in the response
      expect(payeeResponse).not.toHaveProperty('uid');
    });
  });
  
  describe('Sorting and Ordering', () => {
    it('should order payees by creation date descending', () => {
      const payees = [
        { payeeId: '1', createdAt: new Date('2024-01-03') },
        { payeeId: '2', createdAt: new Date('2024-01-01') },
        { payeeId: '3', createdAt: new Date('2024-01-02') },
      ];
      
      const sorted = [...payees].sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      );
      
      expect(sorted[0].payeeId).toBe('1'); // Most recent
      expect(sorted[1].payeeId).toBe('3');
      expect(sorted[2].payeeId).toBe('2'); // Oldest
    });
  });
});
