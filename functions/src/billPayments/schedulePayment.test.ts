/**
 * Tests for Schedule Payment Cloud Function
 * 
 * Tests cover:
 * - Authentication validation
 * - Input validation (required fields, amount, dates)
 * - Payee existence validation
 * - Account ownership and status validation
 * - Balance checking
 * - One-time payment scheduling
 * - Recurring payment scheduling with various frequencies
 * - Recurrence rule validation
 */

import * as admin from 'firebase-admin';
import { schedulePayment } from './schedulePayment';

// Mock Firebase Admin
jest.mock('firebase-admin', () => {
  const actualAdmin = jest.requireActual('firebase-admin');
  return {
    ...actualAdmin,
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn(),
    })),
    firestore: jest.fn(() => ({
      collection: jest.fn(),
      runTransaction: jest.fn(),
    })),
  };
});

describe('schedulePayment Cloud Function', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockAuth: any;
  let mockFirestore: any;
  let mockTransaction: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock request
    mockRequest = {
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-token',
      },
      body: {},
    };

    // Mock response
    mockResponse = {
      set: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Mock auth
    mockAuth = {
      verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-123' }),
    };
    (admin.auth as jest.Mock).mockReturnValue(mockAuth);

    // Mock transaction
    mockTransaction = {
      get: jest.fn(),
      set: jest.fn(),
    };

    // Create a proper mock for Firestore with nested collection/doc support
    const createMockDocRef = (path: string = '') => {
      const docRef: any = {
        toString: jest.fn().mockReturnValue(path),
        id: 'mock-doc-id',
        path: path,
      };
      // Add collection method to support nested collections
      docRef.collection = jest.fn((collectionName: string) => 
        createMockCollectionRef(`${path}/${collectionName}`)
      );
      return docRef;
    };

    const createMockCollectionRef = (path: string = '') => {
      const collectionRef: any = {
        toString: jest.fn().mockReturnValue(path),
        path: path,
      };
      collectionRef.doc = jest.fn((id?: string) => 
        createMockDocRef(`${path}/${id || 'mock-doc-id'}`)
      );
      return collectionRef;
    };

    mockFirestore = {
      collection: jest.fn((collectionName: string) => createMockCollectionRef(collectionName)),
      doc: jest.fn((id: string) => createMockDocRef(id)),
      runTransaction: jest.fn((callback) => callback(mockTransaction)),
    };
    
    (admin.firestore as any).mockReturnValue(mockFirestore);
    (admin.firestore as any).Timestamp = {
      now: jest.fn(() => ({ toDate: () => new Date('2024-01-15T10:00:00Z') })),
      fromDate: jest.fn((date) => ({ toDate: () => date })),
    };
  });

  describe('HTTP Method and CORS', () => {
    it('should handle OPTIONS request for CORS preflight', async () => {
      mockRequest.method = 'OPTIONS';

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
      expect(mockResponse.set).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'POST, OPTIONS');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalledWith('');
    });

    it('should reject non-POST requests', async () => {
      mockRequest.method = 'GET';

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(405);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });
  });

  describe('Authentication', () => {
    it('should reject requests without authorization header', async () => {
      mockRequest.headers = {};

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Unauthorized: Missing or invalid token',
      });
    });

    it('should reject requests with invalid token format', async () => {
      mockRequest.headers.authorization = 'InvalidFormat token';

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Unauthorized: Missing or invalid token',
      });
    });

    it('should reject expired tokens', async () => {
      mockAuth.verifyIdToken.mockRejectedValue({ code: 'auth/id-token-expired' });

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token expired' });
    });
  });

  describe('Input Validation', () => {
    beforeEach(() => {
      // Setup valid payee and account mocks
      mockTransaction.get.mockImplementation((ref: any) => {
        const path = ref.toString();
        if (path.includes('payees')) {
          return Promise.resolve({ exists: true, data: () => ({ payeeId: 'payee-123' }) });
        }
        if (path.includes('accounts')) {
          return Promise.resolve({
            exists: true,
            data: () => ({
              uid: 'test-user-123',
              status: 'active',
              balance: 100000,
            }),
          });
        }
        return Promise.resolve({ exists: false });
      });
    });

    it('should reject requests missing required fields', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        // Missing fromAccountId, amount, scheduledDate
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Missing required fields: payeeId, fromAccountId, amount, scheduledDate',
      });
    });

    it('should reject negative amounts', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: -100,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Amount must be a positive integer (in cents)',
      });
    });

    it('should reject zero amounts', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 0,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Amount must be a positive integer (in cents)',
      });
    });

    it('should reject non-integer amounts', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 100.5,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Amount must be a positive integer (in cents)',
      });
    });

    it('should reject amounts exceeding maximum ($10 million)', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 1000000001, // $10,000,000.01
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Amount exceeds maximum allowed ($10,000,000)',
      });
    });

    it('should reject invalid date format', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: 'invalid-date',
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid scheduledDate format. Must be a valid ISO date string',
      });
    });

    it('should reject past scheduled dates', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Scheduled date must be in the future',
      });
    });

    it('should reject memo longer than 200 characters', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        memo: 'a'.repeat(201),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Memo must be less than 200 characters',
      });
    });
  });

  describe('Recurring Payment Validation', () => {
    beforeEach(() => {
      mockTransaction.get.mockImplementation((ref: any) => {
        const path = ref.toString();
        if (path.includes('payees')) {
          return Promise.resolve({ exists: true, data: () => ({ payeeId: 'payee-123' }) });
        }
        if (path.includes('accounts')) {
          return Promise.resolve({
            exists: true,
            data: () => ({
              uid: 'test-user-123',
              status: 'active',
              balance: 100000,
            }),
          });
        }
        return Promise.resolve({ exists: false });
      });
    });

    it('should reject recurring payment without recurrence rule', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        recurring: true,
        // Missing recurrenceRule
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Recurrence rule is required for recurring payments',
      });
    });

    it('should reject invalid frequency', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'daily', // Invalid
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid frequency. Must be one of: weekly, biweekly, monthly, quarterly',
      });
    });

    it('should reject monthly recurrence without dayOfMonth', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'monthly',
          // Missing dayOfMonth
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'dayOfMonth is required for monthly recurring payments',
      });
    });

    it('should reject invalid dayOfMonth', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'monthly',
          dayOfMonth: 32, // Invalid
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'dayOfMonth must be between 1 and 31',
      });
    });

    it('should reject weekly recurrence without dayOfWeek', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'weekly',
          // Missing dayOfWeek
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'dayOfWeek is required for weekly recurring payments',
      });
    });

    it('should reject invalid dayOfWeek', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'weekly',
          dayOfWeek: 7, // Invalid (must be 0-6)
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)',
      });
    });

    it('should reject invalid endDate format', async () => {
      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'monthly',
          dayOfMonth: 15,
          endDate: 'invalid-date',
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid endDate format. Must be a valid ISO date string',
      });
    });

    it('should reject endDate before scheduledDate', async () => {
      const scheduledDate = new Date(Date.now() + 86400000);
      const endDate = new Date(Date.now() + 43200000); // Earlier than scheduled

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: scheduledDate.toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'monthly',
          dayOfMonth: 15,
          endDate: endDate.toISOString(),
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'End date must be after scheduled date',
      });
    });
  });

  describe('Payee and Account Validation', () => {
    it('should reject payment for non-existent payee', async () => {
      mockTransaction.get.mockImplementation((ref: any) => {
        const path = ref.toString();
        if (path.includes('payees')) {
          return Promise.resolve({ 
            exists: false,
            data: () => null
          });
        }
        return Promise.resolve({ 
          exists: true,
          data: () => ({})
        });
      });

      mockRequest.body = {
        payeeId: 'non-existent-payee',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Payee not found' });
    });

    it('should reject payment for non-existent account', async () => {
      mockTransaction.get.mockImplementation((ref: any) => {
        const path = ref.toString();
        if (path.includes('payees')) {
          return Promise.resolve({ 
            exists: true, 
            data: () => ({ payeeId: 'payee-123' }) 
          });
        }
        if (path.includes('accounts')) {
          return Promise.resolve({ 
            exists: false,
            data: () => null
          });
        }
        return Promise.resolve({ 
          exists: true,
          data: () => ({})
        });
      });

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'non-existent-account',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Account not found' });
    });

    it('should reject payment from account not owned by user', async () => {
      mockTransaction.get.mockImplementation((ref: any) => {
        const path = ref.toString();
        if (path.includes('payees')) {
          return Promise.resolve({ exists: true, data: () => ({ payeeId: 'payee-123' }) });
        }
        if (path.includes('accounts')) {
          return Promise.resolve({
            exists: true,
            data: () => ({
              uid: 'different-user', // Different user
              status: 'active',
              balance: 100000,
            }),
          });
        }
        return Promise.resolve({ exists: false });
      });

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Account does not belong to user',
      });
    });

    it('should reject payment from inactive account', async () => {
      mockTransaction.get.mockImplementation((ref: any) => {
        const path = ref.toString();
        if (path.includes('payees')) {
          return Promise.resolve({ exists: true, data: () => ({ payeeId: 'payee-123' }) });
        }
        if (path.includes('accounts')) {
          return Promise.resolve({
            exists: true,
            data: () => ({
              uid: 'test-user-123',
              status: 'frozen', // Not active
              balance: 100000,
            }),
          });
        }
        return Promise.resolve({ exists: false });
      });

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Account is not active' });
    });

    it('should reject payment with insufficient funds', async () => {
      mockTransaction.get.mockImplementation((ref: any) => {
        const path = ref.toString();
        if (path.includes('payees')) {
          return Promise.resolve({ exists: true, data: () => ({ payeeId: 'payee-123' }) });
        }
        if (path.includes('accounts')) {
          return Promise.resolve({
            exists: true,
            data: () => ({
              uid: 'test-user-123',
              status: 'active',
              balance: 5000, // Less than payment amount
            }),
          });
        }
        return Promise.resolve({ exists: false });
      });

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Insufficient funds in account' });
    });
  });

  describe('Successful Payment Scheduling', () => {
    beforeEach(() => {
      mockTransaction.get.mockImplementation((ref: any) => {
        const path = ref.toString();
        if (path.includes('payees')) {
          return Promise.resolve({ exists: true, data: () => ({ payeeId: 'payee-123' }) });
        }
        if (path.includes('accounts')) {
          return Promise.resolve({
            exists: true,
            data: () => ({
              uid: 'test-user-123',
              status: 'active',
              balance: 100000,
            }),
          });
        }
        return Promise.resolve({ exists: false });
      });
    });

    it('should successfully schedule a one-time payment', async () => {
      const scheduledDate = new Date(Date.now() + 86400000);

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: scheduledDate.toISOString(),
        memo: 'Electric bill payment',
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentId: expect.any(String),
          uid: 'test-user-123',
          payeeId: 'payee-123',
          fromAccountId: 'account-456',
          amount: 10000,
          status: 'scheduled',
          recurring: false,
          memo: 'Electric bill payment',
        })
      );
    });

    it('should successfully schedule a weekly recurring payment', async () => {
      const scheduledDate = new Date(Date.now() + 86400000);

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 5000,
        scheduledDate: scheduledDate.toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'weekly',
          dayOfWeek: 1, // Monday
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentId: expect.any(String),
          uid: 'test-user-123',
          recurring: true,
          recurrenceRule: expect.objectContaining({
            frequency: 'weekly',
            dayOfWeek: 1,
          }),
        })
      );
    });

    it('should successfully schedule a monthly recurring payment', async () => {
      const scheduledDate = new Date(Date.now() + 86400000);

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 15000,
        scheduledDate: scheduledDate.toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'monthly',
          dayOfMonth: 15,
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          recurring: true,
          recurrenceRule: expect.objectContaining({
            frequency: 'monthly',
            dayOfMonth: 15,
          }),
        })
      );
    });

    it('should successfully schedule a recurring payment with end date', async () => {
      const scheduledDate = new Date(Date.now() + 86400000);
      const endDate = new Date(Date.now() + 86400000 * 365); // 1 year later

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 10000,
        scheduledDate: scheduledDate.toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'monthly',
          dayOfMonth: 1,
          endDate: endDate.toISOString(),
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          recurring: true,
          recurrenceRule: expect.objectContaining({
            frequency: 'monthly',
            dayOfMonth: 1,
            endDate: expect.any(String),
          }),
        })
      );
    });

    it('should successfully schedule a biweekly recurring payment', async () => {
      const scheduledDate = new Date(Date.now() + 86400000);

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 20000,
        scheduledDate: scheduledDate.toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'biweekly',
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          recurring: true,
          recurrenceRule: expect.objectContaining({
            frequency: 'biweekly',
          }),
        })
      );
    });

    it('should successfully schedule a quarterly recurring payment', async () => {
      const scheduledDate = new Date(Date.now() + 86400000);

      mockRequest.body = {
        payeeId: 'payee-123',
        fromAccountId: 'account-456',
        amount: 50000,
        scheduledDate: scheduledDate.toISOString(),
        recurring: true,
        recurrenceRule: {
          frequency: 'quarterly',
        },
      };

      await schedulePayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          recurring: true,
          recurrenceRule: expect.objectContaining({
            frequency: 'quarterly',
          }),
        })
      );
    });
  });
});
