/**
 * Tests for Get Payment History Cloud Function
 * 
 * Tests cover:
 * - Authentication validation
 * - Query parameter validation (limit, status, dates)
 * - Pagination functionality
 * - Status filtering
 * - Date range filtering
 * - Successful retrieval with various filters
 */

import * as admin from 'firebase-admin';
import { getPaymentHistory } from './getPaymentHistory';

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
    })),
  };
});

describe('getPaymentHistory Cloud Function', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockAuth: any;
  let mockFirestore: any;
  let mockQuery: any;
  let mockSnapshot: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock request
    mockRequest = {
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token',
      },
      query: {},
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

    // Mock snapshot
    mockSnapshot = {
      docs: [],
    };

    // Mock query
    mockQuery = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      startAfter: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue(mockSnapshot),
    };

    // Create a proper mock for Firestore with nested collection/doc support
    const createMockDocRef = (path: string = '', docData: any = null) => {
      const docRef: any = {
        toString: jest.fn().mockReturnValue(path),
        id: 'mock-doc-id',
        path: path,
        get: jest.fn().mockResolvedValue({
          exists: docData !== null,
          data: () => docData,
        }),
      };
      docRef.collection = jest.fn((collectionName: string) => 
        createMockCollectionRef(`${path}/${collectionName}`)
      );
      return docRef;
    };

    const createMockCollectionRef = (path: string = '') => {
      const collectionRef: any = {
        toString: jest.fn().mockReturnValue(path),
        path: path,
        orderBy: jest.fn().mockReturnValue(mockQuery),
        where: jest.fn().mockReturnValue(mockQuery),
        limit: jest.fn().mockReturnValue(mockQuery),
      };
      collectionRef.doc = jest.fn((id?: string) => 
        createMockDocRef(`${path}/${id || 'mock-doc-id'}`)
      );
      return collectionRef;
    };

    mockFirestore = {
      collection: jest.fn((collectionName: string) => createMockCollectionRef(collectionName)),
    };
    
    (admin.firestore as any).mockReturnValue(mockFirestore);
    (admin.firestore as any).Timestamp = {
      fromDate: jest.fn((date) => ({ 
        toDate: () => date,
        toMillis: () => date.getTime(),
      })),
    };
  });

  describe('HTTP Method and CORS', () => {
    it('should handle OPTIONS request for CORS preflight', async () => {
      mockRequest.method = 'OPTIONS';

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
      expect(mockResponse.set).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, OPTIONS');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalledWith('');
    });

    it('should reject non-GET requests', async () => {
      mockRequest.method = 'POST';

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(405);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });
  });

  describe('Authentication', () => {
    it('should reject requests without authorization header', async () => {
      mockRequest.headers = {};

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Unauthorized: Missing or invalid token',
      });
    });

    it('should reject requests with invalid token format', async () => {
      mockRequest.headers.authorization = 'InvalidFormat token';

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Unauthorized: Missing or invalid token',
      });
    });

    it('should reject expired tokens', async () => {
      mockAuth.verifyIdToken.mockRejectedValue({ code: 'auth/id-token-expired' });

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token expired' });
    });
  });

  describe('Query Parameter Validation', () => {
    it('should reject limit less than 1', async () => {
      mockRequest.query.limit = '0';

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Limit must be between 1 and 100',
      });
    });

    it('should reject limit greater than 100', async () => {
      mockRequest.query.limit = '101';

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Limit must be between 1 and 100',
      });
    });

    it('should reject invalid status', async () => {
      mockRequest.query.status = 'invalid-status';

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid status. Must be one of: scheduled, processing, completed, failed, cancelled',
      });
    });

    it('should reject invalid startDate format', async () => {
      mockRequest.query.startDate = 'invalid-date';

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid startDate format. Must be a valid ISO date string',
      });
    });

    it('should reject invalid endDate format', async () => {
      mockRequest.query.endDate = 'invalid-date';

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid endDate format. Must be a valid ISO date string',
      });
    });

    it('should reject startDate after endDate', async () => {
      mockRequest.query.startDate = '2024-02-01T00:00:00Z';
      mockRequest.query.endDate = '2024-01-01T00:00:00Z';

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'startDate must be before endDate',
      });
    });
  });

  describe('Successful Retrieval', () => {
    it('should return empty list when no payments exist', async () => {
      mockSnapshot.docs = [];

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        payments: [],
        hasMore: false,
      });
    });

    it('should return payment history with default limit', async () => {
      const mockPayments = [
        {
          id: 'payment-1',
          data: () => ({
            uid: 'test-user-123',
            payeeId: 'payee-1',
            fromAccountId: 'account-1',
            amount: 10000,
            scheduledDate: { toDate: () => new Date('2024-01-15') },
            status: 'completed',
            recurring: false,
            createdAt: { toDate: () => new Date('2024-01-10') },
            processedAt: { toDate: () => new Date('2024-01-15') },
          }),
        },
        {
          id: 'payment-2',
          data: () => ({
            uid: 'test-user-123',
            payeeId: 'payee-2',
            fromAccountId: 'account-1',
            amount: 5000,
            scheduledDate: { toDate: () => new Date('2024-01-20') },
            status: 'scheduled',
            recurring: true,
            recurrenceRule: {
              frequency: 'monthly',
              dayOfMonth: 15,
            },
            memo: 'Rent payment',
            createdAt: { toDate: () => new Date('2024-01-05') },
          }),
        },
      ];

      mockSnapshot.docs = mockPayments;

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        payments: expect.arrayContaining([
          expect.objectContaining({
            paymentId: 'payment-1',
            status: 'completed',
            amount: 10000,
          }),
          expect.objectContaining({
            paymentId: 'payment-2',
            status: 'scheduled',
            recurring: true,
            memo: 'Rent payment',
          }),
        ]),
        hasMore: false,
      });
    });

    it('should indicate hasMore when there are more results', async () => {
      // Create 21 mock payments (limit is 20 by default)
      const mockPayments = Array.from({ length: 21 }, (_, i) => ({
        id: `payment-${i}`,
        data: () => ({
          uid: 'test-user-123',
          payeeId: `payee-${i}`,
          fromAccountId: 'account-1',
          amount: 10000,
          scheduledDate: { toDate: () => new Date('2024-01-15') },
          status: 'completed',
          recurring: false,
          createdAt: { toDate: () => new Date('2024-01-10') },
        }),
      }));

      mockSnapshot.docs = mockPayments;

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const response = mockResponse.json.mock.calls[0][0];
      expect(response.hasMore).toBe(true);
      expect(response.payments).toHaveLength(20);
      expect(response.lastPaymentId).toBe('payment-19');
    });

    it('should filter by status', async () => {
      mockRequest.query.status = 'completed';

      const mockPayments = [
        {
          id: 'payment-1',
          data: () => ({
            uid: 'test-user-123',
            payeeId: 'payee-1',
            fromAccountId: 'account-1',
            amount: 10000,
            scheduledDate: { toDate: () => new Date('2024-01-15') },
            status: 'completed',
            recurring: false,
            createdAt: { toDate: () => new Date('2024-01-10') },
          }),
        },
      ];

      mockSnapshot.docs = mockPayments;

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockQuery.where).toHaveBeenCalledWith('status', '==', 'completed');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should filter by date range', async () => {
      mockRequest.query.startDate = '2024-01-01T00:00:00Z';
      mockRequest.query.endDate = '2024-01-31T23:59:59Z';

      mockSnapshot.docs = [];

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockQuery.where).toHaveBeenCalledWith('scheduledDate', '>=', expect.anything());
      expect(mockQuery.where).toHaveBeenCalledWith('scheduledDate', '<=', expect.anything());
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should apply custom limit', async () => {
      mockRequest.query.limit = '10';

      mockSnapshot.docs = [];

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockQuery.limit).toHaveBeenCalledWith(11); // limit + 1 for hasMore check
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should include all optional fields when present', async () => {
      const mockPayments = [
        {
          id: 'payment-1',
          data: () => ({
            uid: 'test-user-123',
            payeeId: 'payee-1',
            fromAccountId: 'account-1',
            amount: 10000,
            scheduledDate: { toDate: () => new Date('2024-01-15') },
            status: 'failed',
            recurring: false,
            memo: 'Test payment',
            confirmationNumber: 'CONF-123',
            failureReason: 'Insufficient funds',
            createdAt: { toDate: () => new Date('2024-01-10') },
            processedAt: { toDate: () => new Date('2024-01-15') },
          }),
        },
      ];

      mockSnapshot.docs = mockPayments;

      await getPaymentHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        payments: expect.arrayContaining([
          expect.objectContaining({
            memo: 'Test payment',
            confirmationNumber: 'CONF-123',
            failureReason: 'Insufficient funds',
            processedAt: expect.any(String),
          }),
        ]),
        hasMore: false,
      });
    });
  });
});
